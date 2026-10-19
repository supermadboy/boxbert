# MP3-Konvertierung — Drittanbieter

Die lokale Browser-Konvertierung verwendet `@breezystack/lamejs` **1.2.7**
(Paketlizenz: **LGPL-3.0**, Autor laut Paket: Alex Zhukov). Audiodaten werden
nicht an diesen Anbieter oder einen Konvertierungsserver geschickt.

- Paket: https://www.npmjs.com/package/@breezystack/lamejs/v/1.2.7
- Zugehöriger veröffentlichter `gitHead` laut npm-Metadaten:
  https://github.com/shijinyu/lamejs/tree/1fb0ef5fa177413107e2e107d054a9b994e3f79c
- Lizenztext: `app/node_modules/@breezystack/lamejs/LICENSE` nach `npm ci`.
- Die eigentliche App-Integration und ihre Buildanweisungen liegen in diesem
  Repo unter `app/`. Das Paket wird nicht als proprietäre Eigenentwicklung
  ausgegeben. Lockfile und Paketversion erhalten die konkrete Abhängigkeit.

Für eine Weiterverteilung Lizenzhinweise und den Quellzugang mitführen.
Die ursprünglichen Browseraufnahmen bleiben separat in IndexedDB; eine
Konvertierung ist keine neue Aufnahme oder automatische Gerätezuordnung.
