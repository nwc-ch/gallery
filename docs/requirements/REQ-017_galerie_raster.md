# REQ-017 – Responsive Fotogalerie

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P2; P6. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-013](REQ-013_vorschaubilder.md), [REQ-022](REQ-022_berechtigungen.md), [REQ-044](REQ-044_ci_layout.md)

## Ziel

Empfänger sehen ein klares, schnelles Raster zugänglicher Fotos.

## Abnahmekriterien

1. Raster zeigt nur ready-Fotos und sichtbare Derivate; Cover-Zuschnitt verändert Originale nicht.
2. Seitenweises Nachladen zeigt insgesamt höchstens 100 neue Datensätze pro Abruf; Bilder außerhalb des sichtbaren Bereichs laden verzögert.
3. Auswahl- und Downloadaktionen erscheinen entsprechend den aktuellen Rechten; leere und gesperrte Alben haben eigene Zustände.

## Verifikation

- **Unit:** Rasterstatus, Bildvarianten und Aktionssichtbarkeit prüfen.
- **Integration:** Fotoliste mit gelöschten, verarbeitenden und fremden Fotos prüfen.
- **E2E:** Album mit 500 Fotos auf Mobil- und Desktopbreite öffnen und nachladen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

