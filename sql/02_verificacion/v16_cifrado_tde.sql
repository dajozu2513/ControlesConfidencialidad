--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v16_cifrado_tde.sql
-- Contenedor: XEPDB1
-- Prueba   : PR-26 (cifrado en reposo efectivo) y A.8.24
-- Control  : ISO/IEC 27001:2022 A.8.24 (uso de criptografía)
--
-- Parte de vistas de PR-26: el keystore está abierto, CLINICA_DATA figura en
-- v$encrypted_tablespaces con AES256 y dba_tablespaces lo marca cifrado.
-- Además prepara la prueba de texto plano: crea un tablespace de control SIN
-- cifrar (TS_CONTROL_PLANO) con una tabla que contiene un nombre real y hace
-- CHECKPOINT. La búsqueda en los datafiles y el borrado del tablespace de
-- control los realiza v16_busqueda_texto.sh.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v16_cifrado_tde.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v16_cifrado_tde PR-26

PROMPT
PROMPT --- Estado del keystore en XEPDB1
COLUMN status      FORMAT A12
COLUMN wallet_type FORMAT A12
SELECT con_id, status, wallet_type FROM v$encryption_wallet;

PROMPT
PROMPT --- Tablespaces cifrados (v$encrypted_tablespaces)
COLUMN nombre FORMAT A16
COLUMN encryptionalg FORMAT A12
COLUMN status FORMAT A10
SELECT t.name AS nombre, e.encryptionalg, e.status
FROM   v$encrypted_tablespaces e JOIN v$tablespace t ON t.ts# = e.ts#;

PROMPT
PROMPT --- Marca de cifrado en dba_tablespaces
COLUMN tablespace_name FORMAT A16
COLUMN encrypted FORMAT A9
SELECT tablespace_name, encrypted FROM dba_tablespaces ORDER BY tablespace_name;

PROMPT
COLUMN resultado FORMAT A70
SELECT CASE WHEN enc.algoritmo = 'AES256' AND dt.encrypted = 'YES'
            THEN 'RESULTADO PR-26 (vistas): CUMPLE (CLINICA_DATA cifrado ' || enc.algoritmo || ')'
            ELSE 'RESULTADO PR-26 (vistas): NO CUMPLE'
       END AS resultado
FROM   (SELECT MAX(e.encryptionalg) AS algoritmo
        FROM   v$encrypted_tablespaces e JOIN v$tablespace t ON t.ts# = e.ts#
        WHERE  t.name = 'CLINICA_DATA') enc,
       (SELECT encrypted FROM dba_tablespaces WHERE tablespace_name = 'CLINICA_DATA') dt;

PROMPT
PROMPT --- Preparación de la prueba de texto plano (tablespace de control sin cifrar)
DECLARE
  PROCEDURE ej(p IN VARCHAR2, ig IN VARCHAR2) IS
  BEGIN EXECUTE IMMEDIATE p;
  EXCEPTION WHEN OTHERS THEN IF INSTR(ig, TO_CHAR(SQLCODE)) = 0 THEN RAISE; END IF; END;
BEGIN
  ej('DROP TABLESPACE ts_control_plano INCLUDING CONTENTS AND DATAFILES', '-959');
  EXECUTE IMMEDIATE 'CREATE TABLESPACE ts_control_plano DATAFILE '''
        || '&ruta_datafiles\TS_CONTROL_PLANO01.DBF'' SIZE 5M';
  EXECUTE IMMEDIATE 'ALTER USER clinica QUOTA UNLIMITED ON ts_control_plano';
  EXECUTE IMMEDIATE 'CREATE TABLE clinica.ctrl_plano (nombre VARCHAR2(100)) TABLESPACE ts_control_plano';
  -- Mismo nombre real que el paciente 1 de CLINICA (dato de control).
  EXECUTE IMMEDIATE 'INSERT INTO clinica.ctrl_plano VALUES (''María Fernanda Solano Vargas'')';
  COMMIT;
END;
/
ALTER SYSTEM CHECKPOINT;

PROMPT Tablespace de control TS_CONTROL_PLANO creado (se elimina en v16_busqueda_texto.sh).

SPOOL OFF
