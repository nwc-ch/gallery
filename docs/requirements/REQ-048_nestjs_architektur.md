# REQ-048 – NestJS-Architektur und Konventionen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T3; T4; T11. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: Keine fachlichen Vorbedingungen.

## Ziel

NestJS trennt Transport, Fachlogik und Infrastruktur.

## Abnahmekriterien

1. Fachmodule Auth, Users, Albums, Photos, Sharing, Feedback und Jobs verwenden Dependency Injection; Controller bleiben dünn.
2. Globale Authentifizierung ist default deny; ausdrücklich öffentliche Login-/Freigabe-Endpunkte werden separat markiert; Policies prüfen Objektbezug.
3. DTOs sind getrennt von Entities; globale ValidationPipe mit whitelist und forbidNonWhitelisted, kontrollierter Transformation und zentralem Exception Filter.

## Verifikation

- **Unit:** Policies, Services und DTO-Regeln isoliert prüfen.
- **Integration:** Nest TestingModule mit echter MariaDB und realen Guards/Pipes prüfen.
- **E2E:** OpenAPI-Client nutzt produktionsnah gestartete API; ungültige DTOs und ungeschützte Routen negativ prüfen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

