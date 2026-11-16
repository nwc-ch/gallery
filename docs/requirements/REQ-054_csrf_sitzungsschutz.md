# REQ-054 – CSRF- und OAuth-Sitzungsschutz

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: T6; T7; S1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-003](REQ-003_sitzungsverwaltung.md)

## Ziel

Cookiebasierte Sitzungen sind gegen Cross-Site-Aktionen und Fixation geschützt.

## Abnahmekriterien

1. Mutierende Browser-API-Aufrufe erfordern sitzungsgebundenes CSRF-Token und gültige Origin-Prüfung; SameSite allein genügt nicht.
2. OAuth-Callback validiert einmalige state/nonce/PKCE-Daten mit höchstens zehn Minuten Gültigkeit; keine offenen Redirects oder wiederverwendbaren Login-Codes.
3. Auth- und Gastcookies werden host-only mit __Host-Präfix ausgeliefert; kein Sitzungstoken in LocalStorage, Queryparametern oder Logs.

## Verifikation

- **Unit:** CSRF-Vergleich, Return-URL-Allowlist und einmalige Callbackdaten prüfen.
- **Integration:** Cross-Origin-POST, Session-Fixation und Callback-Replay an echter API prüfen.
- **E2E:** Angreiferseite löst mutierende Anfrage aus; Aktion bleibt wirkungslos, regulärer Ablauf funktioniert.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

