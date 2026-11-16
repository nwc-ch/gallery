# REQ-008 – Unteralben

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P3. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-005](REQ-005_album_erstellen.md), [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Alben können später in Unteralben gegliedert werden.

## Abnahmekriterien

1. Maximal fünf Ebenen und keine Zyklen; Verschieben nur innerhalb desselben Eigentümers.
2. Freigaben gelten ausschließlich für das konkret freigegebene Album; keine automatische Vererbung auf Kinder.
3. Breadcrumbs zeigen nur zugängliche Vorfahren; Elternlöschung mit Kindern wird bis zu expliziter Auswahl blockiert.

## Verifikation

- **Unit:** Zyklen-, Tiefen- und Vererbungsregeln prüfen.
- **Integration:** Verschiebetransaktion und konkurrierende Elternwechsel prüfen.
- **E2E:** Unteralbum anlegen, verschieben und Gastzugriff ohne Kinderfreigabe versuchen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

