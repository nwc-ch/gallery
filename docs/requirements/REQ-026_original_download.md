# REQ-026 – Einzelne Fotos herunterladen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P1; P2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-015](REQ-015_r2_speicher.md), [REQ-022](REQ-022_berechtigungen.md), [REQ-024](REQ-024_freigabe_widerrufen.md)

## Ziel

Berechtigte Empfänger laden Originale unverändert herunter.

## Abnahmekriterien

1. Downloadfähigkeit ist standardmäßig aus und wird beim Anfordern sowie Streambeginn geprüft; Vorschauzugriff gewährt keinen Originalzugriff.
2. Antwort nutzt bereinigten Dateinamen, Content-Disposition attachment, bekannten MIME-Typ und nosniff; Originalhash bleibt identisch.
3. UI erklärt, dass Abschalten von Downloads Screenshots und Speichern sichtbarer Vorschauen technisch nicht verhindert.

## Verifikation

- **Unit:** Dateinamenbereinigung und Downloadrecht prüfen.
- **Integration:** Streamberechtigung, Range-Anfragen und Hash gegen R2 prüfen.
- **E2E:** Original herunterladen und Hash vergleichen; nach Rechteentzug direkten Endpunkt erneut anfordern.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

