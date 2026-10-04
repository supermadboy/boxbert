# Audio-Lautstaerke — Testeinstellungen sind keine Normpruefung

Stand: **04.10.2026**. Kindersicherheit vor Lautstaerkeoptimierung.

## Was bestaetigt ist

- Etappe 1: Testtoene mit unterschiedlichen digitalen Amplituden gehoert;
  hohe Stufe als extrem laut empfunden und abgebrochen. Keine kalibrierte
  Schalldruckmessung dokumentiert.
- Etappen 2/3: subjektive Hoereindruecke fuer Volume 6 bzw. 12. Die
  unterschiedlichen historischen Sketch-Einstellungen sind keine
  produktweite Sicherheitsfreigabe.
- Etappe 4: Volume **6/21**, leise Wiedergabe/Liedwechsel und optimierter
  Hoertest vom Nutzer bestaetigt. Kein erster-Ton-Mikrofonzeitstempel,
  kein Nachweis fuer einen bestimmten dB(A)-Wert oder EN-71-Konformitaet.

Belege: `docs/testprotokoll-etappe1.md` bis `docs/testprotokoll-etappe4.md`.
Historische Aussagen zu ungefaehren Leistungen/Normwerten nicht als neue
Messung oder verbindlichen Grenzwert uebernehmen.

## Warum MAX_AMP/Volume keinen festen Schalldruck garantieren

`MAX_AMP` begrenzt die digitalen Testton-Samples, die Audio-Library-
Volume-Skala stellt einen Wiedergabepegel ein. Das sind unterschiedliche
Stellgroessen, keine dB(A)-Messgeraete. Reale Lautstaerke haengt unter
anderem von Trackpegel/Frequenzinhalt, Verstaerkergain/-versorgung,
Lautsprecher, Gehaeuse, Abstand und Position ab. Elektrische Leistung
in Watt ist ebenfalls nicht unmittelbar ein Schalldruckwert.

Die frueher genannte Idee **MAX_AMP 6000–8000** ist daher **keine
validierte kindersichere Grenze**; insbesondere nicht in einen MP3-
Player als vermeintlich normkonformen Wert uebertragen. Auch Volume 6
ist nur eine bestaetigte leise Testeinstellung, kein universeller Grenzwert.

## Regeln fuer weitere Tests

- Minimalen Pegel starten und nur bewusst in kleinen Stufen erhoehen.
  Kein automatisches Hochdrehen und keine Maximallautstaerke mit Kind
  im Raum. Aktuelle bestaetigte Referenzlautstaerke nicht nebenbei aendern.
- Im zukuenftigen Player zusaetzlich begrenzbare Maximalstufe vorsehen;
  Grenzwert erst nach geeignetem Test mit realem Gehaeuse/Versorgung
  und den lautesten vorgesehenen Inhalten festlegen.
- Sicherheit nicht allein aus subjektiv „angenehm“, Sample-Spitzen,
  Watt-Schaetzung, Library-Volumezahl oder Handy-App ablesen.

## Noch offene akustische Bewertung

Vor Aussage „kindersicher begrenzt“ / „normkonform“:

1. Anwendbare Normausgabe und Spielzeug-/Schallkategorie, Betriebsarten,
   Bewertungsart, Messabstand/-position und Grenzwerte anhand der
   tatsaechlichen Vorgaben bestimmen. Keine pauschale „85 dB fuer alle
   Spielzeuge“-Regel; historische 65/85-dB-Angaben sind hier nicht verifiziert.
2. Geeignetes kalibriertes Messgeraet/Messverfahren oder fachliche
   Pruefung verwenden; auch nahe-am-Ohr-Nutzung und Worst-Case-Inhalte
   bei hoechster erlaubter Einstellung beruecksichtigen.
3. Datum, Aufbau, Geraet/Kalibrierung, Track, Gain, Versorgung, Abstand,
   Messwerte und daraus abgeleiteten Softwaredeckel protokollieren.

Das ist ein offener Mess-/Bewertungsplan, kein bereits durchgefuehrter
Konformitaetsnachweis. Keine ungeprueften Normzahlen in AGENTS/BOM oder
Firmware-Kommentaren zu einer Sicherheitsgarantie machen.
