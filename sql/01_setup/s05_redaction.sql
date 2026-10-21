--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s05_redaction.sql
-- Contenedor: XEPDB1
-- Fase PHVA: Hacer
-- Controles: ISO/IEC 27001:2022 A.8.11 (enmascaramiento de datos),
--            A.8.3 (restricción del acceso a la información)
--
-- Propósito:
--   Oracle Data Redaction enmascara los datos en el momento de la consulta,
--   sin modificarlos en disco:
--     - POL_RED_PACIENTES : para sesiones con ROL_RECEPCION, la cédula se
--       muestra como X-XXXX-NNNN y el teléfono como XXXX-NNNN.
--     - POL_RED_CONSULTAS : para cualquier sesión sin ROL_MEDICO, diagnóstico
--       y tratamiento se redactan por completo (defensa en profundidad: VPD
--       ya devuelve 0 filas a los no médicos).
--   SYS y los usuarios con EXEMPT REDACTION POLICY no están sujetos a la
--   redacción.
--
-- Requisito: s02 y s03 ejecutados (roles existentes).
-- Re-ejecutable: elimina las políticas si existen.
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

SPOOL evidencias/setup_s05_redaction.txt

ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/01_setup/comun/encabezado.sql s05_redaction

--------------------------------------------------------------------------------
-- 1. Limpieza de una ejecución anterior
--    Se consulta REDACTION_POLICIES para eliminar solo las que existen.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. LIMPIEZA DE POLÍTICAS PREVIAS
BEGIN
  FOR p IN (SELECT object_owner, object_name, policy_name
            FROM   redaction_policies
            WHERE  object_owner = 'CLINICA'
            AND    policy_name IN ('POL_RED_PACIENTES', 'POL_RED_CONSULTAS')) LOOP
    DBMS_REDACT.DROP_POLICY(object_schema => p.object_owner,
                            object_name   => p.object_name,
                            policy_name   => p.policy_name);
    DBMS_OUTPUT.PUT_LINE('Política ' || p.policy_name || ' eliminada.');
  END LOOP;
END;
/

--------------------------------------------------------------------------------
-- 2. POL_RED_PACIENTES (redacción parcial para recepción)
--    Formato de function_parameters para caracteres:
--      'formato_entrada,formato_salida,caracter_mascara,inicio,fin'
--    V = carácter que puede redactarse, F = carácter de formato que se
--    conserva. Se redactan las posiciones V desde "inicio" hasta "fin".
--      Cédula   1-0452-0781 -> VFVVVVFVVVV, V 1 a 5 -> X-XXXX-0781
--      Teléfono 8812-4410   -> VVVVFVVVV,   V 1 a 4 -> XXXX-4410
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. POLÍTICA POL_RED_PACIENTES
BEGIN
  DBMS_REDACT.ADD_POLICY(
    object_schema       => 'CLINICA',
    object_name         => 'PACIENTES',
    policy_name         => 'POL_RED_PACIENTES',
    policy_description  => 'Recepción ve solo los últimos 4 dígitos de cédula y teléfono',
    column_name         => 'CEDULA',
    column_description  => '[CONFIDENCIAL] Cédula: X-XXXX-NNNN',
    function_type       => DBMS_REDACT.PARTIAL,
    function_parameters => 'VFVVVVFVVVV,V-VVVV-VVVV,X,1,5',
    expression          => q'[SYS_CONTEXT('SYS_SESSION_ROLES','ROL_RECEPCION')='TRUE']',
    enable              => TRUE);

  DBMS_REDACT.ALTER_POLICY(
    object_schema       => 'CLINICA',
    object_name         => 'PACIENTES',
    policy_name         => 'POL_RED_PACIENTES',
    action              => DBMS_REDACT.ADD_COLUMN,
    column_name         => 'TELEFONO',
    column_description  => '[CONFIDENCIAL] Teléfono: XXXX-NNNN',
    function_type       => DBMS_REDACT.PARTIAL,
    function_parameters => 'VVVVFVVVV,VVVV-VVVV,X,1,4');

  DBMS_OUTPUT.PUT_LINE('Política POL_RED_PACIENTES creada (CEDULA, TELEFONO).');
END;
/

--------------------------------------------------------------------------------
-- 3. POL_RED_CONSULTAS (redacción completa para no médicos)
--    DBMS_REDACT.FULL reemplaza un VARCHAR2 por un espacio en blanco.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. POLÍTICA POL_RED_CONSULTAS
BEGIN
  DBMS_REDACT.ADD_POLICY(
    object_schema       => 'CLINICA',
    object_name         => 'CONSULTAS',
    policy_name         => 'POL_RED_CONSULTAS',
    policy_description  => 'Solo ROL_MEDICO ve diagnóstico y tratamiento',
    column_name         => 'DIAGNOSTICO',
    column_description  => '[SENSIBLE] Diagnóstico: redacción completa',
    function_type       => DBMS_REDACT.FULL,
    expression          => q'[SYS_CONTEXT('SYS_SESSION_ROLES','ROL_MEDICO')='FALSE']',
    enable              => TRUE);

  DBMS_REDACT.ALTER_POLICY(
    object_schema       => 'CLINICA',
    object_name         => 'CONSULTAS',
    policy_name         => 'POL_RED_CONSULTAS',
    action              => DBMS_REDACT.ADD_COLUMN,
    column_name         => 'TRATAMIENTO',
    column_description  => '[SENSIBLE] Tratamiento: redacción completa',
    function_type       => DBMS_REDACT.FULL);

  DBMS_OUTPUT.PUT_LINE('Política POL_RED_CONSULTAS creada (DIAGNOSTICO, TRATAMIENTO).');
END;
/

--------------------------------------------------------------------------------
-- 4. Verificación
--    La prueba funcional con RECEP_SOLIS y los médicos se realiza en
--    sql/02_verificacion. Aquí se listan las políticas y columnas y quién
--    está exento de la redacción por privilegio.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. VERIFICACIÓN

COLUMN object_name FORMAT A10
COLUMN policy_name FORMAT A18
COLUMN expression  FORMAT A55
COLUMN enable      FORMAT A7
SELECT object_name, policy_name, expression, enable
FROM   redaction_policies
WHERE  object_owner = 'CLINICA'
ORDER  BY object_name;

COLUMN column_name         FORMAT A12
COLUMN function_type       FORMAT A20
COLUMN function_parameters FORMAT A32
SELECT object_name, column_name, function_type, function_parameters
FROM   redaction_columns
WHERE  object_owner = 'CLINICA'
ORDER  BY object_name, column_name;

PROMPT Titulares de EXEMPT REDACTION POLICY (directo o por rol):
COLUMN grantee FORMAT A25
SELECT grantee, privilege
FROM   dba_sys_privs
WHERE  privilege = 'EXEMPT REDACTION POLICY'
ORDER  BY grantee;

SPOOL OFF
