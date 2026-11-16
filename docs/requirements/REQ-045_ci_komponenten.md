# REQ-045 – CI-Komponenten und Zustände

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: D2; eigene Produktanpassung. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-042](REQ-042_ci_farben.md), [REQ-043](REQ-043_ci_typografie.md), [REQ-044](REQ-044_ci_layout.md), [REQ-046](REQ-046_barrierefreiheit.md)

## Ziel

Wiederverwendbare Komponenten sichern konsistente Bedienung.

## Abnahmekriterien

1. Primärbutton: Gold mit schwarzem Text; sekundär: dunkle Fläche mit Goldkontur; destruktive Aktionen tragen Text und Warnsymbol.
2. Buttons, Inputs, Dialoge, Album-/Fotokarten, Toasts und Fortschrittsanzeigen besitzen default, hover, focus-visible, disabled, loading und error soweit sinnvoll.
3. Fokus bleibt sichtbar mit mindestens 2 px Goldring und 2 px Abstand; Touchziele mindestens 44 × 44 px; Bewegungen 120–200 ms und bei reduced-motion deaktiviert.

## Verifikation

- **Unit:** Zustandsauswahl und zugängliche Namen prüfen.
- **Integration:** Komponentenkatalog mit allen Zuständen, Tastatur und Theme rendern.
- **E2E:** Uploadfehler, Dialogbestätigung und Toast bedienen; reduzierte Bewegung und Touchansicht prüfen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

