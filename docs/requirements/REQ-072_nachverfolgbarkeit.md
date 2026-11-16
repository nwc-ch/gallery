# REQ-072 – Anforderungs- und Testnachweise

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-063](REQ-063_unit_tests.md), [REQ-064](REQ-064_integration_tests.md), [REQ-065](REQ-065_e2e_tests.md)

## Ziel

Jede Umsetzung bleibt von der Anforderung bis zum Test nachvollziehbar.

## Abnahmekriterien

1. Jede REQ behält ihre Nummer; Änderungen erhalten Begründung, aktualisierte Kriterien und betroffene Abhängigkeiten.
2. Implementierung/PR und Tests tragen REQ-ID; Matrix verlinkt Unit-, Integrations- und E2E-Nachweise sowie Status geplant, umgesetzt, verifiziert.
3. Fertig bedeutet: Akzeptanz erfüllt, drei Testebenen grün, Sicherheitsreview erledigt, Dokumentation aktuell; nicht anwendbare Testfälle benötigen konkrete Begründung und Systemnachweis.

## Verifikation

- **Unit:** Schema und Eindeutigkeit der REQ-/Testzuordnung prüfen.
- **Integration:** Dokumentationsvalidator gegen fehlende Dateien, Links und Testnachweise ausführen.
- **E2E:** Einen Releasekandidaten anhand der Matrix vollständig bis zu Testreports und Nutzerreise zurückverfolgen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

