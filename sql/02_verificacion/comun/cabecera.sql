--------------------------------------------------------------------------------
-- Encabezado común de los scripts de verificación (sql/02_verificacion).
-- Uso: @sql/02_verificacion/comun/cabecera.sql <nombre_script> <ids_pruebas>
--   <ids_pruebas> sin espacios, por ejemplo PR-02,PR-03
-- Registra fecha, contenedor, usuario conectado y las pruebas que cubre.
-- Se reaplica el formato porque un CONNECT previo ejecuta glogin.sql.
--------------------------------------------------------------------------------
SET PAGESIZE 200
SET LINESIZE 200
SET TRIMSPOOL ON
SET TAB OFF
SET SERVEROUTPUT ON SIZE UNLIMITED

PROMPT
PROMPT ================================================================================
PROMPT  VERIFICACIÓN - &1
PROMPT  Pruebas cubiertas: &2
PROMPT ================================================================================

COLUMN fecha_hora    FORMAT A28
COLUMN usuario       FORMAT A12
COLUMN contenedor    FORMAT A12
COLUMN sesion_ip     FORMAT A16
COLUMN protocolo     FORMAT A10

SELECT TO_CHAR(SYSTIMESTAMP, 'YYYY-MM-DD HH24:MI:SS')    AS fecha_hora,
       SYS_CONTEXT('USERENV', 'SESSION_USER')            AS usuario,
       SYS_CONTEXT('USERENV', 'CON_NAME')                AS contenedor,
       NVL(SYS_CONTEXT('USERENV', 'IP_ADDRESS'), 'local') AS sesion_ip,
       NVL(SYS_CONTEXT('USERENV', 'NETWORK_PROTOCOL'), 'beq') AS protocolo
FROM   dual;

CLEAR COLUMNS
