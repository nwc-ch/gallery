# REQ-052 – API-Pagination, Fehler und Idempotenz

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-048](REQ-048_nestjs_architektur.md)

## Ziel

Konsistente API-Regeln machen Netzfehler und Parallelzugriffe beherrschbar.

## Abnahmekriterien

1. API verwendet /api/v1, UTC-ISO-Zeitpunkte, begrenzte cursorbasierte Listen und einen Fehlerumschlag mit code, message, requestId und optionalen Feldfehlern.
2. Create-Upload-, ZIP- und Abschlussaufträge unterstützen benutzergebundene Idempotency-Keys für 24 Stunden; gleicher Schlüssel mit verändertem Payload liefert 409.
3. 401 bedeutet fehlende Sitzung, 403 fehlende Fähigkeit in sichtbarem Kontext, 404 unsichtbares Objekt, 409 Versionskonflikt, 413 zu groß und 429 mit Retry-After.

## Verifikation

- **Unit:** Fehlermapping, Cursorvalidierung und Payload-Fingerprint prüfen.
- **Integration:** Gleichen Auftrag parallel senden und nur eine Wirkung nachweisen.
- **E2E:** Doppelklick und Retry nach Antwortverlust erzeugen kein doppeltes Album-Uploadobjekt oder ZIP.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

