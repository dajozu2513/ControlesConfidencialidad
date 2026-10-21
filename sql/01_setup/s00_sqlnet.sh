#!/usr/bin/env bash
################################################################################
# Script   : sql/01_setup/s00_sqlnet.sh
# Fase PHVA: Hacer (paso 0, antes de crear usuarios)
#
# Propósito:
#   Respaldar el sqlnet.ora del servidor y fijar
#   SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a, para que las contraseñas de los
#   usuarios creados después solo generen verificadores 12C (SHA-2 con PBKDF2)
#   y se rechacen clientes que solo soportan verificadores antiguos (10G/11G).
#
#   En Oracle 21c el Oracle home es de solo lectura: la configuración de red
#   vive en <ORACLE_BASE_HOME>/network/admin, ruta que devuelve orabasehome.
#
# Ejecución (Git Bash, desde la raíz del repositorio):
#   bash sql/01_setup/s00_sqlnet.sh
#   Re-ejecutable: si el parámetro ya tiene el valor 12a no modifica el archivo.
#   La evidencia se escribe en evidencias/setup_s00_sqlnet.txt.
################################################################################
set -euo pipefail

EVIDENCIA="evidencias/setup_s00_sqlnet.txt"

# 1. Ubicar el sqlnet.ora del servidor y el directorio de respaldos
#    (la ruta de respaldos se toma de sql/config_local.sql, que no se versiona).
BASE_HOME=$(orabasehome.exe | tr -d '\r')
SQLNET="$(cygpath -u "$BASE_HOME")/network/admin/sqlnet.ora"
RUTA_RESPALDOS=$(sed -nE 's/^DEFINE[[:space:]]+ruta_respaldos[[:space:]]*=[[:space:]]*(.+)$/\1/p' sql/config_local.sql | tr -d '\r')
DIR_RESPALDO="$(cygpath -u "$RUTA_RESPALDOS")/sqlnet"
RESPALDO="$DIR_RESPALDO/sqlnet.ora.$(date +%Y%m%d_%H%M%S)"

{
  echo "================================================================================"
  echo " EVIDENCIA DE CONFIGURACIÓN - s00_sqlnet"
  echo " Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c"
  echo "================================================================================"
  echo "Fecha y hora      : $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "Equipo / usuario  : $(hostname) / $(whoami)"
  echo "ORACLE_BASE_HOME  : $BASE_HOME"
  echo "sqlnet.ora        : $(cygpath -w "$SQLNET")"
  echo

  # 2. Respaldo del archivo actual antes de cualquier cambio.
  mkdir -p "$DIR_RESPALDO"
  cp -p "$SQLNET" "$RESPALDO"
  echo "--- 1. RESPALDO ----------------------------------------------------------------"
  echo "Copia creada en   : $(cygpath -w "$RESPALDO")"
  echo

  # 3. Agregar o corregir el parámetro, respetando los finales de línea CRLF
  #    del archivo original.
  echo "--- 2. SQLNET.ALLOWED_LOGON_VERSION_SERVER ---------------------------------------"
  if grep -qiE '^[[:space:]]*SQLNET\.ALLOWED_LOGON_VERSION_SERVER[[:space:]]*=[[:space:]]*12a[[:space:]]*$' <(tr -d '\r' < "$SQLNET"); then
    echo "El parámetro ya tiene el valor 12a; no se modifica el archivo."
  elif grep -qiE '^[[:space:]]*SQLNET\.ALLOWED_LOGON_VERSION_SERVER' "$SQLNET"; then
    sed -i -E 's/^[[:space:]]*SQLNET\.ALLOWED_LOGON_VERSION_SERVER[[:space:]]*=.*$/SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a\r/I' "$SQLNET"
    echo "Valor existente reemplazado por 12a."
  else
    printf '\r\n# ISO 27001 A.8.5 / A.8.24: solo verificadores de contraseña 12C\r\nSQLNET.ALLOWED_LOGON_VERSION_SERVER=12a\r\n' >> "$SQLNET"
    echo "Parámetro agregado al final del archivo."
  fi
  echo

  # 4. Diferencias entre el respaldo y el archivo vigente, y contenido final.
  echo "--- 3. DIFERENCIAS (respaldo -> vigente) ----------------------------------------"
  diff <(tr -d '\r' < "$RESPALDO") <(tr -d '\r' < "$SQLNET") || true
  echo
  echo "--- 4. CONTENIDO VIGENTE ---------------------------------------------------------"
  tr -d '\r' < "$SQLNET"
} | tee "$EVIDENCIA"
