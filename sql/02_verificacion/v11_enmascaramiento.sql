--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v11_enmascaramiento.sql
-- Contenedor: XEPDB1
-- Pruebas  : PR-17 (redacción dinámica para recepción), PR-18 (políticas de
--            redacción definidas), PR-19 (enmascaramiento estático del clon)
-- Control  : ISO/IEC 27001:2022 A.8.11 (enmascaramiento de datos)
--
-- PR-17: RECEP_SOLIS ve la cédula como X-XXXX-NNNN y el teléfono como
--        XXXX-NNNN (Data Redaction). Conexión por TCP.
-- PR-18: existen las políticas y columnas de redacción y se listan los
--        titulares de EXEMPT REDACTION POLICY (directos y por rol).
-- PR-19: ninguna cédula del clon CLINICA_DEV coincide con una real de CLINICA.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v11_enmascaramiento.txt

PROMPT
PROMPT --- PR-17: RECEP_SOLIS consulta cédula y teléfono (deben verse redactados)
CONNECT RECEP_SOLIS/&pwd_recep_solis@//localhost:1521/&pdb_nombre
@sql/02_verificacion/comun/cabecera.sql v11_enmascaramiento PR-17,PR-18,PR-19

COLUMN cedula   FORMAT A12
COLUMN telefono FORMAT A10
SELECT cedula, telefono
FROM   clinica.pacientes
ORDER  BY id
FETCH FIRST 5 ROWS ONLY;

SET SERVEROUTPUT ON
DECLARE
  v_ok  NUMBER := 0;
  v_tot NUMBER := 0;
BEGIN
  FOR r IN (SELECT cedula, telefono FROM clinica.pacientes ORDER BY id FETCH FIRST 5 ROWS ONLY) LOOP
    v_tot := v_tot + 1;
    IF REGEXP_LIKE(r.cedula, '^X-XXXX-[0-9]{4}$')
       AND REGEXP_LIKE(r.telefono, '^XXXX-[0-9]{4}$') THEN
      v_ok := v_ok + 1;
    END IF;
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-17: '
    || CASE WHEN v_ok = v_tot AND v_tot = 5 THEN 'CUMPLE' ELSE 'NO CUMPLE' END
    || ' (' || v_ok || '/' || v_tot || ' filas redactadas)');
END;
/

PROMPT
PROMPT --- PR-18: políticas y columnas de Data Redaction
CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
COLUMN object_name FORMAT A12
COLUMN policy_name FORMAT A20
COLUMN column_name FORMAT A12
COLUMN function_type FORMAT A20
SELECT c.object_name, c.policy_name, c.column_name, c.function_type
FROM   redaction_columns c
WHERE  c.object_owner = 'CLINICA'
ORDER  BY c.object_name, c.column_name;

PROMPT
PROMPT --- PR-18: titulares de EXEMPT REDACTION POLICY (directo y por rol)
COLUMN grantee FORMAT A22
COLUMN via     FORMAT A22
SELECT grantee, 'DIRECTO' AS via
FROM   dba_sys_privs WHERE privilege = 'EXEMPT REDACTION POLICY'
UNION
SELECT rp.grantee, 'VIA ' || sp.grantee
FROM   dba_sys_privs sp
       JOIN dba_role_privs rp ON rp.granted_role = sp.grantee
WHERE  sp.privilege = 'EXEMPT REDACTION POLICY'
ORDER  BY 1;

PROMPT
COLUMN resultado FORMAT A60
SELECT CASE WHEN COUNT(*) = 4
            THEN 'RESULTADO PR-18: CUMPLE'
            ELSE 'RESULTADO PR-18: NO CUMPLE (' || COUNT(*) || ' columnas redactadas, se esperan 4)'
       END AS resultado
FROM   redaction_columns
WHERE  object_owner = 'CLINICA';

PROMPT
PROMPT --- PR-19: cruce de cédulas entre el clon y el origen (debe ser 0)
COLUMN coincidencias FORMAT 999999
SELECT COUNT(*) AS coincidencias
FROM   clinica_dev.pacientes d
       JOIN clinica.pacientes p ON p.cedula = d.cedula;

PROMPT
SELECT CASE WHEN COUNT(*) = 0
            THEN 'RESULTADO PR-19: CUMPLE'
            ELSE 'RESULTADO PR-19: NO CUMPLE (' || COUNT(*) || ' cédulas coinciden)'
       END AS resultado
FROM   clinica_dev.pacientes d
       JOIN clinica.pacientes p ON p.cedula = d.cedula;

SPOOL OFF
