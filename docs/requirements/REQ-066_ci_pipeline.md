# REQ-066 – Verpflichtende Pipeline und Release-Gates

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-062](REQ-062_abhaengigkeiten.md), [REQ-063](REQ-063_unit_tests.md), [REQ-064](REQ-064_integration_tests.md), [REQ-065](REQ-065_e2e_tests.md), [REQ-071](REQ-071_laufende_sicherheitspruefung.md)

## Ziel

Nur geprüfte, nachvollziehbare Artefakte können veröffentlicht werden.

## Abnahmekriterien

1. Pull Requests prüfen Format/Lint, Typen, Build, Unit, Integration, E2E, OpenAPI-Drift, Migrationen und Sicherheitsanalyse; Fehler blockieren Merge.
2. Release ergänzt R2-Contracttest, DAST, Restore-Smoke und Artefakt-/SBOM-Zuordnung; Deploy verwendet dasselbe unveränderliche geprüfte Artefakt.
3. Testreports enthalten Commit und REQ-IDs; ausgelassene/instabile Pflichtfälle gelten als fehlgeschlagen. Secrets und Produktionsdaten stehen externen PR-Jobs nicht zur Verfügung.

## Verifikation

- **Unit:** Pipeline-Policy und Reportvollständigkeit prüfen.
- **Integration:** Absichtlich fehlerhaftes Testartefakt wird vor Deployment blockiert.
- **E2E:** Produktionsnahen Releasekandidaten deployen, Kernreise prüfen und Rollback auf Vorversion ausführen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

