# REQ-042 – CI-Farben und Design-Tokens

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: D1; D2; eigene zugängliche Ergänzungen. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-046](REQ-046_barrierefreiheit.md)

## Ziel

Das Frontend übernimmt die dunkle Schwarz-Gold-Anmutung der AUREOLE-Vorlage.

## Abnahmekriterien

1. Verbindliche Basistokens: Hintergrund #0A0A0A, Oberfläche #1A1A1A, Akzent #C9A962, Akzent-Hover #D4B978 und Text #F5F5F5.
2. Design-Tokens werden zentral in docs/design/frontend-ci.css spezifiziert und später im Angular-Theme verwendet; semantische Zustandsfarben ergänzen die Vorlage.
3. Jede tatsächlich eingesetzte Text-/Hintergrundkombination erreicht WCAG-AA-Kontrast; dekorativer transparenter Goldrand ersetzt keinen sichtbaren Formularrand.

## Verifikation

- **Unit:** Tokenzuordnung und berechneten Farbkontrast prüfen.
- **Integration:** Komponenten mit Theme rendern und berechnete Styles auswerten.
- **E2E:** Album, Upload, Teilen und Lightbox per visueller Regression und Kontrastprüfung kontrollieren.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

