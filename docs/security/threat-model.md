# Initiales Bedrohungsmodell

Status: Ausgangsentwurf, noch kein Sicherheits-Audit. Stand: 16. November 2026. Grundlage: [OWASP ASVS](https://asvs.owasp.org/) 5.0.0, Projektziel Level 2. Die konkrete Kontroll-ID-/Test-Nachweismatrix wird mit der Implementierung nach REQ-053 und REQ-071 erstellt; derzeit ist keine ASVS-Konformität nachgewiesen.

## Schutzgüter und Grenzen

Schutzgüter sind private Originale und Vorschauen, Google-Identitäten, Sitzungen, Freigabetoken, Kommentare, Metadaten einschließlich GPS, Storage-/DB-Secrets und Kostenbudgets. Vertrauensgrenzen verlaufen Browser → API, Browser → Uploadquarantäne, API → Google, API/Worker → MariaDB/R2 sowie Betrieb → Logs/Backups. Alle Clientangaben und Uploadbytes sind unvertrauenswürdig.

| Angreifer / Angriff | Schaden | Geforderte Gegenmaßnahmen | REQ |
| --- | --- | --- | --- |
| Angemeldeter Fremder vertauscht Album-/Foto-ID | Zugriff auf fremde Fotos | Abfrage scopen, Objektpolicies, deny by default, durchgängige Negativtests | 022, 048, 056 |
| Gast verändert Grants oder Kommentarautor | Rechteausweitung / fremdes Feedback | Serverseitige Identität, Feldallowlist, gebundener Zugriffskontext | 021–025, 030, 056 |
| Gestohlener/weitergeleiteter Link | Unbeabsichtigter Empfängerkreis | Tokenhash, starke Zufallswerte, Fragmentaustausch, Ablauf, Widerruf, optional Passwort | 020, 023–024 |
| Login-CSRF, Code-Replay, Tokenfälschung | Kontoübernahme | state, nonce, PKCE, Signatur-/Claimprüfung, einmalige Logintransaktion | 002–003, 054 |
| Fremde Seite missbraucht Cookies | Ungewollte Änderung | CSRF-Token, Originprüfung, sichere Cookieattribute | 054 |
| Kommentar oder Dateiname enthält Skript | Sitzung-/Datenmissbrauch | Textausgabe, Angular-Sanitizing, CSP, Trusted Types, nosniff | 030, 055 |
| SQL-/Sortier-/Pfad-Injection | Datenverlust / Ausführung | Parameterbindung, Allowlists, sichere Dateinamen, keine Shellinterpolation | 026–027, 056 |
| Upload enthält Malware oder Decoderexploit | Kompromittierter Worker | Quarantäne, Scanner, isolierter Decoder, Limits, kein Netzwerk, aktuelle Bibliotheken | 012–013, 057, 062 |
| Upload-URL überschreibt bereits geprüfte Bytes | Nachträglich bösartiger Inhalt | Geprüften Snapshot auf nicht clientbeschreibbarem Schlüssel veröffentlichen | 015–016, 057 |
| Pixelbombe, viele ZIPs, Token-Bruteforce | Verfügbarkeit / Kosten | Ressourcenlimits, Quote, verteilte Raten-/Joblimits und Alarmierung | 014, 027, 058, 067, 069 |
| Abgelaufener Grant nutzt Cache/Stream/Event | Daten nach Widerruf | Autorisierung für jeden Kanal, no-store, Verbindung abbrechen | 015, 024, 034, 055 |
| GPS, Logs oder Drittanbieter verraten Daten | Privatsphäreverletzung | Metadatenfilter, lokale Fonts, Logredaktion, keine Tracker | 013, 043, 060–061 |
| Kompromittiertes Paket / CI-Job | Secrets / Lieferkettenangriff | Lockfile, SBOM, Scanner, unveränderliche Artefakte, getrennte Secrets | 059, 062, 066 |
| Fehlerhafter Löschjob / Backup-Restore | Wiederauftauchen gelöschter Daten | Idempotente Bereinigung, Löschregister bei Restore, definierte Fristen | 009, 016, 060, 068 |
| Insider oder kompromittierte Betriebsidentität | Breiter Datenzugriff | Minimale getrennte Rechte, verschlüsselte Backups, Audit, Rotation | 059, 061, 068 |

## Verbindliche Sicherheitsreview-Fragen

Bei jeder Änderung prüfen: Wer ist der Akteur? Welche Objektbeziehung erlaubt genau diese Aktion? Kann ein Client Eigentum oder Status setzen? Welche Daten verlassen welchen Kanal? Sind Datei-/Text-/URL-Eingaben unkontrolliert? Was passiert bei Wiederholung, Parallelität, Ausfall und Widerruf? Welche Ressourcen kann ein Angreifer verbrauchen? Welche Tests belegen die Antworten?

## Restrisiken und Freigabegrenze

Ein Gastlink ist eine übertragbare Fähigkeit, kein Identitätsnachweis. Gäste können neue Browseridentitäten erzeugen; anonyme Abstimmungen sind nicht manipulationssicher. Sichtbare Fotos lassen sich speichern oder abfotografieren. Originaldownloads können GPS enthalten. Betreiber und serverseitige Verarbeitungsdienste können Klartextbilder sehen; keine Ende-zu-Ende-Verschlüsselung wird versprochen. Kompromittierte Endgeräte oder Google-Konten lassen sich durch diese App nicht vollständig absichern.

Diese Grenzen werden in der passenden Produktstelle erklärt, ohne den Kernablauf mit technischen Details zu überladen. Hohe/kritische ausnutzbare Befunde verhindern ein Release. Reale Nachweise und Restrisikobewertungen gehören mit Datum und verantwortlicher Person in den Releasebericht; geplante Tests reichen nicht.
