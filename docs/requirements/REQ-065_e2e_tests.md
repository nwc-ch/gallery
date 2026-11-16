# REQ-065 – Browser-E2E und Nutzerreisen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-063](REQ-063_unit_tests.md), [REQ-064](REQ-064_integration_tests.md)

## Ziel

Vollständige Abläufe sind mit echten Frontend- und Backendprozessen geprüft.

## Abnahmekriterien

1. Playwright prüft Chromium, Firefox und WebKit sowie mobile Viewports; mindestens alle MVP-Nutzerreisen und Sicherheits-Negativfälle sind abgedeckt.
2. Tests verwenden getrennte Eigentümer-, Personen- und Gastkontexte; OIDC-Testprovider ist ausschließlich in Testumgebungen verfügbar, kein Produktions-Loginbypass.
3. Jede implementierte REQ-ID ist einem Browserablauf oder Infrastruktur-E2E-Nachweis zugeordnet; retries kaschieren keine Fehler, Traces/Screenshots sind redigiert und enthalten keine echten Fotos.

## Verifikation

- **Unit:** Testhelfer und Kontexttrennung mit Testfixtures prüfen.
- **Integration:** E2E-Setup, Seeds, Worker und Dienstbereitschaft zusammen prüfen.
- **E2E:** Erstellen → Upload → Personen-/Gastfreigabe → Feedback → ZIP → Widerruf → Löschen in allen Zielbrowsern.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

