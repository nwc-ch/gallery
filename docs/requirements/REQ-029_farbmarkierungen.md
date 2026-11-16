# REQ-029 – Bildauswahl mit Farbstatus

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P3; P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-025](REQ-025_gast_identitaet.md)

## Ziel

Feedbackberechtigte markieren ihre Bildauswahl leicht verständlich.

## Abnahmekriterien

1. Pro Identität und Foto gilt neutral, ja, vielleicht oder nein; Status verwendet Text und Symbol zusätzlich zu Farbe.
2. Markierungen sind zunächst persönlich; Eigentümer kann sie je Person sehen, ohne fremde Entscheidungen zu überschreiben.
3. Änderungen sind versioniert und gehen bei Konflikten nicht still verloren; UI bestätigt gespeicherten Status.

## Verifikation

- **Unit:** Statusübergänge und nichtfarbliche Darstellung prüfen.
- **Integration:** Persönliche Trennung, Versionskonflikt und Berechtigungen prüfen.
- **E2E:** Zwei Empfänger markieren dasselbe Foto unterschiedlich; Eigentümer sieht beide Ergebnisse.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

