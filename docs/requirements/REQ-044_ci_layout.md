# REQ-044 – CI-Layout, Raster und Responsivität

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: D2; eigene Produktanpassung. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-042](REQ-042_ci_farben.md), [REQ-043](REQ-043_ci_typografie.md)

## Ziel

Die Galerie wirkt ruhig und hochwertig auf Handy, Tablet und Desktop.

## Abnahmekriterien

1. Abstandsskala 4, 8, 12, 16, 24, 32, 48, 64 px; schmale Radien 4/8 px und klare dünne Ränder statt dekorativer Überladung.
2. App-Navigation 64 px hoch; Inhaltsrand 16/24/32 px; Foto-Raster mindestens 160 px Kartenbreite, 12/16/24 px Abstand; Breakpoints 640 und 1024 px.
3. Bei 320 px Breite bis 2560 px und 200-%-Zoom sind Hauptaktionen erreichbar; keine allgemeine horizontale Seitenscrollleiste; Bildansicht darf gezielt zoomen.

## Verifikation

- **Unit:** Layout- und Navigationszustände an Breakpoint-Grenzen prüfen.
- **Integration:** Seitenkomponenten mit langen Titeln und dynamischen Inhalten rendern.
- **E2E:** Screenshots bei 375, 768 und 1440 px; 320 px sowie Zoom separat auf Überlauf prüfen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

