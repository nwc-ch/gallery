# REQ-046 – Barrierefreiheit und verständliche Texte

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T12. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-042](REQ-042_ci_farben.md), [REQ-043](REQ-043_ci_typografie.md), [REQ-044](REQ-044_ci_layout.md), [REQ-045](REQ-045_ci_komponenten.md)

## Ziel

Alle Kernabläufe sind mit Tastatur, Screenreader und Touch verständlich bedienbar.

## Abnahmekriterien

1. Ziel ist WCAG 2.2 AA: normale Texte mindestens 4,5:1, große Texte 3:1 und notwendige UI-Grenzen/Fokus 3:1; Farbe trägt nie allein Bedeutung.
2. Semantische Überschriften, Labels, Dialogfokus, Skip-Link und Live-Region für Uploadfortschritt sind vorhanden; Dateiname ist Standard-Alternativtext, beschreibender Alt-Text editierbar.
3. Deutsch ist Standardsprache; Texte sind zentral übersetzbar, Datum/Zahlen lokalisiert; Fehler nennen Ursache und nächsten Schritt ohne Stacktrace.

## Verifikation

- **Unit:** Labels, Alt-Text-Fallback und Formatierung prüfen.
- **Integration:** axe-Prüfungen im Komponentenkatalog sowie Tastatur-/Screenreader-Check durchführen.
- **E2E:** Album erstellen, Upload, Teilen und Lightbox ohne Maus; automatisierte axe-Prüfung plus manueller Screenreader-Abnahmelauf.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

