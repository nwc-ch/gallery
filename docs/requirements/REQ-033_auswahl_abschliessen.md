# REQ-033 – Auswahl verbindlich abschließen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P3; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-029](REQ-029_farbmarkierungen.md), [REQ-038](REQ-038_dateiversionen.md)

## Ziel

Empfänger können eine Auswahl bewusst zur Bearbeitung übergeben.

## Abnahmekriterien

1. Abschlussdialog zeigt ausgewählte Foto- und Versions-IDs mit Anzahl; leere Auswahl verlangt ausdrückliche Bestätigung.
2. Abschluss speichert einen unveränderlichen Snapshot mit Identität und Zeitpunkt; neue Änderungen erzeugen eine Revision.
3. Eigentümer kann Revisionen vergleichen; neue Bildversionen ändern keinen alten Snapshot.

## Verifikation

- **Unit:** Snapshot- und Revisionsregeln prüfen.
- **Integration:** Parallelabschluss und spätere Versionswechsel prüfen.
- **E2E:** Auswahl abschließen, Foto versionieren und unveränderten Abschlussstand anzeigen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

