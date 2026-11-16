# REQ-034 – Rückmeldungen live aktualisieren

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P1; P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-024](REQ-024_freigabe_widerrufen.md), [REQ-028](REQ-028_favoriten.md), [REQ-029](REQ-029_farbmarkierungen.md), [REQ-030](REQ-030_kommentare.md)

## Ziel

Beteiligte sehen neue Rückmeldungen ohne manuelles Neuladen.

## Abnahmekriterien

1. Server-Sent Events übertragen nur freigegebene Albumereignisse; keine Tokens in Query-Parametern.
2. 95 % der bestätigten Änderungen erscheinen innerhalb von zwei Sekunden unter dem Lastprofil aus REQ-067.
3. Reconnect verwendet Ereignis-ID und erneute Rechteprüfung; bei Lücke werden erlaubte Daten neu geladen; Widerruf beendet Verbindung.

## Verifikation

- **Unit:** Event-Reihenfolge, Deduplizierung und Reconnect prüfen.
- **Integration:** Outbox-Übertragung, Replay und Rechteentzug zwischen zwei Instanzen prüfen.
- **E2E:** Zwei Browserkontexte zeigen Kommentar/Favorit live; Netzunterbrechung und Widerruf prüfen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

