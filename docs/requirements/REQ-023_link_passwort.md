# REQ-023 – Gastlink mit Passwort schützen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P3. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-020](REQ-020_gastlink.md), [REQ-058](REQ-058_missbrauchsschutz.md)

## Ziel

Eigentümer können einen Gastlink zusätzlich schützen.

## Abnahmekriterien

1. Optionales Passwort umfasst 12–128 Zeichen; Speicherung als Argon2id-Hash mit individuellem Salt und geprüften Parametern mindestens 19 MiB, zwei Iterationen, Parallelität eins.
2. Ohne korrekte Prüfung gibt es keine Albumdaten oder Vorschauen; Versuche sind nach Freigabe und IP begrenzt.
3. Passwortänderung invalidiert bestehende Gastsitzungen durch Freigabeversion; Passwort wird weder geloggt noch im Link transportiert.

## Verifikation

- **Unit:** Passwortgrenzen und Invalidierungsentscheidung prüfen.
- **Integration:** Hashverifikation und Rate-Limit bei verteilten Requests prüfen.
- **E2E:** Passwortlink öffnen, falsches und richtiges Passwort eingeben und nach Änderung alten Zugang testen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

