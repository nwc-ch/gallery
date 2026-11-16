# REQ-018 – Fotoeinzelansicht und Navigation

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P4; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-017](REQ-017_galerie_raster.md), [REQ-046](REQ-046_barrierefreiheit.md)

## Ziel

Fotos lassen sich groß betrachten und einfach durchblättern.

## Abnahmekriterien

1. Einzelansicht zeigt vollständiges Bild ohne erzwungenen Zuschnitt, Dateiname und Zähler.
2. Pfeiltasten, Vor/Zurück-Schaltflächen und mobile Wischgeste navigieren; Escape schließt und setzt Fokus auf das Ausgangsfoto zurück.
3. Bildfehler blockieren Navigation nicht; bei entzogenem Zugriff wird die Einzelansicht geschlossen und Bildzustand geleert.

## Verifikation

- **Unit:** Indexgrenzen, Fokusübergabe und Fehlerzustand prüfen.
- **Integration:** Albumrechte auch beim Abruf hochauflösender Derivate prüfen.
- **E2E:** Per Tastatur öffnen, durchblättern und schließen; währenddessen Freigabe entziehen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

