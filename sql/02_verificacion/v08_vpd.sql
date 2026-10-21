--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v08_vpd.sql
-- Contenedor: XEPDB1
-- Prueba   : PR-12
-- Control  : ISO/IEC 27001:2022 A.8.3 (restricción del acceso)
--
-- PR-12: la política VPD limita CONSULTAS a cada médico. Se espera que
--        MED_ROJAS vea 18 filas, MED_MORA 12 y SYS (exento) 30. Se emite una
--        línea de resultado por cada sesión y se lista la política.
--        Conexiones de los médicos por TCP.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v08_vpd.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v08_vpd PR-12

PROMPT
PROMPT --- Política VPD sobre CLINICA.CONSULTAS
COLUMN object_name FORMAT A12
COLUMN policy_name FORMAT A20
COLUMN function    FORMAT A18
COLUMN enable      FORMAT A6
SELECT object_name, policy_name, function, enable
FROM   dba_policies
WHERE  object_owner = 'CLINICA' AND object_name = 'CONSULTAS';

PROMPT
PROMPT --- Distribución real de CONSULTAS por médico (referencia)
COLUMN usuario_bd FORMAT A12
COLUMN filas      FORMAT 9999
SELECT m.usuario_bd, COUNT(*) AS filas
FROM   clinica.consultas c JOIN clinica.medicos m ON m.id = c.medico_id
GROUP  BY m.usuario_bd ORDER BY m.usuario_bd;

PROMPT
PROMPT --- PR-12 (SYS, exento de VPD): se esperan 30 filas
SET SERVEROUTPUT ON
DECLARE
  v_n NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_n FROM clinica.consultas;
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-12 (SYS): '
    || CASE WHEN v_n = 30 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (' || v_n || ' filas)');
END;
/

PROMPT
PROMPT --- PR-12 (MED_ROJAS, por TCP): se esperan 18 filas
CONNECT MED_ROJAS/&pwd_med_rojas@//localhost:1521/&pdb_nombre
SET SERVEROUTPUT ON
DECLARE
  v_n NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_n FROM clinica.consultas;
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-12 (MED_ROJAS): '
    || CASE WHEN v_n = 18 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (' || v_n || ' filas)');
END;
/

PROMPT
PROMPT --- PR-12 (MED_MORA, por TCP): se esperan 12 filas
CONNECT MED_MORA/&pwd_med_mora@//localhost:1521/&pdb_nombre
SET SERVEROUTPUT ON
DECLARE
  v_n NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_n FROM clinica.consultas;
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-12 (MED_MORA): '
    || CASE WHEN v_n = 12 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (' || v_n || ' filas)');
END;
/

SPOOL OFF
