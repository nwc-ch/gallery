# REQ-037 – Wasserzeichen auf Vorschauen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P3. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-013](REQ-013_vorschaubilder.md), [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Eigentümer kennzeichnen freigegebene Vorschauen bei Bedarf.

## Abnahmekriterien

1. Server erzeugt getrennte Derivate mit Text- oder freigegebenem Rasterlogo; Original bleibt unverändert.
2. Wasserzeichenfreigaben liefern ausschließlich markierte Derivate, auch in Lightbox und hochauflösender Vorschau.
3. Ein aktiviertes Wasserzeichen deaktiviert Originaldownloads nicht automatisch; Dialog erklärt den Zusammenhang und die begrenzte Schutzwirkung.

## Verifikation

- **Unit:** Variantenauswahl und Konfiguration prüfen.
- **Integration:** Pixelvergleich, Originalhash und unmarkierte Derivat-IDs unter Wasserzeichenfreigabe prüfen.
- **E2E:** Wasserzeichen aktivieren und alle Vorschauansichten kontrollieren.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

