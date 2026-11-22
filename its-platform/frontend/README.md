# ITS Platform Frontend

Next.js App Router UI para o ITS Platform.

## Desenvolvimento

```bash
npm --prefix its-platform/frontend install
npm --prefix its-platform/frontend run dev
```

App: http://localhost:3100

## HTTPS local (microfone em LAN)

`getUserMedia`/microfone exige contexto seguro: `https://` ou `http://localhost`.  
Para acessar por LAN (ex.: `https://192.168.0.6:3100`), use HTTPS local.

### 1) Gerar certificado confiável com mkcert

Instale mkcert (Ubuntu/Debian):

```bash
sudo apt install libnss3-tools mkcert
# ou instale o binário oficial do mkcert e depois:
mkcert -install
```

Gere cert para localhost e IP LAN:

```bash
mkdir -p its-platform/frontend/certs
mkcert -key-file its-platform/frontend/certs/dev.key \
       -cert-file its-platform/frontend/certs/dev.crt \
       localhost 127.0.0.1 ::1 192.168.0.6
```

> Não commite `dev.key`/`dev.crt`. `its-platform/frontend/certs/` está ignorado pelo git.

Fallback sem mkcert: `openssl` pode gerar cert autoassinado, mas o navegador exibirá aviso até confiar manualmente no certificado/CA.

### 2) Subir frontend em HTTPS

```bash
npm --prefix its-platform/frontend run dev:https
```

Acesse:
- https://localhost:3100
- https://192.168.0.6:3100

O script usa `--experimental-https` do Next, escutando em `0.0.0.0:3100`.

### 3) Ajustes locais de env (não commitar)

`its-platform/.env`:
```env
CORS_ORIGIN=http://localhost:3100,http://192.168.0.6:3100,https://localhost:3100,https://192.168.0.6:3100
AUDIO_BASE_URL=http://192.168.0.6:3200
```

`its-platform/frontend/.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://192.168.0.6:3100
NEXT_PUBLIC_AUDIO_BASE_URL=/media
ITS_API_BASE_URL=http://localhost:3000/api/v1
```

Reinicie frontend/backend após mudar env.

### 4) Áudio e mixed content

Em página HTTPS, mídia HTTP é bloqueada. A solução padrão é o proxy same-origin `/media/*` do frontend:

- Browser chama `https://<host>:3100/media/catalog/render/...`
- Route handler Next (`src/app/media/[...path]/route.ts`) faz proxy server-side para `AUDIO_BASE_URL` (ex.: `http://192.168.0.6:3200`)
- Caminhos permitidos são restritos a `catalog/render/<clip>/<file>` (sem open proxy)

Para dev HTTP antigo, `NEXT_PUBLIC_AUDIO_BASE_URL=http://192.168.0.6:3200` ainda funciona.

### 5) Dispositivos móveis na LAN

Dispositivos móveis precisam confiar na CA local do mkcert. No computador onde gerou os certs:

```bash
mkcert -CAROOT
```

Instale/confie essa CA no dispositivo móvel e acesse `https://192.168.0.6:3100`.

## Gates

```bash
npm --prefix its-platform/frontend run typecheck
npm --prefix its-platform/frontend run lint
npm --prefix its-platform/frontend test
CI=1 npm --prefix its-platform/frontend run build
```
