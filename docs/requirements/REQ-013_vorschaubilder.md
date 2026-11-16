# REQ-013 – Vorschaubilder und Metadaten

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P2; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-012](REQ-012_bildformate.md), [REQ-016](REQ-016_speicher_konsistenz.md), [REQ-057](REQ-057_sichere_bildverarbeitung.md)

## Ziel

Verarbeitete Fotos liefern schnelle, korrekt ausgerichtete Vorschauen.

## Abnahmekriterien

1. Worker erzeugt Derivate mit maximalen Kantenlängen 320, 960 und 1920 Pixel ohne Hochskalierung; EXIF-Orientierung wird angewendet und Vorschau nach sRGB konvertiert.
2. Original bleibt byteidentisch; Derivate entfernen EXIF einschließlich GPS und erhalten bekannte sichere MIME-Typen.
3. Nur Zustand ready ist freigabefähig; Decoderfehler erscheinen Eigentümern mit Wiederholen-Aktion, Gästen ohne technische Details.

## Verifikation

- **Unit:** Variantenauswahl, Metadatenfilter und Zustandsabbildung prüfen.
- **Integration:** Orientierte und GPS-markierte echte Bilddateien dekodieren, Ausgabe und Originalhash vergleichen.
- **E2E:** Nach Upload erscheint korrekt gedrehtes Foto; Netzwerkantwort der Vorschau enthält keine GPS-Daten.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

