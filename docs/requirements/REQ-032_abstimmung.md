# REQ-032 – Gemeinsame Abstimmung

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-028](REQ-028_favoriten.md)

## Ziel

Teams erkennen bevorzugte Fotos anhand nachvollziehbarer Stimmen.

## Abnahmekriterien

1. Rangliste zählt je authentifizierter Identität und Foto höchstens eine Stimme und sortiert Gleichstände stabil.
2. Gastsitzungen werden getrennt als unverifizierte Stimmen dargestellt; keine Behauptung einer Stimme je realer Person.
3. Eigentümer kann Abstimmung beenden; danach sind Änderungen gesperrt und Abschlussstand bleibt sichtbar.

## Verifikation

- **Unit:** Zählung, Gleichstand und Abschlusslogik prüfen.
- **Integration:** Gleichzeitige Stimmen, entfernte Grants und eingefrorenen Stand prüfen.
- **E2E:** Zwei Konten stimmen ab; Eigentümer schließt und weiterer Abstimmversuch scheitert.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

