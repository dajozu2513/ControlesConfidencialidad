--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v10_eliminacion.sql
-- Contenedor: XEPDB1
-- Prueba   : PR-15 (eliminación segura de objetos; papelera vacía)
-- Control  : ISO/IEC 27001:2022 A.8.10 (borrado de información)
--
-- PR-15: se crea y elimina una tabla temporal y se vacía la papelera de
--        reciclaje; dba_recyclebin debe quedar en 0. El borrado obsoleto de
--        respaldos (PR-16) se prueba en v10_obsoletos.rman.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v10_eliminacion.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v10_eliminacion PR-15

PROMPT
PROMPT --- Creación y borrado de CLINICA.TMP_BORRAR
CREATE TABLE clinica.tmp_borrar (id NUMBER, dato VARCHAR2(30)) TABLESPACE clinica_data;
INSERT INTO clinica.tmp_borrar VALUES (1, 'dato de prueba');
COMMIT;
DROP TABLE clinica.tmp_borrar;

PROMPT
PROMPT --- Objetos de CLINICA en la papelera antes de purgar
COLUMN owner FORMAT A10
COLUMN original_name FORMAT A20
SELECT owner, original_name, type
FROM   dba_recyclebin
WHERE  owner = 'CLINICA';

PROMPT
PROMPT --- Purga de la papelera
PURGE DBA_RECYCLEBIN;

PROMPT
COLUMN total_papelera FORMAT 999999
SELECT COUNT(*) AS total_papelera FROM dba_recyclebin;

PROMPT
COLUMN resultado FORMAT A60
SELECT CASE WHEN COUNT(*) = 0
            THEN 'RESULTADO PR-15: CUMPLE'
            ELSE 'RESULTADO PR-15: NO CUMPLE (' || COUNT(*) || ' objetos en papelera)'
       END AS resultado
FROM   dba_recyclebin;

SPOOL OFF
