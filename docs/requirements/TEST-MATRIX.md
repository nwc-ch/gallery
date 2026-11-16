# Anforderungs- und Testnachweismatrix

Stand: 16. November 2026. **Alle Anwendungstests sind geplant und noch nicht vorhanden.** Die drei letzten Nachweisspalten müssen bei der Implementierung mit konkreten Testdateien/Testnamen und CI-Reportlinks befüllt werden. Querverweise unten zeigen zunächst nur die spezifizierten Szenarien, keine ausgeführten Tests.

Unit prüft isolierte Fach-/Konfigurationslogik; Integration prüft reale Komponenten/Dienste; E2E prüft Nutzerreise oder tatsächlichen Infrastrukturlebenszyklus. Bei reinem Betriebsverhalten darf E2E beispielsweise ein Restore- oder Deploymentlauf sein. Das ersetzt nicht die Browser-E2E der Produktfunktionen. Manueller Screenreader-, Usability- und Penetrationstest ergänzt die Automatisierung.

| Anforderung / Testspezifikation | Umfang | Umsetzung | Unit-Nachweis | Integrationsnachweis | E2E-Nachweis |
| --- | --- | --- | --- | --- | --- |
| [REQ-001](REQ-001_einfache_bedienung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-002](REQ-002_google_login.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-003](REQ-003_sitzungsverwaltung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-004](REQ-004_konto_verwalten.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-005](REQ-005_album_erstellen.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-006](REQ-006_album_uebersicht.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-007](REQ-007_album_bearbeiten.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-008](REQ-008_unteralben.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-009](REQ-009_papierkorb.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-010](REQ-010_dateiauswahl.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-011](REQ-011_upload_fortschritt.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-012](REQ-012_bildformate.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-013](REQ-013_vorschaubilder.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-014](REQ-014_speicherquote.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-015](REQ-015_r2_speicher.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-016](REQ-016_speicher_konsistenz.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-017](REQ-017_galerie_raster.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-018](REQ-018_lightbox.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-019](REQ-019_sortieren_filtern.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-020](REQ-020_gastlink.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-021](REQ-021_personenfreigabe.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-022](REQ-022_berechtigungen.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-023](REQ-023_link_passwort.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-024](REQ-024_freigabe_widerrufen.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-025](REQ-025_gast_identitaet.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-026](REQ-026_original_download.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-027](REQ-027_zip_download.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-028](REQ-028_favoriten.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-029](REQ-029_farbmarkierungen.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-030](REQ-030_kommentare.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-031](REQ-031_bildanmerkungen.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-032](REQ-032_abstimmung.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-033](REQ-033_auswahl_abschliessen.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-034](REQ-034_live_aktualisierung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-035](REQ-035_benachrichtigungen.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-036](REQ-036_praesentationsmodus.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-037](REQ-037_wasserzeichen.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-038](REQ-038_dateiversionen.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-039](REQ-039_auswahl_export.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-040](REQ-040_weitere_medienformate.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-041](REQ-041_teamverwaltung.md#verifikation) | Ausbau | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-042](REQ-042_ci_farben.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-043](REQ-043_ci_typografie.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-044](REQ-044_ci_layout.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-045](REQ-045_ci_komponenten.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-046](REQ-046_barrierefreiheit.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-047](REQ-047_angular_architektur.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-048](REQ-048_nestjs_architektur.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-049](REQ-049_datenmodell.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-050](REQ-050_datenbank_migrationen.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-051](REQ-051_openapi_vertrag.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-052](REQ-052_api_regeln.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-053](REQ-053_bedrohungsmodell.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-054](REQ-054_csrf_sitzungsschutz.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-055](REQ-055_xss_csp.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-056](REQ-056_validierung_injection.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-057](REQ-057_sichere_bildverarbeitung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-058](REQ-058_missbrauchsschutz.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-059](REQ-059_transport_geheimnisse.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-060](REQ-060_datenschutz_aufbewahrung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-061](REQ-061_audit_protokolle.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-062](REQ-062_abhaengigkeiten.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-063](REQ-063_unit_tests.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-064](REQ-064_integration_tests.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-065](REQ-065_e2e_tests.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-066](REQ-066_ci_pipeline.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-067](REQ-067_leistung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-068](REQ-068_backup_wiederherstellung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-069](REQ-069_betrieb_konfiguration.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-070](REQ-070_lokale_entwicklung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-071](REQ-071_laufende_sicherheitspruefung.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |
| [REQ-072](REQ-072_nachverfolgbarkeit.md#verifikation) | MVP | Geplant | Ausstehend | Ausstehend | Ausstehend |

## Pflichtreisen im MVP

1. Eigentümer meldet sich an, erstellt Album, lädt mehrere erlaubte Fotos hoch und betrachtet Vorschau/Lightbox.
2. Eigentümer teilt per Gastlink; neuer Browser betrachtet ohne Konto, gibt nur bei erlaubtem Feedback Rückmeldung.
3. Persönlicher Empfänger nimmt Einladung mit passendem Google-Konto an; falsche Identität erhält keinen Zugriff.
4. Original-/ZIP-Download funktioniert nur bei eingeschaltetem Recht und liefert die richtigen Bytes.
5. Passwort, Ablauf und Widerruf greifen auch für Einzelmedien, Jobs und Liveverbindungen.
6. Fremder Eigentümer manipuliert sämtliche verschachtelten Objekt-IDs ohne Datenzugriff.
7. Netz-/Worker-Ausfall, Dateifehler und Uploadabbruch führen zu wiederholbaren Zuständen ohne Doppelveröffentlichung.
8. Löschung sperrt Freigaben sofort; Wiederherstellung und endgültige Bereinigung entsprechen Fristen.
9. Tastatur-/Touchbedienung und reduzierte Bewegung funktionieren in allen Kernabläufen.
10. Backup-Restore, Deployment-/Rollback und Konfigurationssperren werden in isoliertem System nachgewiesen.

Sicherheitsreport ordnet konkrete ASVS-Kontroll-IDs den hier verlinkten Tests zu. Kein Release ist allein aufgrund dieser geplanten Matrix freigegeben.
