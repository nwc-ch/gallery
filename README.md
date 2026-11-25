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
