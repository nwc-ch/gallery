# REQ-035 – Benachrichtigungen und E-Mail-Einladungen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-021](REQ-021_personenfreigabe.md), [REQ-030](REQ-030_kommentare.md), [REQ-034](REQ-034_live_aktualisierung.md), [REQ-060](REQ-060_datenschutz_aufbewahrung.md)

## Ziel

Nutzer erhalten bei Bedarf Hinweise zu neuen Rückmeldungen und Einladungen.

## Abnahmekriterien

1. In-App-Ereignisse und optionaler E-Mail-Versand verwenden einen separat konfigurierten Transaktionsmail-Adapter.
2. Kommentare werden in E-Mails nur nach Opt-in zusammengefasst; standardmäßig keine privaten Bilder oder Kommentartexte mitsenden.
3. Outbox verhindert Verlust; Versand ist dedupliziert, begrenzt und abbestellbar, ohne Pflicht-Sicherheitsmeldungen zu verschlucken.

## Verifikation

- **Unit:** Vorlagenescaping, Opt-in und Deduplizierung prüfen.
- **Integration:** Mail-Testserver, Retry und deaktivierten Versand prüfen.
- **E2E:** Einladung versenden, annehmen und Rückmeldungsbenachrichtigung abbestellen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

