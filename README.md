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
Frontend-Code kann daher relative API-URLs verwenden. Für produktive Deployments
muss das Hosting dieselbe Weiterleitung bereitstellen. Der Backend-Port lässt
sich über die Umgebungsvariable `PORT` ändern; bei lokaler Änderung auch das
Ziel in `apps/frontend/proxy.conf.json` anpassen.

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

## Rollen und Galerien

Neue und bestehende Benutzer erhalten zunächst die Rolle `user`. Administratoren
haben die Rolle `admin` und können im Dashboard Galerien mit einem Titel anlegen.
Titel sind erforderlich, werden am Rand von Leerzeichen bereinigt und dürfen
höchstens 160 Zeichen lang sein. Alle angemeldeten Benutzer sehen die Galerien.
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

Die API bietet `GET /api/galleries` für angemeldete Benutzer sowie
`POST /api/galleries` mit `{ "title": "Meine Galerie" }` nur für Administratoren.
Schreibende Anfragen benötigen zusätzlich den Header `X-Requested-With: Gallery`.
Die neue TypeORM-Migration ergänzt die Rolle und die Tabelle `galleries`;
auf anderen Installationen vor dem Backend-Start `npm run migration:run` ausführen.

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

**Betrieb:** Aktuell liegen Sitzungen im Arbeitsspeicher des Backends; ein Neustart
meldet Benutzer ab. Vor einem produktiven Deployment einen gemeinsamen,
persistenten Session-Store (z. B. Redis) in `app.setup.ts` anbinden. Außerdem
`NODE_ENV=production`, `APP_URL=https://deine-domain` und einen festen sicheren
`SESSION_SECRET` setzen, die produktive Callback-URI bei Google registrieren und
`/api` unter derselben Domain weiterleiten. `TRUST_PROXY=1` nur hinter genau einem
vertrauenswürdigen Reverse Proxy setzen. Ohne Google-Zugangsdaten zeigt die
Login-Seite eine Verfügbarkeitsmeldung.

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
