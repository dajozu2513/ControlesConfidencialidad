--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v04_perfil_contrasenas.sql
-- Contenedor: XEPDB1
-- Pruebas  : PR-05 (perfil aplicado), PR-06 (rechazo de contraseña débil)
-- Control  : ISO/IEC 27001:2022 A.5.17 (información de autenticación), A.8.5
--
-- PR-05: PERFIL_CLINICA define la política de contraseñas y está asignado a
--        los usuarios nominales.
-- PR-06: una contraseña débil (abc123) es rechazada por la función de
--        verificación; se espera ORA-28003. El valor abc123 es un literal
--        deliberadamente débil, no una credencial del proyecto.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v04_perfil_contrasenas.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v04_perfil_contrasenas PR-05,PR-06

PROMPT
PROMPT --- PR-05: límites de PERFIL_CLINICA
COLUMN resource_name FORMAT A26
COLUMN limit         FORMAT A30
SELECT resource_name, limit
FROM   dba_profiles
WHERE  profile = 'PERFIL_CLINICA' AND resource_type = 'PASSWORD'
ORDER  BY resource_name;

PROMPT
PROMPT --- PR-05: usuarios con PERFIL_CLINICA
COLUMN username FORMAT A16
COLUMN profile  FORMAT A16
COLUMN account_status FORMAT A16
SELECT username, profile, account_status
FROM   dba_users
WHERE  profile = 'PERFIL_CLINICA'
ORDER  BY username;

PROMPT
COLUMN resultado FORMAT A70
SELECT CASE WHEN COUNT(*) >= 6
            AND MAX(CASE WHEN resource_name = 'PASSWORD_VERIFY_FUNCTION'
                         THEN limit END) = 'ORA12C_STRONG_VERIFY_FUNCTION'
            THEN 'RESULTADO PR-05: CUMPLE'
            ELSE 'RESULTADO PR-05: NO CUMPLE'
       END AS resultado
FROM   dba_profiles
WHERE  profile = 'PERFIL_CLINICA' AND resource_type = 'PASSWORD';

PROMPT
PROMPT --- PR-06: intento de fijar una contraseña débil a MED_ROJAS (se espera ORA-28003)
SET SERVEROUTPUT ON
DECLARE
BEGIN
  EXECUTE IMMEDIATE 'ALTER USER med_rojas IDENTIFIED BY abc123';
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-06: NO CUMPLE (se aceptó una contraseña débil)');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -28003 THEN
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-06: CUMPLE (ORA-28003, contraseña rechazada)');
    ELSE
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-06: NO CUMPLE (ORA' || SQLCODE || ')');
    END IF;
END;
/

SPOOL OFF
