--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s03_usuarios_roles.sql
-- Contenedor: XEPDB1
-- Fase PHVA: Hacer
-- Controles: ISO/IEC 27001:2022 A.5.15 (control de acceso), A.5.17
--            (información de autenticación), A.5.18 (derechos de acceso),
--            A.8.2 (derechos de acceso privilegiado), A.8.5 (autenticación
--            segura), A.5.3 (segregación de funciones)
--
-- Propósito:
--   1. Perfil PERFIL_CLINICA con política de contraseñas robusta.
--   2. Roles funcionales con mínimo privilegio sobre el esquema CLINICA.
--   3. Usuarios nominales asignados a un único rol según su función.
--   Ningún usuario recibe privilegios directos sobre objetos de CLINICA y
--   nada se otorga a PUBLIC.
--
-- Requisito: s02 ejecutado. SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a vigente
--            (s00_sqlnet.sh + reinicio de s01), para generar solo
--            verificadores 12C.
-- Re-ejecutable: elimina usuarios, roles y perfil si existen. Después de
-- re-ejecutarlo deben volver a ejecutarse s06 (al eliminar DBA_OPER se pierde
-- la habilitación de POL_PRIVILEGIADOS) y s07 (privilegios de ROL_DESARROLLO).
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

SPOOL evidencias/setup_s03_usuarios_roles.txt

ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/01_setup/comun/encabezado.sql s03_usuarios_roles

--------------------------------------------------------------------------------
-- 1. Limpieza de una ejecución anterior
--    ORA-01918: usuario inexistente. ORA-01919: rol inexistente.
--    ORA-02380: perfil inexistente.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. LIMPIEZA DE OBJETOS PREVIOS
DECLARE
  PROCEDURE ejecutar(p_sql IN VARCHAR2, p_ignorar IN VARCHAR2) IS
  BEGIN
    EXECUTE IMMEDIATE p_sql;
    DBMS_OUTPUT.PUT_LINE('Ejecutado: ' || p_sql);
  EXCEPTION
    WHEN OTHERS THEN
      IF INSTR(',' || p_ignorar || ',', ',' || SQLCODE || ',') > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Omitido  : ' || p_sql || ' (ORA-'
                             || LPAD(ABS(SQLCODE), 5, '0') || ', no existía)');
      ELSE
        RAISE;
      END IF;
  END;
BEGIN
  FOR u IN (SELECT column_value AS nombre
            FROM   TABLE(sys.odcivarchar2list('MED_ROJAS', 'MED_MORA', 'RECEP_SOLIS',
                                              'AUD_VEGA', 'DEV_CALVO', 'DBA_OPER'))) LOOP
    ejecutar('DROP USER ' || u.nombre || ' CASCADE', '-1918');
  END LOOP;
  FOR r IN (SELECT column_value AS nombre
            FROM   TABLE(sys.odcivarchar2list('ROL_MEDICO', 'ROL_RECEPCION',
                                              'ROL_AUDITOR', 'ROL_DESARROLLO'))) LOOP
    ejecutar('DROP ROLE ' || r.nombre, '-1919');
  END LOOP;
  ejecutar('DROP PROFILE perfil_clinica CASCADE', '-2380');
END;
/

--------------------------------------------------------------------------------
-- 2. Perfil de contraseñas
--    ORA12C_STRONG_VERIFY_FUNCTION exige como mínimo 9 caracteres, 2
--    mayúsculas, 2 minúsculas, 2 dígitos y 2 caracteres especiales.
--    Vigencia de 90 días, sin reutilizar las últimas 5 contraseñas ni repetir
--    una durante 365 días, bloqueo de 1 hora tras 5 intentos fallidos y
--    bloqueo automático de cuentas inactivas por 90 días.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. PERFIL PERFIL_CLINICA
CREATE PROFILE perfil_clinica LIMIT
  PASSWORD_VERIFY_FUNCTION ora12c_strong_verify_function
  PASSWORD_LIFE_TIME       90
  PASSWORD_REUSE_MAX       5
  PASSWORD_REUSE_TIME      365
  FAILED_LOGIN_ATTEMPTS    5
  PASSWORD_LOCK_TIME       1/24
  INACTIVE_ACCOUNT_TIME    90;

--------------------------------------------------------------------------------
-- 3. Roles funcionales (mínimo privilegio)
--    ROL_MEDICO     : lee médicos, pacientes y consultas; registra y
--                     actualiza consultas (VPD limita a sus propios pacientes).
--    ROL_RECEPCION  : gestiona datos de pacientes; no accede a CONSULTAS.
--    ROL_AUDITOR    : consulta la pista de auditoría (AUDIT_VIEWER).
--    ROL_DESARROLLO : solo sesión; el SELECT sobre CLINICA_DEV se otorga en s07.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. ROLES
CREATE ROLE rol_medico;
GRANT CREATE SESSION TO rol_medico;
GRANT SELECT ON clinica.medicos   TO rol_medico;
GRANT SELECT ON clinica.pacientes TO rol_medico;
GRANT SELECT, INSERT, UPDATE ON clinica.consultas TO rol_medico;

CREATE ROLE rol_recepcion;
GRANT CREATE SESSION TO rol_recepcion;
GRANT SELECT, INSERT, UPDATE ON clinica.pacientes TO rol_recepcion;

CREATE ROLE rol_auditor;
GRANT CREATE SESSION TO rol_auditor;
GRANT audit_viewer TO rol_auditor;

CREATE ROLE rol_desarrollo;
GRANT CREATE SESSION TO rol_desarrollo;

--------------------------------------------------------------------------------
-- 4. Usuarios nominales
--    Todos con PERFIL_CLINICA. Se crean con EXECUTE IMMEDIATE para que la
--    contraseña (tomada de config_local.sql) no aparezca en la evidencia.
--    DBA_OPER administra la base de datos con el rol DBA y los privilegios
--    administrativos separados SYSBACKUP (respaldos) y SYSKM (gestión de
--    claves TDE), en lugar de usar SYS.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. USUARIOS
DECLARE
  PROCEDURE crear_usuario(p_usuario IN VARCHAR2, p_clave IN VARCHAR2, p_rol IN VARCHAR2) IS
  BEGIN
    EXECUTE IMMEDIATE 'CREATE USER ' || p_usuario
                   || ' IDENTIFIED BY "' || p_clave || '"'
                   || ' PROFILE perfil_clinica';
    EXECUTE IMMEDIATE 'GRANT ' || p_rol || ' TO ' || p_usuario;
    DBMS_OUTPUT.PUT_LINE('Usuario ' || RPAD(p_usuario, 12) || ' creado con ' || p_rol);
  END;
BEGIN
  crear_usuario('MED_ROJAS',   '&pwd_med_rojas',   'ROL_MEDICO');
  crear_usuario('MED_MORA',    '&pwd_med_mora',    'ROL_MEDICO');
  crear_usuario('RECEP_SOLIS', '&pwd_recep_solis', 'ROL_RECEPCION');
  crear_usuario('AUD_VEGA',    '&pwd_aud_vega',    'ROL_AUDITOR');
  crear_usuario('DEV_CALVO',   '&pwd_dev_calvo',   'ROL_DESARROLLO');
  crear_usuario('DBA_OPER',    '&pwd_dba_oper',    'DBA');
END;
/

GRANT SYSBACKUP TO dba_oper;
GRANT SYSKM     TO dba_oper;

--------------------------------------------------------------------------------
-- 5. Verificación
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 5. VERIFICACIÓN

PROMPT Límites de PERFIL_CLINICA:
COLUMN resource_name FORMAT A25
COLUMN limit         FORMAT A30
SELECT resource_name, limit
FROM   dba_profiles
WHERE  profile = 'PERFIL_CLINICA'
AND    resource_type = 'PASSWORD'
ORDER  BY resource_name;

PROMPT Usuarios creados (verificadores de contraseña: solo 12C):
COLUMN username          FORMAT A12
COLUMN account_status    FORMAT A10
COLUMN profile           FORMAT A15
COLUMN password_versions FORMAT A17
SELECT username, account_status, profile, password_versions
FROM   dba_users
WHERE  username IN ('MED_ROJAS', 'MED_MORA', 'RECEP_SOLIS', 'AUD_VEGA', 'DEV_CALVO', 'DBA_OPER')
ORDER  BY username;

PROMPT Roles asignados a los usuarios:
COLUMN grantee      FORMAT A12
COLUMN granted_role FORMAT A15
SELECT grantee, granted_role, admin_option, default_role
FROM   dba_role_privs
WHERE  grantee IN ('MED_ROJAS', 'MED_MORA', 'RECEP_SOLIS', 'AUD_VEGA', 'DEV_CALVO', 'DBA_OPER')
ORDER  BY grantee, granted_role;

PROMPT Privilegios de sistema de los roles funcionales:
COLUMN grantee   FORMAT A15
COLUMN privilege FORMAT A20
SELECT grantee, privilege
FROM   dba_sys_privs
WHERE  grantee LIKE 'ROL\_%' ESCAPE '\'
ORDER  BY grantee, privilege;

PROMPT Privilegios sobre objetos de CLINICA:
COLUMN grantee    FORMAT A15
COLUMN table_name FORMAT A12
SELECT grantee, table_name, privilege
FROM   dba_tab_privs
WHERE  owner = 'CLINICA'
ORDER  BY grantee, table_name, privilege;

PROMPT Privilegios directos a usuarios o a PUBLIC sobre CLINICA (debe ser 0):
SELECT COUNT(*) AS privilegios_indebidos
FROM   dba_tab_privs p
WHERE  p.owner = 'CLINICA'
AND    (p.grantee = 'PUBLIC'
        OR p.grantee IN (SELECT username FROM dba_users));

PROMPT Privilegios administrativos (archivo de contraseñas):
COLUMN username FORMAT A12
SELECT username, sysdba, sysbackup, syskm, con_id
FROM   v$pwfile_users
WHERE  username = 'DBA_OPER';

SPOOL OFF
