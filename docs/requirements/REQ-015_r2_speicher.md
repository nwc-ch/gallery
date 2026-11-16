# REQ-015 – Privater Cloudflare-R2-Speicher

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-059](REQ-059_transport_geheimnisse.md)

## Ziel

Alle Originale und Derivate liegen in privaten R2-Buckets.

## Abnahmekriterien

1. Öffentliche Buckets und r2.dev-Zugriff sind deaktiviert; Objektschlüssel werden serverseitig zufällig und ohne personenbezogene Dateinamen erzeugt.
2. Uploads erhalten objekt- und methodengebundene S3-Presigned-URLs mit höchstens fünf Minuten Laufzeit; CORS erlaubt nur festgelegte Frontend-Origins und notwendige Methoden/Header.
3. Lesen erfolgt im MVP durch einen autorisierenden Medien-Endpunkt mit privatem No-Store-Caching; R2-Schlüssel und dauerhafte Lese-URLs gelangen nie zum Client.

## Verifikation

- **Unit:** Objektschlüssel, Signierungsparameter und Origin-Allowlist prüfen.
- **Integration:** Private Zugriffe, PUT-Signaturen und ungültige Methoden in einem isolierten R2-Testbucket prüfen.
- **E2E:** Direkte Objektadresse und fremde Medien-ID öffnen; beide Zugriffe bleiben gesperrt.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

