/**
 * Processo usado pelo serviço do Windows: inicia o servidor Next.js
 * e mantém o processo vivo. Não abre navegador.
 * Logs são gravados em logs/service.log (pasta do projeto).
 *
 * O diretório do projeto vem de WEIGHT_CONTROL_ROOT (definido na instalação do serviço).
 * Se não existir, usa o diretório acima deste script (funciona quando rodando fora do serviço).
 */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let projectRoot = process.env.WEIGHT_CONTROL_ROOT;
if (!projectRoot) {
  try {
    projectRoot = path.resolve(path.dirname(require.resolve("../package.json")));
  } catch {
    projectRoot = path.resolve(__dirname, "..");
  }
}
process.chdir(projectRoot);

const logDir = path.join(projectRoot, "logs");
const logFile = path.join(logDir, "service.log");

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFile, line);
  } catch (_) {}
}

log("Iniciando servidor em: " + projectRoot);

const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "start"], {
  cwd: projectRoot,
  env: { ...process.env, FORCE_COLOR: "0" },
  stdio: ["ignore", "pipe", "pipe"],
});

child.stdout.on("data", (data) => {
  const s = data.toString().trim();
  if (s) log(s);
});
child.stderr.on("data", (data) => {
  const s = data.toString().trim();
  if (s) log(s);
});

child.on("error", (err) => {
  log("Erro: " + err.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  log("Servidor encerrado. code=" + code + " signal=" + signal);
  process.exit(code != null ? code : 1);
});
