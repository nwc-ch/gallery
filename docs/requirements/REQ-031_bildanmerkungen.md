# REQ-031 – Visuelle Anmerkungen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P3; P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-030](REQ-030_kommentare.md), [REQ-038](REQ-038_dateiversionen.md)

## Ziel

Retuschehinweise können direkt auf einer Bildversion platziert werden.

## Abnahmekriterien

1. Anmerkungen verwenden normalisierte Koordinaten 0–1 und sind an eine konkrete Foto-Version gebunden.
2. Punkte, Rechtecke und begrenzte Freihandpfade sind möglich; maximal 2.000 Punkte pro Anmerkung.
3. Skalierung, Rotation und mobile Ansicht erhalten die Position; Originaldatei bleibt unverändert.

## Verifikation

- **Unit:** Koordinaten-, Längen- und Transformationsgrenzen prüfen.
- **Integration:** Versionsbezug und Autorenrechte persistieren und prüfen.
- **E2E:** Anmerkung am Desktop setzen und mobil an gleicher Bildstelle prüfen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

