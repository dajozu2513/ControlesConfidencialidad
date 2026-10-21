#!/usr/bin/env bash
################################################################################
# Script   : sql/01_setup/s08_red.sh
# Fase PHVA: Hacer
# Controles: ISO/IEC 27001:2022 A.8.20 (seguridad de redes), A.8.24 (uso de
#            criptografía)
#
# Propósito:
#   Endurecer la configuración de red de Oracle Net en el sqlnet.ora del
#   servidor (ver sql/01_setup/s08_red.md):
#     - Cifrado nativo obligatorio con AES256.
#     - Integridad (crypto-checksum) obligatoria con SHA256.
#     - Lista de nodos invitados: solo el propio equipo puede conectarse.
#   El cambio en TCP.* lo aplica el listener al reiniciarse; el cifrado y la
#   integridad se aplican a cada conexión nueva.
#
# Ejecución (Git Bash, desde la raíz del repositorio):
#   bash sql/01_setup/s08_red.sh <hostname> <ipv4_local>
#   El reinicio del listener (lsnrctl stop / start) se hace aparte, después
#   de revisar la evidencia.
#   Re-ejecutable: cada parámetro se reemplaza si ya existe o se agrega si no.
#   La evidencia se escribe en evidencias/setup_s08_red.txt.
################################################################################
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Uso: bash sql/01_setup/s08_red.sh <hostname> <ipv4_local>" >&2
  exit 1
fi
HOST_EQUIPO="$1"
IP_EQUIPO="$2"
EVIDENCIA="evidencias/setup_s08_red.txt"

# 1. Ubicar el sqlnet.ora del servidor y el directorio de respaldos.
BASE_HOME=$(orabasehome.exe | tr -d '\r')
SQLNET="$(cygpath -u "$BASE_HOME")/network/admin/sqlnet.ora"
RUTA_RESPALDOS=$(sed -nE 's/^DEFINE[[:space:]]+ruta_respaldos[[:space:]]*=[[:space:]]*(.+)$/\1/p' sql/config_local.sql | tr -d '\r')
DIR_RESPALDO="$(cygpath -u "$RUTA_RESPALDOS")/sqlnet"
RESPALDO="$DIR_RESPALDO/sqlnet.ora.$(date +%Y%m%d_%H%M%S)"

# Fija "PARAMETRO = valor": reemplaza la línea si existe o la agrega al final
# (con fin de línea CRLF, como el archivo original).
fijar_parametro() {
  local nombre="$1" valor="$2" patron
  patron="^[[:space:]]*${nombre//./\\.}[[:space:]]*="
  if grep -qiE "$patron" "$SQLNET"; then
    sed -i -E "s/${patron}.*\$/${nombre} = ${valor}\r/I" "$SQLNET"
    echo "Reemplazado: ${nombre} = ${valor}"
  else
    printf '%s = %s\r\n' "$nombre" "$valor" >> "$SQLNET"
    echo "Agregado   : ${nombre} = ${valor}"
  fi
}

{
  echo "================================================================================"
  echo " EVIDENCIA DE CONFIGURACIÓN - s08_red"
  echo " Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c"
  echo "================================================================================"
  echo "Fecha y hora      : $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "Equipo / usuario  : $(hostname) / $(whoami)"
  echo "sqlnet.ora        : $(cygpath -w "$SQLNET")"
  echo "Nodos invitados   : 127.0.0.1, localhost, ::1, ${HOST_EQUIPO}, ${IP_EQUIPO}"
  echo

  # 2. Respaldo del archivo actual antes de cualquier cambio.
  mkdir -p "$DIR_RESPALDO"
  cp -p "$SQLNET" "$RESPALDO"
  echo "--- 1. RESPALDO"
  echo "Copia creada en   : $(cygpath -w "$RESPALDO")"
  echo

  # 3. Parámetros de cifrado, integridad y nodos invitados.
  echo "--- 2. PARÁMETROS"
  if ! grep -q 'A.8.20' "$SQLNET"; then
    printf '\r\n# ISO 27001 A.8.20 / A.8.24: cifrado e integridad obligatorios, nodos invitados\r\n' >> "$SQLNET"
  fi
  fijar_parametro "SQLNET.ENCRYPTION_SERVER"           "REQUIRED"
  fijar_parametro "SQLNET.ENCRYPTION_TYPES_SERVER"     "(AES256)"
  fijar_parametro "SQLNET.CRYPTO_CHECKSUM_SERVER"      "REQUIRED"
  fijar_parametro "SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER" "(SHA256)"
  fijar_parametro "TCP.VALIDNODE_CHECKING"             "YES"
  fijar_parametro "TCP.INVITED_NODES"                  "(127.0.0.1, localhost, ::1, ${HOST_EQUIPO}, ${IP_EQUIPO})"
  echo

  # 4. Diferencias y contenido final.
  echo "--- 3. DIFERENCIAS (respaldo -> vigente)"
  diff <(tr -d '\r' < "$RESPALDO") <(tr -d '\r' < "$SQLNET") || true
  echo
  echo "--- 4. CONTENIDO VIGENTE"
  tr -d '\r' < "$SQLNET"
} | tee "$EVIDENCIA"
