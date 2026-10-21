#!/usr/bin/env bash
################################################################################
# Script   : sql/02_verificacion/v12_expdp.sh
# Prueba   : PR-21 (exportación de datos cifrada)
# Control  : ISO/IEC 27001:2022 A.8.12 (prevención de fuga), A.8.10 (borrado)
#
# Exporta el esquema CLINICA con Data Pump cifrado (ENCRYPTION=ALL,
# ENCRYPTION_MODE=TRANSPARENT) y comprueba con grep que un nombre real NO
# aparece en el .dmp. Si el cifrado de Data Pump no está disponible en XE, se
# documenta el error, se exporta sin cifrar y se demuestra la fuga (el nombre
# SÍ aparece). En ambos casos el .dmp y su log se borran al final (A.8.10).
#
# Ejecución: bash sql/02_verificacion/v12_expdp.sh
# La contraseña se lee de config_local.sql y no se imprime ni se guarda.
################################################################################
set -uo pipefail
export MSYS_NO_PATHCONV=1 NLS_LANG=AMERICAN_AMERICA.AL32UTF8

EVID="evidencias/v12_expdp.txt"
NOMBRE_REAL="Solano Vargas"     # apellido del paciente 1 de CLINICA
cfg(){ sed -nE "s/^DEFINE[[:space:]]+$1[[:space:]]*=[[:space:]]*\"?([^\"]*)\"?[[:space:]]*\$/\1/p" sql/config_local.sql | tr -d '\r'; }
PDB=$(cfg pdb_nombre)
PWD_DBA=$(cfg pwd_dba_oper)

# Ruta física de DATA_PUMP_DIR (específica de la PDB).
DPDIR_WIN=$(printf 'set head off pages 0 feedback off trimspool on\nalter session set container=%s;\nselect directory_path from dba_directories where directory_name='\''DATA_PUMP_DIR'\'';\nexit\n' "$PDB" \
  | sqlplus -S -L "/ as sysdba" | tr -d '\r' | sed '/^$/d' | tail -1)
DPDIR=$(cygpath -u "$(echo "$DPDIR_WIN" | sed 's#\\\\#/#g; s#\\#/#g')")

STAMP=$(date +%Y%m%d_%H%M%S)
DMP="expfuga_${STAMP}.dmp"
LOGF="expfuga_${STAMP}.log"

{
  echo "================================================================================"
  echo " VERIFICACIÓN - v12_expdp (PR-21)"
  echo " Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c"
  echo "================================================================================"
  echo "Fecha y hora   : $(date '+%Y-%m-%d %H:%M:%S %z')"
  echo "DATA_PUMP_DIR  : $DPDIR_WIN"
  echo "Esquema        : CLINICA   Dumpfile: $DMP"
  echo

  # 1. Exportación cifrada (modo transparente: usa el keystore TDE).
  echo "--- 1. EXPORTACIÓN CIFRADA (ENCRYPTION=ALL, ENCRYPTION_MODE=TRANSPARENT)"
  # La salida de expdp no contiene la contraseña, por lo que se muestra tal cual.
  CIFRADO="SI"
  expdp "DBA_OPER/${PWD_DBA}@//localhost:1521/${PDB}" \
        schemas=CLINICA directory=DATA_PUMP_DIR dumpfile="$DMP" logfile="$LOGF" \
        encryption=all encryption_mode=transparent reuse_dumpfiles=yes \
        > "$DPDIR/expdp_out.tmp" 2>&1
  RC=$?
  grep -iE 'Export:|ORA-|UDE-|LRM-|completed|elapsed' "$DPDIR/expdp_out.tmp" | sed 's/^/  /'
  rm -f "$DPDIR/expdp_out.tmp"

  if [ $RC -ne 0 ] || [ ! -f "$DPDIR/$DMP" ]; then
    echo
    echo "  El cifrado de Data Pump no se completó (código $RC). Se documenta como"
    echo "  desviación y se repite la exportación SIN cifrado para evidenciar la fuga."
    CIFRADO="NO"
    expdp "DBA_OPER/${PWD_DBA}@//localhost:1521/${PDB}" \
          schemas=CLINICA directory=DATA_PUMP_DIR dumpfile="$DMP" logfile="$LOGF" \
          reuse_dumpfiles=yes > "$DPDIR/expdp_out.tmp" 2>&1
    grep -iE 'Export:|ORA-|UDE-|completed|elapsed' "$DPDIR/expdp_out.tmp" | sed 's/^/  /'
    rm -f "$DPDIR/expdp_out.tmp"
  fi
  echo

  # 2. Búsqueda del nombre real dentro del .dmp.
  echo "--- 2. BÚSQUEDA DE UN NOMBRE REAL EN EL DUMP (grep -a -c \"$NOMBRE_REAL\")"
  if [ -f "$DPDIR/$DMP" ]; then
    COINC=$(grep -a -c -- "$NOMBRE_REAL" "$DPDIR/$DMP" 2>/dev/null); [ -z "$COINC" ] && COINC=0
  else
    COINC="(sin dump)"
  fi
  echo "  Coincidencias: $COINC"
  echo

  # 3. Registro de la exportación en la auditoría unificada.
  echo "--- 3. AUDITORÍA DE LA EXPORTACIÓN (audit_type Datapump)"
  printf 'set head on pages 50 lines 160 feedback off\nalter session set container=%s;\nexec dbms_audit_mgmt.flush_unified_audit_trail;\ncol action_name for a16\ncol dbusername for a12\ncol cuando for a20\nselect dbusername, action_name, to_char(event_timestamp,'\''YYYY-MM-DD HH24:MI:SS'\'') cuando from unified_audit_trail where audit_type='\''Datapump'\'' and event_timestamp>=trunc(systimestamp) order by event_timestamp;\nexit\n' "$PDB" \
    | sqlplus -S -L "/ as sysdba" | tr -d '\r' | grep -vE '^\s*$' | sed 's/^/  /'
  echo

  # 4. Veredicto.
  echo "--- 4. RESULTADO"
  if [ "$CIFRADO" = "SI" ] && [ "$COINC" = "0" ]; then
    echo "RESULTADO PR-21: CUMPLE (export cifrado; el nombre real no aparece)"
  elif [ "$CIFRADO" = "NO" ]; then
    echo "RESULTADO PR-21: NO CUMPLE (cifrado de Data Pump no disponible en XE; el export"
    echo "  sin cifrar expone el nombre real: $COINC coincidencias). Hallazgo de fuga."
  else
    echo "RESULTADO PR-21: NO CUMPLE (export cifrado pero se hallaron $COINC coincidencias)"
  fi

  # 5. Borrado seguro del dump y su log (A.8.10).
  rm -f "$DPDIR/$DMP" "$DPDIR/$LOGF"
  echo
  echo "--- 5. LIMPIEZA: dump y log eliminados de DATA_PUMP_DIR"
} | tee "$EVID"
