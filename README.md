# Gallery

npm-Workspace mit zwei eigenständigen Apps:

- `apps/backend`: NestJS 12 mit OpenAPI/Swagger und TypeScript.
- `apps/frontend`: Angular 22.3 mit Standalone-Komponenten, Routing und SCSS.

## Voraussetzungen

Node.js `^22.22.3`, `^24.15.0` oder `^26.0.0` und npm. `.nvmrc` legt Node.js 24.15.0 fest.

## Installation und Entwicklung

Im Projektverzeichnis:

```sh
npm install
npm run db:up
npm run migration:run
```

Anschließend in zwei Terminals starten:

```sh
npm run start:backend
```

```sh
npm run start:frontend
```

- Frontend: <http://localhost:4200>
- Backend: <http://localhost:3000/api>
- Swagger UI: <http://localhost:3000/api/docs>
- OpenAPI JSON: <http://localhost:3000/api/openapi.json>

Der Angular-Entwicklungsserver leitet `/api` und Unterpfade an das Backend weiter.
Frontend-Code kann daher relative API-URLs verwenden. Im Produktionsimage liefert
NestJS das gebaute Frontend selbst aus; API und Frontend nutzen dieselbe Domain.
Der Backend-Port lässt
sich über die Umgebungsvariable `PORT` ändern; bei lokaler Änderung auch das
Ziel in `apps/frontend/proxy.conf.json` anpassen.

## Produktionsimage und Live-Server

Der [Dockerfile](Dockerfile) baut ein gemeinsames Backend-/Frontend-Image.
Die [GitHub-Actions-Pipeline](.github/workflows/backend-image.yaml) prüft das
Projekt und veröffentlicht es unter `ghcr.io/nwc-ch/gallery`.

Für `https://gallery.0808.ch` liegt eine separate
[Live-Compose-Datei](deploy/docker-compose.yaml) mit MariaDB und einmaligem
Migrationslauf vor. Der vorhandene Nginx Proxy Manager übernimmt HTTPS;
Sitzungen bleiben im Arbeitsspeicher. Einrichtung und Updates stehen in der
[Deployment-Anleitung](deploy/README.md). Die Compose-Datei im Projektverzeichnis
bleibt für die lokale Entwicklungsdatenbank zuständig.

## MariaDB und TypeORM

`docker-compose.yaml` startet MariaDB 11.8 mit Healthcheck und dauerhaftem Volume.
Der Port ist nur lokal unter `127.0.0.1:3307` erreichbar. Das Backend verwendet
TypeORM mit dem `mysql2`-Treiber. Die lokalen Standardwerte sind:

| Einstellung | Wert |
| --- | --- |
| Host / Port | `127.0.0.1:3307` |
| Datenbank | `gallery` |
| Benutzer | `gallery` |
| Passwort | `gallery_local` |

Die Entwicklungszugangsdaten sind ausschließlich für die lokale Datenbank gedacht.
`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` und `DB_PASSWORD` lassen sich
in `apps/backend/.env` konfigurieren; die Vorlage enthält dieselben Standardwerte.
Die App und die TypeORM-CLI laden diese Datei unabhängig vom Arbeitsverzeichnis.
Vorhandene Umgebungsvariablen haben Vorrang.

```sh
npm run db:up
npm run migration:run
npm run start:backend
```

`npm run db:down` stoppt die Datenbank; das Volume bleibt erhalten.
Wer vom Standard abweichende DB-Werte in `apps/backend/.env` einträgt, startet
Compose mit derselben Datei, damit Container und Backend übereinstimmen:

```sh
docker compose --env-file apps/backend/.env up -d --wait db
```

Compose übernimmt `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` und optional
`DB_ROOT_PASSWORD`. Bei einem bestehenden Volume ändern diese Werte nicht die
bereits angelegten Datenbankkonten. Das Backend verbindet sich mit dem normalen
Anwendungsbenutzer, nicht mit root.

### Schemaänderungen

`synchronize` und `migrationsRun` sind deaktiviert. Das Schema wird ausschließlich
über versionierte TypeORM-Migrationen verändert; der Backend-Start ändert es nicht.
Die gemeinsame Konfiguration liegt in `src/database/database.config.ts`, die
CLI-DataSource in `src/database/data-source.ts` (Pfade relativ zum Backend).

1. Datenbank starten und ausstehende Migrationen ausführen.
2. Entities ändern und die Migration gegen die laufende Datenbank erzeugen:

   ```sh
   npm run migration:generate -- src/database/migrations/BeschreibungDerAenderung
   ```

3. Die erzeugte Datei unter `apps/backend/src/database/migrations` prüfen und
   zusammen mit den Entity-Änderungen versionieren.
4. Migrationen ausführen und den Status prüfen:

   ```sh
   npm run migration:run
   npm run migration:show
   ```

`npm run migration:revert` führt die `down`-Methode der letzten Migration aus.
Dabei können Daten verloren gehen, beispielsweise beim Zurücknehmen der initialen
Benutzertabelle. MariaDB führt viele DDL-Befehle mit implizitem Commit aus;
eine Migration mit mehreren DDL-Schritten ist daher nicht vollständig atomar.

Die Befehle kompilieren das Backend vor dem TypeORM-CLI-Aufruf. Dadurch verwenden
NestJS und die CLI dieselben ESM-Entities und Migrationen ohne zusätzlichen
TypeScript-Laufzeitloader. Im Deployment nach dem Build und vor dem App-Start:

```sh
npm run migration:run:prod --workspace=backend
```

Die initiale Migration wurde von TypeORM erzeugt. Sie legt `users` an. Google-Logins
legen Benutzer anhand der stabilen Google-ID an oder aktualisieren Name, E-Mail
und den Zeitpunkt der letzten Anmeldung. Die Migrationstabelle heißt
`typeorm_migrations`.

`npm run test:database` prüft gegen die laufende, migrierte MariaDB den Schema-Abgleich
sowie Anlegen und Aktualisieren von Benutzerprofilen. Testdaten werden innerhalb
einer Transaktion angelegt und anschließend zurückgerollt. Die üblichen Unit- und
HTTP-Tests laufen unabhängig von einer Datenbank.

## Bilder und Cloudflare R2

Im Dashboard eine Galerie öffnen. Administratoren können dort mehrere JPG-Dateien
auswählen. Die Dateien werden nacheinander hochgeladen; erfolgreiche Uploads
erscheinen sofort in der Galerie. Fehlgeschlagene Dateien werden einzeln angezeigt,
die übrigen Dateien werden weiterverarbeitet.

### Speicher konfigurieren

1. In Cloudflare R2 einen **privaten Bucket mit dem Namen `gallery`** anlegen.
2. R2-S3-Zugangsdaten mit Lese- und Schreibrechten für diesen Bucket erstellen;
   für das Aufräumen fehlgeschlagener Uploads werden auch Löschrechte benötigt.
3. In `apps/backend/.env` eintragen und das Backend neu starten:

   ```dotenv
   R2_ACCOUNT_ID=deine-cloudflare-account-id
   R2_ACCESS_KEY_ID=deine-r2-access-key-id
   R2_SECRET_ACCESS_KEY=dein-r2-secret-access-key
   ```

   Bei einem regionalen Bucket kann `R2_ENDPOINT` auf den zugehörigen
   HTTPS-S3-Endpunkt gesetzt werden, z. B.
   `https://ACCOUNT_ID.eu.r2.cloudflarestorage.com`. Ohne diese Variable verwendet
   das Backend `https://ACCOUNT_ID.r2.cloudflarestorage.com`.

Die Zugangsdaten bleiben im Backend. Der Browser lädt Vorschaubilder und Originale
über authentifizierte API-Routen; dafür sind weder ein öffentlicher R2-Bucket
noch eine R2-CORS-Freigabe nötig. Ohne konfigurierte Zugangsdaten ist der Upload
deaktiviert. Die Verfügbarkeitsanzeige prüft die Konfiguration; R2-Rechte und
Netzwerkzugriff werden erst beim tatsächlichen Upload geprüft.

### Verarbeitung und Anzeige

- Erlaubt sind `.jpg`/`.jpeg` mit tatsächlichem JPEG-Inhalt, maximal **50 MiB**
  pro Datei und **100 Megapixel**. Umbenannte PNGs und beschädigte JPGs werden
  abgewiesen.
- Das Original wird einschließlich Metadaten unverändert gespeichert. Die
  Vorschau ist ein progressives JPG mit maximal 1200 × 1200 Pixeln, Qualität 82,
  ohne Vergrößerung oder Beschnitt. EXIF-Ausrichtung wird auf die Vorschau
  angewendet; Vorschau-Metadaten werden entfernt.
- R2-Objekte liegen unter
  `galleries/GALERIE_ID/BILD_ID/original.jpg` und `…/preview.jpg`.
  Bildabmessungen, Dateiname und Objektschlüssel stehen in MariaDB. Die neue
  TypeORM-Migration legt `gallery_images` an.
- Die Galerie verwendet ausschließlich Vorschaubilder und berechnet ein
  responsives **Justified Gallery**-Layout: gemeinsame Höhe je Zeile, erhaltene
  Seitenverhältnisse, volle Zeilenbreite. Die letzte Zeile wird nicht aufgeblasen.
- Erst beim Öffnen eines Bildes wird dessen Original geladen. Die Ansicht passt
  das ganze Bild ohne Beschnitt in den verfügbaren Bildschirm ein. **100 %**
  beziehungsweise Doppelklick wechselt zur Detailansicht mit Scrollen und Ziehen.
- Schaltflächen und linke/rechte Pfeiltaste wechseln das Bild. Am ersten Bild
  fehlt Zurück, am letzten Weiter; es gibt keinen Umlauf. **Esc** oder die
  Schließen-Schaltfläche beendet die Ansicht. Navigation setzt den Zoom zurück.

API (Anmeldung und Albumfreigabe erforderlich; Administratoren haben immer Zugriff):

- `GET /api/galleries/:id`: Galerie laden.
- `GET /api/galleries/:galleryId/images`: Bilder und Verfügbarkeit des Uploads.
- `POST /api/galleries/:galleryId/images`: Admin-Upload als `multipart/form-data`
  mit Feld `file` und Header `X-Requested-With: Gallery`.
- `GET /api/galleries/:galleryId/images/:imageId/preview`: JPG-Vorschau.
- `GET /api/galleries/:galleryId/images/:imageId/original`: unverändertes Original.

Bei Speicher- oder Datenbankfehlern versucht das Backend, beide neu angelegten
Objekte zu entfernen. R2 und MariaDB bilden keine gemeinsame Transaktion;
nach einem Prozessabbruch oder fehlgeschlagenem Aufräumen können unreferenzierte
Objekte verbleiben. Ein solcher Aufräumfehler wird im Backend protokolliert.
Das Ausführen oder Zurücknehmen einer DB-Migration entfernt keine R2-Objekte.

Die automatisierten Tests prüfen R2-SDK-Aufrufe mit simuliertem Speicher sowie
JPG-Verarbeitung, Berechtigungen, Justified-Layout und Bildnavigation. Ein echter
R2-Upload erfordert die oben genannten Zugangsdaten.

## Rollen und Galerien

Neue und bestehende Benutzer erhalten zunächst die Rolle `user`. Administratoren
haben die Rolle `admin` und können im Dashboard Galerien mit einem Titel anlegen.
Titel sind erforderlich, werden am Rand von Leerzeichen bereinigt und dürfen
höchstens 160 Zeichen lang sein. Normale Benutzer sehen nur explizit für sie
freigegebene Galerien; Administratoren sehen alle Galerien.
Galerien und ihre Ersteller werden in MariaDB gespeichert.

Nach der ersten Google-Anmeldung kann ein bestimmtes Konto lokal zum Admin
ernannt werden. Die stabile Google-ID steht in `/api/auth/me` als `id` oder in
der Datenbanktabelle `users`:

```sh
npm run user:role -- GOOGLE_ID admin
```

Mit `npm run user:role -- GOOGLE_ID user` wird die Berechtigung wieder entzogen.
Es gibt keinen öffentlichen Endpunkt zur Rollenzuweisung. Ein Google-Login
überschreibt die bereits gespeicherte Rolle nicht. Geschützte Anfragen laden
den Benutzer einschließlich Rolle aus der Datenbank neu; Änderungen gelten
daher auch für laufende Sitzungen. Nach einer Rollenzuweisung das Dashboard
neu laden, damit das Formular erscheint.

Die API bietet `GET /api/galleries` als gefilterte Übersicht für angemeldete Benutzer sowie
`POST /api/galleries` mit `{ "title": "Meine Galerie" }` nur für Administratoren.
Schreibende Anfragen benötigen zusätzlich den Header `X-Requested-With: Gallery`.
Die neue TypeORM-Migration ergänzt die Rolle und die Tabelle `galleries`;
auf anderen Installationen vor dem Backend-Start `npm run migration:run` ausführen.

### Benutzerfreigaben je Album

Administratoren öffnen ein Album und klicken auf den **Drei-Punkte-Button** neben
dem Albumtitel. Im modalen Dialog **Wer darf dieses Album sehen?** wählen sie die
gewünschten Benutzer aus. Die Liste enthält alle Konten, die sich
bereits mindestens einmal mit Google angemeldet haben, unabhängig davon, ob
aktuell eine Sitzung aktiv ist. Alle Benutzer werden ohne Suchfeld angezeigt.
Der Dialog lässt sich über den Schließen-Button oder mit Escape schließen;
ungespeicherte Änderungen werden dabei verworfen.
Mit **Freigaben speichern** wird die Auswahl für genau dieses Album übernommen.
Abwählen und Speichern entzieht den Zugriff wieder. Eine leere Auswahl bedeutet,
dass ausschließlich Administratoren Zugriff haben.

Administratoren behalten unabhängig von der Auswahl Zugriff auf alle Alben.
Diese Konten sind in der Liste entsprechend markiert und nicht abwählbar.
Neue Benutzer erhalten keine automatische Freigabe. Auch bestehende Alben sind
nach der Migration für normale Benutzer zunächst nicht freigegeben; ein Admin
muss die gewünschten Konten auswählen.

Freigaben liegen in `gallery_access` mit eindeutiger Kombination aus Album und
Benutzer. Änderungen werden als Transaktion gespeichert und prüfen, dass alle
ausgewählten Benutzer existieren. Die TypeORM-Migration `AddGalleryAccess` legt
die Tabelle und ihre Fremdschlüssel an.

Die Prüfung erfolgt im Backend bei jeder Anfrage: Albumübersicht, Albumdetails,
Bildliste, Vorschauen und Originale. Nicht freigegebene Alben erscheinen nicht in
der Übersicht; direkte Zugriffe liefern `404`. Die Benutzerliste und das Ändern
der Freigaben sind nur für Administratoren verfügbar:

- `GET /api/galleries/:id/access`: registrierte Benutzer und gespeicherte Auswahl.
- `PUT /api/galleries/:id/access`: Auswahl durch `{ "userIds": ["GOOGLE_ID"] }`
  ersetzen. Der Header `X-Requested-With: Gallery` ist erforderlich.
- `{ "userIds": [] }` entfernt alle expliziten Benutzerfreigaben dieses Albums.

Ein Entzug gilt für neue Anfragen sofort, auch bei laufenden Sitzungen. Neue
Bildantworten verwenden `Cache-Control: private, no-store`, damit der Browser
die Zugriffsprüfung nicht durch seinen HTTP-Cache umgeht. Bereits heruntergeladene
oder aktuell angezeigte Bilddaten können nicht rückwirkend entzogen werden.

## Google-Anmeldung

Die erste Seite ist `/login`. Google ist die einzige Anmeldemöglichkeit.
Nach der Anmeldung führt die App auf das geschützte `/dashboard`.
Eine bestehende Sitzung bleibt beim Neuladen erhalten; Abmelden beendet sie.

1. In der [Google Cloud Console](https://console.cloud.google.com/auth/clients)
   einen OAuth-Client vom Typ **Webanwendung** erstellen und den Zustimmungsbildschirm
   konfigurieren. Im Testmodus die gewünschten Google-Konten als Testnutzer hinzufügen.
2. Diese autorisierte Weiterleitungs-URI exakt eintragen:
   `http://localhost:4200/api/auth/google/callback`.
3. `apps/backend/.env.example` nach `apps/backend/.env` kopieren. Dort
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` und einen zufälligen
   `SESSION_SECRET` mit mindestens 32 Zeichen eintragen. Ein Erzeugungsbefehl
   steht in der Beispieldatei. Die Zugangsdaten bleiben ausschließlich im Backend.
4. Backend und Frontend wie oben starten. Nach Konfigurationsänderungen das Backend
   neu starten. Die Backend-Startbefehle laden dessen lokale `.env` automatisch.

Der Authorization-Code-Flow verwendet PKCE, State und Nonce. Google-ID-Tokens
werden mit Googles Bibliothek auf Signatur, Aussteller, Zielgruppe und Ablauf
geprüft. Die Sitzung verwendet ein HttpOnly-Cookie mit `SameSite=Lax`, in
Produktion zusätzlich `Secure`. Google-Zugriffstokens werden nicht gespeichert.
Die API stellt `/api/auth/me` nur mit gültiger Sitzung bereit.

**Betrieb:** Sitzungen bleiben auch im Live-Betrieb im Arbeitsspeicher des einen
App-Containers; ein Neustart meldet Benutzer ab. Die Live-Compose-Datei setzt
`NODE_ENV=production`, `APP_URL=https://gallery.0808.ch` und `TRUST_PROXY=1` für
den vorgeschalteten Nginx Proxy Manager. Einen festen sicheren `SESSION_SECRET`
in der Serverkonfiguration setzen und die produktive Callback-URI bei Google
registrieren. Ohne Google-Zugangsdaten zeigt die Login-Seite eine
Verfügbarkeitsmeldung.

Implementierung nach [Googles Dokumentation zum Webserver-Flow](https://developers.google.com/identity/protocols/oauth2/web-server).

## Prüfung und Build

```sh
npm run build
npm test
npm run test:e2e
npm run lint
```

Build-Ausgaben: `apps/backend/dist` und `apps/frontend/dist/frontend`.
Das gebaute Backend startet mit `npm run start:prod --workspace=backend`.
Die OpenAPI-Dokumentation wird aus den Controllern und Swagger-Dekoratoren
generiert. Neue API-Routen und DTOs entsprechend dokumentieren.
