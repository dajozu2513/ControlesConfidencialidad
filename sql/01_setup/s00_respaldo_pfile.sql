--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s00_respaldo_pfile.sql
-- Contenedor: CDB$ROOT
-- Fase PHVA: Hacer (paso 0, antes de cualquier cambio de configuración)
--
-- Propósito:
--   Generar una copia de texto (PFILE) de los parámetros de inicialización
--   almacenados en el SPFILE, en un directorio fuera del repositorio. Permite
--   volver a la configuración original si un cambio posterior (WALLET_ROOT,
--   TDE_CONFIGURATION) impide arrancar la instancia.
--
-- Ejecución (desde la raíz del repositorio):
--   sqlplus / as sysdba @sql/01_setup/s00_respaldo_pfile.sql
--   Re-ejecutable: cada ejecución crea un archivo nuevo con fecha y hora, de
--   modo que nunca se sobrescribe el respaldo original.
--------------------------------------------------------------------------------

SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK ON
SET SERVEROUTPUT ON SIZE UNLIMITED
SET PAGESIZE 200
SET LINESIZE 200
SET TRIMSPOOL ON
SET TRIMOUT ON
SET TAB OFF
WHENEVER SQLERROR EXIT FAILURE ROLLBACK

SPOOL evidencias/setup_s00_respaldo_pfile.txt

ALTER SESSION SET CONTAINER = CDB$ROOT;
@sql/01_setup/comun/encabezado.sql s00_respaldo_pfile

--------------------------------------------------------------------------------
-- 1. Directorio de respaldo
--    Se crea fuera del repositorio, bajo ORACLE_BASE, donde la cuenta del
--    servicio de Oracle tiene permiso de escritura.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. DIRECTORIO DE RESPALDO
HOST if not exist "&ruta_respaldos\pfile" mkdir "&ruta_respaldos\pfile"
PROMPT Directorio: &ruta_respaldos\pfile

--------------------------------------------------------------------------------
-- 2. CREATE PFILE FROM SPFILE
--    El nombre incluye fecha y hora para conservar todas las versiones.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. RESPALDO DEL SPFILE COMO PFILE
DECLARE
  v_archivo VARCHAR2(400) :=
    '&ruta_respaldos\pfile\initXE_' || TO_CHAR(SYSDATE, 'YYYYMMDD_HH24MISS') || '.ora';
BEGIN
  EXECUTE IMMEDIATE 'CREATE PFILE = ''' || v_archivo || ''' FROM SPFILE';
  DBMS_OUTPUT.PUT_LINE('PFILE generado: ' || v_archivo);
END;
/

COLUMN name  FORMAT A20
COLUMN value FORMAT A70

PROMPT
PROMPT SPFILE de origen:
SELECT name, value FROM v$parameter WHERE name = 'spfile';

SPOOL OFF
