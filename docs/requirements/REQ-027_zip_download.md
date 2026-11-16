# REQ-027 – Fotoauswahl als ZIP herunterladen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-016](REQ-016_speicher_konsistenz.md), [REQ-022](REQ-022_berechtigungen.md), [REQ-026](REQ-026_original_download.md)

## Ziel

Empfänger können mehrere Fotos komfortabel gesammelt beziehen.

## Abnahmekriterien

1. Auswahl oder ganzes Album kann bei Downloadrecht als asynchrones ZIP angefordert werden; maximal 1.000 Fotos und 2 GiB Originalvolumen pro Auftrag.
2. ZIP-Einträge haben sichere eindeutige Namen ohne Pfadsegmente; Job und Ergebnis sind an Anforderer und gültige Freigabe gebunden.
3. Fortschritt und verständliche Fehlermeldung sind sichtbar; temporäres ZIP wird spätestens nach 24 Stunden gelöscht und beim Abruf neu autorisiert.

## Verifikation

- **Unit:** Namenskollisionen, Pfadbereinigung und Joblimits prüfen.
- **Integration:** ZIP-Inhalt/Hashes, fremde Job-ID und Widerruf während Erstellung prüfen.
- **E2E:** Auswahl herunterladen und entpacken; nach Linkwiderruf gespeicherte Ergebnisadresse aufrufen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

