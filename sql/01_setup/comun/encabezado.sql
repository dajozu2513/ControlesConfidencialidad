--------------------------------------------------------------------------------
-- Encabezado común de evidencia para los scripts de sql/01_setup.
-- Uso: @sql/01_setup/comun/encabezado.sql <nombre_script>
-- Registra cuándo, con qué usuario y en qué contenedor se ejecutó el script.
-- Se invoca después de ALTER SESSION SET CONTAINER; DBMS_OUTPUT se habilita
-- aquí porque el cambio de contenedor descarta la habilitación previa.
--------------------------------------------------------------------------------
SET SERVEROUTPUT ON SIZE UNLIMITED
PROMPT
PROMPT ================================================================================
PROMPT  EVIDENCIA DE CONFIGURACIÓN - &1
PROMPT  Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c
PROMPT ================================================================================

COLUMN fecha_hora    FORMAT A28
COLUMN usuario       FORMAT A10
COLUMN contenedor    FORMAT A12
COLUMN con_id        FORMAT A6
COLUMN instancia     FORMAT A10
COLUMN autenticacion FORMAT A13

SELECT TO_CHAR(SYSTIMESTAMP, 'YYYY-MM-DD HH24:MI:SS TZH:TZM') AS fecha_hora,
       SYS_CONTEXT('USERENV', 'SESSION_USER')                 AS usuario,
       SYS_CONTEXT('USERENV', 'CON_NAME')                     AS contenedor,
       SYS_CONTEXT('USERENV', 'CON_ID')                       AS con_id,
       SYS_CONTEXT('USERENV', 'INSTANCE_NAME')                AS instancia,
       SYS_CONTEXT('USERENV', 'AUTHENTICATION_METHOD')        AS autenticacion
FROM   dual;

COLUMN fecha_hora    CLEAR
COLUMN usuario       CLEAR
COLUMN contenedor    CLEAR
COLUMN con_id        CLEAR
COLUMN instancia     CLEAR
COLUMN autenticacion CLEAR
