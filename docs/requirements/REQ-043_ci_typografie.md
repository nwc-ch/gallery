# REQ-043 – CI-Typografie

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: D1; D2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-046](REQ-046_barrierefreiheit.md)

## Ziel

Große Titel nutzen Cormorant Garamond, Bedienelemente Montserrat.

## Abnahmekriterien

1. Überschriften verwenden Cormorant Garamond 500/600, Fließtext und UI Montserrat 400/500/600; System-Fallbacks bleiben definiert.
2. WOFF2-Schriften werden nach Lizenzprüfung lokal ausgeliefert, font-display swap; keine Laufzeitanfragen an Google Fonts.
3. Grundtext 16 px/1,6; UI mindestens 14 px; h1 clamp(2rem,4vw,3rem), h2 1,75rem; lange Dateinamen brechen ohne Informationsverlust um.

## Verifikation

- **Unit:** Typografietoken und Fallback-Regeln prüfen.
- **Integration:** Schriftdateien, MIME-Typen und lokale Auslieferung prüfen.
- **E2E:** Schriftladen blockieren und 200-%-Zoom prüfen; Kernaktionen bleiben nutzbar.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

