--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v17_version.sql
-- Contenedor: XEPDB1 y CDB$ROOT
-- Control  : ISO/IEC 27001:2022 A.8.8 (gestión de vulnerabilidades técnicas)
--
-- Informativo (sin prueba PR): versión del motor, componentes del diccionario
-- y parches aplicados, como base para la gestión de vulnerabilidades.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v17_version.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v17_version A.8.8(informativo)

PROMPT
PROMPT --- Versión del motor
COLUMN banner_full FORMAT A80
SELECT banner_full FROM v$version;

PROMPT
PROMPT --- Componentes del diccionario (dba_registry)
COLUMN comp_name FORMAT A40
COLUMN version   FORMAT A14
COLUMN status    FORMAT A10
SELECT comp_name, version, status FROM dba_registry ORDER BY comp_name;

PROMPT
PROMPT --- Parches de SQL aplicados (dba_registry_sqlpatch)
COLUMN action   FORMAT A10
COLUMN status   FORMAT A10
COLUMN description FORMAT A50
SELECT TO_CHAR(action_time, 'YYYY-MM-DD') AS fecha, action, status, description
FROM   dba_registry_sqlpatch
ORDER  BY action_time;

PROMPT
PROMPT (Script informativo para A.8.8; no genera resultado PR.)

SPOOL OFF
