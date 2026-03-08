/**
 * Remove o serviço do Windows.
 * Executar como Administrador: node scripts/uninstall-service.js
 * Ou: npm run uninstall-service (como Admin)
 */
if (process.platform !== "win32") {
  console.error("Este script é apenas para Windows.");
  process.exit(1);
}

let Service;
try {
  Service = require("node-windows").Service;
} catch (e) {
  console.error("Instale node-windows: npm install node-windows");
  process.exit(1);
}

const path = require("path");
const scriptPath = path.resolve(__dirname, "service-runner.js");
const projectRoot = path.resolve(__dirname, "..");

const svc = new Service({
  name: "WeightControl",
  description: "Controle de Peso - Servidor Next.js em produção",
  script: scriptPath,
  workingDirectory: projectRoot,
  env: [{ name: "WEIGHT_CONTROL_ROOT", value: projectRoot }],
});

svc.on("uninstall", () => {
  console.log("Serviço desinstalado.");
});

svc.on("error", (err) => {
  console.error("Erro:", err);
});

console.log("Desinstalando serviço...");
svc.uninstall();
