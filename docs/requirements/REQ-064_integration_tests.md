# REQ-064 – Integrationstests mit echter MariaDB und Storage

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T11. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-049](REQ-049_datenmodell.md), [REQ-050](REQ-050_datenbank_migrationen.md), [REQ-051](REQ-051_openapi_vertrag.md)

## Ziel

Schnittstellen werden mit realistischem Verhalten statt alleinigen Mocks geprüft.

## Abnahmekriterien

1. Integration startet NestJS mit echten Guards/Pipes, isolierter MariaDB derselben Produktivversionslinie und tatsächlich angewendeten Migrationen.
2. Lokaler S3-kompatibler Speicher deckt Standardfälle ab; separater isolierter R2-Testbucket prüft vor Release Signaturen, CORS, Multipart und Privatzugriff, weil Emulatoren R2 nicht vollständig abbilden.
3. OIDC-Testprovider und Worker laufen kontrolliert; Fehler, Parallelität, Rechte und DB-/R2-Teilausfälle sind Bestandteil jeder betroffenen Anforderung.

## Verifikation

- **Unit:** Testdatenfabriken und Adapter-Contractauswahl prüfen.
- **Integration:** Jede REQ-Testsektion gegen isolierte Dienste ausführen; Tests dürfen nicht von Reihenfolge abhängen.
- **E2E:** Browser verwendet denselben integrierten Stack; Upload bis Download ohne gemockte interne API.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

