# REQ-009 – Album und Fotos löschen oder wiederherstellen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-016](REQ-016_speicher_konsistenz.md), [REQ-022](REQ-022_berechtigungen.md), [REQ-060](REQ-060_datenschutz_aufbewahrung.md)

## Ziel

Versehentlich gelöschte Inhalte sind während einer kurzen Frist wiederherstellbar.

## Abnahmekriterien

1. Nur Eigentümer löschen Album oder Foto mit Bestätigung; Inhalte verschwinden sofort aus allen Freigaben.
2. Papierkorb bewahrt Inhalte sieben Tage auf; Wiederherstellung reaktiviert keine früheren Freigaben.
3. Nach Frist löscht ein idempotenter Auftrag Originale, Derivate und abhängige Exporte; Fehler sind wiederholbar.

## Verifikation

- **Unit:** Frist, Wiederherstellungsstatus und Rechte prüfen.
- **Integration:** Teilweise fehlgeschlagene R2-Löschung und Wiederholung prüfen.
- **E2E:** Foto löschen, Gastzugriff prüfen, wiederherstellen und nach simulierter Frist endgültige Entfernung prüfen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

