--------------------------------------------------------------------------------
-- Script   : sql/01_setup/prueba_autologin.sql
-- Contenedor: CDB$ROOT y XEPDB1
-- Fase PHVA: Verificar (complemento de s01)
-- Controles: ISO/IEC 27001:2022 A.8.24 (uso de criptografía),
--            A.8.14 (redundancia / disponibilidad tras reinicio)
--
-- Propósito:
--   Comprobar que, tras un reinicio, el keystore AUTO_LOGIN (cwallet.sso)
--   abre automáticamente en CDB$ROOT y en XEPDB1 sin ADMINISTER KEY
--   MANAGEMENT manual, y que XEPDB1 vuelve a READ WRITE por su estado guardado.
--   No se ejecuta ALTER PLUGGABLE DATABASE OPEN ni se abre el keystore.
--
-- ATENCIÓN: este script REINICIA LA INSTANCIA (SHUTDOWN IMMEDIATE / STARTUP).
--
-- Ejecución (desde la raíz del repositorio):
--   sqlplus / as sysdba @sql/01_setup/prueba_autologin.sql
--------------------------------------------------------------------------------

SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK ON
SET PAGESIZE 200
SET LINESIZE 200
SET TRIMSPOOL ON
SET TRIMOUT ON
SET TAB OFF
WHENEVER SQLERROR EXIT FAILURE ROLLBACK

SPOOL evidencias/setup_autologin.txt

ALTER SESSION SET CONTAINER = CDB$ROOT;
@sql/01_setup/comun/encabezado.sql prueba_autologin

COLUMN wrl_parameter FORMAT A45
COLUMN status        FORMAT A20
COLUMN wallet_type   FORMAT A12
COLUMN keystore_mode FORMAT A8
COLUMN con_id        FORMAT 999999
COLUMN name          FORMAT A10
COLUMN open_mode     FORMAT A10

--------------------------------------------------------------------------------
-- 1. Estado antes del reinicio
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. ESTADO ANTES DEL REINICIO
SELECT con_id, wrl_parameter, status, wallet_type, keystore_mode
FROM   v$encryption_wallet
ORDER  BY con_id;

--------------------------------------------------------------------------------
-- 2. Reinicio de la instancia
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. REINICIO (SHUTDOWN IMMEDIATE / STARTUP)
SHUTDOWN IMMEDIATE
STARTUP
SET SERVEROUTPUT ON SIZE UNLIMITED

--------------------------------------------------------------------------------
-- 3. Estado después del reinicio en CDB$ROOT (sin intervención manual)
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. ESTADO DESPUÉS DEL REINICIO EN CDB$ROOT
SELECT con_id, wrl_parameter, status, wallet_type, keystore_mode
FROM   v$encryption_wallet
ORDER  BY con_id;

SELECT con_id, name, open_mode
FROM   v$pdbs
ORDER  BY con_id;

COLUMN resultado FORMAT A70
SELECT CASE
         WHEN status = 'OPEN' AND wallet_type = 'AUTOLOGIN'
         THEN 'RESULTADO AUTO_LOGIN CDB$ROOT: CUMPLE'
         ELSE 'RESULTADO AUTO_LOGIN CDB$ROOT: NO CUMPLE (' || status || '/' || wallet_type || ')'
       END AS resultado
FROM   v$encryption_wallet
WHERE  con_id = 1;

--------------------------------------------------------------------------------
-- 4. Estado después del reinicio en XEPDB1
--    Además de la vista, se lee una tabla del tablespace cifrado: si la clave
--    maestra no estuviera disponible, la consulta fallaría (ORA-28365).
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. ESTADO DESPUÉS DEL REINICIO EN XEPDB1
ALTER SESSION SET CONTAINER = &pdb_nombre;

SELECT con_id, status, wallet_type, keystore_mode
FROM   v$encryption_wallet;

SELECT COUNT(*) AS filas_consultas_cifradas FROM clinica.consultas;

SELECT CASE
         WHEN w.status = 'OPEN' AND w.wallet_type = 'AUTOLOGIN' AND p.open_mode = 'READ WRITE'
         THEN 'RESULTADO AUTO_LOGIN XEPDB1: CUMPLE'
         ELSE 'RESULTADO AUTO_LOGIN XEPDB1: NO CUMPLE (' || w.status || '/'
              || w.wallet_type || '/' || p.open_mode || ')'
       END AS resultado
FROM   v$encryption_wallet w
       CROSS JOIN v$pdbs p;

SPOOL OFF
