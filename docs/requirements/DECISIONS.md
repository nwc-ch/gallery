# Annahmen und Entscheidungen

Stand: 16. November 2026. Die folgenden Entscheidungen machen den Katalog umsetzbar. Sie sind Vorschläge, sofern nicht durch den Nutzerauftrag festgelegt, und brauchen für diese Dokumentation keine zusätzliche Freigabe.

| Thema | Arbeitsentscheidung | Wann erneut prüfen |
| --- | --- | --- |
| Stack | Angular, NestJS, MariaDB, TypeORM, OpenAPI, Cloudflare R2, Google OAuth2/OIDC gemäß Auftrag | Bei technischer Unverträglichkeit |
| Einfacher Zugang | Eigentümer/persönliche Empfänger mit Google, Gäste per Link ohne Konto | Mit ersten Usability-Tests |
| Gastlink | Default nur betrachten, 7 Tage; Download/Feedback bewusst einschalten, maximal 90 Tage | Vor erster Sharing-Implementierung |
| Persönliche Einladung | Verifizierte Google-Mail bei Annahme, danach stabile Provideridentität | Vor REQ-021 |
| Dateiformate | MVP JPEG, PNG, WebP, 50 MiB, 100 MP; weitere Formate separat | Mit echten Musterfotos |
| Quote | 10 GiB pro Eigentümer einschließlich Reservierungen, Versionen und Papierkorb | Vor Kapazitäts-/Kostentest |
| ZIP | Maximal 1.000 Fotos und 2 GiB pro Auftrag, private temporäre Ablage | Vor REQ-027 |
| Hosting | Modularer Monolith, Worker, möglichst eine Web-/API-Origin | Beim Bootstrap; Zielhost und Domain fehlen noch |
| Jobs | Zunächst MariaDB-Outbox/Leases statt zusätzlichem Broker | Bei gemessenem Durchsatzengpass |
| Medienzugriff | Autorisierender Stream-Endpunkt für kontrollierten Widerruf | Vor CDN-/Performanceoptimierung |
| Region | Region für App, DB, Worker, Backup und R2-Jurisdiktion bewusst festlegen | Vor echten personenbezogenen Daten; Location Hint allein reicht nicht |
| Recht/Verträge | Keine pauschale DSGVO-/DSG-Konformitätszusage aus einem Technikplan | Verantwortlicher muss Zielmärkte, Verträge und Fristen vor Produktion prüfen |
| Brand | Arbeitsname Fotogalerie, dunkles AUREOLE-inspiriertes CI | Vor Logo-/Produktnamenarbeit |
| Schrift/Assets | Schriftlizenzen prüfen und lokal ausliefern; keine Templatebilder/-codes kopieren | Vor Einbindung realer Dateien |
| E-Mail | Im MVP Link kopieren; Anbieter und Versand erst im Ausbau | Vor REQ-035 |
| Performance | Startlast 50 aktive Nutzer, 1.000 Fotos/Album | Gegen erwartete echte Nutzung |
| Versionen | Unterstützte kompatible konkrete Versionen erst beim Bootstrap wählen | Dann dokumentieren und regelmäßig aktualisieren |

## Noch benötigte Betriebsangaben

Produktname/Logo, Hosting/Domain, gewünschte Datenresidenz, erwartete Nutzer-/Fotomenge, Verantwortlicher und Transaktionsmail-Anbieter sind noch offen. Sie verhindern weder den Anforderungskatalog noch einen lokalen Prototyp mit synthetischen Daten. Vor Produktivkonfiguration müssen die jeweils betroffenen Punkte entschieden sein.

## Spätere Erweiterungen

Professionelle Formate, Unteralben, visuelle Retuschehinweise, verbindliche Auswahlstände, Teamrollen und individuelle Präsentationen sind bewusst als Ausbau spezifiziert. picdrop-Funktionen wie Live Push sind als recherchierter Kontext erfasst, aber nicht ohne eigenen Auftrag und Sicherheits-/Betriebskonzept Teil des Produkts. Bezahlpläne und Abrechnung sind ebenfalls nicht vorgesehen.
