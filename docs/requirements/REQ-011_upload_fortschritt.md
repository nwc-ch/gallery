# REQ-011 – Uploadwarteschlange und Wiederaufnahme

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P2; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-010](REQ-010_dateiauswahl.md), [REQ-016](REQ-016_speicher_konsistenz.md)

## Ziel

Uploads sind verständlich, abbrechbar und bei Netzfehlern wiederholbar.

## Abnahmekriterien

1. Je Datei erscheinen Prozentwert und Zustand wartend, hochladend, prüfend, fertig, fehlgeschlagen oder abgebrochen; maximal drei parallele Transfers.
2. Multipart-Upload wird ab 20 MiB verwendet; temporäre Unterbrechungen setzen bestätigte Teile innerhalb von 24 Stunden fort.
3. Nach Neuladen fordert die UI bei Bedarf erneute Dateiauswahl und prüft Fingerprint; Abbrechen verwirft Multipart-Zustand und Quotenreservierung.

## Verifikation

- **Unit:** Fortschritt, Backoff mit maximal fünf Versuchen und Zustandswechsel prüfen.
- **Integration:** Teil-Upload, abgelaufene Signatur, erneute Signierung und Abbruch mit Storage-Adapter prüfen.
- **E2E:** Netzwerk unterbrechen, fortsetzen und abbrechen; andere Dateien werden weiterverarbeitet.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

