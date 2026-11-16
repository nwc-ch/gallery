# REQ-022 – Rechte pro Album und Objekt

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Nutzerauftrag; P1; T3. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: Keine fachlichen Vorbedingungen.

## Ziel

Jeder Serverzugriff entscheidet nach Eigentümerschaft und expliziter Freigabe.

## Abnahmekriterien

1. Eigentümer verwaltet Inhalte und Freigaben; Betrachten, Originaldownload und Feedback sind getrennte Grant-Fähigkeiten; Empfänger laden im MVP nichts hoch.
2. Default deny gilt für Alben, Fotos, Varianten, Kommentare, Exporte und Ereignisse; IDs allein erteilen keine Rechte.
3. Abfragen begrenzen bereits auf erlaubte Eigentümer-/Albumbeziehungen; fremde und nicht vorhandene Objekte liefern einheitlich 404 ohne Metadaten.

## Verifikation

- **Unit:** Rechtematrix für Eigentümer, Person, Gast und fremden Nutzer vollständig prüfen.
- **Integration:** IDOR/BOLA durch Vertauschen von Album-, Foto-, Grant-, Kommentar- und Job-IDs testen.
- **E2E:** Zwei Eigentümer und Gast verwenden; verbotene UI-Aktionen zusätzlich direkt per API versuchen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

