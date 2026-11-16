# REQ-040 – RAW, TIFF, PSD und Video

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P1; P2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-012](REQ-012_bildformate.md), [REQ-013](REQ-013_vorschaubilder.md), [REQ-057](REQ-057_sichere_bildverarbeitung.md)

## Ziel

Professionelle Medienformate werden erst mit eigener sicherer Verarbeitung freigegeben.

## Abnahmekriterien

1. Je zusätzlichem Format werden Decoder, Dateigrenze, Previewstrategie und Testfixtures ausdrücklich ergänzt.
2. Ohne freigegebenen Decoder bleibt das Format abgelehnt; Video benötigt eigene Transcoding- und Streaminggrenzen.
3. Parser laufen mit Ressourcenlimits und ohne Netzwerk; Formatunterstützung wird erst nach allen drei Testebenen angezeigt.

## Verifikation

- **Unit:** Formatregistrierung und Capability-Mapping prüfen.
- **Integration:** Reale RAW-/TIFF-/PSD-/Video-Fixtures und schadhafte Varianten in isolierten Workern prüfen.
- **E2E:** Neues unterstütztes Format hochladen und Vorschau/Download gemäß Fähigkeiten verwenden.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

