/**
 * Instala a aplicação como serviço do Windows.
 * Executar como Administrador: node scripts/install-service.js
 * Ou: npm run install-service (como Admin)
 */
const path = require("path");

if (process.platform !== "win32") {
  console.error("Serviço do Windows só pode ser instalado no Windows.");
  process.exit(1);
}

let Service;
try {
  Service = require("node-windows").Service;
} catch (e) {
  console.error(
    "Instale node-windows primeiro: npm install node-windows (ou npm install)"
  );
  process.exit(1);
}

const scriptPath = path.resolve(__dirname, "service-runner.js");
const projectRoot = path.resolve(__dirname, "..");

const svc = new Service({
  name: "WeightControl",
  description: "Controle de Peso - Servidor Next.js em produção",
  script: scriptPath,
  workingDirectory: projectRoot,
  env: [{ name: "WEIGHT_CONTROL_ROOT", value: projectRoot }],
});

svc.on("install", () => {
  console.log("Serviço instalado. Iniciando...");
  svc.start();
});

svc.on("start", () => {
  console.log("Serviço em execução. Acesse http://localhost:3000");
});

svc.on("alreadyinstalled", () => {
  console.log("Serviço já estava instalado.");
});

svc.on("invalidinstallation", (err) => {
  console.error("Instalação inválida:", err);
});

svc.on("error", (err) => {
  console.error("Erro:", err);
});

console.log("Instalando serviço (caminho do script: " + scriptPath + ")...");
svc.install();
