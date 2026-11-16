# REQ-059 – Transport, Geheimnisse und minimale Rechte

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; S1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-069](REQ-069_betrieb_konfiguration.md)

## Ziel

Produktionsdaten und Zugangsschlüssel sind während Transport und Betrieb geschützt.

## Abnahmekriterien

1. HTTPS wird erzwungen, TLS mindestens 1.2 mit bevorzugtem 1.3; HSTS nach Domainprüfung; DB-Verbindungen und externe Dienste verwenden verifizierte TLS-Zertifikate.
2. Secrets kommen aus geschützter Laufzeitkonfiguration, nie aus Repository oder Frontendbuild; R2-Tokens gelten nur für benötigte Buckets und Operationen.
3. API-, Worker- und Migrationsidentitäten haben getrennte minimale DB-/Storage-Rechte; Rotation und Sperrung sind dokumentiert und getestet; Verschlüsselung bei Speicherung wird je Dienst nachgewiesen.

## Verifikation

- **Unit:** Fehlende Secrets und zu breite Konfiguration ablehnen.
- **Integration:** TLS-Verifikation und gezielt eingeschränkte Testidentitäten prüfen.
- **E2E:** HTTP-Aufruf wird sicher umgeleitet; Frontendassets und Netzwerkantworten enthalten keine Backendgeheimnisse.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

