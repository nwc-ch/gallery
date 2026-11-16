# REQ-020 – Album über Gastlink teilen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; P2; P3. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-024](REQ-024_freigabe_widerrufen.md), [REQ-025](REQ-025_gast_identitaet.md)

## Ziel

Eigentümer teilen ein Album ohne Registrierungspflicht für Empfänger.

## Abnahmekriterien

1. Freigabe erzeugt einen kryptografisch zufälligen Token mit mindestens 256 Bit; Datenbank speichert ausschließlich dessen Hash.
2. Dialog zeigt Album, Rechte, Ablauf und Warnung, dass jeder mit dem Link Zugriff erhält; Default nur Betrachten, sieben Tage.
3. Token steht im URL-Fragment, wird über POST gegen eine eingeschränkte Gastsitzung getauscht und aus der Adresszeile entfernt; Sharing kopiert einen explizit erzeugten Link ohne Analytics.

## Verifikation

- **Unit:** Tokenentropie-Anbindung, Hashvergleich und Freigabedefaults prüfen.
- **Integration:** Tokenaustausch, Hashspeicherung und fremde Album-ID prüfen.
- **E2E:** Link kopieren und in frischem Kontext ohne Google-Konto öffnen; Quellalbum bleibt unveränderbar.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

