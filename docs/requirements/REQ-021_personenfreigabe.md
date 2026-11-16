# REQ-021 – Album gezielt für Personen freigeben

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-002](REQ-002_google_login.md), [REQ-022](REQ-022_berechtigungen.md), [REQ-024](REQ-024_freigabe_widerrufen.md)

## Ziel

Persönliche Freigaben binden den Zugriff an eine verifizierte Google-Identität.

## Abnahmekriterien

1. Eigentümer legt Empfängeradresse und Rechte fest; unbekannte Adressen lösen keine Auskunft über vorhandene Konten aus.
2. Annahme erfolgt nach Google-Login nur mit passender verifizierter E-Mail; danach wird der Grant an iss + sub gebunden.
3. UI erzeugt einen kopierbaren Einladungslink; automatischer E-Mail-Versand ist erst REQ-035 und keine MVP-Voraussetzung.

## Verifikation

- **Unit:** Adressnormalisierung ohne Punkt-/Plus-Alias-Raten und Einladungsbindung prüfen.
- **Integration:** Einmalige Annahme, falsche Identität und doppelte Annahme prüfen.
- **E2E:** Einladung mit vorgesehenem Konto annehmen; anderes Konto erhält keinen Zugriff.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

