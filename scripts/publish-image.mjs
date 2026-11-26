import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = fileURLToPath(new URL("../", import.meta.url));
const builder = "gallery-publisher";

function run(args, quiet = false) {
  const result = spawnSync("docker", args, {
    cwd: root,
    stdio: quiet ? "pipe" : "inherit",
    shell: false,
  });
  if (result.error)
    throw new Error(
      `Docker konnte nicht gestartet werden: ${result.error.message}`,
    );
  if (result.signal)
    throw new Error(`Docker wurde durch ${result.signal} beendet.`);
  return result.status ?? 1;
}

function requireSuccess(args) {
  const status = run(args);
  if (status !== 0)
    throw new Error(
      `Docker ist mit Exit-Code ${status} fehlgeschlagen. Es werden keine weiteren Schritte ausgeführt.`,
    );
}

try {
  const { values } = parseArgs({
    options: {
      image: { type: "string", default: "ghcr.io/nwc-ch/gallery" },
      tag: { type: "string", default: "latest" },
      platform: { type: "string", default: "linux/amd64,linux/arm64" },
      "dry-run": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.help) {
    console.log(`Image lokal bauen und nach GitHub Container Registry veröffentlichen.

Aufruf: npm run image:publish -- [Optionen]
  --tag TAG          Image-Tag (Standard: latest)
  --platform LISTE  linux/amd64,linux/arm64 (Standard: beide)
  --image IMAGE      GHCR-Repository (Standard: ghcr.io/nwc-ch/gallery)
  --dry-run          Befehle anzeigen, ohne Docker aufzurufen oder zu veröffentlichen
  --help             Diese Hilfe anzeigen

Voraussetzungen: Docker mit Buildx und Anmeldung über docker login ghcr.io.
Es wird der aktuelle Arbeitsstand inklusive nicht committeter Änderungen gebaut.`);
  } else {
    if (
      !/^ghcr\.io\/[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)+$/.test(
        values.image,
      )
    )
      throw new Error(
        "--image muss ein kleingeschriebenes GHCR-Repository ohne Tag sein.",
      );
    if (!/^[\w][\w.-]{0,127}$/.test(values.tag))
      throw new Error("Ungültiger Image-Tag.");
    const platforms = [
      ...new Set(values.platform.split(",").map((value) => value.trim())),
    ];
    if (
      !platforms.length ||
      platforms.some((value) => !["linux/amd64", "linux/arm64"].includes(value))
    )
      throw new Error(
        "--platform erlaubt linux/amd64 und linux/arm64, durch Komma getrennt.",
      );

    const buildTag = `build-${new Date().toISOString().replace(/[-:.]/g, "")}`;
    const tags = [
      `${values.image}:${values.tag}`,
      `${values.image}:${buildTag}`,
    ];
    const build = [
      "buildx",
      "build",
      "--builder",
      builder,
      "--platform",
      platforms.join(","),
      "--file",
      "Dockerfile",
      ...tags.flatMap((tag) => ["--tag", tag]),
      "--label",
      "org.opencontainers.image.source=https://github.com/nwc-ch/gallery",
      "--push",
      ".",
    ];

    if (values["dry-run"]) {
      console.log("Vorschau: Es werden keine Docker-Befehle ausgeführt.");
      console.log(`Arbeitsverzeichnis: ${root}`);
      console.log(
        `Builder bei Bedarf anlegen: docker buildx create --name ${builder} --driver docker-container`,
      );
      console.log(`docker buildx inspect ${builder} --bootstrap`);
      console.log(
        `docker ${build.map((value) => JSON.stringify(value)).join(" ")}`,
      );
    } else {
      console.log("Baue Backend und Frontend aus dem aktuellen Arbeitsstand.");
      console.log(`Ziel: ${tags.join(", ")}`);
      requireSuccess(["version", "--format", "{{.Server.Version}}"]);
      requireSuccess(["buildx", "version"]);
      if (run(["buildx", "inspect", builder], true) !== 0) {
        requireSuccess([
          "buildx",
          "create",
          "--name",
          builder,
          "--driver",
          "docker-container",
        ]);
      }
      requireSuccess(["buildx", "inspect", builder, "--bootstrap"]);
      requireSuccess(build);
      console.log(`\nVeröffentlicht:\n${tags.join("\n")}`);
      console.log(
        `\nAuf dem Zielserver bei Bedarf GALLERY_IMAGE=${tags[1]} setzen und die Update-Befehle aus deploy/README.md ausführen.`,
      );
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
