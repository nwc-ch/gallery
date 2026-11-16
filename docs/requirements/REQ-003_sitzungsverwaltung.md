# REQ-003 – Sitzung und Abmelden

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T7. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-054](REQ-054_csrf_sitzungsschutz.md)

## Ziel

Serverseitige Sitzungen erlauben kontrolliertes Anmelden und Abmelden.

## Abnahmekriterien

1. Opaque Sitzungs-ID wird nach Login rotiert und ausschließlich in Secure-, HttpOnly-, SameSite=Lax-Cookie mit Path=/ und ohne Domain gespeichert.
2. Inaktivitätslimit 12 Stunden und absolute Laufzeit 7 Tage werden serverseitig geprüft; Gastlaufzeiten begrenzt zusätzlich REQ-024.
3. Abmelden widerruft die Sitzung sofort; Google-Refresh-Tokens werden für reinen Login nicht angefordert.

## Verifikation

- **Unit:** Laufzeitgrenzen und Rotation mit kontrollierter Uhr prüfen.
- **Integration:** Sitzungsspeicher und gleichzeitige Abmeldung über mehrere API-Instanzen prüfen.
- **E2E:** Anmelden, Neuladen, Abmelden und Zurück-Navigation zeigen keine privat nutzbaren Inhalte.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

