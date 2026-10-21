--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v07_acceso_privilegiado.sql
-- Contenedor: XEPDB1
-- Pruebas  : PR-10 (inventario de acceso privilegiado), PR-11 (un rol
--            administrativo acotado no da acceso a los datos)
-- Control  : ISO/IEC 27001:2022 A.8.2 (acceso privilegiado), A.5.15
--
-- PR-10: beneficiarios del rol DBA, privilegios ANY otorgados directamente a
--        cuentas no administrativas (debe ser 0) y titulares de privilegios
--        administrativos en el archivo de contraseñas.
-- PR-11: DBA_OPER conectado AS SYSBACKUP no puede leer CLINICA.CONSULTAS.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v07_acceso_privilegiado.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v07_acceso_privilegiado PR-10,PR-11

PROMPT
PROMPT --- PR-10: beneficiarios del rol DBA
COLUMN grantee FORMAT A20
COLUMN admin_option FORMAT A12
SELECT grantee, admin_option
FROM   dba_role_privs
WHERE  granted_role = 'DBA'
ORDER  BY grantee;

PROMPT
PROMPT --- PR-10: privilegios ANY otorgados directamente a cuentas no administrativas
COLUMN grantee   FORMAT A16
COLUMN privilege FORMAT A30
SELECT grantee, privilege
FROM   dba_sys_privs
WHERE  privilege LIKE '%ANY%'
AND    grantee IN (SELECT username FROM dba_users WHERE oracle_maintained = 'N')
ORDER  BY grantee, privilege;

PROMPT
PROMPT --- PR-10: titulares de privilegios administrativos (archivo de contraseñas)
COLUMN username FORMAT A16
SELECT username, sysdba, sysbackup, syskm
FROM   v$pwfile_users
WHERE  username NOT IN ('SYS')
ORDER  BY username;

PROMPT
COLUMN resultado FORMAT A70
SELECT CASE WHEN COUNT(*) = 0
            THEN 'RESULTADO PR-10: CUMPLE'
            ELSE 'RESULTADO PR-10: NO CUMPLE (' || COUNT(*) || ' privilegios ANY directos)'
       END AS resultado
FROM   dba_sys_privs
WHERE  privilege LIKE '%ANY%'
AND    grantee IN (SELECT username FROM dba_users WHERE oracle_maintained = 'N');

PROMPT
PROMPT --- PR-11: DBA_OPER AS SYSBACKUP intenta leer CLINICA.CONSULTAS (debe fallar)
CONNECT DBA_OPER/&pwd_dba_oper@//localhost:1521/&pdb_nombre AS SYSBACKUP
SET SERVEROUTPUT ON
DECLARE
  v_n NUMBER;
BEGIN
  EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM clinica.consultas' INTO v_n;
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-11: NO CUMPLE (acceso permitido, ' || v_n || ' filas)');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE IN (-942, -1031)
    THEN DBMS_OUTPUT.PUT_LINE('RESULTADO PR-11: CUMPLE (ORA' || SQLCODE || ')');
    ELSE DBMS_OUTPUT.PUT_LINE('RESULTADO PR-11: NO CUMPLE (ORA' || SQLCODE || ')');
    END IF;
END;
/

SPOOL OFF
