# Funktionsanalyse und Quellenregister

Recherche: 16. November 2026. Öffentliche Produktbeschreibungen wurden gelesen, kein picdrop-Konto angelegt oder privater Produktbereich getestet. Funktionsaussagen beschreiben die öffentliche Darstellung; konkrete interne Implementierung, Verträge und Tarifverfügbarkeit wurden nicht überprüft. Der eigene Katalog leitet daraus unabhängig prüfbares Sollverhalten ab.

## picdrop: beobachtete Funktionsprinzipien

| Kürzel | Beleg und komprimierter Befund | Abgeleitete Anforderungen |
| --- | --- | --- |
| P1 | [Startseite](https://www.picdrop.com/web): Teilen und Auswählen, Rückmeldungen, Gastzugang, Teamarbeit, Versionen und Live Push. | 001–003, 020–022, 025–030, 034, 038, 041 |
| P2 | [Photo Sharing](https://www.picdrop.com/web/how-it-works/photo-sharing-for-photographers): browserbasierte Galerien, Upload/Download, ZIP, Suchfunktion und konfigurierbare Interaktion. | 005–007, 010–019, 026–027 |
| P3 | [Photo Proofing](https://www.picdrop.com/web/how-it-works/photo-proofing): Untergalerien, Links mit optionalem Passwort, Auswahl, Kommentare, visuelle Rückmeldung und Wasserzeichen. | 008, 020, 023, 029–031, 033, 037 |
| P4 | [Presentation Mode](https://www.picdrop.com/web/how-it-works/why-presentation-mode-is-the-best-way-to-share-beautiful-galleries-with-clients): ruhige Ansicht, Cover-Einstieg, anpassbare Gestaltung und ausblendbare Bilder. | 018, 036 |
| P5 | [Collaboration Mode](https://www.picdrop.com/web/how-it-works/how-collaboration-mode-helps-you-save-time-working-with-your-photo-clients): Farbmarkierungen, Likes, Teamvoting, Bildanmerkungen, Kommentare und Benachrichtigungen; Unterstützung beim Übertragen einer Auswahl in Foto-Workflows. | 019, 028–035, 039 |
| P6 | [Image Management](https://www.picdrop.com/web/how-it-works/image-management-for-teams): organisierte Mediensammlung und Zusammenarbeit für Teams. | 006, 017, 041 |

Grundablauf: Fotos in einer Sammlung organisieren, Zugriff vergeben, Empfänger betrachten oder bewerten, Auswahl bearbeiten und finale Dateien ausliefern. Die Präsentation und die Auswahlphase sind unterschiedliche Bedienkontexte.

Keine Produktkopie: Google-Login, Tokenentropie, Ablaufzeiten, Ressourcenlimits, Datenmodell, konkrete Rollen, Quoten und Testschwellen sind Festlegungen dieses Projekts. Eine Werbeaussage zu Sicherheit oder Verschlüsselung belegt keine überprüfte Sicherheitsarchitektur. Insbesondere wird für dieses System keine Ende-zu-Ende-Verschlüsselung behauptet, weil serverseitige Bildverarbeitung Klartextzugriff benötigt.

## Layoutquelle: tatsächliches Template statt Demorahmen

- D1: [TemplateMonster-Demo 566517](https://demo.templatemonster.com/demo/566517.html), Titel «AUREOLE – Luxury Restaurant & Fine Dining HTML Template with Table Reservation». Der HTML-Demorahmen verweist per iframe auf die eigentliche Vorlage.
- D2: [AUREOLE-Vorlage](https://xdrive.site/sites/AUREOLE/) und [deren Stylesheet](https://xdrive.site/sites/AUREOLE/css/style.css). Direkt per HTTPS abgerufen und HTML/CSS ausgewertet. Der Web-Textabruf konnte diese Seiten nicht lesen; Browserautomation war nicht verfügbar. Daher keine behauptete visuelle Screenshot-Abnahme der fremden Seite.

Belegt im CSS sind #0A0A0A, #1A1A1A, #C9A962, #D4B978, #F5F5F5, #888888 sowie Cormorant Garamond und Montserrat. Dazu kommen transparente Goldränder, große Serifentitel, goldene Buttons, dunkle Bildoverlays und großzügige Abstände. Das [eigene CI](../design/FRONTEND-CI.md) übernimmt diese Richtung und definiert zugängliche Produktkomponenten. Neue Statusfarben, Breakpoints, Größen und Bewegungsregeln sind eigene Ergänzungen. Der fremde Bootstrap-/Animationsstack wird nicht als Angular-Vorgabe übernommen.

## Offizielle technische Grundlagen

| Kürzel | Quelle | Verwendeter Grundsatz |
| --- | --- | --- |
| T1 | [Angular Style Guide](https://angular.dev/style-guide) | Konsistente, fachlich organisierte Komponenten und Dateien. |
| T2 | [Angular Security](https://angular.dev/best-practices/security) | Frameworkschutz erhalten, gefährliche Trust-APIs vermeiden, CSP/Trusted Types berücksichtigen. |
| T3 | [NestJS Authentication](https://docs.nestjs.com/security/authentication) und [Authorization](https://docs.nestjs.com/security/authorization) | Authentifizierung und objektbezogene Autorisierung trennen. |
| T4 | [NestJS Validation](https://docs.nestjs.com/techniques/validation) | DTO-Validierung und Allowlisting. |
| T5 | [R2 Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/) | Zeit-, Objekt- und methodengebundene signierte Zugriffe sind Bearerfähigkeiten. |
| T6 | [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect) | ID-Token validieren; stabile Identität aus Aussteller und subject. |
| T7 | [OAuth Security BCP, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html) | Codeflow, PKCE und Schutz vor Redirect-/Replay-Angriffen. |
| T8 | [TypeORM Migrations](https://typeorm.io/docs/migrations/why/) | Kontrollierte Schemaänderungen statt synchronize in Produktion. |
| T9 | [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction) | API-Spezifikation aus definierten Verträgen ableiten. |
| T10 | [Angular Testing](https://angular.dev/guide/testing) | Unterstützte Testwerkzeuge und Komponententests verwenden. |
| T11 | [NestJS Testing](https://docs.nestjs.com/fundamentals/testing) | Testmodule und Integration des Frameworkstacks prüfen. |
| T12 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Zugänglichkeit messbar prüfen. |
| T13 | [R2 Data Location](https://developers.cloudflare.com/r2/reference/data-location/) | Jurisdiktion und unverbindliche Standort-Hints unterscheiden. |
| S1 | [OWASP ASVS](https://asvs.owasp.org/) | Recherchierte stabile Basis 5.0.0; Projektziel Level 2, konkrete Kontrollmatrix bei Umsetzung. |
| S2 | [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | Mehrstufige Dateiprüfung, Quarantäne und begrenzte Verarbeitung. |

Diese Links sind Grundlagen, keine Kopie ihrer vollständigen Inhalte. Anforderungen kombinieren sie mit eigenen Projektentscheidungen. Versionen und Sicherheitsstandards werden vor Umsetzung und regelmäßig im Betrieb erneut geprüft.
