--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s01_tde_keystore.sql
-- Contenedor: CDB$ROOT (keystore en modo unido para toda la CDB)
-- Fase PHVA: Hacer
-- Controles: ISO/IEC 27001:2022 A.8.24 (uso de criptografía),
--            A.5.33 (protección de registros), A.8.13 (respaldo de información)
--
-- Propósito:
--   Configurar Transparent Data Encryption (TDE) con un keystore de software:
--     1. Directorio WALLET_ROOT fuera del repositorio.
--     2. WALLET_ROOT en el SPFILE y reinicio de la instancia (solo si hace falta).
--     3. TDE_CONFIGURATION = KEYSTORE_CONFIGURATION=FILE.
--     4. Creación del keystore, apertura en todos los contenedores, clave
--        maestra con respaldo y keystore AUTO_LOGIN para abrir al reiniciar.
--     5. Copia de respaldo del keystore fuera del repositorio y de WALLET_ROOT.
--
-- ATENCIÓN: este script REINICIA LA INSTANCIA la primera vez que se ejecuta.
--
-- Ejecución (desde la raíz del repositorio):
--   sqlplus / as sysdba @sql/01_setup/s01_tde_keystore.sql
--   Re-ejecutable: cada paso comprueba el estado actual antes de actuar
--   (no reinicia, no recrea el keystore ni rota la clave si ya existen).
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

SPOOL evidencias/setup_s01_tde_keystore.txt

ALTER SESSION SET CONTAINER = CDB$ROOT;
@sql/01_setup/comun/encabezado.sql s01_tde_keystore

--------------------------------------------------------------------------------
-- 1. Directorios del keystore y de su respaldo
--    WALLET_ROOT\tde es la ubicación que Oracle usa para el keystore TDE
--    cuando TDE_CONFIGURATION indica KEYSTORE_CONFIGURATION=FILE.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. DIRECTORIOS DEL KEYSTORE
HOST if not exist "&ruta_wallet_root\tde" mkdir "&ruta_wallet_root\tde"
HOST if not exist "&ruta_respaldos\keystore" mkdir "&ruta_respaldos\keystore"
PROMPT WALLET_ROOT          : &ruta_wallet_root
PROMPT Respaldo del keystore: &ruta_respaldos\keystore

--------------------------------------------------------------------------------
-- 2. WALLET_ROOT en el SPFILE
--    Es un parámetro estático: se registra en el SPFILE y requiere reinicio.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. WALLET_ROOT EN SPFILE
ALTER SYSTEM SET WALLET_ROOT = '&ruta_wallet_root' SCOPE = SPFILE;

--------------------------------------------------------------------------------
-- 3. Reinicio condicional
--    Si el valor en memoria ya coincide con el deseado (re-ejecución), se
--    invoca sin_reinicio.sql; si no, reiniciar_bd.sql.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. REINICIO DE LA INSTANCIA
COLUMN script_reinicio NEW_VALUE v_script_reinicio NOPRINT
SELECT CASE
         WHEN UPPER(NVL(value, '-')) = UPPER('&ruta_wallet_root')
         THEN 'sql/01_setup/comun/sin_reinicio.sql'
         ELSE 'sql/01_setup/comun/reiniciar_bd.sql'
       END AS script_reinicio
FROM   v$parameter
WHERE  name = 'wallet_root';
@&v_script_reinicio

--------------------------------------------------------------------------------
-- 4. TDE_CONFIGURATION
--    Indica que el keystore es de tipo archivo (software keystore) ubicado en
--    WALLET_ROOT\tde. Es dinámico: SCOPE=BOTH lo aplica sin reinicio.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. TDE_CONFIGURATION
ALTER SYSTEM SET TDE_CONFIGURATION = 'KEYSTORE_CONFIGURATION=FILE' SCOPE = BOTH;

--------------------------------------------------------------------------------
-- 5. Keystore y clave maestra (ADMINISTER KEY MANAGEMENT)
--    Cada operación se ejecuta solo si el estado lo requiere:
--      a) CREATE KEYSTORE           si no existe (estado NOT_AVAILABLE).
--      b) SET KEYSTORE OPEN         si está cerrado (CONTAINER=ALL).
--      c) SET KEY WITH BACKUP       si algún contenedor no tiene clave maestra
--                                   (OPEN_NO_MASTER_KEY), en CONTAINER=ALL.
--      d) CREATE AUTO_LOGIN KEYSTORE para que el keystore abra solo al
--                                   reiniciar (cwallet.sso).
--    Las sentencias se ejecutan con EXECUTE IMMEDIATE para no exponer la
--    contraseña en la evidencia si ocurre un error.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 5. KEYSTORE Y CLAVE MAESTRA
DECLARE
  v_estado   v$encryption_wallet.status%TYPE;
  v_sin_clave NUMBER;

  FUNCTION estado_raiz RETURN VARCHAR2 IS
    v VARCHAR2(30);
  BEGIN
    SELECT status INTO v FROM v$encryption_wallet WHERE con_id = 1;
    RETURN v;
  END;
BEGIN
  -- a) Crear el keystore protegido por contraseña (ewallet.p12).
  v_estado := estado_raiz;
  IF v_estado = 'NOT_AVAILABLE' THEN
    EXECUTE IMMEDIATE
      'ADMINISTER KEY MANAGEMENT CREATE KEYSTORE IDENTIFIED BY "&pwd_keystore"';
    DBMS_OUTPUT.PUT_LINE('a) Keystore creado en &ruta_wallet_root\tde');
  ELSE
    DBMS_OUTPUT.PUT_LINE('a) Keystore ya existe (estado ' || v_estado || '); no se crea.');
  END IF;

  -- b) Abrir el keystore en la raíz y en todas las PDB.
  v_estado := estado_raiz;
  IF v_estado = 'CLOSED' THEN
    EXECUTE IMMEDIATE
      'ADMINISTER KEY MANAGEMENT SET KEYSTORE OPEN IDENTIFIED BY "&pwd_keystore" CONTAINER = ALL';
    DBMS_OUTPUT.PUT_LINE('b) Keystore abierto con CONTAINER=ALL.');
  ELSE
    DBMS_OUTPUT.PUT_LINE('b) Keystore ya abierto (estado ' || v_estado || ').');
  END IF;

  -- c) Crear la clave maestra (TDE master key) en todos los contenedores,
  --    respaldando antes el keystore (WITH BACKUP).
  SELECT COUNT(*) INTO v_sin_clave
  FROM   v$encryption_wallet
  WHERE  status = 'OPEN_NO_MASTER_KEY';
  IF v_sin_clave > 0 THEN
    EXECUTE IMMEDIATE
      'ADMINISTER KEY MANAGEMENT SET KEY USING TAG ''s01_clave_inicial'' '
      || 'IDENTIFIED BY "&pwd_keystore" WITH BACKUP USING ''s01_previo_set_key'' CONTAINER = ALL';
    DBMS_OUTPUT.PUT_LINE('c) Clave maestra creada en todos los contenedores (WITH BACKUP).');
  ELSE
    DBMS_OUTPUT.PUT_LINE('c) Todos los contenedores ya tienen clave maestra; no se rota.');
  END IF;

  -- d) Keystore de inicio automático (cwallet.sso). ORA-46630 indica que ya existe.
  BEGIN
    EXECUTE IMMEDIATE
      'ADMINISTER KEY MANAGEMENT CREATE AUTO_LOGIN KEYSTORE FROM KEYSTORE IDENTIFIED BY "&pwd_keystore"';
    DBMS_OUTPUT.PUT_LINE('d) Keystore AUTO_LOGIN creado.');
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLCODE = -46630 THEN
        DBMS_OUTPUT.PUT_LINE('d) Keystore AUTO_LOGIN ya existe (ORA-46630).');
      ELSE
        RAISE;
      END IF;
  END;
END;
/

--------------------------------------------------------------------------------
-- 6. Respaldo del keystore fuera del repositorio y fuera de WALLET_ROOT
--    BACKUP KEYSTORE genera ewallet_<fecha>_<identificador>.p12 en la ruta
--    indicada. FORCE KEYSTORE abre temporalmente el keystore con contraseña
--    si el que está en uso es el AUTO_LOGIN.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 6. RESPALDO DEL KEYSTORE
BEGIN
  EXECUTE IMMEDIATE
    'ADMINISTER KEY MANAGEMENT BACKUP KEYSTORE USING ''s01_respaldo'' FORCE KEYSTORE '
    || 'IDENTIFIED BY "&pwd_keystore" TO ''&ruta_respaldos\keystore''';
  DBMS_OUTPUT.PUT_LINE('Respaldo del keystore generado en &ruta_respaldos\keystore');
END;
/

--------------------------------------------------------------------------------
-- 7. Verificación
--    Parámetros vigentes, estado del keystore por contenedor y claves maestras.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 7. VERIFICACIÓN

COLUMN parametro FORMAT A20
COLUMN valor     FORMAT A60

SELECT name AS parametro, value AS valor
FROM   v$parameter
WHERE  name IN ('wallet_root', 'tde_configuration')
ORDER  BY name;

COLUMN wrl_type        FORMAT A8
COLUMN wrl_parameter   FORMAT A50
COLUMN status          FORMAT A20
COLUMN wallet_type     FORMAT A12
COLUMN keystore_mode   FORMAT A8
COLUMN fully_backed_up FORMAT A9
COLUMN con_id          FORMAT 999999

SELECT wrl_type, wrl_parameter, status, wallet_type, keystore_mode,
       fully_backed_up, con_id
FROM   v$encryption_wallet
ORDER  BY con_id;

COLUMN tag             FORMAT A20
COLUMN creation_time   FORMAT A20
COLUMN activation_time FORMAT A20
COLUMN keystore_type   FORMAT A18
COLUMN backed_up       FORMAT A9

SELECT con_id,
       tag,
       TO_CHAR(creation_time,   'YYYY-MM-DD HH24:MI:SS') AS creation_time,
       TO_CHAR(activation_time, 'YYYY-MM-DD HH24:MI:SS') AS activation_time,
       keystore_type,
       backed_up
FROM   v$encryption_keys
ORDER  BY con_id, creation_time;

SPOOL OFF
