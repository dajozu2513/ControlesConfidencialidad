--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v06_proteccion_registros.sql
-- Contenedor: XEPDB1
-- Pruebas  : PR-08 (la pista de auditoría no se puede alterar por DML),
--            PR-09 (purga controlada que conserva los registros recientes)
-- Control  : ISO/IEC 27001:2022 A.5.28 (protección de evidencia), A.8.15
--
-- PR-08: DELETE directo sobre AUDSYS.AUD$UNIFIED, como DBA_OPER y como SYS,
--        debe ser rechazado (se espera ORA-46385). Se emite una línea de
--        resultado por cada intento.
-- PR-09: con la marca de archivado fijada a ayer, CLEAN_AUDIT_TRAIL con
--        use_last_arch_timestamp=TRUE no elimina los registros de hoy, y la
--        propia operación de DBMS_AUDIT_MGMT queda registrada.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v06_proteccion_registros.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v06_proteccion_registros PR-08,PR-09

PROMPT
PROMPT --- PR-08 (DBA_OPER): DELETE sobre AUDSYS.AUD$UNIFIED (se espera ORA-46385)
CONNECT DBA_OPER/&pwd_dba_oper@//localhost:1521/&pdb_nombre
SET SERVEROUTPUT ON
DECLARE
BEGIN
  EXECUTE IMMEDIATE 'DELETE FROM audsys.aud$unified';
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (DBA_OPER): NO CUMPLE (se permitió el DELETE)');
EXCEPTION
  WHEN OTHERS THEN
    -- ORA-46385: DML/DDL no permitido sobre la tabla de auditoría.
    -- ORA-00942 / ORA-01031: DBA_OPER ni siquiera puede ver AUDSYS.AUD$UNIFIED
    -- (AUDSYS está excluido de los privilegios ANY), lo que también impide el
    -- borrado. Cualquiera de los tres confirma el control.
    IF SQLCODE IN (-46385, -942, -1031) THEN
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (DBA_OPER): CUMPLE (ORA' || SQLCODE || ')');
    ELSE
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (DBA_OPER): NO CUMPLE (ORA' || SQLCODE || ')');
    END IF;
END;
/

PROMPT
PROMPT --- PR-08 (SYS): DELETE sobre AUDSYS.AUD$UNIFIED (se espera ORA-46385)
CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
SET SERVEROUTPUT ON
DECLARE
BEGIN
  EXECUTE IMMEDIATE 'DELETE FROM audsys.aud$unified';
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (SYS): NO CUMPLE (se permitió el DELETE)');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE IN (-46385, -1031) THEN
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (SYS): CUMPLE (ORA' || SQLCODE || ')');
    ELSE
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (SYS): NO CUMPLE (ORA' || SQLCODE || ')');
    END IF;
END;
/

PROMPT
PROMPT --- PR-09: purga controlada de la auditoría unificada (conserva lo de hoy)
COLUMN total_antes FORMAT 999999
SELECT COUNT(*) AS total_antes FROM unified_audit_trail;

DECLARE
  v_hoy_antes NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_hoy_antes
  FROM   unified_audit_trail
  WHERE  event_timestamp >= TRUNC(SYSTIMESTAMP);

  -- Marca como archivados los registros hasta ayer.
  DBMS_AUDIT_MGMT.SET_LAST_ARCHIVE_TIMESTAMP(
    audit_trail_type  => DBMS_AUDIT_MGMT.AUDIT_TRAIL_UNIFIED,
    last_archive_time => SYSTIMESTAMP - INTERVAL '1' DAY);

  -- Limpia solo lo archivado (anterior a ayer); no toca lo de hoy.
  DBMS_AUDIT_MGMT.CLEAN_AUDIT_TRAIL(
    audit_trail_type        => DBMS_AUDIT_MGMT.AUDIT_TRAIL_UNIFIED,
    use_last_arch_timestamp => TRUE);

  -- Vuelca a disco los registros aún en memoria.
  DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;

  DBMS_OUTPUT.PUT_LINE('Registros de hoy antes de limpiar: ' || v_hoy_antes);
END;
/

PROMPT
PROMPT --- PR-09: registros de hoy que permanecen y evidencia de la operación
COLUMN hoy_despues FORMAT 999999
SELECT COUNT(*) AS hoy_despues
FROM   unified_audit_trail
WHERE  event_timestamp >= TRUNC(SYSTIMESTAMP);

COLUMN evento FORMAT A40
COLUMN cuando FORMAT A20
SELECT DISTINCT action_name AS evento,
       TO_CHAR(MAX(event_timestamp) OVER (PARTITION BY action_name), 'YYYY-MM-DD HH24:MI') AS cuando
FROM   unified_audit_trail
WHERE  UPPER(object_name) = 'DBMS_AUDIT_MGMT'
AND    event_timestamp >= TRUNC(SYSTIMESTAMP);

PROMPT
COLUMN resultado FORMAT A70
SELECT CASE
         WHEN (SELECT COUNT(*) FROM unified_audit_trail
               WHERE event_timestamp >= TRUNC(SYSTIMESTAMP)) > 0
          AND (SELECT COUNT(*) FROM unified_audit_trail
               WHERE UPPER(object_name) = 'DBMS_AUDIT_MGMT'
               AND   event_timestamp >= TRUNC(SYSTIMESTAMP)) > 0
         THEN 'RESULTADO PR-09: CUMPLE'
         ELSE 'RESULTADO PR-09: NO CUMPLE'
       END AS resultado
FROM   dual;

SPOOL OFF
