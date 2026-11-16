# REQ-058 – Rate-Limits und Ressourcenbudgets

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: S1; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Automatisierter Missbrauch kann Daten und Kosten nicht unbegrenzt belasten.

## Abnahmekriterien

1. Konfigurierbare Startwerte: Loginstart 20/15 min/IP, Passwortversuch 5/15 min/Grant+IP, API-Schreibzugriffe 120/min/Identität und höchstens zwei ZIP-Jobs/Eigentümer gleichzeitig.
2. Limits gelten konsistent über Instanzen; nur vertrauenswürdige Proxies dürfen Client-IP setzen; Identifier in Limit-Schlüsseln sind gehasht.
3. 429 enthält Retry-After; Lastgrenzen, Bandbreitenbudgets und Abbruchmechanismen schützen Worker, R2 und Medienstreaming; legitime Nutzer erhalten verständliche Rückmeldung.

## Verifikation

- **Unit:** Zählfenster, Identitätskeys und Retry-After prüfen.
- **Integration:** Verteilte Limits, manipuliertes X-Forwarded-For und Jobsättigung prüfen.
- **E2E:** Schnelle Fehlversuche blockieren Angreifer; ein unabhängiger zulässiger Nutzer bleibt arbeitsfähig.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

