# REQ-067 – Leistungs- und Kapazitätsziele

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; eigene messbare Ziele. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-013](REQ-013_vorschaubilder.md), [REQ-017](REQ-017_galerie_raster.md), [REQ-034](REQ-034_live_aktualisierung.md)

## Ziel

Die einfache Bedienung bleibt bei größeren Alben flüssig.

## Abnahmekriterien

1. Referenzlast: 50 gleichzeitige aktive Nutzer, 10 parallele Uploadnutzer, 1.000 Fotos/Album und 100 Alben/Eigentümer; Datensatz/Hardware werden im Messbericht festgehalten.
2. Metadaten-API p95 ≤ 300 ms und Fehlerrate < 1 % während 15 Minuten; Medienübertragung und bewusst abgewiesene Requests getrennt ausweisen.
3. Bei 10 Mbit/s Downlink, 100 ms RTT und kaltem Cache: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms im definierten Interaktionslauf; 10-MiB-JPEG-Vorschau p95 ≤ 10 s nach vollständigem Upload.

## Verifikation

- **Unit:** Batchgrößen, Thumbnailwahl und Querybudgets prüfen.
- **Integration:** Lastlauf auf DB/API/Worker mit N+1-Erkennung und begrenztem RAM durchführen.
- **E2E:** Galerie im Browser unter Netz-/CPU-Profil messen; Livefeedback und Upload gleichzeitig bedienen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

