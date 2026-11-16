# REQ-030 – Kommentare pro Foto

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: P1; P5. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-022](REQ-022_berechtigungen.md), [REQ-025](REQ-025_gast_identitaet.md), [REQ-055](REQ-055_xss_csp.md)

## Ziel

Rückmeldungen bleiben beim jeweiligen Foto.

## Abnahmekriterien

1. Feedbackberechtigte schreiben Textkommentare mit 1–2.000 Zeichen; Anzeige enthält Anzeigename und Zeitpunkt.
2. Verfasser darf eigenen Kommentar bearbeiten/löschen; Eigentümer moderiert; andere Empfänger dürfen nicht bearbeiten.
3. Kommentare werden als Text gerendert, paginiert und nach Zeit/ID geordnet; Editierungen werden gekennzeichnet.

## Verifikation

- **Unit:** Textgrenzen, Editierrechte und Darstellung prüfen.
- **Integration:** Fremde Kommentar-ID, paginierte Reihenfolge und Stored-XSS-Fixture prüfen.
- **E2E:** Gast kommentiert; zweiter Empfänger liest und versucht unberechtigte Bearbeitung.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

