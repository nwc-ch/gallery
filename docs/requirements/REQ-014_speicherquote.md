# REQ-014 – Speicherquote und Reservierungen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-049](REQ-049_datenmodell.md), [REQ-052](REQ-052_api_regeln.md)

## Ziel

Speicherverbrauch bleibt für Nutzer und Betrieb begrenzt.

## Abnahmekriterien

1. Vorschlagswert ist 10 GiB pro Eigentümer, inklusive Originalen, Derivaten, Versionen und Papierkorb; UI zeigt Nutzung und Reservierungen.
2. Upload reserviert vor Signierung atomar Platz einschließlich einer konfigurierten Derivatreserve; Quote wird nach Verarbeitung abgeglichen.
3. Gleichzeitige Uploads dürfen die Quote nicht überschreiten; abgebrochene Reservierungen verfallen nach 24 Stunden.

## Verifikation

- **Unit:** Byteberechnung, Reserve und Grenzfall prüfen.
- **Integration:** Konkurrierende Reservierungen und tatsächliche R2-Größe gegen MariaDB prüfen.
- **E2E:** Mit fast voller Quote zwei Uploads starten; Ablehnung ist verständlich und bestehende Fotos bleiben nutzbar.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

