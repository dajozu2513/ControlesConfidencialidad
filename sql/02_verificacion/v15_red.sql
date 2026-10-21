--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v15_red.sql
-- Contenedor: XEPDB1
-- Pruebas  : PR-24 (cifrado de red AES256), PR-25 (integridad de red SHA256)
-- Control  : ISO/IEC 27001:2022 A.8.20 (seguridad de redes), A.8.24
--
-- Se ejecuta DESPUÉS de que ejecutar_todo.sh escriba, al inicio de
-- evidencias/v15_red.txt, las líneas relevantes del sqlnet.ora del servidor;
-- por eso este script hace SPOOL en modo APPEND.
-- PR-24/PR-25: una sesión por TCP (DBA_OPER) debe mostrar en
-- v$session_connect_info el adaptador de cifrado AES256 y el de integridad
-- SHA256.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v15_red.txt APPEND

CONNECT DBA_OPER/&pwd_dba_oper@//localhost:1521/&pdb_nombre
@sql/02_verificacion/comun/cabecera.sql v15_red PR-24,PR-25

PROMPT
PROMPT --- Adaptadores de servicio de red de la sesión TCP actual
COLUMN network_service_banner FORMAT A90
SELECT network_service_banner
FROM   v$session_connect_info
WHERE  sid = SYS_CONTEXT('USERENV', 'SID')
ORDER  BY network_service_banner;

PROMPT
SET SERVEROUTPUT ON
DECLARE
  v_aes NUMBER;
  v_sha NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_aes FROM v$session_connect_info
   WHERE sid = SYS_CONTEXT('USERENV','SID')
   AND   network_service_banner LIKE '%AES256%Encryption%';
  SELECT COUNT(*) INTO v_sha FROM v$session_connect_info
   WHERE sid = SYS_CONTEXT('USERENV','SID')
   AND   network_service_banner LIKE '%SHA256%Crypto-checksumming%';
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-24: '
    || CASE WHEN v_aes > 0 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (cifrado AES256)');
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-25: '
    || CASE WHEN v_sha > 0 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (integridad SHA256)');
END;
/

SPOOL OFF
