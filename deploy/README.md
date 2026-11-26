# Live-Betrieb auf gallery.0808.ch

Das Image `ghcr.io/nwc-ch/gallery` enthält NestJS und den fertigen Angular-Build.
NestJS liefert das Frontend unter `/` und die API unter `/api` aus. Angular-Routen
funktionieren auch beim direkten Aufrufen oder Neuladen. Es wird ein einzelner
App-Container betrieben; Sitzungen bleiben wie gewünscht im Arbeitsspeicher und
enden bei dessen Neustart. HTTPS übernimmt der vorhandene Nginx Proxy Manager.

## Image lokal bauen und nach GitHub veröffentlichen

Die Veröffentlichung erfolgt lokal über `scripts/publish-image.mjs`, ohne
GitHub-Actions-Pipeline. Benötigt werden Node.js und ein laufendes Docker mit
Buildx. Docker Desktop unterstützt die voreingestellten Plattformen
`linux/amd64` und `linux/arm64`. Auf Linux muss für plattformfremde Builds eine
passende Emulation vorhanden sein; alternativ nur die Zielplattform auswählen.

Einmalig mit dem eigenen GitHub-Benutzernamen bei GHCR anmelden:

```sh
docker login ghcr.io -u DEIN_GITHUB_BENUTZER
```

Als Passwort einen GitHub Personal Access Token (classic) mit `write:packages`
verwenden. Das Konto benötigt Schreibzugriff auf das Paket `nwc-ch/gallery`;
gegebenenfalls den Token für die Organisation per SSO freigeben. Den Token nicht
im Skript oder Repository speichern.

Im Repository-Verzeichnis die gewünschten Prüfungen ausführen und veröffentlichen:

```sh
npm test
npm run test:e2e
npm run lint
npm run migration:run
npm run test:database
npm run image:publish
```

Die Datenbankbefehle setzen eine laufende lokale MariaDB voraus. Das
Veröffentlichsskript selbst führt ausschließlich Docker-Build und Push aus;
der Dockerfile baut Backend und Frontend. Es erstellt oder verwendet einen
eigenen Buildx-Builder `gallery-publisher`, dessen Cache lokal erhalten bleibt.

Standardmäßig werden `ghcr.io/nwc-ch/gallery:latest` und zusätzlich ein eindeutiger
Tag `build-<UTC-Zeitstempel>` veröffentlicht. Es wird der aktuelle Arbeitsstand
inklusive nicht committeter Änderungen gebaut, daher ist der Build-Tag keinem
Git-Commit gleichzusetzen. Für einen bestimmten Release-Stand `GALLERY_IMAGE` auf
dem Server auf den ausgegebenen Build-Tag setzen.

Optionen:

```sh
npm run image:publish -- --dry-run
npm run image:publish -- --tag v1.2.3
npm run image:publish -- --platform linux/amd64
npm run image:publish -- --help
```

`--tag` ersetzt den Standard-Tag `latest`; der eindeutige Build-Tag wird zusätzlich
veröffentlicht. `--image ghcr.io/ORGANISATION/REPOSITORY` wählt ein anderes
GHCR-Repository (in Kleinbuchstaben). `--dry-run` zeigt nur die geplanten Befehle.
Der Live-Server wird durch das Skript nicht automatisch aktualisiert; dafür die
Update-Befehle weiter unten ausführen.

## Server vorbereiten

Diese Dateien gemeinsam auf den Server kopieren:

- `deploy/docker-compose.yaml`
- `deploy/.env.example`

Alle folgenden Befehle im Verzeichnis mit der Live-Compose-Datei ausführen:

```sh
cp .env.example .env
```

In `.env` die DB-Passwörter, Google-OAuth-Zugangsdaten und einen zufälligen
`SESSION_SECRET` mit mindestens 32 Zeichen eintragen. Sichere Zufallswerte lassen
sich beispielsweise mit `openssl rand -hex 32` erzeugen. Die Datei gehört nicht
ins Repository. Für Bild-Uploads auch die R2-Werte eintragen; der Bucket bleibt
`gallery`.

`NPM_NETWORK` muss der Name eines bestehenden Docker-Netzwerks sein, an dem
Nginx Proxy Manager hängt. Die Beispielbezeichnung `proxy` entsprechend anpassen.
Verfügbare Netzwerke zeigt `docker network ls`. Die App wird dort unter dem
eindeutigen Alias **`gallery-app`** erreichbar. App und Datenbank veröffentlichen
keine Host-Ports. MariaDB liegt zusätzlich in einem separaten internen Netzwerk.

Falls das GHCR-Paket privat ist, auf dem Server zuerst mit einem GitHub-Konto und
einem Token mit `read:packages` per `docker login ghcr.io` anmelden.

```sh
docker compose pull
docker compose up -d --wait
```

Compose wartet auf die Datenbank, führt mit dem gleichen App-Image den einmaligen
Service `migrate` aus und startet die Anwendung erst bei erfolgreichem Abschluss.
Schemaveränderungen erfolgen weiterhin nur über TypeORM-Migrationen. Das
MariaDB-Volume bleibt bei `docker compose down` erhalten.

## Nginx Proxy Manager

Einen Proxy Host mit diesen Werten anlegen:

| Einstellung | Wert |
| --- | --- |
| Domain Names | `gallery.0808.ch` |
| Scheme zum Upstream | `http` |
| Forward Hostname / IP | `gallery-app` |
| Forward Port | `3000` |
| Cache Assets | deaktiviert |
| SSL | Zertifikat für `gallery.0808.ch`, Force SSL aktivieren |

DNS für `gallery.0808.ch` muss auf den Server mit Nginx Proxy Manager zeigen.
Unter **Advanced** den Upload-Limit und bei Bedarf das Zeitlimit setzen:

```nginx
client_max_body_size 55m;
proxy_read_timeout 180s;
```

Das Backend erlaubt weiterhin höchstens 50 MiB pro JPG. Keine separate Location
für `/api` und keine Weiterleitung auf einen Angular-Entwicklungsserver einrichten:
sämtliche Pfade gehen unverändert an den gleichen App-Container.

`APP_URL=https://gallery.0808.ch` und `TRUST_PROXY=1` sind bereits in Compose
gesetzt. Nginx Proxy Manager muss `X-Forwarded-Proto: https` weiterreichen, damit
die sicheren Sitzungscookies gesetzt werden. Die App ist für genau diesen einen
vorgeschalteten vertrauenswürdigen Proxy konfiguriert.

Im Google-OAuth-Client diese autorisierte Weiterleitungs-URI hinterlegen:

```text
https://gallery.0808.ch/api/auth/google/callback
```

## Updates und Administration

Für ein Update `GALLERY_IMAGE` bei Bedarf auf den neuen Tag setzen, dann:

```sh
docker compose pull
docker compose stop app
docker compose run --rm migrate
docker compose up -d --wait
```

Schlägt die Migration fehl, die Anwendung erst nach Behebung des Fehlers wieder
starten. Schema-Synchronisation ist deaktiviert. Logs und Status:

```sh
docker compose ps -a
docker compose logs --tail=100 app migrate
```

Ein bereits angemeldetes Benutzerkonto zum Admin ernennen, ohne Build-Werkzeuge
im Produktionsimage zu benötigen:

```sh
docker compose exec app node scripts/set-user-role.mjs GOOGLE_ID admin
```

## Image lokal bauen

Vom Repository-Verzeichnis aus:

```sh
docker build -t gallery:local .
```

Das Image enthält nur die Backend-Laufzeitabhängigkeiten, kompilierte
Backend-Dateien, Migrations-/Administrationswerkzeuge und den Frontend-Build.
Es läuft als Benutzer `node`. Lokale `.env`-Dateien, Entwicklungsabhängigkeiten
und Quelltexte werden nicht in das Laufzeitimage übernommen.
