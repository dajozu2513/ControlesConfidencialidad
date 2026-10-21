--------------------------------------------------------------------------------
-- Proyecto : Marco de controles ISO/IEC 27001:2022 para confidencialidad
--            en la administración de bases de datos Oracle 21c
-- Script   : sql/00_entorno/00_verificar_entorno.sql
-- Fase PHVA: Hacer (línea base del entorno antes de implementar controles)
--
-- Propósito:
--   Verificar, en modo de SOLO LECTURA, qué funciones de seguridad orientadas
--   a la confidencialidad están disponibles en la instancia: versión y edición,
--   arquitectura multitenant, opciones licenciadas/instaladas, estado del
--   wallet TDE, paquetes de Data Redaction y VPD, auditoría unificada y
--   cifrado de red de la sesión.
--
--   El script NO modifica la base de datos: solo ejecuta consultas SELECT
--   sobre vistas del diccionario y vistas dinámicas de rendimiento (V$).
--
-- Ejecución (desde la raíz del repositorio, como SYSDBA):
--   sqlplus / as sysdba @sql/00_entorno/00_verificar_entorno.sql
--   Se ejecuta una vez en CDB$ROOT y otra en la PDB. La salida se AGREGA
--   (APPEND) a evidencias/00_entorno.txt; cada ejecución queda separada por
--   un encabezado con fecha y contenedor. Para una evidencia limpia, borrar
--   el archivo antes de la primera ejecución.
--------------------------------------------------------------------------------

-- Formato de salida: sin eco de comandos ni sustitución de variables,
-- líneas anchas y sin espacios sobrantes al final en el archivo spool.
SET ECHO OFF
SET VERIFY OFF
SET FEEDBACK ON
SET HEADING ON
SET PAGESIZE 200
SET LINESIZE 220
SET TRIMSPOOL ON
SET TRIMOUT ON
SET TAB OFF
SET NULL "(nulo)"

-- Si una vista no existe o falta un privilegio, se registra el error y el
-- script continúa con el siguiente bloque.
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/00_entorno.txt APPEND

--------------------------------------------------------------------------------
-- 0. Encabezado de la ejecución
--    Identifica cuándo, con qué usuario y en qué contenedor se generó la
--    evidencia, y por qué protocolo llegó la sesión (beq = local, tcp = red).
--------------------------------------------------------------------------------
PROMPT
PROMPT ================================================================================
PROMPT  VERIFICACIÓN DEL ENTORNO - ISO/IEC 27001:2022 / ORACLE 21c
PROMPT ================================================================================

COLUMN fecha_hora   FORMAT A35
COLUMN usuario      FORMAT A15
COLUMN contenedor   FORMAT A15
COLUMN con_id       FORMAT A6
COLUMN servicio     FORMAT A35
COLUMN protocolo    FORMAT A10
COLUMN autenticacion FORMAT A15

SELECT TO_CHAR(SYSTIMESTAMP, 'YYYY-MM-DD HH24:MI:SS TZH:TZM') AS fecha_hora,
       USER                                                   AS usuario,
       SYS_CONTEXT('USERENV', 'CON_NAME')                     AS contenedor,
       SYS_CONTEXT('USERENV', 'CON_ID')                       AS con_id,
       SYS_CONTEXT('USERENV', 'SERVICE_NAME')                 AS servicio,
       NVL(SYS_CONTEXT('USERENV', 'NETWORK_PROTOCOL'), 'beq') AS protocolo,
       SYS_CONTEXT('USERENV', 'AUTHENTICATION_METHOD')        AS autenticacion
FROM   dual;

--------------------------------------------------------------------------------
-- 1. Versión y edición
--    V$VERSION muestra el banner completo del producto; V$INSTANCE aporta la
--    versión exacta (VERSION_FULL) y la edición (EE, SE2, XE). La edición
--    determina qué opciones de seguridad están incluidas.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. VERSIÓN Y EDICIÓN -------------------------------------------------------

COLUMN banner_full FORMAT A110 WORD_WRAPPED

SELECT banner_full FROM v$version;

COLUMN instance_name FORMAT A12
COLUMN host_name     FORMAT A25
COLUMN version_full  FORMAT A14
COLUMN edition       FORMAT A8
COLUMN status        FORMAT A10
COLUMN database_type FORMAT A10

SELECT instance_name, host_name, version_full, edition, status, database_type
FROM   v$instance;

--------------------------------------------------------------------------------
-- 2. Arquitectura multitenant
--    V$DATABASE.CDB indica si la base es contenedora (CDB). V$PDBS lista las
--    bases conectables: desde CDB$ROOT se ven todas; desde una PDB solo ella
--    misma. Los controles del proyecto se aplicarán en la PDB.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. ARQUITECTURA MULTITENANT (CDB / PDB) ------------------------------------

COLUMN name      FORMAT A12
COLUMN cdb       FORMAT A4
COLUMN open_mode FORMAT A12
COLUMN log_mode  FORMAT A13

SELECT name, cdb, open_mode, log_mode
FROM   v$database;

COLUMN con_id     FORMAT 999999
COLUMN restricted FORMAT A10

SELECT con_id, name, open_mode, restricted
FROM   v$pdbs
ORDER  BY con_id;

--------------------------------------------------------------------------------
-- 3. Opciones de seguridad (V$OPTION)
--    Se consulta una lista fija de opciones relevantes para la confidencialidad.
--    Si una opción no aparece en V$OPTION en esta versión, se informa como
--    "NO LISTADA" en lugar de omitirse.
--      - Advanced Security / Transparent Data Encryption: cifrado en reposo
--        (TDE) y Data Redaction.
--      - Unified Auditing: TRUE indica auditoría unificada pura.
--      - Fine-grained access control: Virtual Private Database (VPD).
--      - Oracle Label Security: control de acceso por etiquetas.
--      - Oracle Database Vault: separación de funciones del DBA (referencia).
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. OPCIONES DE SEGURIDAD (V$OPTION) ----------------------------------------

COLUMN opcion FORMAT A35
COLUMN valor  FORMAT A12

WITH opciones_buscadas AS (
  SELECT 1 AS orden, 'Advanced Security'            AS opcion FROM dual UNION ALL
  SELECT 2,          'Transparent Data Encryption'            FROM dual UNION ALL
  SELECT 3,          'Unified Auditing'                       FROM dual UNION ALL
  SELECT 4,          'Fine-grained access control'            FROM dual UNION ALL
  SELECT 5,          'Oracle Label Security'                  FROM dual UNION ALL
  SELECT 6,          'Oracle Database Vault'                  FROM dual
)
SELECT b.opcion,
       NVL(o.value, 'NO LISTADA') AS valor
FROM   opciones_buscadas b
       LEFT JOIN v$option o ON o.parameter = b.opcion
ORDER  BY b.orden;

--------------------------------------------------------------------------------
-- 4. Wallet TDE (keystore)
--    V$ENCRYPTION_WALLET muestra, por contenedor, el tipo y ubicación del
--    keystore y su estado (NOT_AVAILABLE, CLOSED, OPEN, OPEN_NO_MASTER_KEY).
--    Los parámetros WALLET_ROOT y TDE_CONFIGURATION definen dónde y cómo se
--    gestiona el keystore en 21c. También se listan los tablespaces cifrados.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. WALLET TDE Y CIFRADO EN REPOSO ------------------------------------------

COLUMN wrl_type        FORMAT A8
COLUMN wrl_parameter   FORMAT A45 WORD_WRAPPED
COLUMN status          FORMAT A20
COLUMN wallet_type     FORMAT A12
COLUMN keystore_mode   FORMAT A8
COLUMN fully_backed_up FORMAT A9
COLUMN con_id          FORMAT 999999

SELECT wrl_type, wrl_parameter, status, wallet_type, keystore_mode,
       fully_backed_up, con_id
FROM   v$encryption_wallet
ORDER  BY con_id;

COLUMN parametro FORMAT A20
COLUMN valor     FORMAT A60 WORD_WRAPPED
COLUMN modificable_sesion FORMAT A10
COLUMN modificable_sistema FORMAT A10

SELECT name            AS parametro,
       NVL(value, '(sin valor)') AS valor,
       isses_modifiable AS modificable_sesion,
       issys_modifiable AS modificable_sistema
FROM   v$parameter
WHERE  name IN ('wallet_root', 'tde_configuration')
ORDER  BY name;

COLUMN tablespace_name FORMAT A20
COLUMN encrypted       FORMAT A9

SELECT tablespace_name, encrypted
FROM   dba_tablespaces
ORDER  BY tablespace_name;

--------------------------------------------------------------------------------
-- 5. Paquetes de Data Redaction y Virtual Private Database
--    DBMS_REDACT permite enmascarar datos en las consultas (Data Redaction).
--    DBMS_RLS permite políticas de seguridad a nivel de fila (VPD).
--    Se verifica que existan en el esquema SYS y que estén en estado VALID.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 5. PAQUETES DBMS_REDACT Y DBMS_RLS -----------------------------------------

COLUMN paquete     FORMAT A15
COLUMN object_type FORMAT A15
COLUMN status      FORMAT A12

WITH paquetes_buscados AS (
  SELECT 'DBMS_REDACT' AS paquete FROM dual UNION ALL
  SELECT 'DBMS_RLS'               FROM dual
)
SELECT p.paquete,
       NVL(o.object_type, '-')       AS object_type,
       NVL(o.status, 'NO EXISTE')    AS status
FROM   paquetes_buscados p
       LEFT JOIN dba_objects o
              ON  o.owner       = 'SYS'
              AND o.object_name = p.paquete
              AND o.object_type IN ('PACKAGE', 'PACKAGE BODY')
ORDER  BY p.paquete, o.object_type;

--------------------------------------------------------------------------------
-- 6. Auditoría unificada
--    AUDIT_UNIFIED_ENABLED_POLICIES lista las políticas de auditoría
--    unificada habilitadas y a quién aplican. Sirve como línea base de lo que
--    ya se audita antes de definir las políticas propias del proyecto.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 6. POLÍTICAS DE AUDITORÍA UNIFICADA HABILITADAS ----------------------------

COLUMN policy_name    FORMAT A35
COLUMN enabled_option FORMAT A15
COLUMN entity_name    FORMAT A20
COLUMN entity_type    FORMAT A8
COLUMN success        FORMAT A7
COLUMN failure        FORMAT A7

SELECT policy_name, enabled_option, entity_name, entity_type, success, failure
FROM   audit_unified_enabled_policies
ORDER  BY policy_name, entity_name;

--------------------------------------------------------------------------------
-- 7. Cifrado de red de la sesión actual
--    V$SESSION_CONNECT_INFO muestra los adaptadores de servicio de red de la
--    sesión. Si el cifrado nativo está activo aparece una línea del tipo
--    "AES256 Encryption service adapter"; la integridad aparece como
--    "Crypto-checksumming service adapter". En una conexión local (beq) no
--    hay tráfico de red, por lo que este bloque solo es concluyente vía TCP.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 7. CIFRADO DE RED DE LA SESIÓN ACTUAL --------------------------------------

COLUMN network_service_banner FORMAT A95 WORD_WRAPPED
COLUMN authentication_type    FORMAT A12

SELECT network_service_banner, authentication_type
FROM   v$session_connect_info
WHERE  sid = SYS_CONTEXT('USERENV', 'SID')
ORDER  BY network_service_banner;

--------------------------------------------------------------------------------
-- 8. Resumen de disponibilidad
--    Consolida los resultados anteriores en una tabla única: cada función de
--    seguridad se marca como SI / NO y se indica el dato en que se basa.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 8. RESUMEN DE DISPONIBILIDAD -----------------------------------------------

COLUMN funcion    FORMAT A44
COLUMN disponible FORMAT A16
COLUMN evidencia  FORMAT A60 WORD_WRAPPED

WITH
  opt AS (
    SELECT parameter, value FROM v$option
  ),
  pkg AS (
    SELECT object_name
    FROM   dba_objects
    WHERE  owner = 'SYS'
    AND    object_type = 'PACKAGE'
    AND    status = 'VALID'
    AND    object_name IN ('DBMS_REDACT', 'DBMS_RLS')
  ),
  wal AS (
    SELECT MAX(status) AS status
    FROM   v$encryption_wallet
    WHERE  con_id = SYS_CONTEXT('USERENV', 'CON_ID')
  ),
  red AS (
    SELECT
      MAX(CASE WHEN network_service_banner LIKE '%Encryption service adapter%'
               THEN network_service_banner END) AS cifrado,
      MAX(CASE WHEN network_service_banner LIKE '%Crypto-checksumming service adapter%'
               THEN network_service_banner END) AS integridad
    FROM v$session_connect_info
    WHERE sid = SYS_CONTEXT('USERENV', 'SID')
  )
SELECT 'Cifrado en reposo (TDE)' AS funcion,
       CASE WHEN EXISTS (SELECT 1 FROM opt
                         WHERE parameter IN ('Advanced Security', 'Transparent Data Encryption')
                         AND   value = 'TRUE')
            THEN 'SI' ELSE 'NO' END AS disponible,
       'V$OPTION Advanced Security / Transparent Data Encryption' AS evidencia
FROM dual
UNION ALL
SELECT 'Wallet TDE abierto en este contenedor',
       CASE WHEN (SELECT status FROM wal) LIKE 'OPEN%' THEN 'SI' ELSE 'NO' END,
       'V$ENCRYPTION_WALLET.STATUS = ' || NVL((SELECT status FROM wal), '(sin fila)')
FROM dual
UNION ALL
SELECT 'Data Redaction (DBMS_REDACT)',
       CASE WHEN EXISTS (SELECT 1 FROM pkg WHERE object_name = 'DBMS_REDACT')
            THEN 'SI' ELSE 'NO' END,
       'Paquete SYS.DBMS_REDACT en estado VALID'
FROM dual
UNION ALL
SELECT 'Virtual Private Database (DBMS_RLS)',
       CASE WHEN EXISTS (SELECT 1 FROM pkg WHERE object_name = 'DBMS_RLS')
             AND EXISTS (SELECT 1 FROM opt
                         WHERE parameter = 'Fine-grained access control'
                         AND   value = 'TRUE')
            THEN 'SI' ELSE 'NO' END,
       'SYS.DBMS_RLS VALID y V$OPTION Fine-grained access control'
FROM dual
UNION ALL
SELECT 'Oracle Label Security',
       CASE WHEN EXISTS (SELECT 1 FROM opt
                         WHERE parameter = 'Oracle Label Security'
                         AND   value = 'TRUE')
            THEN 'SI' ELSE 'NO' END,
       'V$OPTION Oracle Label Security'
FROM dual
UNION ALL
SELECT 'Auditoria unificada pura',
       CASE WHEN EXISTS (SELECT 1 FROM opt
                         WHERE parameter = 'Unified Auditing'
                         AND   value = 'TRUE')
            THEN 'SI' ELSE 'NO (modo mixto)' END,
       'V$OPTION Unified Auditing (FALSE = modo mixto, igual se usan politicas)'
FROM dual
UNION ALL
SELECT 'Politicas de auditoria unificada activas',
       CASE WHEN (SELECT COUNT(*) FROM audit_unified_enabled_policies) > 0
            THEN 'SI' ELSE 'NO' END,
       (SELECT COUNT(DISTINCT policy_name) FROM audit_unified_enabled_policies)
         || ' politica(s) en AUDIT_UNIFIED_ENABLED_POLICIES'
FROM dual
UNION ALL
SELECT 'Cifrado de red en esta sesion',
       CASE WHEN (SELECT cifrado FROM red) IS NOT NULL THEN 'SI' ELSE 'NO' END,
       NVL((SELECT cifrado FROM red),
           'Sin adaptador de cifrado activo (protocolo: '
           || NVL(SYS_CONTEXT('USERENV', 'NETWORK_PROTOCOL'), 'beq') || ')')
FROM dual
UNION ALL
SELECT 'Integridad de red (checksum) en esta sesion',
       CASE WHEN (SELECT integridad FROM red) IS NOT NULL THEN 'SI' ELSE 'NO' END,
       NVL((SELECT integridad FROM red), 'Sin adaptador de checksum activo')
FROM dual;

PROMPT
PROMPT === FIN DE LA VERIFICACIÓN ===================================================

SPOOL OFF

-- Restablecer formato de sesión.
SET NULL ""
SET FEEDBACK ON
