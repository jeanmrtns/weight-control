/**
 * Launcher para Windows: inicia o servidor Next.js em produção,
 * aguarda ficar pronto e abre o navegador padrão.
 * Uso: node scripts/launcher.js
 */
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const URL = `http://localhost:${PORT}`;

function waitForServer(maxAttempts = 60, intervalMs = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const tryConnect = () => {
      attempts++;
      const req = http.get(URL, (res) => {
        req.destroy();
        resolve();
      });
      req.on("error", () => {
        req.destroy();
        if (attempts >= maxAttempts) {
          reject(new Error("Servidor não respondeu a tempo."));
          return;
        }
        setTimeout(tryConnect, intervalMs);
      });
    };
    tryConnect();
  });
}

function openBrowser(url) {
  const start =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  const args = process.platform === "win32" ? [url] : [url];
  require("child_process").spawn(start, args, { shell: true, stdio: "ignore" });
}

function main() {
  const projectRoot = path.resolve(__dirname, "..");
  process.chdir(projectRoot);

  const isWindows = process.platform === "win32";
  const npmCmd = isWindows ? "npm.cmd" : "npm";
  const child = spawn(npmCmd, ["start"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: isWindows,
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  let browserOpened = false;
  child.on("error", (err) => {
    console.error("Erro ao iniciar o servidor:", err.message);
    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code != null ? code : 1);
  });

  waitForServer()
    .then(() => {
      if (!browserOpened) {
        browserOpened = true;
        openBrowser(URL);
      }
    })
    .catch((err) => {
      console.error(err.message);
    });
}

main();
