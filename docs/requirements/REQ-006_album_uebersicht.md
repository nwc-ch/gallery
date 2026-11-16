# REQ-006 – Albenübersicht und Suche

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P2; P6. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-005](REQ-005_album_erstellen.md), [REQ-022](REQ-022_berechtigungen.md), [REQ-052](REQ-052_api_regeln.md)

## Ziel

Nutzer finden eigene und persönlich freigegebene Alben schnell.

## Abnahmekriterien

1. Karten zeigen Titel, zugängliches Titelbild, Fotoanzahl und Änderungszeit; Suche durchsucht Albumtitel.
2. Ergebnisse sind berechtigungsgefiltert, deterministisch sortiert und seitenweise mit maximal 100 Einträgen verfügbar.
3. Lade-, Leer-, Keine-Treffer- und Fehlerzustände bieten verständliche nächste Schritte.

## Verifikation

- **Unit:** Suchnormalisierung und Kartenstatus prüfen.
- **Integration:** Suche, Pagination und Gesamtzahlen gegen MariaDB mit zwei Eigentümern prüfen.
- **E2E:** Album suchen, Seite wechseln und Zugang entziehen; Album verschwindet aus fremder Übersicht.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

