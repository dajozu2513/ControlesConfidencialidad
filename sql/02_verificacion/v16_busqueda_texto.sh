#!/usr/bin/env bash
################################################################################
# Script   : sql/02_verificacion/v16_busqueda_texto.sh
# Prueba   : PR-26 (parte de texto plano en disco)
# Control  : ISO/IEC 27001:2022 A.8.24 (uso de criptografía)
#
# Busca un nombre real en el datafile de CLINICA_DATA (cifrado: se espera 0) y
# en el de TS_CONTROL_PLANO (sin cifrar: se espera > 0). Como Windows mantiene
# abiertos los datafiles, si no se pueden leer directamente se hace una copia
# imagen con RMAN (BACKUP AS COPY) fuera del repositorio, se busca en la copia
# y se borra. Al final elimina el tablespace de control.
#
# Debe ejecutarse DESPUÉS de v16_cifrado_tde.sql. Añade (APPEND) su resultado a
# evidencias/v16_cifrado_tde.txt.
################################################################################
set -uo pipefail
export MSYS_NO_PATHCONV=1 NLS_LANG=AMERICAN_AMERICA.AL32UTF8

EVID="evidencias/v16_cifrado_tde.txt"
NOMBRE_REAL="Solano Vargas"
cfg(){ sed -nE "s/^DEFINE[[:space:]]+$1[[:space:]]*=[[:space:]]*\"?([^\"]*)\"?[[:space:]]*\$/\1/p" sql/config_local.sql | tr -d '\r'; }
PDB=$(cfg pdb_nombre)
RUTA_RESP=$(cfg ruta_respaldos)
TMPDIRW="${RUTA_RESP}\\tmp_pr26"
TMPDIR_U=$(cygpath -u "$RUTA_RESP")/tmp_pr26
mkdir -p "$TMPDIR_U"

# Número y ruta de cada datafile en la PDB.
leer() {
  printf 'set head off pages 0 feedback off trimspool on\nalter session set container=%s;\n%s\nexit\n' "$PDB" "$1" \
    | sqlplus -S -L "/ as sysdba" | tr -d '\r' | sed '/^$/d' | tail -1
}
CLI_FILE=$(leer "select file# from dba_data_files where tablespace_name='CLINICA_DATA';")
CLI_PATH=$(leer "select file_name from dba_data_files where tablespace_name='CLINICA_DATA';")
CTL_FILE=$(leer "select file# from dba_data_files where tablespace_name='TS_CONTROL_PLANO';")
CTL_PATH=$(leer "select file_name from dba_data_files where tablespace_name='TS_CONTROL_PLANO';")

# Cuenta coincidencias en un datafile; si no se puede leer directamente (lock
# de Windows), copia el datafile con RMAN y busca en la copia.
contar() {
  local file_num="$1" win_path="$2" etiqueta="$3" token="$4"
  local unix_path copia_win copia_unix c rc
  unix_path=$(cygpath -u "$(echo "$win_path" | sed 's#\\\\#/#g; s#\\#/#g')")
  c=$(grep -a -c -- "$token" "$unix_path" 2>/dev/null); rc=$?
  if [ $rc -ge 2 ]; then
    # Lectura directa bloqueada: copia imagen con RMAN.
    copia_win="${TMPDIRW}\\${etiqueta}.dbf"
    copia_unix="${TMPDIR_U}/${etiqueta}.dbf"
    rm -f "$copia_unix"
    rman target / > /dev/null 2>&1 <<RMAN
BACKUP AS COPY DATAFILE $file_num FORMAT '$copia_win';
exit
RMAN
    c=$(grep -a -c -- "$token" "$copia_unix" 2>/dev/null); [ -z "$c" ] && c=0
    echo "$c (vía copia RMAN)"
    rm -f "$copia_unix"
  else
    [ -z "$c" ] && c=0
    echo "$c (lectura directa)"
  fi
}

{
  echo
  echo "--- PRUEBA DE TEXTO PLANO EN DISCO (PR-26)"
  echo "Nombre buscado        : $NOMBRE_REAL"
  echo "Datafile CLINICA_DATA : $CLI_PATH (archivo $CLI_FILE)"
  echo "Datafile control plano: $CTL_PATH (archivo $CTL_FILE)"
  echo

  CLI_RES=$(contar "$CLI_FILE" "$CLI_PATH" "clinica_data" "$NOMBRE_REAL")
  CTL_RES=$(contar "$CTL_FILE" "$CTL_PATH" "control_plano" "$NOMBRE_REAL")
  CLI_N=${CLI_RES%% *}
  CTL_N=${CTL_RES%% *}
  echo "Coincidencias en CLINICA_DATA (cifrado) : $CLI_RES"
  echo "Coincidencias en TS_CONTROL_PLANO (plano): $CTL_RES"
  echo

  if [ "$CLI_N" = "0" ] && [ "$CTL_N" -gt 0 ] 2>/dev/null; then
    echo "RESULTADO PR-26: CUMPLE (datos cifrados ilegibles en disco; control en claro legible)"
  else
    echo "RESULTADO PR-26: NO CUMPLE (CLINICA_DATA=$CLI_N, control=$CTL_N)"
  fi

  # Limpieza del tablespace de control.
  printf 'alter session set container=%s;\ndrop tablespace ts_control_plano including contents and datafiles;\nexit\n' "$PDB" \
    | sqlplus -S -L "/ as sysdba" > /dev/null 2>&1
  echo
  echo "--- LIMPIEZA: TS_CONTROL_PLANO eliminado"
} | tee -a "$EVID"

rmdir "$TMPDIR_U" 2>/dev/null || true
