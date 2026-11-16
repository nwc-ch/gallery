# REQ-005 – Privates Album erstellen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; P2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-049](REQ-049_datenmodell.md)

## Ziel

Angemeldete Nutzer erstellen ein zunächst privates Album.

## Abnahmekriterien

1. Name ist nach Trimmen 1–120 Zeichen lang; Beschreibung höchstens 2.000 Zeichen.
2. Erstellen setzt Eigentümer aus der Sitzung und erzeugt eine nicht fortlaufende öffentliche ID; Client darf keinen Eigentümer setzen.
3. Ein leeres Album zeigt Upload-Aktion und bleibt ohne ausdrückliche Freigabe für andere unsichtbar.

## Verifikation

- **Unit:** Namensgrenzen und Default-Sichtbarkeit prüfen.
- **Integration:** Album mit Eigentümerrelation speichern; manipulierten ownerId ablehnen.
- **E2E:** Album erstellen und im fremden Browser anhand seiner ID vergeblich öffnen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

