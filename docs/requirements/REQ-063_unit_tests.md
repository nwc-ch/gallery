# REQ-063 – Unit-Tests für jede Anforderung

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T10; T11. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-047](REQ-047_angular_architektur.md), [REQ-048](REQ-048_nestjs_architektur.md)

## Ziel

Fachregeln und UI-Verhalten werden isoliert und deterministisch geprüft.

## Abnahmekriterien

1. Jede implementierte REQ-ID hat mindestens ein sinnvolles Unit-Szenario aus ihrer Testsektion; Infrastrukturregeln werden über echte Konfigurations-/Policyfunktionen geprüft.
2. Angular verwendet den zur gewählten CLI-Version passenden unterstützten Runner mit TestBed; NestJS den unterstützten Test-Runner mit TestingModule. Uhr, Zufall und externe Dienste werden kontrolliert.
3. Zielwerte: mindestens 85 % Statements/Lines/Functions und 80 % Branches je Anwendung; Auth-, Rechte- und Freigabedomäne mindestens 95 % Branches; alle beschriebenen Sicherheitsregeln bleiben unabhängig davon Pflichtfälle.

## Verifikation

- **Unit:** Coverage-Auswertung, Zeitgrenzen und Testisolation an Fixtures prüfen.
- **Integration:** Unit-Runner und Reportparser in CI mit bewusst fehlschlagendem Fixture prüfen.
- **E2E:** Ein realer Fehler in einer Kernregel wird vom zugeordneten Unit-Test und Nutzerablauf erkannt; Fixture nie produktiv einbauen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

