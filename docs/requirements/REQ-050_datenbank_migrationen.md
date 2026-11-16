# REQ-050 – Versionierte TypeORM-Migrationen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T8. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-049](REQ-049_datenmodell.md)

## Ziel

Datenbankschemata ändern sich reproduzierbar und ohne automatische Produktionssynchronisierung.

## Abnahmekriterien

1. synchronize ist in allen geteilten Umgebungen false; Schemaänderungen erfolgen über versionierte, geprüfte Migrationen.
2. Migrationen laufen als separater Deployment-Schritt mit Sperre; MariaDB-DDL wird wegen möglicher impliziter Commits nicht als pauschal rückrollbar behandelt.
3. CI prüft leere DB und Upgrade einer Vorversion; destruktive Änderungen benötigen Expand/Contract, Sicherung und dokumentierte Wiederherstellung.

## Verifikation

- **Unit:** Migrationskonfiguration und Verbot automatischer Synchronisierung prüfen.
- **Integration:** Migrationen auf leerer und befüllter MariaDB ausführen; Fehler und erneuten Start prüfen.
- **E2E:** Vorversionsdaten nach Upgrade im Browser öffnen und bearbeiten.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

