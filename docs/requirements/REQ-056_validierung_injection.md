# REQ-056 – Eingabevalidierung und Injection-Schutz

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: T4; S1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-048](REQ-048_nestjs_architektur.md), [REQ-049](REQ-049_datenmodell.md)

## Ziel

Jede externe Eingabe erhält serverseitige Typ-, Werte- und Größenprüfung.

## Abnahmekriterien

1. DTOs erlauben nur ausdrücklich definierte Felder; Eigentümer, Rollen und interne Status sind nie massenweise bindbar.
2. TypeORM verwendet Parameterbindung; Sortierfelder und Identifier stammen aus Allowlists; keine ungeprüften Raw-SQL-Fragmente.
3. JSON-Bodylimit 1 MiB, begrenzte Listen und Stringlängen; keine Shell-Kommandos mit Nutzereingaben, keine externen Bild-URLs oder beliebigen Server-Fetches.

## Verifikation

- **Unit:** DTO-Grenzen, Sortierallowlist und unerlaubte Felder prüfen.
- **Integration:** SQLi-, Mass-Assignment-, Pfad- und SSRF-Payloads gegen API und Worker prüfen.
- **E2E:** Manipuliertes Albumformular verändert keine Eigentümerschaft und führt keine externe Anfrage aus.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

