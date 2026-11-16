# REQ-001 – Einfacher Kernablauf

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; P1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-005](REQ-005_album_erstellen.md), [REQ-010](REQ-010_dateiauswahl.md), [REQ-020](REQ-020_gastlink.md), [REQ-046](REQ-046_barrierefreiheit.md)

## Ziel

Eigentümer erstellen Alben, laden Fotos hoch und teilen sie ohne Schulung.

## Abnahmekriterien

1. Der Hauptablauf lautet «Album erstellen → Fotos hinzufügen → Teilen»; pro Schritt gibt es eine erkennbare Hauptaktion.
2. Mit gültiger Sitzung, vorhandenem Album und abgeschlossenen Uploads lässt sich ein Gastlink in höchstens drei Aktionen erstellen und kopieren.
3. Mindestens vier von fünf erstmaligen Testpersonen öffnen einen erhaltenen Link und ein Foto innerhalb von 60 Sekunden ohne Hilfe.

## Verifikation

- **Unit:** Navigation und leere Zustände prüfen.
- **Integration:** Album-, Upload- und Freigabestatus gemeinsam prüfen.
- **E2E:** Erstellen, Hochladen, Teilen und Öffnen in getrennten Browserkontexten; Usability-Ziel zusätzlich mit Personen prüfen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

