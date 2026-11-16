# REQ-012 – Zulässige Bildformate und Grenzen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; eigene MVP-Eingrenzung zu P2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-057](REQ-057_sichere_bildverarbeitung.md)

## Ziel

Der erste Umfang verarbeitet JPEG, PNG und WebP sicher und vorhersehbar.

## Abnahmekriterien

1. Je Datei gelten maximal 50 MiB und 100 Megapixel; Limits sind serverseitig konfiguriert und in der UI sichtbar.
2. Server prüft Dateisignatur, tatsächlichen Decoder-Typ und Abmessungen; Endung und Content-Type allein genügen nicht.
3. SVG, HTML, Archive und animierte Formate werden im MVP abgelehnt; Erweiterungen folgen REQ-040.

## Verifikation

- **Unit:** Allowlist und Grenzwerte inklusive falscher Endung prüfen.
- **Integration:** Echte JPEG-, PNG-, WebP-, beschädigte und typgefälschte Fixtures durch Verarbeitung schicken.
- **E2E:** Gültiges Foto und als JPEG getarnte HTML-Datei hochladen; nur gültiges Foto wird sichtbar.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

