# REQ-070 – Reproduzierbare lokale Entwicklungsumgebung

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-047](REQ-047_angular_architektur.md), [REQ-048](REQ-048_nestjs_architektur.md), [REQ-049](REQ-049_datenmodell.md)

## Ziel

Neue Entwickler können den Stack ohne Produktionszugang starten.

## Abnahmekriterien

1. Repository gliedert sich in apps/web, apps/api, optionale apps/worker, packages/api-client und docs; genaue Struktur wird beim Bootstrap festgelegt.
2. Compose startet MariaDB, lokalen S3-Dienst und OIDC-Testprovider; .env.example enthält nur Platzhalter und lokale Testwerte.
3. Dokumentierte Befehle installieren, migrieren, starten und führen alle drei Testebenen aus; lokale Seeds sind synthetisch, lokale Authkonfiguration kann in Produktion nicht aktiviert werden.

## Verifikation

- **Unit:** Umgebungsvalidierung und Produktionssperre des Testproviders prüfen.
- **Integration:** Frischen Checkout mit leerer DB automatisiert starten und Seeds anwenden.
- **E2E:** Vollständige Kernreise im lokal gestarteten Stack ohne Google-/R2-Produktionskonto durchführen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

