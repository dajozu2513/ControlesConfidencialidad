--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v03_identidades.sql
-- Contenedor: XEPDB1
-- Prueba   : PR-04
-- Control  : ISO/IEC 27001:2022 A.5.16 (gestión de identidades), A.8.5
--
-- PR-04: ninguna cuenta abierta usa una contraseña por defecto conocida
--        (dba_users_with_defpwd). Se listan además las cuentas abiertas que
--        no son mantenidas por Oracle.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v03_identidades.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v03_identidades PR-04

PROMPT
PROMPT --- Cuentas abiertas no mantenidas por Oracle
COLUMN username       FORMAT A16
COLUMN account_status FORMAT A16
COLUMN profile        FORMAT A16
SELECT username, account_status, profile
FROM   dba_users
WHERE  oracle_maintained = 'N'
AND    account_status LIKE 'OPEN%'
ORDER  BY username;

PROMPT
PROMPT --- Cuentas abiertas con contraseña por defecto conocida
COLUMN username FORMAT A20
SELECT d.username
FROM   dba_users_with_defpwd d
       JOIN dba_users u ON u.username = d.username
WHERE  u.account_status LIKE 'OPEN%'
ORDER  BY d.username;

PROMPT
COLUMN resultado FORMAT A60
SELECT CASE WHEN COUNT(*) = 0
            THEN 'RESULTADO PR-04: CUMPLE'
            ELSE 'RESULTADO PR-04: NO CUMPLE (' || COUNT(*) || ' cuentas con clave por defecto)'
       END AS resultado
FROM   dba_users_with_defpwd d
       JOIN dba_users u ON u.username = d.username
WHERE  u.account_status LIKE 'OPEN%';

SPOOL OFF
