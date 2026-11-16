# REQ-053 – Bedrohungsmodell und ASVS-Basis

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; S1. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-071](REQ-071_laufende_sicherheitspruefung.md)

## Ziel

Sicherheitsanforderungen orientieren sich an einem nachvollziehbaren Angreifermodell.

## Abnahmekriterien

1. Vor erster Implementierung dokumentiert das Team Datenflüsse, Trust Boundaries und Risiken für Browser, OAuth, API, MariaDB, Worker und R2.
2. ASVS 5.0.0 Level 2 ist die initiale Prüfgrundlage; anwendbare Kontrollen erhalten konkrete Zuordnung zu Anforderungen, Tests und Nachweisen, nicht anwendbare Kontrollen eine Begründung.
3. Mindestens fremder Nutzer, bösartiger Gast, geleakter Link, manipulierte Bilddatei, kompromittierte Abhängigkeit und Insider werden bewertet; Änderung der Angriffsfläche erfordert Aktualisierung.

## Verifikation

- **Unit:** Policy- und Sicherheitsinvarianten aus dem Modell als Unitfälle festhalten.
- **Integration:** Trust-Boundary-Verletzungen mit zwei Eigentümern und manipulierten Provider-/Storageantworten prüfen.
- **E2E:** Angriffsszenarien aus docs/security/threat-model.md im Testsystem ausführen; Modell zusätzlich manuell reviewen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

