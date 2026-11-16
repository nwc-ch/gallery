# REQ-049 – MariaDB-Datenmodell und Integrität

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; eigener Architekturvorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-048](REQ-048_nestjs_architektur.md)

## Ziel

TypeORM speichert Metadaten relational in MariaDB.

## Abnahmekriterien

1. Kernobjekte User, Session, Album, Photo, PhotoVersion, Derivative, Upload, ShareGrant, GuestIdentity, Favorite, ColorMark, Comment, Job und Outbox sind mit Eigentumsbezug modelliert.
2. Fremdschlüssel, Unique Constraints und Indizes sichern Identität, Favoriten, Objektzuordnung und Listenabfragen; Text utf8mb4, Zeitpunkte UTC mit dokumentierter Millisekundenpräzision.
3. Dateibytes gehören nach R2; Datenbank speichert Größen, Hashes, Status und Schlüssel. Löschkaskaden sind bewusst definiert und lösen keine unkontrollierten Storage-Löschungen aus.

## Verifikation

- **Unit:** Entity-Mapping und Fachinvarianten prüfen.
- **Integration:** Constraints, Isolation, konkurrierende Transaktionen und Indexpläne mit echter MariaDB prüfen.
- **E2E:** Zwei Nutzer erstellen gleichnamige Alben und Fotos; Inhalte bleiben getrennt.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

