--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s04_vpd.sql
-- Contenedor: XEPDB1
-- Fase PHVA: Hacer
-- Controles: ISO/IEC 27001:2022 A.8.3 (restricción del acceso a la
--            información), A.5.15 (control de acceso)
--
-- Propósito:
--   Virtual Private Database (VPD) sobre CLINICA.CONSULTAS: cada médico solo
--   ve, registra, modifica o elimina las consultas en las que es el médico
--   tratante. El predicado lo agrega Oracle de forma transparente a cada
--   sentencia, por lo que no depende de la aplicación.
--
--   Función de política CLINICA.FN_VPD_CONSULTAS:
--     - SESSION_USER registrado en MEDICOS -> 'medico_id = <su id>'
--     - SESSION_USER = CLINICA             -> NULL (sin restricción)
--     - cualquier otro usuario             -> '1=0' (ninguna fila)
--   SYS y los usuarios con EXEMPT ACCESS POLICY no están sujetos a VPD.
--
-- Requisito: s02 y s03 ejecutados.
-- Re-ejecutable: elimina la política si existe y reemplaza la función.
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

SPOOL evidencias/setup_s04_vpd.txt

ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/01_setup/comun/encabezado.sql s04_vpd

--------------------------------------------------------------------------------
-- 1. Limpieza de una ejecución anterior
--    Se consulta DBA_POLICIES para eliminar la política solo si existe.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. LIMPIEZA DE LA POLÍTICA PREVIA
DECLARE
  v_existe NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_existe
  FROM   dba_policies
  WHERE  object_owner = 'CLINICA'
  AND    object_name  = 'CONSULTAS'
  AND    policy_name  = 'POL_VPD_CONSULTAS';

  IF v_existe > 0 THEN
    DBMS_RLS.DROP_POLICY(object_schema => 'CLINICA',
                         object_name   => 'CONSULTAS',
                         policy_name   => 'POL_VPD_CONSULTAS');
    DBMS_OUTPUT.PUT_LINE('Política POL_VPD_CONSULTAS eliminada.');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Política POL_VPD_CONSULTAS no existía.');
  END IF;
END;
/

--------------------------------------------------------------------------------
-- 2. Función de política
--    Se crea en el esquema CLINICA (propietario de MEDICOS) con derechos del
--    definidor, de modo que los médicos no necesitan privilegios adicionales.
--    El id del médico se concatena como número, no como texto del usuario,
--    lo que evita inyección en el predicado.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. FUNCIÓN CLINICA.FN_VPD_CONSULTAS
CREATE OR REPLACE FUNCTION clinica.fn_vpd_consultas (
  p_schema IN VARCHAR2,
  p_obj    IN VARCHAR2
) RETURN VARCHAR2
IS
  v_usuario   VARCHAR2(128) := SYS_CONTEXT('USERENV', 'SESSION_USER');
  v_medico_id clinica.medicos.id%TYPE;
BEGIN
  -- El propietario del esquema no tiene restricción.
  IF v_usuario = 'CLINICA' THEN
    RETURN NULL;
  END IF;

  -- Un médico registrado solo ve sus propias consultas.
  SELECT id
  INTO   v_medico_id
  FROM   clinica.medicos
  WHERE  usuario_bd = v_usuario;

  RETURN 'medico_id = ' || TO_CHAR(v_medico_id);
EXCEPTION
  -- Cualquier otro usuario no ve ninguna fila.
  WHEN NO_DATA_FOUND THEN
    RETURN '1=0';
END fn_vpd_consultas;
/

SHOW ERRORS FUNCTION clinica.fn_vpd_consultas

--------------------------------------------------------------------------------
-- 3. Política VPD
--    statement_types abarca lectura y escritura. update_check => TRUE impide
--    que un médico inserte o modifique una consulta dejándola fuera de su
--    propio predicado (por ejemplo, asignarla a otro médico).
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. POLÍTICA POL_VPD_CONSULTAS
BEGIN
  DBMS_RLS.ADD_POLICY(
    object_schema   => 'CLINICA',
    object_name     => 'CONSULTAS',
    policy_name     => 'POL_VPD_CONSULTAS',
    function_schema => 'CLINICA',
    policy_function => 'FN_VPD_CONSULTAS',
    statement_types => 'SELECT,INSERT,UPDATE,DELETE',
    update_check    => TRUE,
    enable          => TRUE);
  DBMS_OUTPUT.PUT_LINE('Política POL_VPD_CONSULTAS creada y habilitada.');
END;
/

--------------------------------------------------------------------------------
-- 4. Verificación
--    La prueba funcional con cada médico se realiza en sql/02_verificacion.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. VERIFICACIÓN

COLUMN object_name     FORMAT A10
COLUMN policy_name     FORMAT A18
COLUMN function        FORMAT A17
COLUMN sel             FORMAT A3
COLUMN ins             FORMAT A3
COLUMN upd             FORMAT A3
COLUMN del             FORMAT A3
COLUMN chk_option      FORMAT A10
COLUMN enable          FORMAT A6
COLUMN policy_type     FORMAT A8

SELECT object_name, policy_name, function, sel, ins, upd, del,
       chk_option, enable, policy_type
FROM   dba_policies
WHERE  object_owner = 'CLINICA';

COLUMN object_name FORMAT A20
COLUMN object_type FORMAT A10
COLUMN status      FORMAT A7
SELECT object_name, object_type, status
FROM   dba_objects
WHERE  owner = 'CLINICA'
AND    object_name = 'FN_VPD_CONSULTAS';

PROMPT Predicado que devuelve la función para la sesión actual (SYS -> 1=0):
COLUMN predicado FORMAT A20
SELECT clinica.fn_vpd_consultas('CLINICA', 'CONSULTAS') AS predicado FROM dual;

SPOOL OFF
