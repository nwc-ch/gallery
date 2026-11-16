# REQ-061 – Sicherheitsprotokolle und Nachvollziehbarkeit

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: S1; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Sicherheitsrelevante Änderungen sind ohne Datenleck untersuchbar.

## Abnahmekriterien

1. Loginresultate, Freigabe-/Rechteänderungen, Uploadablehnungen, Löschungen und privilegierte Aktionen tragen UTC-Zeit, pseudonyme Akteur-ID, Ziel-ID, Ergebnis und Request-ID.
2. Keine Token, Passwörter, signierten URLs, Foto-Inhalte oder Kommentartexte loggen; Log-Injection durch Zeilenumbrüche neutralisieren.
3. Logs sind zugriffsgeschützt, gegen unbemerkte Änderung abgesichert und nach REQ-060 bereinigt; häufige Autorisierungsfehler lösen einen Alarm aus.

## Verifikation

- **Unit:** Redaktion und strukturiertes Logging mit schädlichen Eingaben prüfen.
- **Integration:** Auditereignisse und unzulässigen Logzugriff im zentralen Speicher prüfen.
- **E2E:** Freigabe erstellen und widerrufen; zugehörige Ereignisse nachweisen, Tokenfreiheit kontrollieren.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

