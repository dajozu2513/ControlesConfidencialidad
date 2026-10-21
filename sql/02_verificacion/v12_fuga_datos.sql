--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v12_fuga_datos.sql
-- Contenedor: XEPDB1
-- Prueba   : PR-20 (superficie de fuga de datos)
-- Control  : ISO/IEC 27001:2022 A.8.12 (prevención de fuga de datos)
--
-- PR-20: inventario de vías de salida de datos: beneficiarios de los roles
--        de Data Pump, enlaces de base de datos (deben ser 0) y privilegios
--        sobre directorios. La exportación cifrada se prueba en v12_expdp.sh.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v12_fuga_datos.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v12_fuga_datos PR-20

PROMPT
PROMPT --- Beneficiarios de roles de Data Pump
COLUMN grantee      FORMAT A20
COLUMN granted_role FORMAT A32
SELECT grantee, granted_role
FROM   dba_role_privs
WHERE  granted_role LIKE '%DATAPUMP%'
ORDER  BY granted_role, grantee;

PROMPT
PROMPT --- Enlaces de base de datos (se excluye el interno DBMS_CLRDBLINK de Oracle)
COLUMN db_link FORMAT A20
COLUMN host    FORMAT A20
COLUMN nota    FORMAT A28
SELECT owner, db_link, host,
       CASE WHEN db_link = 'DBMS_CLRDBLINK' THEN 'interno de Oracle (extproc CLR)'
            ELSE 'definido por el usuario' END AS nota
FROM   dba_db_links ORDER BY owner, db_link;

PROMPT
PROMPT --- Privilegios sobre directorios
COLUMN grantee   FORMAT A18
COLUMN directorio FORMAT A20
COLUMN privilege FORMAT A10
SELECT p.grantee, p.table_name AS directorio, p.privilege
FROM   dba_tab_privs p
WHERE  p.type = 'DIRECTORY'
AND    p.grantee IN (SELECT username FROM dba_users WHERE oracle_maintained = 'N')
ORDER  BY p.grantee, p.table_name;

PROMPT
COLUMN resultado FORMAT A70
SELECT CASE WHEN (SELECT COUNT(*) FROM dba_db_links WHERE db_link <> 'DBMS_CLRDBLINK') = 0
            THEN 'RESULTADO PR-20: CUMPLE (sin enlaces definidos por el usuario)'
            ELSE 'RESULTADO PR-20: NO CUMPLE ('
                 || (SELECT COUNT(*) FROM dba_db_links WHERE db_link <> 'DBMS_CLRDBLINK')
                 || ' enlaces de usuario)'
       END AS resultado
FROM   dual;

SPOOL OFF
