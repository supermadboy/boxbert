// Etappe 5 (Breadboard): funktionierenden Etappe-4-Pfad um lokales WLAN,
// Dateiliste, Upload und Zuordnung der ZWEI bekannten UIDs erweitern.
// Nur USB, Akku ab. Kein Flash/Upload ohne ausdruecklichen Hardware-Test.
// APIs: Core 3.3.12 WebServer/examples/WebUpdate + FSBrowser,
// Preferences, Etappe-4-Player (Adafruit PN532 1.3.4, Audio 4.0.0).
#include <Arduino.h>
#include <WiFi.h>
#include <ESPmDNS.h>
#include <WebServer.h>
#include <Preferences.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <Adafruit_PN532.h>
#include <Audio.h>
#include <atomic>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>
#include "TagMap.h"
#include "Secrets.h"

constexpr uint8_t NFC_SDA = 3, NFC_SCL = 4;
constexpr uint8_t SD_CS = 10, SD_SCK = 36, SD_MISO = 37, SD_MOSI = 35;
constexpr uint8_t I2S_BCLK = 17, I2S_LRC = 18, I2S_DOUT = 16;
constexpr uint8_t VOLUME = 6;
constexpr uint32_t SD_SPI_HZ = 4000000, NFC_PAUSE_MS = 200;
constexpr size_t MAX_UPLOAD_BYTES = 16 * 1024 * 1024;
constexpr char TEMP_PATH[] = "/.boxbert-upload.tmp";

Adafruit_PN532 nfc(255, 254, &Wire); // Dummy-IRQ/Reset wie Etappe 4.
Audio audio;
WebServer server(80);
Preferences prefs;
QueueHandle_t nfcEvents = nullptr;
String tagPaths[2];
bool ready = false, nfcFailed = false, webReady = false, mdnsReady = false;
uint32_t reads = 0, switches = 0, starts = 0, startErrors = 0;
File uploadFile;
String uploadPath;
size_t uploadBytes = 0;
int uploadError = 0;

// Callbacks der Audio-Lib koennen in einer anderen Task laufen.
void audioInfo(Audio::msg_t message) {
    if (message.e == Audio::evt_vu || message.e == Audio::evt_spectrum) return;
    Serial.printf("[audio] %s: %s\n", message.s ? message.s : "?",
                  message.msg ? message.msg : "");
}

void nfcTask(void *) {
    uint8_t lastUid[7] = {};
    uint8_t lastLength = 0;
    uint32_t taskReads = 0, taskSwitches = 0;
    for (;;) {
        NfcEvent event;
        const bool ok = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A,
                                                 event.uid, &event.length, 0);
        if (!ok || event.length == 0 || event.length > sizeof(event.uid)) {
            event.failed = true;
            xQueueOverwrite(nfcEvents, &event);
            vTaskDelete(nullptr);
        }
        event.detectedMs = millis();
        event.reads = ++taskReads;
        event.changed = event.length != lastLength ||
                        memcmp(event.uid, lastUid, event.length) != 0;
        if (event.changed) {
            if (lastLength) ++taskSwitches;
            memcpy(lastUid, event.uid, event.length);
            lastLength = event.length;
        }
        event.switches = taskSwitches;
        // Upload kann handleClient() lange binden: nur das neueste
        // Wechselereignis behalten, NFC-Task niemals an voller Queue parken.
        if (event.changed) xQueueOverwrite(nfcEvents, &event);
        vTaskDelay(pdMS_TO_TICKS(NFC_PAUSE_MS));
    }
}

// Nur flache ASCII-Dateinamen, nie Client-Pfade/Verzeichnisse/Temp-Datei.
bool validName(const String &name) {
    if (name.length() < 5 || name.length() > 64 ||
        !name.endsWith(".mp3") || name.startsWith(".")) return false;
    for (size_t i = 0; i < name.length(); ++i) {
        const char c = name[i];
        if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
              (c >= '0' && c <= '9') || c == '-' || c == '_' || c == '.')) return false;
    }
    return true;
}

bool validPath(const String &path) {
    return path.startsWith("/") && validName(path.substring(1));
}

bool playableFile(const String &path) {
    if (!validPath(path)) return false;
    File f = SD.open(path, FILE_READ);
    const bool ok = f && !f.isDirectory() && f.size() > 0;
    if (f) f.close();
    return ok;
}

String jsonString(const String &value) {
    String out = "\"";
    for (size_t i = 0; i < value.length(); ++i) {
        const char c = value[i];
        if (c == '"' || c == '\\') out += '\\';
        out += c;
    }
    return out + '"';
}

void noCache() { server.sendHeader("Cache-Control", "no-store"); }

bool authenticated() {
    if (server.authenticate("boxbert", BOXBERT_WEB_PASSWORD)) return true;
    server.requestAuthentication();
    return false;
}

// Schreib-Requests nur von der geladenen Box-Seite; Basic Auth allein
// schuetzt nicht gegen Cross-Site-Formulare im selben Browser.
bool sameOrigin() {
    const String host = server.hostHeader();
    const String origin = server.header("Origin");
    return host.length() && origin == String("http://") + host;
}

const char PAGE[] PROGMEM = R"HTML(<!doctype html><html lang="de"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Boxbert</title><style>body{font:1.1em system-ui;max-width:36em;margin:1em auto;padding:0 1em}
input,select,button{font:inherit;margin:.4em 0;padding:.4em;max-width:100%}li{margin:.4em}</style>
<h1>Boxbert</h1><p>Nur im vertrauten lokalen WLAN. Upload nur bei gestoppter Musik.</p>
<h2>SD-Dateien</h2><ul id="files"></ul>
<h2>MP3 hochladen</h2><form id="upload"><input type="file" name="file" accept=".mp3" required>
<button>Hochladen</button></form>
<h2>Bekannte Tags zuordnen</h2><div id="tags"></div><p id="message" role="status"></p>
<script>
const msg = document.querySelector('#message');
async function request(url, options) { const r = await fetch(url, options); const t = await r.text();
  if (!r.ok) throw Error(t); return JSON.parse(t); }
async function refresh() {
  const files = await request('/files'); const tags = await request('/tags');
  const list = document.querySelector('#files'); list.replaceChildren();
  for (const f of files) { const li=document.createElement('li'); li.textContent=f; list.append(li); }
  const box=document.querySelector('#tags'); box.replaceChildren();
  for (const tag of tags) { const row=document.createElement('div'); const label=document.createElement('label');
    label.textContent=tag.uid+' → '; const select=document.createElement('select');
    for(const f of files) { const o=document.createElement('option'); o.value=f; o.textContent=f;
      o.selected=f===tag.path; select.append(o); }
    const button=document.createElement('button'); button.textContent='Speichern';
    button.onclick=async()=>{try{ const data=new URLSearchParams({uid:tag.uid,path:select.value});
      await request('/tags',{method:'POST',body:data}); msg.textContent='Gespeichert'; await refresh();
    }catch(e){msg.textContent=e.message}};
    label.append(select); row.append(label,button); box.append(row); }
}
document.querySelector('#upload').onsubmit=async e=>{e.preventDefault();msg.textContent='Upload läuft …';
  try { const data=new FormData(e.target); await request('/upload',{method:'POST',body:data});
    msg.textContent='Hochgeladen'; e.target.reset(); await refresh(); }
  catch(err){msg.textContent=err.message} };
refresh().catch(e=>msg.textContent=e.message);
</script></html>)HTML";

void handleFiles() {
    if (!authenticated()) return;
    File root = SD.open("/");
    if (!root) { server.send(500, "text/plain", "SD nicht lesbar"); return; }
    String json = "[";
    size_t count = 0;
    for (File f = root.openNextFile(); f && count < 128; f = root.openNextFile()) {
        String path = f.name();
        if (!path.startsWith("/")) path = "/" + path;
        if (!f.isDirectory() && f.size() && validPath(path)) {
            if (count++) json += ',';
            json += jsonString(path);
        }
        f.close();
    }
    root.close();
    json += ']';
    noCache(); server.send(200, "application/json", json);
}

void handleTags() {
    if (!authenticated()) return;
    String json = "[";
    for (size_t i = 0; i < 2; ++i) {
        if (i) json += ',';
        json += "{\"uid\":" + jsonString(TAG_UIDS[i]) +
                ",\"path\":" + jsonString(tagPaths[i]) + '}';
    }
    noCache(); server.send(200, "application/json", json + ']');
}

void saveTag() {
    if (!authenticated()) return;
    if (!sameOrigin()) { server.send(403, "text/plain", "Origin ungueltig"); return; }
    const String uid = server.arg("uid"), path = server.arg("path");
    int index = -1;
    for (int i = 0; i < 2; ++i) if (uid == TAG_UIDS[i]) index = i;
    if (index < 0 || !playableFile(path)) {
        server.send(400, "text/plain", "Bekannte UID und vorhandene MP3 erforderlich"); return;
    }
    // NVS-String (nicht SD) ueberlebt Neustart, solange NVS nicht geloescht wird.
    if (prefs.putString(index == 0 ? "tag0" : "tag1", path) != path.length()) {
        server.send(500, "text/plain", "Zuordnung konnte nicht gespeichert werden"); return;
    }
    tagPaths[index] = path;
    noCache(); server.send(200, "application/json", "{\"ok\":true}");
}

void discardUpload() {
    if (uploadFile) uploadFile.close();
    if (SD.exists(TEMP_PATH)) SD.remove(TEMP_PATH);
}

// Core-WebServer ruft diese Funktion beim Empfangen jedes Multipart-Chunks auf.
// Niemals waehrend eines Songs auf SD schreiben; handleClient() darf Audio
// nicht fuer einen ganzen Upload blockieren.
void receiveUpload() {
    HTTPUpload &up = server.upload();
    if (up.status == UPLOAD_FILE_START) {
        uploadError = 0; uploadBytes = 0; uploadPath = "";
        if (!server.authenticate("boxbert", BOXBERT_WEB_PASSWORD) || !sameOrigin()) {
            uploadError = 403; return;
        }
        if (audio.isRunning()) { uploadError = 409; return; }
        if (!validName(up.filename)) { uploadError = 400; return; }
        uploadPath = "/" + up.filename;
        // Keine Ueberschreibung: bestehende Songs/Tag-Zuordnungen bleiben sicher.
        if (SD.exists(uploadPath) || SD.exists(TEMP_PATH)) { uploadError = 409; return; }
        uploadFile = SD.open(TEMP_PATH, FILE_WRITE);
        if (!uploadFile) uploadError = 500;
    } else if (up.status == UPLOAD_FILE_WRITE) {
        if (uploadError) return;
        if (!uploadFile || up.currentSize > MAX_UPLOAD_BYTES - uploadBytes) {
            uploadError = 413; discardUpload(); return;
        }
        if (uploadFile.write(up.buf, up.currentSize) != up.currentSize) {
            uploadError = 500; discardUpload(); return;
        }
        uploadBytes += up.currentSize;
    } else if (up.status == UPLOAD_FILE_END) {
        if (uploadError) return;
        if (!uploadFile || uploadBytes == 0) { uploadError = 400; discardUpload(); return; }
        uploadFile.flush(); uploadFile.close();
        // Erst nach vollstaendig geparstem HTTP-Request im Final-Handler
        // in den sichtbaren Dateinamen umbenennen.
    } else if (up.status == UPLOAD_FILE_ABORTED) {
        uploadError = 400; discardUpload();
    }
}

void finishUpload() {
    if (!authenticated()) return;
    if (!sameOrigin()) { server.send(403, "text/plain", "Origin ungueltig"); return; }
    if (uploadError) {
        const int code = uploadError;
        uploadPath = "";
        server.send(code, "text/plain", "Upload fehlgeschlagen (Name, Groesse, SD oder laufende Musik pruefen)");
        return;
    }
    if (uploadPath.isEmpty() || !uploadBytes || !SD.exists(TEMP_PATH)) {
        uploadPath = "";
        server.send(400, "text/plain", "Kein vollstaendiger Upload"); return;
    }
    if (SD.exists(uploadPath)) {
        discardUpload(); uploadPath = "";
        server.send(409, "text/plain", "Dateiname existiert bereits"); return;
    }
    if (!SD.rename(TEMP_PATH, uploadPath)) {
        discardUpload(); uploadPath = "";
        server.send(500, "text/plain", "SD-Umbenennen fehlgeschlagen"); return;
    }
    uploadPath = ""; uploadBytes = 0;
    noCache(); server.send(200, "application/json", "{\"ok\":true}");
}

void setup() {
    Serial.begin(115200);
    delay(2500);
    Serial.println("Boxbert Etappe 5 — USB only, Volume 6");
    Audio::audio_info_callback = audioInfo;
    if (!psramFound() || !ESP.getFreePsram()) { Serial.println("PSRAM fehlt (QSPI pruefen)"); return; }
    if (!Wire.begin(NFC_SDA, NFC_SCL)) { Serial.println("Wire.begin fehlgeschlagen"); return; }
    Wire.setClock(100000);
    if (!nfc.begin()) { Serial.println("nfc.begin fehlgeschlagen"); return; }
    delay(100);
    if (!nfc.getFirmwareVersion() || !nfc.SAMConfig()) { Serial.println("PN532 fehlt"); return; }
    pinMode(SD_CS, OUTPUT); digitalWrite(SD_CS, HIGH);
    if (!SPI.begin(SD_SCK, SD_MISO, SD_MOSI, SD_CS) ||
        !SD.begin(SD_CS, SPI, SD_SPI_HZ) || SD.cardType() == CARD_NONE) {
        Serial.println("SD fehlt"); return;
    }
    // Nicht automatisch einen fremden/abgebrochenen Temp-Upload loeschen.
    // Im Fehlerfall Karte am PC pruefen und Temp-Datei gezielt entfernen.
    if (!prefs.begin("boxbert-tags")) { Serial.println("NVS fehlt"); return; }
    for (size_t i = 0; i < 2; ++i) {
        tagPaths[i] = prefs.getString(i == 0 ? "tag0" : "tag1", TAG_BINDINGS[i].path);
        if (!playableFile(tagPaths[i])) {
            Serial.printf("Tag %s: MP3 fehlt/ungueltig: %s\n", TAG_UIDS[i], tagPaths[i].c_str());
            // Fehler offen lassen: kein stilles Fallback auf ein anderes Lied.
        }
    }
    if (!audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT)) { Serial.println("I2S fehlt"); return; }
    audio.setVolume(VOLUME);
    nfcEvents = xQueueCreate(1, sizeof(NfcEvent));
    if (!nfcEvents || xTaskCreate(nfcTask, "BoxbertNFC", 4096, nullptr, 1, nullptr) != pdPASS) {
        Serial.println("NFC-Task fehlgeschlagen"); return;
    }
    ready = true;
    const char *headers[] = {"Origin"};
    server.collectHeaders(headers, 1);
    server.on("/", HTTP_GET, []() {
        if (!authenticated()) return;
        noCache(); server.send_P(200, "text/html; charset=utf-8", PAGE);
    });
    server.on("/files", HTTP_GET, handleFiles);
    server.on("/tags", HTTP_GET, handleTags);
    server.on("/tags", HTTP_POST, saveTag);
    server.on("/upload", HTTP_POST, finishUpload, receiveUpload);
    server.onNotFound([]() { server.send(404, "text/plain", "Not found"); });
    WiFi.mode(WIFI_STA);
    WiFi.setHostname("boxbert"); // DHCP-Name, nicht als DNS-Garantie verstehen.
    WiFi.begin(BOXBERT_WIFI_SSID, BOXBERT_WIFI_PASSWORD);
    Serial.println("WLAN verbindet im Hintergrund; Player bleibt sofort nutzbar.");
    Serial.println("Bereit: bekanntes Tag startet Musik, gleiches Tag startet nicht neu.");
}

void loop() {
    if (ready) {
        audio.loop();
        if (!webReady && WiFi.status() == WL_CONNECTED) {
            server.begin(); webReady = true;
            Serial.print("Boxbert im lokalen WLAN: http://"); Serial.println(WiFi.localIP());
            // Core-3.3.12-Beispiel ESPmDNS/mDNS_Web_Server:
            // mDNS ist Komfort; der Server funktioniert auch bei Fehler per IP.
            if (MDNS.begin("boxbert")) {
                MDNS.addService("http", "tcp", 80);
                mdnsReady = true;
                Serial.println("mDNS: http://boxbert.local/");
            } else Serial.println("mDNS fehlgeschlagen; per IP erreichbar");
        }
        // Bei langen Uploads verarbeitet handleClient() ggf. spaeter das
        // naechste Tag-Event; Audio/SD bleiben allein im Hauptloop.
        if (webReady) server.handleClient();
        NfcEvent event;
        if (xQueueReceive(nfcEvents, &event, 0) == pdTRUE) {
            if (event.failed) { nfcFailed = true; Serial.println("NFC-Lesen gestoppt"); }
            else {
                reads = event.reads; switches = event.switches;
                if (event.changed) {
                    const TagBinding *binding = findTagBinding(event.uid, event.length);
                    if (binding) {
                        const size_t index = binding - TAG_BINDINGS;
                        const String &path = tagPaths[index];
                        if (!playableFile(path)) { ++startErrors; Serial.printf("Fehlende MP3: %s\n", path.c_str()); }
                        else {
                            audio.setVolume(VOLUME);
                            if (audio.connecttoFS(SD, path.c_str())) {
                                ++starts; Serial.printf("START %s -> %s\n", binding->name, path.c_str());
                            } else { ++startErrors; Serial.println("Audio-Start fehlgeschlagen"); }
                        }
                    } else Serial.println("Unbekanntes Tag: kein Start");
                }
            }
        }
    }
    static uint32_t lastReport = 0;
    if (millis() - lastReport >= 5000) {
        lastReport = millis();
        Serial.printf("STATUS NFC=%s READS=%lu SWITCHES=%lu STARTS=%lu ERRORS=%lu AUDIO=%s WLAN=%s IP=%s MDNS=%s\n",
                      nfcFailed ? "Fehler" : "ok", (unsigned long)reads, (unsigned long)switches,
                      (unsigned long)starts, (unsigned long)startErrors,
                      audio.isRunning() ? "an" : "aus", WiFi.status() == WL_CONNECTED ? "an" : "aus",
                      WiFi.localIP().toString().c_str(), mdnsReady ? "an" : "aus");
    }
    delay(1);
}
