# REQ-071 – Sicherheit bei jeder Änderung und vor Releases

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; S1; S2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-053](REQ-053_bedrohungsmodell.md), [REQ-062](REQ-062_abhaengigkeiten.md), [REQ-066](REQ-066_ci_pipeline.md)

## Ziel

Sicherheit wird fortlaufend belegt und nicht einmalig zugesichert.

## Abnahmekriterien

1. Jede Änderung prüft Authentifizierung, Objektberechtigung, Eingaben, Datenausgabe, Dateien und Ressourcenverbrauch; relevante REQ-Tests werden angepasst.
2. Vor erstem Produktivstart und bei wesentlicher Angriffsflächenänderung erfolgen DAST und manuelle Prüfung von IDOR, OAuth-Replay, XSS, CSRF, Injection, Uploadmissbrauch und Freigabelecks im autorisierten Testsystem.
3. ASVS-Nachweismatrix enthält konkrete Kontroll-IDs der verwendeten Version, Ergebnis, Testlink und Datum; offene ausnutzbare hohe/kritische Befunde blockieren Release. Neue Standards werden mindestens quartalsweise bewertet.

## Verifikation

- **Unit:** Neue Sicherheitsregel erhält Regressions-Unit-Test.
- **Integration:** Automatisierte Angriffssuite gegen isolierte reale Dienste ausführen.
- **E2E:** Angreifer-Nutzerreisen manuell und automatisiert prüfen; Bericht samt Restrisiken zum Release ablegen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

