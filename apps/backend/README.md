# Gallery Backend

NestJS 12 mit Express und OpenAPI über `@nestjs/swagger`.
Installation und gemeinsame Befehle stehen in der [Projekt-README](../../README.md).

Vom Projektverzeichnis aus starten:

```sh
npm run start:backend
```

- `GET /api`: Beispielroute.
- `/api/docs`: interaktive Swagger-Oberfläche.
- `/api/openapi.json`: generierte OpenAPI-Spezifikation.

`src/app.setup.ts` konfiguriert API-Präfix und OpenAPI für Anwendung und E2E-Tests.
`PORT` bestimmt den HTTP-Port (Standard: `3000`).

```sh
npm run build --workspace=backend
npm run start:prod --workspace=backend
npm run test --workspace=backend
npm run test:e2e --workspace=backend
```
