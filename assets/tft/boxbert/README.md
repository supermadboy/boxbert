# Boxbert — reproduzierbare TFT-V2-Geräteframes

Stand 18.10.2026. Selbst modellierte kleine 3D-Musikbox mit großen Augen,
Tragegriff, Lautsprecher, dezenter sinusförmiger Dreh-/Hubbewegung und einem
Blinzeln. Keine externen Modelle, Texturen, Fonts oder Designkonten.

## Dateien

- `scene.py`: vollständige prozedurale Szene, orthografische Kamera, Licht,
  Cycles CPU, 48 Samples, fixer Seed, vier Renderthreads und 64×64 Pixel.
- `render.sh`: gepinnter Blender **5.2.0 LTS**, PNG-Normalisierung und Konverter.
- `masters/frame-000.png` … `frame-011.png`: normalisierte RGB-PNG-Master.
- `boxbert.rgb565`: **fertige Gerätepixel**, 98.328 Bytes inklusive Header.
- `manifest.json`: Format, Timing, CRC32, SHA256, Frameoffsets und Masterhashes.
- `preview.py` / `contact-sheet.png`: Kontaktbogen direkt aus der finalen
  RGB565-Payload, nicht aus einer andersfarbigen Browser-/Blender-Vorschau.

Der Hintergrund ist exakt RGB (16,16,16), quantisiert **0x1082**. Der Blender-
Compositor setzt ihn über Alpha-Over nach der Renderlayer-Auswertung ein;
Scene-View-Transform und Socket-Reihenfolge sind bewusst gesetzt. PNG ist
nur Offline-Zwischenformat. Zur Laufzeit wird nichts als PNG/GIF dekodiert.

## Reproduktion

Im Boxbert-Repo:

```sh
sh assets/tft/boxbert/render.sh
sh tools/tft/python-frames.sh assets/tft/boxbert/preview.py
sh tools/tft/python-frames.sh tools/tft/tests/test_frames.py
# Unabhängiger Wiederholungsbuild ohne die Masterkopie zu überschreiben:
sh assets/tft/boxbert/render.sh tools/tft/build/v2-repro/masters tools/tft/build/v2-repro/output
cmp assets/tft/boxbert/boxbert.rgb565 tools/tft/build/v2-repro/output/boxbert.rgb565
cmp assets/tft/boxbert/manifest.json tools/tft/build/v2-repro/output/manifest.json
```

Beide Wrapper pinnen Nixpkgs
`0954f7ee2f6bb3dc7d4e3d0d8bcb8fd4bde4cfc5`; Python/Pillow werden als gepinnte
Python-Umgebung bezogen. Kein Root, Systempaket, neuer Port oder Flake-Update.
Die getrackten Frames genügen für normale App-/Rendererbuilds, Blender wird
nur beim bewussten Neurendern verwendet.

Blender schreibt Datums-/Renderzeit-Metadaten in PNGs, obwohl die Pixel
reproduzierbar sind. Der explizite Buildschritt `--normalize-masters` entfernt
diese variablen Metadaten ohne Farbänderung. Eine normale Konvertierung ohne
diesen Schalter verändert Eingabedateien nicht. Nach Normalisierung wurden
**alle zwölf PNG-Dateien, das gesamte RGB565-Paket und das Manifest aus zwei
separaten Blenderläufen byteidentisch verglichen**. Das gilt für den hier
geprüften Host/Toolchainstand, nicht als pauschale plattformübergreifende
Cycles-Bitgleichheitsgarantie.

## BBT2

24-Byte-Header: Magic `BBT2`, danach fünf uint32 Little Endian: Breite 64,
Höhe 64, Anzahl 12, Dauer 160 ms/Frame, zlib-CRC32 der Payload. Anschließend
12 × 8.192 Bytes RGB565 Little Endian, insgesamt 98.304 Pixelbytes.
Loopdauer 1.920 ms. Quantisierung `R>>3, G>>2, B>>3`, kein Dithering.
Das Manifest ist das Prüf-/Buildbegleitdokument, keine zweite Laufzeitquelle.

Konverter und sechs Tests unter `tools/tft/`: Farben/LE, Header/Framegrenzen/
Timing/CRC, Ablehnung falscher Größen/Anzahl/Dauer/Transparenz, PNG-/Manifest-
Integrität, reproduzierbare Konvertierung, Hintergrund, echte Bildänderung,
Loopnaht und Metadaten-Normalisierung. Vor Implementierung wurden neue Slices
jeweils rot ausgeführt, anschließend grün geprüft.

Der erste Nahttest scheiterte mit `2.7694498697916665 not less than 2.0`.
Drehung und Hub wurden reduziert, **nicht die Testschwelle aufgeweicht**.
Finale PNG-Naht (mittlere absolute RGB-Differenz letzter→erster Frame):
**1,4228515625**, Testgrenze weiterhin <2,0. Das Blinzeln verändert weiterhin
sichtbar die Augen; Framewahl und Loop sind im gemeinsamen Renderer geprüft.
Das ist ein quantitativer Übergangstest, keine Photosensitivitätsfreigabe.

Blender meldet im Headless-Betrieb `Failed to connect PipeWire event context`
und einen Hinweis zur für Blender 6.0 abgekündigten `Material.use_nodes`-API.
Der gepinnte 5.2-Render beendet sich erfolgreich; alle Dateien und Prüfungen
wurden tatsächlich erzeugt/ausgeführt. Kein Audiozugriff nötig.

Integration, ABI/Fallback und Grenzen: [TFT V2](../../../docs/tft-v2.md).
Reale TFT-/Audio-/SD-/SPI-/Speicherprüfung bleibt bei der späteren
ESP-Gesamtintegration; keine neue Firmware geflasht.
