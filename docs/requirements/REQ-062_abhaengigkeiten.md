# REQ-062 – Unterstützte Versionen und Lieferkettenschutz

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: T1; T2; S1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: Keine fachlichen Vorbedingungen.

## Ziel

Frameworks, Laufzeit und Bibliotheken bleiben unterstützt und überprüfbar.

## Abnahmekriterien

1. Vor Projektbootstrap werden kompatible unterstützte Angular-, NestJS-, Node-LTS-, TypeORM- und MariaDB-Versionen anhand offizieller Release-/Supportdokumentation gewählt und exakt dokumentiert.
2. Lockfile und reproduzierbare Installationen sind Pflicht; CI erzeugt SBOM und prüft Abhängigkeiten, Container und Secrets.
3. Scans laufen je Pull Request und täglich; ausnutzbare kritische/hohe Befunde blockieren Release; Triage binnen eines Arbeitstags, kritischer Fix binnen 48 Stunden, hoher binnen sieben Tagen oder befristete dokumentierte Risikofreigabe.

## Verifikation

- **Unit:** Versions-/Konfigurationsprüfer mit ungültigen Kombinationen prüfen.
- **Integration:** Reproduzierbare Installation und absichtlich verwundbare Testfixture im Scanner prüfen.
- **E2E:** Gepatchtes Artefakt durch Kernabläufe testen; SBOM und Scanreport des identischen Artefakts nachweisen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

