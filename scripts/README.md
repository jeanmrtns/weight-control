# Launcher (produção on-premise no Windows)

## Opção 1: Rodar como serviço do Windows (recomendado)

O servidor fica rodando em segundo plano, sem janela de terminal.

### Instalar o serviço (uma vez)

1. Compile a aplicação: `npm run build`
2. Abra o **Prompt de Comando ou PowerShell como Administrador** (botão direito → "Executar como administrador").
3. Vá até a pasta do projeto e execute:
   ```bat
   cd C:\caminho\do\weight-control
   npm run install-service
   ```
4. O serviço **WeightControl** será instalado e iniciado. Acesse http://localhost:3000

### Gerenciar o serviço

- **Parar/Iniciar**: Win+R → `services.msc` → procure "WeightControl" → botão direito → Parar/Iniciar.
- **Remover o serviço**: Como Administrador, na pasta do projeto: `npm run uninstall-service`

### Logs

Quando rodando como serviço, as saídas ficam em **`logs/service.log`** na pasta do projeto.

---

## Opção 2: Iniciar com terminal (abre o navegador)

1. **Duplo clique** em `start-server.bat` (na raiz do projeto).
2. O script irá:
   - Instalar dependências se faltar `node_modules`
   - Compilar a aplicação (`npm run build`)
   - Iniciar o servidor em modo produção
   - Abrir o navegador padrão em http://localhost:3000 quando o servidor estiver pronto
3. Para encerrar, feche a janela do terminal ou pressione `Ctrl+C`.

## Executável / atalho

- Você pode **fixar** o `start-server.bat` na barra de tarefas ou criar um atalho na área de trabalho (botão direito no arquivo → Enviar para → Área de trabalho (criar atalho)).
- Para usar como “executável”: mantenha a pasta do projeto no mesmo lugar; o atalho deve apontar para o `.bat` dentro dessa pasta.

## Requisitos

- **Node.js** instalado e no PATH.
- **PostgreSQL** configurado (variáveis em `.env`).
- Porta **3000** livre (ou defina `PORT` no ambiente).
- **Serviço**: a dependência opcional `node-windows` é instalada com `npm install`.

## Executar manualmente

```bat
cd C:\caminho\do\weight-control
npm run build
node scripts/launcher.js
```

Ou só subir o servidor (sem abrir o navegador):

```bat
npm run build
npm start
```
