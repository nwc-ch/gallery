# REQ-068 – Backups und verifizierte Wiederherstellung

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-049](REQ-049_datenmodell.md), [REQ-060](REQ-060_datenschutz_aufbewahrung.md)

## Ziel

Datenverlust und Wiederanlauf sind messbar beherrschbar.

## Abnahmekriterien

1. Zielwerte RPO höchstens 24 Stunden, RTO höchstens 8 Stunden; DB-Backups täglich verschlüsselt, Aufbewahrung 30 Tage.
2. R2 benötigt explizite unabhängige Kopie/Backupstrategie für Originale und Manifest; Objektspeicherdurabilität und Papierkorb ersetzen kein Backup.
3. Monatlicher Restore in isolierter Umgebung prüft DB, Stichprobenhashes, Objektverweise und erneutes Anwenden des Löschregisters; Derivate sind reproduzierbar.

## Verifikation

- **Unit:** Manifestvergleich und Löschregister-Anwendung prüfen.
- **Integration:** DB und Objekte aus Sicherung wiederherstellen, inkonsistente Referenzen melden.
- **E2E:** Wiederhergestelltes Album öffnen und Originalhash prüfen; zuvor gelöschtes Konto bleibt gesperrt.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

