# REQ-019 – Fotos sortieren und filtern

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P5; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-017](REQ-017_galerie_raster.md), [REQ-028](REQ-028_favoriten.md), [REQ-029](REQ-029_farbmarkierungen.md)

## Ziel

Nutzer finden Fotos nach Namen, Reihenfolge und Rückmeldungen.

## Abnahmekriterien

1. Sortierung nach Dateiname, Uploadzeit und manueller Eigentümerreihenfolge ist deterministisch mit ID als Tie-Breaker.
2. Filter für eigene Favoriten und Farbstatus sind kombinierbar; aktive Filter und Zurücksetzen sind sichtbar.
3. Sortierfelder werden serverseitig erlaubt aufgelistet; Filter und Pagination beziehen sich auf dieselbe Ordnung.

## Verifikation

- **Unit:** Sortiervergleich, Filterkombination und Reset prüfen.
- **Integration:** Stabile Seitengrenzen und unerlaubtes Sortierfeld gegen MariaDB prüfen.
- **E2E:** Favoriten filtern, sortieren und Filter löschen; Fotoanzahl bleibt nachvollziehbar.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

