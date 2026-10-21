--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s06_auditoria.sql
-- Contenedor: XEPDB1
-- Fase PHVA: Hacer (y base para Verificar)
-- Controles: ISO/IEC 27001:2022 A.8.15 (registro de eventos), A.8.16
--            (seguimiento de actividades), A.8.2 (derechos de acceso
--            privilegiado), A.8.12 (prevención de fuga de datos)
--
-- Propósito:
--   Políticas de auditoría unificada (funcionan también en modo mixto):
--     - POL_PRIVILEGIADOS       : toda acción del administrador DBA_OPER.
--     - POL_DATOS_SENSIBLES     : lectura y modificación de PACIENTES y
--                                 CONSULTAS por cualquier usuario.
--     - POL_CAMBIOS_PRIVILEGIOS : gestión de usuarios, roles, privilegios
--                                 y perfiles.
--     - POL_EXPORTACIONES       : exportaciones con Data Pump.
--   Además se confirma que la política predefinida ORA_LOGON_FAILURES
--   (intentos fallidos de inicio de sesión) sigue habilitada.
--
-- Requisito: s02 y s03 ejecutados (tablas y usuario DBA_OPER existentes).
-- Re-ejecutable: deshabilita y elimina las políticas si existen.
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

SPOOL evidencias/setup_s06_auditoria.txt

ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/01_setup/comun/encabezado.sql s06_auditoria

--------------------------------------------------------------------------------
-- 1. Limpieza de una ejecución anterior
--    Una política habilitada no puede eliminarse: primero se deshabilita
--    (NOAUDIT) para cada usuario o rol en que esté activa y luego se elimina.
--    ORA-46357: la política no existe.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. LIMPIEZA DE POLÍTICAS PREVIAS
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
  FOR e IN (SELECT policy_name, entity_name, entity_type
            FROM   audit_unified_enabled_policies
            WHERE  policy_name IN ('POL_PRIVILEGIADOS', 'POL_DATOS_SENSIBLES',
                                   'POL_CAMBIOS_PRIVILEGIOS', 'POL_EXPORTACIONES')) LOOP
    IF e.entity_name = 'ALL USERS' THEN
      ejecutar('NOAUDIT POLICY ' || e.policy_name, '-46357');
    ELSIF e.entity_type = 'ROLE' THEN
      ejecutar('NOAUDIT POLICY ' || e.policy_name || ' BY USERS WITH GRANTED ROLES '
               || e.entity_name, '-46357');
    ELSE
      ejecutar('NOAUDIT POLICY ' || e.policy_name || ' BY ' || e.entity_name, '-46357');
    END IF;
  END LOOP;

  FOR p IN (SELECT column_value AS nombre
            FROM   TABLE(sys.odcivarchar2list('POL_PRIVILEGIADOS', 'POL_DATOS_SENSIBLES',
                                              'POL_CAMBIOS_PRIVILEGIOS', 'POL_EXPORTACIONES'))) LOOP
    ejecutar('DROP AUDIT POLICY ' || p.nombre, '-46357');
  END LOOP;
END;
/

--------------------------------------------------------------------------------
-- 2. POL_PRIVILEGIADOS
--    ACTIONS ALL registra cualquier sentencia del usuario privilegiado.
--    Se aplica solo a DBA_OPER (BY), para no generar volumen con el resto.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. POL_PRIVILEGIADOS
CREATE AUDIT POLICY pol_privilegiados
  ACTIONS ALL;

AUDIT POLICY pol_privilegiados BY dba_oper;

--------------------------------------------------------------------------------
-- 3. POL_DATOS_SENSIBLES
--    Acciones a nivel de objeto sobre las tablas con datos CONFIDENCIALES y
--    SENSIBLES. Permite saber quién leyó o cambió datos de pacientes.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. POL_DATOS_SENSIBLES
CREATE AUDIT POLICY pol_datos_sensibles
  ACTIONS SELECT ON clinica.pacientes,
          INSERT ON clinica.pacientes,
          UPDATE ON clinica.pacientes,
          DELETE ON clinica.pacientes,
          SELECT ON clinica.consultas,
          INSERT ON clinica.consultas,
          UPDATE ON clinica.consultas,
          DELETE ON clinica.consultas;

AUDIT POLICY pol_datos_sensibles;

--------------------------------------------------------------------------------
-- 4. POL_CAMBIOS_PRIVILEGIOS
--    Cambios en la gestión de identidades y derechos de acceso.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. POL_CAMBIOS_PRIVILEGIOS
CREATE AUDIT POLICY pol_cambios_privilegios
  ACTIONS GRANT, REVOKE,
          CREATE USER, ALTER USER, DROP USER,
          CREATE ROLE, ALTER ROLE, DROP ROLE,
          ALTER PROFILE;

AUDIT POLICY pol_cambios_privilegios;

--------------------------------------------------------------------------------
-- 5. POL_EXPORTACIONES
--    Registra cada trabajo de exportación de Data Pump (posible extracción
--    masiva de datos).
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 5. POL_EXPORTACIONES
CREATE AUDIT POLICY pol_exportaciones
  ACTIONS COMPONENT = DATAPUMP EXPORT;

AUDIT POLICY pol_exportaciones;

--------------------------------------------------------------------------------
-- 6. Verificación
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 6. VERIFICACIÓN

PROMPT Definición de las políticas del proyecto:
COLUMN policy_name   FORMAT A24
COLUMN audit_option  FORMAT A20
COLUMN option_type   FORMAT A20
COLUMN object_schema FORMAT A8
COLUMN object_name   FORMAT A10
SELECT policy_name, audit_option, audit_option_type AS option_type,
       object_schema, object_name
FROM   audit_unified_policies
WHERE  policy_name IN ('POL_PRIVILEGIADOS', 'POL_DATOS_SENSIBLES',
                       'POL_CAMBIOS_PRIVILEGIOS', 'POL_EXPORTACIONES')
ORDER  BY policy_name, object_name, audit_option;

PROMPT Políticas habilitadas en la PDB (incluye ORA_LOGON_FAILURES):
COLUMN enabled_option FORMAT A15
COLUMN entity_name    FORMAT A12
COLUMN entity_type    FORMAT A8
COLUMN success        FORMAT A7
COLUMN failure        FORMAT A7
SELECT policy_name, enabled_option, entity_name, entity_type, success, failure
FROM   audit_unified_enabled_policies
ORDER  BY policy_name;

PROMPT Confirmación de ORA_LOGON_FAILURES:
COLUMN estado FORMAT A40
SELECT CASE WHEN COUNT(*) > 0
            THEN 'ORA_LOGON_FAILURES habilitada'
            ELSE 'ORA_LOGON_FAILURES NO habilitada'
       END AS estado
FROM   audit_unified_enabled_policies
WHERE  policy_name = 'ORA_LOGON_FAILURES';

SPOOL OFF
