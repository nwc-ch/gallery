# REQ-069 – Betrieb, Konfiguration und Überwachung

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-058](REQ-058_missbrauchsschutz.md), [REQ-059](REQ-059_transport_geheimnisse.md), [REQ-061](REQ-061_audit_protokolle.md)

## Ziel

Fehlkonfiguration und Dienstausfälle werden früh erkannt.

## Abnahmekriterien

1. Umgebungsvariablen sind typisiert und beim Start validiert; Produktion verweigert Test-OIDC, unsichere Cookies, öffentliche Buckets und fehlende Pflichtsecrets.
2. Readiness prüft DB und relevante Dienste, Liveness den Prozess ohne teure Abhängigkeiten; interne Healthdetails sind nicht öffentlich.
3. Metriken überwachen Fehlerquote, Latenz, Queuealter, Workerabstürze, Speicherquote und Löschrückstände; Testalarm erreicht den konfigurierten Bereitschaftskanal.

## Verifikation

- **Unit:** Konfigurationsmatrix und Health-Auswertung prüfen.
- **Integration:** DB-/R2-Ausfall, Queue-Stau und Alarmzustellung mit Testempfänger simulieren.
- **E2E:** Ausfall erzeugt verständlichen UI-Zustand; nach Wiederanlauf funktioniert Upload ohne Datenverlust.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

