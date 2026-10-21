--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v09_autenticacion_segura.sql
-- Contenedor: XEPDB1
-- Pruebas  : PR-13 (bloqueo por intentos fallidos), PR-14 (auditoría de
--            fallos y verificadores 12C)
-- Control  : ISO/IEC 27001:2022 A.8.5 (autenticación segura), A.5.17, A.8.15
--
-- PR-13: tras varios intentos con contraseña errónea, MED_MORA queda en
--        estado LOCKED(TIMED) (FAILED_LOGIN_ATTEMPTS = 5).
-- PR-14: los intentos fallidos quedan registrados (return_code 1017) y los
--        seis usuarios de prueba solo tienen verificador de contraseña 12C.
-- Al final se desbloquea MED_MORA para dejar el entorno limpio.
-- La contraseña 'clave_incorrecta' es un valor erróneo a propósito.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v09_autenticacion_segura.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v09_autenticacion_segura PR-13,PR-14

PROMPT
PROMPT --- PR-13: 6 intentos de conexión de MED_MORA con contraseña errónea
CONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre
CONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre
CONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre
CONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre
CONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre
CONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre

PROMPT
PROMPT --- PR-13: estado de la cuenta MED_MORA tras los intentos
CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
COLUMN username       FORMAT A12
COLUMN account_status FORMAT A16
SELECT username, account_status FROM dba_users WHERE username = 'MED_MORA';

COLUMN resultado FORMAT A60
SELECT CASE WHEN account_status = 'LOCKED(TIMED)'
            THEN 'RESULTADO PR-13: CUMPLE (' || account_status || ')'
            ELSE 'RESULTADO PR-13: NO CUMPLE (' || account_status || ')'
       END AS resultado
FROM   dba_users WHERE username = 'MED_MORA';

PROMPT
PROMPT --- PR-14: registro de los intentos fallidos (return_code 1017)
EXEC DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;

COLUMN intentos_fallidos FORMAT 999999
SELECT COUNT(*) AS intentos_fallidos
FROM   unified_audit_trail
WHERE  dbusername = 'MED_MORA' AND return_code = 1017
AND    event_timestamp >= TRUNC(SYSTIMESTAMP);

PROMPT
PROMPT --- PR-14: verificadores de contraseña de los usuarios de prueba (solo 12C)
COLUMN username          FORMAT A14
COLUMN password_versions FORMAT A18
SELECT username, password_versions
FROM   dba_users
WHERE  username IN ('MED_ROJAS','MED_MORA','RECEP_SOLIS','AUD_VEGA','DEV_CALVO','DBA_OPER')
ORDER  BY username;

PROMPT
SELECT CASE
         WHEN (SELECT COUNT(*) FROM unified_audit_trail
               WHERE dbusername = 'MED_MORA' AND return_code = 1017
               AND   event_timestamp >= TRUNC(SYSTIMESTAMP)) >= 5
          AND (SELECT COUNT(*) FROM dba_users
               WHERE username IN ('MED_ROJAS','MED_MORA','RECEP_SOLIS','AUD_VEGA','DEV_CALVO','DBA_OPER')
               AND   RTRIM(password_versions) <> '12C') = 0
         THEN 'RESULTADO PR-14: CUMPLE'
         ELSE 'RESULTADO PR-14: NO CUMPLE'
       END AS resultado
FROM   dual;

PROMPT
PROMPT --- Limpieza: desbloqueo de MED_MORA
ALTER USER med_mora ACCOUNT UNLOCK;
SELECT username, account_status FROM dba_users WHERE username = 'MED_MORA';

SPOOL OFF
