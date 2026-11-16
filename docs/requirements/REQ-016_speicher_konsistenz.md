# REQ-016 – Konsistente Datei- und Auftragszustände

- Status: Geplant; noch nicht implementiert oder getestet.
- Lieferumfang: MVP · Muss.
- Herkunft: Eigener Vorschlag. Quellenkürzel siehe [Quellenregister](SOURCES.md); konkrete Grenzwerte und Architekturentscheidungen sind Projektfestlegungen.
- Bezüge: [REQ-049](REQ-049_datenmodell.md), [REQ-050](REQ-050_datenbank_migrationen.md)

## Ziel

Datenbank, Storage und Hintergrundaufträge bleiben bei Fehlern abgleichbar.

## Abnahmekriterien

1. Upload durchläuft reserved → uploaded → quarantined → processing → ready oder failed; Abschluss prüft serverseitig Objektgröße und Integrität.
2. Outbox in derselben DB-Transaktion speichert Verarbeitungsauftrag; Worker nutzt Lease, begrenzte Wiederholungen und idempotente Verarbeitung.
3. Täglicher Abgleich bereinigt verwaiste Objekte und abgelaufene Multipart-Uploads nach mindestens 24 Stunden; keine Veröffentlichung durch bloßes Client-Fertigsignal.
4. Vor Prüfung wird ein serverseitiger Verarbeitungssnapshot auf einem nie per Upload-URL beschreibbaren Schlüssel erzeugt. Nur dessen geprüfte Bytes dürfen als Original veröffentlicht werden; wiederholtes PUT auf den Quarantäneschlüssel darf veröffentlichte Fotos nicht verändern.

## Verifikation

- **Unit:** Erlaubte Übergänge, Idempotenz und Lease-Ablauf prüfen.
- **Integration:** Absturz zwischen R2-Schreibzugriff und DB-Commit sowie doppelte Auftragsausführung simulieren; wiederverwendete Upload-URL nach Prüfung verändert weder freigegebenen Originalhash noch Derivate.
- **E2E:** Upload bei Worker-Ausfall abschließen, Worker starten und genau ein fertiges Foto sehen.

Die Verifikation ist eine verbindliche Vorgabe für die spätere Umsetzung. Für diese Dokumentationsphase liegen noch keine Anwendungstests vor.

