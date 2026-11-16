# REQ-010 – Fotos auswählen und hochladen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; P2. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-012](REQ-012_bildformate.md), [REQ-014](REQ-014_speicherquote.md), [REQ-015](REQ-015_r2_speicher.md), [REQ-057](REQ-057_sichere_bildverarbeitung.md)

## Ziel

Eigentümer fügen einem Album mehrere Fotos über Dateidialog oder Drag-and-drop hinzu.

## Abnahmekriterien

1. Beide Eingabewege unterstützen Mehrfachauswahl; auf Mobilgeräten steht der Dateidialog zur Verfügung.
2. Vor dem Start zeigt die UI Anzahl, Dateigrößen und einzeln abgelehnte Dateien; zulässige Dateien bleiben auswählbar.
3. Nur Eigentümer dürfen Uploads starten; neue Dateien erhalten eigene Foto-IDs und überschreiben keine Originale.

## Verifikation

- **Unit:** Auswahl, Duplikate im Auswahlstapel und Dateigrößenanzeige prüfen.
- **Integration:** Upload-Initialisierung mit Albumrecht und Quotenreservierung prüfen.
- **E2E:** Mehrere Fotos per Dialog und Drag-and-drop hinzufügen; unberechtigten Upload versuchen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

