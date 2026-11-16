# Frontend-CI – Fotogalerie

Stand: 16. November 2026. Arbeitsname «Fotogalerie»; Produktname und Logo sind noch offen. Referenz: [AUREOLE-Demo](https://demo.templatemonster.com/demo/566517.html), deren [Stylesheet](https://xdrive.site/sites/AUREOLE/css/style.css) und [Quellenprotokoll](../requirements/SOURCES.md). CI bedeutet hier Corporate Identity beziehungsweise das verbindliche visuelle System des Frontends. Technische Continuous Integration steht in REQ-066.

## Gestalterische Richtung

Dunkle Flächen, zurückhaltendes Gold und elegante Serifentitel lassen Fotos im Mittelpunkt stehen. Montserrat hält Formulare und Navigation lesbar. Große Bildflächen und Luft zwischen Gruppen übernehmen die Ruhe der Restaurantvorlage, die Bedienung wird auf die Fotogalerie zugeschnitten.

## Farben

| Token | Wert | Herkunft und Verwendung |
| --- | --- | --- |
| bg | #0A0A0A | Vorlage: Seitenhintergrund |
| surface | #1A1A1A | Vorlage: Karten und Dialoge |
| accent | #C9A962 | Vorlage: Hauptaktionen, Links und Fokus |
| accent-hover | #D4B978 | Vorlage: Hover auf Hauptaktion |
| text | #F5F5F5 | Vorlage: Haupttext |
| text-muted | #888888 | Vorlage: ergänzender Text auf bg/surface; bei Überlagerungen Kontrast neu messen |
| border-decorative | rgba(201,169,98,.2) | Vorlage: ausschließlich dekorative Trennlinien |
| border-control | #888888 | Eigene Zuordnung: erkennbare Eingabegrenzen |
| success | #8DD3A8 | Eigene Ergänzung: bestätigt/ja mit Haken und Text |
| warning | #F3CD79 | Eigene Ergänzung: vielleicht/Achtung mit Symbol und Text |
| danger | #FF9B9B | Eigene Ergänzung: Fehler/nein mit Symbol und Text |
| info | #9FC5F8 | Eigene Ergänzung: Hinweis mit Symbol und Text |

Primärbutton: bg auf accent, Hover bg auf accent-hover. Fehlertext: danger auf surface. Keine weiße kleine Schrift auf Gold. Zustandsflächen bleiben dunkel, Statusfarben werden für Text/Symbole verwendet. Fokus auf hellem Foto benötigt dunkle Unterlegung zusätzlich zum Goldring.

**Kontrast wird für jede tatsächliche Kombination berechnet.** Mindestwerte gemäß [WCAG 2.2](https://www.w3.org/TR/WCAG22/): 4,5:1 für normalen Text und 3:1 für großen Text sowie relevante UI-Abgrenzungen. Ein 20-%-Goldrand reicht nicht als alleinige Formularbegrenzung. Text über Fotos erhält eine ausreichend dunkle, geprüfte Unterlegung; ein variabler Bildinhalt ist kein verlässlicher Hintergrund.

Rechnerische Prüfung der Referenztokens am 16. November 2026: Haupttext erreicht 18,16:1 auf bg beziehungsweise 15,96:1 auf surface, Zusatztext 5,58:1 beziehungsweise 4,91:1 und Gold 8,80:1 beziehungsweise 7,74:1. Alle vier ergänzten Statusfarben erreichen auf beiden Grundflächen mindestens 8,63:1. Diese Prüfung belegt die definierten Farbpaarungen; tatsächliche Komponenten, Überlagerungen und Screenshots müssen bei Implementierung zusätzlich geprüft werden.

## Typografie

| Einsatz | Schrift | Gewicht | Größe / Zeilenhöhe |
| --- | --- | --- | --- |
| H1 / Albumtitel | Cormorant Garamond | 600 | clamp(2rem,4vw,3rem) / 1,2 |
| H2 | Cormorant Garamond | 600 | 1,75rem / 1,25 |
| H3 | Cormorant Garamond | 500 | 1,5rem / 1,3 |
| Fließtext | Montserrat | 400 | 1rem / 1,6 |
| Buttons, Labels | Montserrat | 500/600 | 0,875–1rem / 1,5 |
| Zusatzinformation | Montserrat | 400 | mindestens 0,875rem / 1,5 |

Die Schriftfamilien sind in der Vorlage belegt, die kompaktere Produktskala ist eine Projektentscheidung. Schriften werden nach Prüfung ihrer Distributionslizenz lokal als WOFF2 ausgeliefert; Lizenzdateien gehören in das Repository. Keine externen Fonts im Betrieb. Fallbacks: Georgia/Times New Roman für Titel, system-ui/Arial für UI; font-display swap. Deutsche Umlaute und ß müssen enthalten sein.

## Layout und Komponenten

- Abstände: 4, 8, 12, 16, 24, 32, 48, 64 px. Radien 4 px für Controls und 8 px für Karten/Dialoge. Dünne Konturen; Schatten nur für erhöhten Dialog.
- Desktop: Appbar 64 px, optionale Sidebar 240 px ab 1024 px, Inhaltsrand 32 px. Albumlisten maximal 1440 px breit; Fotogalerien dürfen den verfügbaren Platz nutzen.
- Tablet: ab 640 px Inhaltsrand 24 px, Navigation einklappbar. Mobil: 16 px, Aktionen bleiben textlich erkennbar; Freigabedialog darf als vollflächiger Dialog erscheinen.
- Fotogitter: repeat(auto-fill, minmax(min(100%,160px),1fr)); Abstand 12/16/24 px. Thumbnail-Rahmen 4:3, object-fit cover; Lightbox object-fit contain. Kein Informationsverlust durch Zuschnitt des Originals.
- Hauptaktionen heißen «Album erstellen», «Fotos hinzufügen» und «Teilen». Freigabedialog zeigt Empfängerkreis, Rechte und Ablauf direkt vor Erstellen.
- Dialoge erhalten sichtbaren Titel, Schließen-Schaltfläche, Fokusbegrenzung und Rückkehrfokus. Gefährliche Aktionen zeigen Konsequenz und eindeutige Bestätigung.
- Leere Zustände nennen eine nächste Aktion; Fehler erhalten «Erneut versuchen», soweit sinnvoll. Upload zeigt pro Datei Zustand und Fortschritt; Toast allein reicht nicht für einen dauerhaften Fehler.

## Interaktion und Zugänglichkeit

Alle interaktiven Komponenten besitzen sichtbaren Tastaturfokus. Touchziele mindestens 44 × 44 px. Farbmarkierungen heißen zusätzlich «Ja», «Vielleicht», «Nein» oder «Neutral». Symbole kommen aus einem konsistenten, lizenzgeprüften Satz; reine Symbolbuttons besitzen zugängliche Namen.

Animation 120–200 ms für opacity/transform, kein transition all. Bei prefers-reduced-motion keine nicht notwendige Bewegung. Nativer Cursor, sofort zugängliche Inhalte und sichtbare Eingabefokusse sind verbindlich. Die Vorlage enthält Cursor-, Preloader- und Fokusregeln, die nicht als Produktvorgabe übernommen werden, weil sie den einfachen zugänglichen Ablauf beeinträchtigen würden.

## Technische Nutzung und Prüfung

[frontend-ci.css](frontend-ci.css) enthält frameworkneutrale Referenztokens und minimale Grundregeln. Beim Angular-Bootstrap werden diese in das globale Theme überführt. Die Datei ist noch kein gebautes Frontend und enthält noch keine ausgelieferten Schriftdateien.

REQ-042 bis REQ-046 definieren die Abnahme. Komponentenkatalog zeigt alle Zustände. Visuelle Referenzen bei 375, 768 und 1440 px, 320-px-Überlaufcheck, 200-%-Zoom, Tastatur und Screenreader ergänzen automatisierte Kontrast-/axe-Prüfungen. Screenshotbaselines werden erst mit der tatsächlichen Implementierung erstellt und geprüft.
