# REQ-057 – Quarantäne und sichere Bildverarbeitung

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; S2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-016](REQ-016_speicher_konsistenz.md), [REQ-059](REQ-059_transport_geheimnisse.md)

## Ziel

Hochgeladene Dateien werden vor jeder Veröffentlichung isoliert untersucht.

## Abnahmekriterien

1. Original landet zunächst in Quarantäne; Malwareprüfung und vollständiges sicheres Dekodieren sind Voraussetzung für ready; bei Scannerfehler bleibt Datei gesperrt.
2. Worker läuft ohne Root, ohne ausgehendes Netzwerk, mit beschränktem Dateisystem und je Job maximal 512 MiB RAM, 30 Sekunden CPU sowie 60 Sekunden Laufzeit; Limits sind konfigurierbar.
3. Decoderbibliotheken bleiben gepflegt; Pixel-/Speicherbomben, Polyglotte und Parserabstürze werden abgefangen und veröffentlichen keine Teilresultate.

## Verifikation

- **Unit:** Quarantäne-Gates, Timeouts und Fail-Closed-Regeln prüfen.
- **Integration:** Sichere Malware-Testsignatur, defekte Bilder, große Dimensionen und Prozessabbruch testen.
- **E2E:** Schadhafte Testdatei hochladen: Eigentümer sieht Ablehnung, Gast erhält zu keinem Zeitpunkt Datei oder Derivat.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

