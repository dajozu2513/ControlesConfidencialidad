--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v14_auditoria.sql
-- Contenedor: XEPDB1
-- Prueba   : PR-23 (trazabilidad del acceso a datos sensibles)
-- Control  : ISO/IEC 27001:2022 A.8.15 (registro), A.8.16 (seguimiento)
--
-- PR-23: un acceso de MED_ROJAS a CLINICA.CONSULTAS queda registrado en la
--        auditoría unificada y el rol auditor (AUD_VEGA) puede consultarlo
--        sin privilegios sobre los datos. Conexiones por TCP.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v14_auditoria.txt

PROMPT
PROMPT --- PR-23: MED_ROJAS accede a CLINICA.CONSULTAS (acción a auditar)
CONNECT MED_ROJAS/&pwd_med_rojas@//localhost:1521/&pdb_nombre
@sql/02_verificacion/comun/cabecera.sql v14_auditoria PR-23
SELECT COUNT(*) AS filas_vistas FROM clinica.consultas;

PROMPT
PROMPT --- Volcado de la auditoría a disco (como SYS)
CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
EXEC DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;

PROMPT
PROMPT --- PR-23: el auditor AUD_VEGA consulta el registro del acceso de MED_ROJAS
CONNECT AUD_VEGA/&pwd_aud_vega@//localhost:1521/&pdb_nombre
COLUMN dbusername  FORMAT A12
COLUMN object_name FORMAT A12
COLUMN action_name FORMAT A10
COLUMN cuando      FORMAT A20
SELECT dbusername, object_name, action_name,
       TO_CHAR(event_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS cuando
FROM   unified_audit_trail
WHERE  dbusername = 'MED_ROJAS'
AND    object_schema = 'CLINICA' AND object_name = 'CONSULTAS'
AND    event_timestamp >= TRUNC(SYSTIMESTAMP)
ORDER  BY event_timestamp;

PROMPT
PROMPT --- Políticas de auditoría habilitadas (vista del auditor)
COLUMN policy_name    FORMAT A26
COLUMN enabled_option FORMAT A14
COLUMN entity_name    FORMAT A12
SELECT policy_name, enabled_option, entity_name
FROM   audit_unified_enabled_policies
ORDER  BY policy_name, entity_name;

PROMPT
SET SERVEROUTPUT ON
DECLARE
  v_n NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_n
  FROM   unified_audit_trail
  WHERE  dbusername = 'MED_ROJAS'
  AND    object_schema = 'CLINICA' AND object_name = 'CONSULTAS'
  AND    event_timestamp >= TRUNC(SYSTIMESTAMP);
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-23: '
    || CASE WHEN v_n > 0 THEN 'CUMPLE' ELSE 'NO CUMPLE' END
    || ' (' || v_n || ' registros del acceso de MED_ROJAS)');
END;
/

SPOOL OFF
