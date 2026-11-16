# REQ-036 – Ruhiger Präsentationsmodus

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P4. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-007](REQ-007_album_bearbeiten.md), [REQ-017](REQ-017_galerie_raster.md), [REQ-018](REQ-018_lightbox.md), [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Finale Fotos werden mit wenigen Bedienelementen präsentiert.

## Abnahmekriterien

1. Eigentümer aktiviert Cover-Einstieg und reduziertes Layout mit denselben sicheren Medienrechten.
2. Feedbackwerkzeuge sind optional verborgen; Verborgenheit verändert keine serverseitigen Berechtigungen.
3. Gezielt ausgeblendete Fotos fehlen auch in API-Listen, Einzelabrufen und ZIPs dieser Freigabe; Moduswechsel gewährt keine Zusatzrechte.

## Verifikation

- **Unit:** Modus- und Sichtbarkeitsregeln prüfen.
- **Integration:** Versteckte Foto-ID in Liste, Medien und ZIP anfordern.
- **E2E:** Präsentation mobil öffnen und versuchen, ausgeblendete Fotos direkt abzurufen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

