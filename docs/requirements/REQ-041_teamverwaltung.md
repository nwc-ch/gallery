# REQ-041 – Teamrollen

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: Ausbau · Soll, nach MVP.
- Herkunft: P1; P6. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-021](REQ-021_personenfreigabe.md), [REQ-022](REQ-022_berechtigungen.md)

## Ziel

Mehrere Verantwortliche können später gemeinsam Inhalte betreuen.

## Abnahmekriterien

1. Teamrollen Owner, Editor und Viewer werden explizit auf einen Teamkontext begrenzt; globale Administratoren erhalten keinen automatischen Fotozugriff.
2. Nur Owner vergibt Rollen; letzter Owner darf nicht entfernt werden.
3. Mitgliedsentzug stoppt teambezogene Daten-, Medien- und Ereigniszugriffe; private Alben wechseln nicht automatisch zum Team.

## Verifikation

- **Unit:** Rollenmatrix und Letzter-Owner-Regel prüfen.
- **Integration:** Rollenwechsel bei laufenden Sitzungen und fremde Team-ID prüfen.
- **E2E:** Editor bearbeitet erlaubtes Teamalbum und verliert nach Entzug den Zugriff.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

