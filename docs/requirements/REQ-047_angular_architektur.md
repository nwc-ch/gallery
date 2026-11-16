# REQ-047 – Angular-Architektur und Konventionen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; T1; T2; T10. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: Keine fachlichen Vorbedingungen.

## Ziel

Angular wird mit aktuellen unterstützten APIs und klaren Fachgrenzen aufgebaut.

## Abnahmekriterien

1. Standalone-Komponenten, striktes TypeScript/Templatechecking und Featurestruktur auth, albums, photos, sharing, feedback verwenden; Routen lazy laden.
2. Komponenten sind klein, Services kapseln API-Zugriffe; Signals für lokalen synchronen Zustand, RxJS für asynchrone Abläufe mit sauberem Subscription-Lifecycle.
3. OnPush beziehungsweise unterstützte zoneless-Konfiguration nach Kompatibilitätsprüfung; stabile Tracking-IDs und abgeleitete statt duplizierter Zustände; Frontendguards dienen nur der Navigation.

## Verifikation

- **Unit:** Komponentenverhalten und Services mit Angular TestBed sowie HttpTestingController prüfen.
- **Integration:** Router-, Formular- und Servicezusammenspiel ohne echte Google-Anmeldung prüfen.
- **E2E:** Produktionsbuild durch Kernabläufe führen; Browserkonsole ohne unbehandelte Fehler.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

