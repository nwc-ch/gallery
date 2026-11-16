# REQ-051 – OpenAPI und typisierter Angular-Client

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T9. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-048](REQ-048_nestjs_architektur.md), [REQ-052](REQ-052_api_regeln.md)

## Ziel

Der API-Vertrag ist nachvollziehbar und automatisch prüfbar.

## Abnahmekriterien

1. NestJS erzeugt eine versionierte OpenAPI-Spezifikation mit stabilen operationIds, DTOs, Fehlern, Cookie-/CSRF-Sicherheitsdefinitionen und Upload-/Jobabläufen.
2. Angular verwendet einen reproduzierbar generierten typisierten Client; Entities oder Secrets werden nicht in Responses veröffentlicht.
3. CI validiert Schema, erkennt Breaking Changes und prüft Client-Drift; Swagger-UI ist in Produktion deaktiviert oder separat geschützt. SSE erhält ergänzende Ereignisschemata.

## Verifikation

- **Unit:** DTO-Schema und Serialisierung prüfen.
- **Integration:** Response-/Request-Contractchecks gegen laufende API und generierten Client ausführen.
- **E2E:** Album erstellen, hochladen und teilen ausschließlich mit veröffentlichtem Vertrag durchführen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

