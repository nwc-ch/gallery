# REQ-024 – Freigabeablauf und Widerruf

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Eigentümer behalten Kontrolle über bestehende Freigaben.

## Abnahmekriterien

1. Freigaben besitzen expiresAt und revokedAt; Default sieben Tage, maximal 90 Tage pro Vergabe; Verlängerung erfolgt bewusst.
2. Widerruf oder Rechteentzug wird vor jedem Daten-, Medien-, Export- und Ereigniszugriff serverseitig geprüft; neue Zugriffe sind sofort gesperrt.
3. Aktive Streams und Ereignisverbindungen werden innerhalb von fünf Sekunden beendet; bereits heruntergeladene oder lokal angezeigte Bytes können nicht zurückgerufen werden.

## Verifikation

- **Unit:** Zeitgrenzen mit Fake Clock und Grant-Version prüfen.
- **Integration:** Widerruf während Medienstream und Exportvorbereitung über mehrere Instanzen prüfen.
- **E2E:** Link öffnen, Eigentümer widerruft, erneutes Fotoabrufen und Download müssen scheitern.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

