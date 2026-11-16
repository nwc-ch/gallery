# REQ-004 – Eigenes Konto verwalten

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag; REQ-060. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-002](REQ-002_google_login.md), [REQ-060](REQ-060_datenschutz_aufbewahrung.md)

## Ziel

Nutzer sehen ihr Profil und können die Löschung ihres Kontos auslösen.

## Abnahmekriterien

1. Profil zeigt Anzeigenamen und verifizierte Google-Adresse; fremde Profile sind nicht abrufbar.
2. Kontolöschung verlangt eine höchstens fünf Minuten alte erneute Anmeldung und klare Bestätigung mit Folgen für eigene Alben.
3. Löschauftrag sperrt sofort Sitzungen und Freigaben; endgültige Bereinigung erfolgt nachvollziehbar nach REQ-060.

## Verifikation

- **Unit:** Eigentumsprüfung und Reauthentifizierungsfenster prüfen.
- **Integration:** Löschauftrag mit Daten-, Objekt- und Sitzungsspeicher prüfen.
- **E2E:** Kontolöschung eines Testnutzers durchführen und alten Gastlink sowie alte Sitzung erneut öffnen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

