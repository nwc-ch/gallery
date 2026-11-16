# REQ-028 – Persönliche Favoriten

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P1; P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-025](REQ-025_gast_identitaet.md)

## Ziel

Empfänger markieren Fotos mit einem Herz.

## Abnahmekriterien

1. Feedbackberechtigte Personen und Gäste setzen oder entfernen eigene Favoriten mit einem Schritt.
2. Pro Identität und Foto existiert höchstens ein Favorit; wiederholtes Setzen ist idempotent.
3. Eigentümer sieht Favoritenzahlen; Empfänger sieht eigene Markierungen und kann danach filtern, aber keine fremden E-Mail-Adressen.

## Verifikation

- **Unit:** Toggle-Verhalten und Darstellung prüfen.
- **Integration:** Unique Constraint und gleichzeitiges Setzen prüfen.
- **E2E:** Gast markiert Foto, lädt neu, filtert Favoriten und entfernt die Markierung.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

