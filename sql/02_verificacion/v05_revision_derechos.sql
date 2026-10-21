--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v05_revision_derechos.sql
-- Contenedor: XEPDB1
-- Prueba   : PR-07
-- Control  : ISO/IEC 27001:2022 A.5.18 (derechos de acceso), A.8.2
--
-- PR-07: inventario de las cuentas no mantenidas por Oracle con estado,
--        último acceso, perfil, roles y privilegios de sistema. CUMPLE si
--        no hay cuentas abiertas sin acceso durante más de 90 días.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v05_revision_derechos.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v05_revision_derechos PR-07

PROMPT
PROMPT --- Inventario de cuentas (estado, último acceso, perfil, roles)
COLUMN username       FORMAT A14
COLUMN account_status FORMAT A16
COLUMN ultimo_acceso  FORMAT A20
COLUMN profile        FORMAT A16
COLUMN roles          FORMAT A40
SELECT u.username,
       u.account_status,
       NVL(TO_CHAR(u.last_login, 'YYYY-MM-DD HH24:MI'), '(nunca)') AS ultimo_acceso,
       u.profile,
       NVL((SELECT LISTAGG(rp.granted_role, ', ') WITHIN GROUP (ORDER BY rp.granted_role)
            FROM   dba_role_privs rp WHERE rp.grantee = u.username), '(ninguno)') AS roles
FROM   dba_users u
WHERE  u.oracle_maintained = 'N'
ORDER  BY u.username;

PROMPT
PROMPT --- Privilegios de sistema por cuenta no mantenida por Oracle
COLUMN privilegios FORMAT A50
SELECT u.username,
       NVL((SELECT LISTAGG(sp.privilege, ', ') WITHIN GROUP (ORDER BY sp.privilege)
            FROM   dba_sys_privs sp WHERE sp.grantee = u.username), '(ninguno)') AS privilegios
FROM   dba_users u
WHERE  u.oracle_maintained = 'N'
ORDER  BY u.username;

PROMPT
COLUMN resultado FORMAT A70
SELECT CASE WHEN COUNT(*) = 0
            THEN 'RESULTADO PR-07: CUMPLE'
            ELSE 'RESULTADO PR-07: NO CUMPLE (' || COUNT(*) || ' cuentas inactivas > 90 días)'
       END AS resultado
FROM   dba_users
WHERE  oracle_maintained = 'N'
AND    account_status LIKE 'OPEN%'
AND    last_login IS NOT NULL
AND    last_login < SYSTIMESTAMP - INTERVAL '90' DAY;

SPOOL OFF
