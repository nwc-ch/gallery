# REQ-039 – Auswahllisten exportieren

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P1; P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-029](REQ-029_farbmarkierungen.md), [REQ-033](REQ-033_auswahl_abschliessen.md)

## Ziel

Eigentümer übertragen Auswahlen in weitere Foto-Workflows.

## Abnahmekriterien

1. Export enthält wählbar Dateinamen als UTF-8-Text oder CSV mit Foto-ID und Versionsbezug.
2. CSV neutralisiert Tabellenformeln und behandelt Sonderzeichen; gleichnamige Fotos werden nicht zusammengeführt.
3. Lightroom-/Capture-One-Suchlisten sind optionale Ausgabeformate mit dokumentierten Grenzen; keine ungeprüfte Plugin-Integration.

## Verifikation

- **Unit:** CSV-Escaping, Formelschutz und gleichnamige Dateien prüfen.
- **Integration:** Nur autorisierte Auswahl und richtigen Versionssnapshot exportieren.
- **E2E:** Auswahl exportieren und Inhalte mit sichtbarer Auswahl vergleichen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

