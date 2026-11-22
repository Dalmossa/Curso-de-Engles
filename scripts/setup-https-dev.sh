#!/usr/bin/env bash
set -euo pipefail

# Configura HTTPS local para desenvolvimento LAN do ITS Platform.
# - Gera certificados mkcert para localhost/127.0.0.1/::1/IP LAN
# - Atualiza .env locais (sem commitar segredos)
# - Não inicia/reinicia serviços automaticamente

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT/its-platform/frontend"
CERT_DIR="$FRONTEND/certs"
KEY_FILE="$CERT_DIR/dev.key"
CERT_FILE="$CERT_DIR/dev.crt"
BACKEND_ENV="$ROOT/its-platform/.env"
FRONTEND_ENV_LOCAL="$FRONTEND/.env.local"
FRONTEND_ENV_EXAMPLE="$FRONTEND/.env.example"
LAN_IP="${LAN_IP:-192.168.0.6}"
FORCE=0
SKIP_MKCERT_INSTALL=0

usage() {
  cat <<'EOF'
Uso: scripts/setup-https-dev.sh [opções]

Opções:
  --ip <ipv4>              IP LAN a incluir no certificado (default: 192.168.0.6 ou $LAN_IP)
  --force                  Regenera certificados mesmo se já existirem
  --skip-mkcert-install    Não executa 'mkcert -install' (usa CA já instalada)
  -h, --help               Mostra esta ajuda

Exemplos:
  scripts/setup-https-dev.sh
  LAN_IP=192.168.1.50 scripts/setup-https-dev.sh --force
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ip)
      LAN_IP="${2:-}"
      shift 2
      ;;
    --force)
      FORCE=1
      shift
      ;;
    --skip-mkcert-install)
      SKIP_MKCERT_INSTALL=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Opção desconhecida: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$LAN_IP" ]]; then
  echo "Erro: IP LAN vazio." >&2
  exit 1
fi

log() { printf '\n==> %s\n' "$*"; }
warn() { printf 'AVISO: %s\n' "$*" >&2; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Erro: comando obrigatório não encontrado: $1" >&2
    return 1
  fi
}

require_cmd python3

if ! command -v mkcert >/dev/null 2>&1; then
  cat >&2 <<'EOF'
Erro: mkcert não encontrado.
Instale o mkcert e a CA local antes de continuar.

Ubuntu/Debian:
  sudo apt install libnss3-tools mkcert
  mkcert -install

Alternativa: instalar binário oficial do mkcert e executar 'mkcert -install'.
Fallback manual (não recomendado, navegador exibirá aviso): gerar cert autoassinado com openssl.
EOF
  exit 1
fi

log "Instalando CA local do mkcert"
if [[ "$SKIP_MKCERT_INSTALL" -eq 1 ]]; then
  echo "Pulando 'mkcert -install' (--skip-mkcert-install)."
else
  mkcert -install
fi

log "Gerando certificados HTTPS de desenvolvimento"
mkdir -p "$CERT_DIR"
if [[ "$FORCE" -eq 0 && -f "$KEY_FILE" && -f "$CERT_FILE" ]]; then
  echo "Certificados já existem: $CERT_FILE"
  echo "Use --force para regenerar."
else
  mkcert \
    -key-file "$KEY_FILE" \
    -cert-file "$CERT_FILE" \
    localhost 127.0.0.1 ::1 "$LAN_IP"
  echo "Certificado gerado: $CERT_FILE"
  echo "Chave gerada: $KEY_FILE"
fi

log "Atualizando variáveis de ambiente locais (sem commitar)"
python3 - "$BACKEND_ENV" "$FRONTEND_ENV_LOCAL" "$FRONTEND_ENV_EXAMPLE" "$LAN_IP" <<'PY'
import os
import sys

backend_env, frontend_env_local, frontend_env_example, lan_ip = sys.argv[1:5]

def read_env(path):
    if not os.path.exists(path):
        return [], {}
    with open(path, "r", encoding="utf-8") as f:
        lines = f.read().splitlines()
    data = {}
    for i, line in enumerate(lines):
        if not line or line.lstrip().startswith("#") or "=" not in line:
            continue
        key, _ = line.split("=", 1)
        key = key.strip()
        if key and key not in data:
            data[key] = i
    return lines, data

def upsert(path, updates, create_if_missing=False, template_path=None):
    lines, data = read_env(path)
    if not os.path.exists(path):
        if not create_if_missing:
            return False, []
        if template_path and os.path.exists(template_path):
            with open(template_path, "r", encoding="utf-8") as f:
                lines = f.read().splitlines()
            _, data = read_env(path)
        else:
            lines = []
            data = {}
    changed = []
    for key, value in updates.items():
        new_line = f"{key}={value}"
        if key in data:
            if lines[data[key]] != new_line:
                lines[data[key]] = new_line
                changed.append(key)
        else:
            if lines and lines[-1] != "":
                lines.append("")
            lines.append(new_line)
            data[key] = len(lines) - 1
            changed.append(key)
    if changed or not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines).rstrip() + "\n")
    return True, changed

cors = (
    "http://localhost:3100,http://192.168.0.6:3100,"
    f"https://localhost:3100,https://{lan_ip}:3100"
)
# de-dup preserving order
seen = set()
cors_parts = []
for part in cors.split(","):
    p = part.strip()
    if p and p not in seen:
        seen.add(p)
        cors_parts.append(p)
cors = ",".join(cors_parts)

backend_updates = {
    "CORS_ORIGIN": cors,
    "AUDIO_BASE_URL": f"http://{lan_ip}:3200",
}
frontend_updates = {
    "NEXT_PUBLIC_APP_URL": f"https://{lan_ip}:3100",
    "NEXT_PUBLIC_AUDIO_BASE_URL": "/media",
    "ITS_API_BASE_URL": "http://localhost:3000/api/v1",
}

ok, changed = upsert(backend_env, backend_updates, create_if_missing=False)
if ok:
    if changed:
        print(f"Atualizado {backend_env}: {', '.join(changed)}")
    else:
        print(f"Sem mudanças em {backend_env} (chaves já estavam corretas ou arquivo ausente).")
else:
    print(f"Ignorado {backend_env}: arquivo não existe. Crie a partir de its-platform/.env.example se necessário.")

ok, changed = upsert(frontend_env_local, frontend_updates, create_if_missing=True, template_path=frontend_env_example)
if changed:
    print(f"Atualizado {frontend_env_local}: {', '.join(changed)}")
else:
    print(f"Sem mudanças em {frontend_env_local}.")
PY

log "Verificação"
echo "Certificado: $CERT_FILE"
echo "Chave:       $KEY_FILE"
echo "CA mkcert:   $(mkcert -CAROOT)"

cat <<EOF

Concluído.

Próximos passos:
1. Reinicie backend/frontend para carregar as variáveis de ambiente.
2. Suba o frontend HTTPS:
     npm --prefix its-platform/frontend run dev:https
3. Acesse:
     https://localhost:3100
     https://${LAN_IP}:3100
4. Confirme que o áudio :3200 está ativo (o proxy /media encaminha para AUDIO_BASE_URL).

Pendências manuais:
- O navegador/OS precisa confiar na CA local do mkcert (mkcert -install faz isso nesta máquina).
- Dispositivos móveis na LAN precisam confiar na CA: copie/instale a CA de '$(mkcert -CAROOT)' no dispositivo.
- Se usar IP LAN diferente de ${LAN_IP}, execute com --ip <ip> e regenere com --force.
- Não commite .env, .env.local, certs/chaves privadas.
EOF
