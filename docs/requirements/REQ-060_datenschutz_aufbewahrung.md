# REQ-060 – Datenminimierung, Speicherregion und Löschfristen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T13; eigene Produktpolitik. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-009](REQ-009_papierkorb.md), [REQ-061](REQ-061_audit_protokolle.md), [REQ-068](REQ-068_backup_wiederherstellung.md)

## Ziel

Personendaten und Fotos werden nachvollziehbar sparsam verarbeitet.

## Abnahmekriterien

1. Originale behalten EXIF für Eigentümer/erlaubte Downloader; Vorschauen entfernen GPS. Keine Gesichtserkennung, Nutzung zum KI-Training oder Werbe-Tracker im Basisumfang.
2. Vor Produktivbetrieb sind Verantwortlicher, Zielregion für DB/Backups/Worker und R2-Jurisdiktion dokumentiert; Standort-Hints gelten nicht als Residenzgarantie. Anwendbares Recht und Dienstverträge bleiben zu prüfen.
3. Vorschlagsfristen: Papierkorb 7 Tage, ZIP/abgebrochene Uploads 24 Stunden, Betriebslogs 14 Tage, Sicherheitslogs 90 Tage, Backups 30 Tage; Kontolöschung bereinigt aktive Daten binnen 30 Tagen. Wiederherstellung wendet Löschregister erneut an.

## Verifikation

- **Unit:** Retentionberechnung und EXIF-Freigaberegeln prüfen.
- **Integration:** Löschauftrag entfernt abhängige Datensätze/Objekte und bewahrt minimales Löschregister für Restore.
- **E2E:** Konto löschen und Zugriffsende prüfen; Region und Fristen zusätzlich dokumentiert abnehmen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

