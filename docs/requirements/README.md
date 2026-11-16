# Anforderungskatalog Fotogalerie

Stand: 16. November 2026. Ausgangspunkt: Nutzerauftrag, öffentliche picdrop-Produktseiten und AUREOLE-Layoutvorlage. Alle Anforderungen sind **geplant**, keine Anwendung ist bereits implementiert. Dieses Repository enthält in dieser Phase die Spezifikation.

## Produktziel

Fotos in privaten Alben hochladen und mit ausgewählten Personen oder per Gastlink teilen. Der Kernablauf soll für Eigentümer und Empfänger ohne Schulung verständlich sein. «Album» bezeichnet im Produkt die Sammlung, die picdrop «Galerie» nennt. Fremde Inhalte, Marken und proprietärer Templatecode werden nicht übernommen.

## Festgelegte Technologie

| Bereich | Vorgabe |
| --- | --- |
| Frontend | Angular, striktes TypeScript, Standalone-Komponenten |
| Backend | NestJS, modulare REST-API und Hintergrundverarbeitung |
| Datenbank | MariaDB, ausschließlich TypeORM als reguläre Persistenzschicht |
| API-Vertrag | OpenAPI, generierter Angular-Client |
| Dateien | Cloudflare R2, private Buckets und S3-kompatible Anbindung |
| Login | Google OAuth2 mit OpenID Connect, serverseitige Sitzung |
| Tests | Unit, Integration und E2E für jede implementierte Anforderung |

Exakte unterstützte und miteinander kompatible Versionen werden beim Bootstrap anhand offizieller Dokumentation festgehalten (REQ-062). Es werden keine ungeprüften «latest»-Versionen festgeschrieben.

## Umfang und Rollen

- **Eigentümer:** Google-Anmeldung, eigene Alben/Fotos und Freigaben verwalten.
- **Persönlicher Empfänger:** Google-Anmeldung, Zugriff nach Einladung und Identitätsprüfung.
- **Gast:** Link, gegebenenfalls Passwort; ohne Google-Konto betrachten und bei Erlaubnis Feedback geben.
- **Teammitglied:** spätere Erweiterung mit expliziten Teamrollen.

MVP umfasst sichere Bild-Uploads für JPEG, PNG und WebP, Alben, Galerie/Lightbox, persönliche Freigaben/Gastlinks, Downloadsteuerung, ZIP, Favoriten, Farbmarkierungen, Kommentare und Liveaktualisierung. Alle als MVP gekennzeichneten Qualitäts-, Test- und Sicherheitsanforderungen gehören zur ersten produktiven Freigabe.

Ausbau umfasst Unteralben, Anmerkungen, Abstimmungen, Auswahlabschluss, E-Mails, Präsentationsmodus, Wasserzeichen, Versionen, Export, zusätzliche Medienformate und Teamverwaltung. Die Priorisierung ist ein Vorschlag für dieses Projekt, keine Behauptung über picdrop. Abrechnung, Verkaufsfunktionen, Gesichtserkennung, native Apps, FTP und Live-Kameraübertragung sind zunächst außerhalb des Umfangs.

## Lesen und umsetzen

1. [Funktionsanalyse und Quellen](SOURCES.md) lesen: belegt vs. projektspezifisch.
2. [Frontend-CI](../design/FRONTEND-CI.md), [Architektur](../architecture/OVERVIEW.md) und [Sicherheitsmodell](../security/threat-model.md) berücksichtigen.
3. [Annahmen und offene Entscheidungen](DECISIONS.md) beim ersten Umsetzungsschritt überprüfen; sie blockieren diese Dokumentation nicht.
4. Kleine vertikale Schritte umsetzen; jede REQ enthält konkrete Abnahmekriterien und drei Testebenen.
5. [Testnachweismatrix](TEST-MATRIX.md) mit tatsächlichen Reportlinks füllen. Ein Dokumentationslink oder geplanter Test gilt nicht als bestandener Test.

«Bezüge» in Einzeldateien sind fachliche Querverweise, kein strikt azyklischer Buildplan. Gemeinsame Architektur- und Sicherheitsregeln werden vor beziehungsweise zusammen mit dem ersten vertikalen Schritt umgesetzt. Grenzwerte sind überprüfbare Startfestlegungen und können begründet geändert werden.

## Empfohlene Umsetzungsschnitte

| Schnitt | Ergebnis | Zentrale Anforderungen |
| --- | --- | --- |
| 1 | Reproduzierbarer Stack, Theme, sicherer Login und Rechtebasis | 002–003, 022, 042–056, 059, 062–066, 069–072 |
| 2 | Privates Album bis sicher verarbeitetes Foto | 005–017, 057–058 |
| 3 | Empfängerzugriff und kontrollierte Auslieferung | 018–027, 060–061 |
| 4 | Bildauswahl und Zusammenarbeit | 019, 028–030, 034 |
| 5 | Produktive Abnahme und Betrieb | 001, 004, 046, 067–071; alle MVP-Nachweise |
| 6 | Erweiterungen | Alle Ausbau-Anforderungen, einzeln priorisieren |

Sicherheit, Tests und CI gelten in jedem Schnitt; die Tabelle verschiebt keine Pflichtkontrolle auf das Ende.

## Einzelanforderungen

| ID | Thema | Umfang |
| --- | --- | --- |
| REQ-001 | [Einfacher Kernablauf](REQ-001_einfache_bedienung.md) | MVP |
| REQ-002 | [Google-Anmeldung](REQ-002_google_login.md) | MVP |
| REQ-003 | [Sitzung und Abmelden](REQ-003_sitzungsverwaltung.md) | MVP |
| REQ-004 | [Eigenes Konto verwalten](REQ-004_konto_verwalten.md) | MVP |
| REQ-005 | [Privates Album erstellen](REQ-005_album_erstellen.md) | MVP |
| REQ-006 | [Albenübersicht und Suche](REQ-006_album_uebersicht.md) | MVP |
| REQ-007 | [Albumdetails und Titelbild](REQ-007_album_bearbeiten.md) | MVP |
| REQ-008 | [Unteralben](REQ-008_unteralben.md) | Ausbau |
| REQ-009 | [Album und Fotos löschen oder wiederherstellen](REQ-009_papierkorb.md) | MVP |
| REQ-010 | [Fotos auswählen und hochladen](REQ-010_dateiauswahl.md) | MVP |
| REQ-011 | [Uploadwarteschlange und Wiederaufnahme](REQ-011_upload_fortschritt.md) | MVP |
| REQ-012 | [Zulässige Bildformate und Grenzen](REQ-012_bildformate.md) | MVP |
| REQ-013 | [Vorschaubilder und Metadaten](REQ-013_vorschaubilder.md) | MVP |
| REQ-014 | [Speicherquote und Reservierungen](REQ-014_speicherquote.md) | MVP |
| REQ-015 | [Privater Cloudflare-R2-Speicher](REQ-015_r2_speicher.md) | MVP |
| REQ-016 | [Konsistente Datei- und Auftragszustände](REQ-016_speicher_konsistenz.md) | MVP |
| REQ-017 | [Responsive Fotogalerie](REQ-017_galerie_raster.md) | MVP |
| REQ-018 | [Fotoeinzelansicht und Navigation](REQ-018_lightbox.md) | MVP |
| REQ-019 | [Fotos sortieren und filtern](REQ-019_sortieren_filtern.md) | MVP |
| REQ-020 | [Album über Gastlink teilen](REQ-020_gastlink.md) | MVP |
| REQ-021 | [Album gezielt für Personen freigeben](REQ-021_personenfreigabe.md) | MVP |
| REQ-022 | [Rechte pro Album und Objekt](REQ-022_berechtigungen.md) | MVP |
| REQ-023 | [Gastlink mit Passwort schützen](REQ-023_link_passwort.md) | MVP |
| REQ-024 | [Freigabeablauf und Widerruf](REQ-024_freigabe_widerrufen.md) | MVP |
| REQ-025 | [Gastidentität für Rückmeldungen](REQ-025_gast_identitaet.md) | MVP |
| REQ-026 | [Einzelne Fotos herunterladen](REQ-026_original_download.md) | MVP |
| REQ-027 | [Fotoauswahl als ZIP herunterladen](REQ-027_zip_download.md) | MVP |
| REQ-028 | [Persönliche Favoriten](REQ-028_favoriten.md) | MVP |
| REQ-029 | [Bildauswahl mit Farbstatus](REQ-029_farbmarkierungen.md) | MVP |
| REQ-030 | [Kommentare pro Foto](REQ-030_kommentare.md) | MVP |
| REQ-031 | [Visuelle Anmerkungen](REQ-031_bildanmerkungen.md) | Ausbau |
| REQ-032 | [Gemeinsame Abstimmung](REQ-032_abstimmung.md) | Ausbau |
| REQ-033 | [Auswahl verbindlich abschließen](REQ-033_auswahl_abschliessen.md) | Ausbau |
| REQ-034 | [Rückmeldungen live aktualisieren](REQ-034_live_aktualisierung.md) | MVP |
| REQ-035 | [Benachrichtigungen und E-Mail-Einladungen](REQ-035_benachrichtigungen.md) | Ausbau |
| REQ-036 | [Ruhiger Präsentationsmodus](REQ-036_praesentationsmodus.md) | Ausbau |
| REQ-037 | [Wasserzeichen auf Vorschauen](REQ-037_wasserzeichen.md) | Ausbau |
| REQ-038 | [Neue Version eines Fotos](REQ-038_dateiversionen.md) | Ausbau |
| REQ-039 | [Auswahllisten exportieren](REQ-039_auswahl_export.md) | Ausbau |
| REQ-040 | [RAW, TIFF, PSD und Video](REQ-040_weitere_medienformate.md) | Ausbau |
| REQ-041 | [Teamrollen](REQ-041_teamverwaltung.md) | Ausbau |
| REQ-042 | [CI-Farben und Design-Tokens](REQ-042_ci_farben.md) | MVP |
| REQ-043 | [CI-Typografie](REQ-043_ci_typografie.md) | MVP |
| REQ-044 | [CI-Layout, Raster und Responsivität](REQ-044_ci_layout.md) | MVP |
| REQ-045 | [CI-Komponenten und Zustände](REQ-045_ci_komponenten.md) | MVP |
| REQ-046 | [Barrierefreiheit und verständliche Texte](REQ-046_barrierefreiheit.md) | MVP |
| REQ-047 | [Angular-Architektur und Konventionen](REQ-047_angular_architektur.md) | MVP |
| REQ-048 | [NestJS-Architektur und Konventionen](REQ-048_nestjs_architektur.md) | MVP |
| REQ-049 | [MariaDB-Datenmodell und Integrität](REQ-049_datenmodell.md) | MVP |
| REQ-050 | [Versionierte TypeORM-Migrationen](REQ-050_datenbank_migrationen.md) | MVP |
| REQ-051 | [OpenAPI und typisierter Angular-Client](REQ-051_openapi_vertrag.md) | MVP |
| REQ-052 | [API-Pagination, Fehler und Idempotenz](REQ-052_api_regeln.md) | MVP |
| REQ-053 | [Bedrohungsmodell und ASVS-Basis](REQ-053_bedrohungsmodell.md) | MVP |
| REQ-054 | [CSRF- und OAuth-Sitzungsschutz](REQ-054_csrf_sitzungsschutz.md) | MVP |
| REQ-055 | [XSS-Schutz und Browser-Header](REQ-055_xss_csp.md) | MVP |
| REQ-056 | [Eingabevalidierung und Injection-Schutz](REQ-056_validierung_injection.md) | MVP |
| REQ-057 | [Quarantäne und sichere Bildverarbeitung](REQ-057_sichere_bildverarbeitung.md) | MVP |
| REQ-058 | [Rate-Limits und Ressourcenbudgets](REQ-058_missbrauchsschutz.md) | MVP |
| REQ-059 | [Transport, Geheimnisse und minimale Rechte](REQ-059_transport_geheimnisse.md) | MVP |
| REQ-060 | [Datenminimierung, Speicherregion und Löschfristen](REQ-060_datenschutz_aufbewahrung.md) | MVP |
| REQ-061 | [Sicherheitsprotokolle und Nachvollziehbarkeit](REQ-061_audit_protokolle.md) | MVP |
| REQ-062 | [Unterstützte Versionen und Lieferkettenschutz](REQ-062_abhaengigkeiten.md) | MVP |
| REQ-063 | [Unit-Tests für jede Anforderung](REQ-063_unit_tests.md) | MVP |
| REQ-064 | [Integrationstests mit echter MariaDB und Storage](REQ-064_integration_tests.md) | MVP |
| REQ-065 | [Browser-E2E und Nutzerreisen](REQ-065_e2e_tests.md) | MVP |
| REQ-066 | [Verpflichtende Pipeline und Release-Gates](REQ-066_ci_pipeline.md) | MVP |
| REQ-067 | [Leistungs- und Kapazitätsziele](REQ-067_leistung.md) | MVP |
| REQ-068 | [Backups und verifizierte Wiederherstellung](REQ-068_backup_wiederherstellung.md) | MVP |
| REQ-069 | [Betrieb, Konfiguration und Überwachung](REQ-069_betrieb_konfiguration.md) | MVP |
| REQ-070 | [Reproduzierbare lokale Entwicklungsumgebung](REQ-070_lokale_entwicklung.md) | MVP |
| REQ-071 | [Sicherheit bei jeder Änderung und vor Releases](REQ-071_laufende_sicherheitspruefung.md) | MVP |
| REQ-072 | [Anforderungs- und Testnachweise](REQ-072_nachverfolgbarkeit.md) | MVP |

## Abnahmegrenze

Dieser Katalog definiert Sollverhalten. Er ist keine Sicherheitsaussage über eine vorhandene Anwendung. Implementierung, Unit-/Integrations-/E2E-Läufe und Sicherheitsnachweise entstehen in den folgenden Entwicklungsschritten.
