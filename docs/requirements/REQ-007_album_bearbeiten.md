# REQ-007 – Albumdetails und Titelbild

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P2; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-005](REQ-005_album_erstellen.md), [REQ-013](REQ-013_vorschaubilder.md), [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Eigentümer ändern Albumtitel, Beschreibung und Titelbild.

## Abnahmekriterien

1. Titelbild kann nur ein verarbeitungsfertiges, nicht gelöschtes Foto desselben Albums sein.
2. Änderungen sind nach Neuladen sichtbar; Versionskonflikte liefern 409 statt stillen Überschreibens.
3. Titelbildlöschung setzt einen sicheren Ersatz oder einen Platzhalter; Beschreibung wird als Text ausgegeben.

## Verifikation

- **Unit:** Titelbildwahl und Versionskonflikt prüfen.
- **Integration:** Gleichzeitige Änderungen und fremde Foto-ID mit MariaDB prüfen.
- **E2E:** Titel und Cover ändern; zweite Sitzung versucht eine veraltete Änderung.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

