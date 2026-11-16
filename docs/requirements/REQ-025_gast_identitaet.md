# REQ-025 – Gastidentität für Rückmeldungen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P1; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-020](REQ-020_gastlink.md), [REQ-054](REQ-054_csrf_sitzungsschutz.md)

## Ziel

Gäste können ohne Konto verständlich und pseudonym Feedback geben.

## Abnahmekriterien

1. Vor erster Rückmeldung wird ein Anzeigename mit 1–80 Zeichen erfragt; Lesen bleibt ohne Namenseingabe möglich.
2. Server erzeugt eine zufällige, freigabegebundene Gastidentität in einer sicheren Sitzung; Namen sind keine verifizierten Identitäten.
3. Browserwechsel erzeugt neue Identität; UI erklärt diese Grenze und verwendet kein Gerätefingerprinting.

## Verifikation

- **Unit:** Namensgrenzen und sichtbare Kennzeichnung prüfen.
- **Integration:** Gast-IDs dürfen nicht clientseitig vorgegeben oder zwischen Freigaben übernommen werden.
- **E2E:** Als Gast Favorit setzen, erneut laden und im privaten zweiten Kontext getrennte Identität sehen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

