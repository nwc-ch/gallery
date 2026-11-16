# REQ-055 – XSS-Schutz und Browser-Header

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: T2; S1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-047](REQ-047_angular_architektur.md), [REQ-059](REQ-059_transport_geheimnisse.md)

## Ziel

Unvertrauenswürdige Namen und Kommentare werden sicher angezeigt.

## Abnahmekriterien

1. Angular rendert Benutzereingaben als Text; kein ungeprüftes innerHTML oder bypassSecurityTrust-Aufruf; produktive AOT-Builds sind Pflicht.
2. CSP verwendet geprüfte Nonces/Hashes, keine pauschalen unsafe-inline/unsafe-eval-Ausnahmen; frame-ancestors none, object-src none und base-uri self; Trusted Types wo unterstützt.
3. nosniff und Referrer-Policy no-referrer schützen Medien und Freigaben; private Antworten nutzen Cache-Control private, no-store; Service Worker speichern keine privaten API-/Medienantworten.

## Verifikation

- **Unit:** Escaping und Headerkonfiguration prüfen.
- **Integration:** Stored-/DOM-XSS-Payloads in Album, Name, Dateiname und Kommentar prüfen; CSP-Verstöße auswerten.
- **E2E:** Payload im Browser anzeigen: kein Skript läuft; reguläre Angular-Navigation bleibt funktionsfähig.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

