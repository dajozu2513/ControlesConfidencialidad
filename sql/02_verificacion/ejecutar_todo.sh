#!/usr/bin/env bash
################################################################################
# Script   : sql/02_verificacion/ejecutar_todo.sh
# Fase PHVA: Verificar
#
# Ejecuta las 17 verificaciones (v01 a v17) en orden y, para las pruebas que
# dependen de RMAN o del sistema de archivos, calcula el resultado a partir de
# la salida y lo añade a la evidencia correspondiente.
#
# Ejecución (Git Bash, desde la raíz del repositorio):
#   bash sql/02_verificacion/ejecutar_todo.sh
################################################################################
set -uo pipefail
export MSYS_NO_PATHCONV=1 NLS_LANG=AMERICAN_AMERICA.AL32UTF8

cd "$(dirname "$0")/../.." || exit 1
cfg(){ sed -nE "s/^DEFINE[[:space:]]+$1[[:space:]]*=[[:space:]]*\"?([^\"]*)\"?[[:space:]]*\$/\1/p" sql/config_local.sql | tr -d '\r'; }
PDB=$(cfg pdb_nombre)

sqlf(){ printf '@sql/02_verificacion/%s\nexit\n' "$1" | sqlplus -S -L /nolog > /dev/null 2>&1; }
banner(){ echo "==================== $1"; }

# --- v01 a v09 (SQL) --------------------------------------------------------
for s in v01_clasificacion v02_control_acceso v03_identidades v04_perfil_contrasenas \
         v05_revision_derechos v06_proteccion_registros v07_acceso_privilegiado \
         v08_vpd v09_autenticacion_segura; do
  banner "$s"; sqlf "$s.sql"
done

# --- v10: PR-15 (SQL) + PR-16 (RMAN obsoletos) ------------------------------
banner "v10_eliminacion"; sqlf "v10_eliminacion.sql"
banner "v10_obsoletos (RMAN)"
rman target / cmdfile=sql/02_verificacion/v10_obsoletos.rman log=evidencias/v10_obsoletos.txt > /dev/null 2>&1
if grep -qi "no obsolete backups found" evidencias/v10_obsoletos.txt; then
  echo "RESULTADO PR-16: CUMPLE (no quedan respaldos obsoletos)" >> evidencias/v10_obsoletos.txt
else
  echo "RESULTADO PR-16: NO CUMPLE (persisten respaldos obsoletos)" >> evidencias/v10_obsoletos.txt
fi

# --- v11 (SQL) --------------------------------------------------------------
banner "v11_enmascaramiento"; sqlf "v11_enmascaramiento.sql"

# --- v12: PR-20 (SQL) + PR-21 (expdp) ---------------------------------------
banner "v12_fuga_datos"; sqlf "v12_fuga_datos.sql"
banner "v12_expdp (shell)"; bash sql/02_verificacion/v12_expdp.sh > /dev/null 2>&1

# --- v13: PR-22 cifrado (SQL) + restore validate (RMAN) ---------------------
banner "v13_respaldos"; sqlf "v13_respaldos.sql"
banner "v13_validar (RMAN)"
rman target / cmdfile=sql/02_verificacion/v13_validar.rman log=evidencias/v13_validar.txt > /dev/null 2>&1
if grep -q "Finished restore" evidencias/v13_validar.txt && ! grep -qE "RMAN-[0-9]" evidencias/v13_validar.txt; then
  echo "RESULTADO PR-22 (restore validate): CUMPLE" >> evidencias/v13_respaldos.txt
else
  echo "RESULTADO PR-22 (restore validate): NO CUMPLE" >> evidencias/v13_respaldos.txt
fi

# --- v14 (SQL) --------------------------------------------------------------
banner "v14_auditoria"; sqlf "v14_auditoria.sql"

# --- v15: líneas del sqlnet.ora (shell) + banners de red (SQL, APPEND) ------
banner "v15_red"
BASE_HOME=$(orabasehome.exe | tr -d '\r')
SQLNET="$(cygpath -u "$BASE_HOME")/network/admin/sqlnet.ora"
{
  echo "================================================================================"
  echo " VERIFICACIÓN - v15_red (PR-24, PR-25)"
  echo "================================================================================"
  echo "Fecha y hora: $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo
  echo "--- Parámetros de cifrado e integridad en el sqlnet.ora del servidor"
  tr -d '\r' < "$SQLNET" | grep -iE 'ENCRYPTION|CRYPTO_CHECKSUM|VALIDNODE|INVITED' | sed 's/^/  /'
} > evidencias/v15_red.txt
sqlf "v15_red.sql"

# --- v16: PR-26 vistas (SQL) + texto plano (shell) --------------------------
banner "v16_cifrado_tde"; sqlf "v16_cifrado_tde.sql"
banner "v16_busqueda_texto (shell)"; bash sql/02_verificacion/v16_busqueda_texto.sh > /dev/null 2>&1

# --- v17 (SQL, informativo) -------------------------------------------------
banner "v17_version"; sqlf "v17_version.sql"

echo
echo "==================== Resultados registrados"
grep -h "RESULTADO PR-" evidencias/v*.txt | sort -t- -k2 -n
