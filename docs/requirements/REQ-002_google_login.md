# REQ-002 – Google-Anmeldung

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T6; T7. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-003](REQ-003_sitzungsverwaltung.md), [REQ-054](REQ-054_csrf_sitzungsschutz.md)

## Ziel

Google OAuth2 mit OpenID Connect authentifiziert registrierte Nutzer.

## Abnahmekriterien

1. NestJS führt Authorization Code Flow mit PKCE S256, state und nonce aus; nur openid, email und profile anfordern.
2. ID-Token mit etablierter Bibliothek auf Signatur, zulässigen Algorithmus, iss, aud, exp und nonce prüfen; Identität über iss + sub speichern.
3. Abbruch, abgelaufener Code und ungültiger Rücksprung erzeugen keine Sitzung; Redirect-URIs sind exakt freigegeben.

## Verifikation

- **Unit:** Claim-, state-, nonce- und Redirect-Validierung einschließlich Replay prüfen.
- **Integration:** OIDC-Testprovider mit echten signierten Testtokens, JWKS-Wechsel und ungültiger Audience verwenden.
- **E2E:** Anmelden, Abbrechen und Callback-Manipulation im Browser; Live-Google-Smoke separat im Testkonto.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

