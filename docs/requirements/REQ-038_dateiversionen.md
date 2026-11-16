# REQ-038 – Neue Version eines Fotos

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-013](REQ-013_vorschaubilder.md), [REQ-016](REQ-016_speicher_konsistenz.md), [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Eigentümer ersetzen Bearbeitungsstände ohne Verlust der Historie.

## Abnahmekriterien

1. Neue Version erhält eigene unveränderliche Objekt-IDs; nach Verarbeitung wird sie atomar aktive Version.
2. Alte Kommentare und Anmerkungen bleiben an ihrer Version; UI zeigt diesen Bezug deutlich.
3. Ältere Versionen sind nur für Eigentümer zugänglich, sofern nicht ausdrücklich separat freigegeben; Quote zählt alle Versionen.

## Verifikation

- **Unit:** Aktivierung und Rechte älterer Versionen prüfen.
- **Integration:** Fehlgeschlagene Verarbeitung lässt vorherige aktive Version unverändert.
- **E2E:** Neue Version hochladen, Historie prüfen und als Gast alte Original-ID anfordern.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

