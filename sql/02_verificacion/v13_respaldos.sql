--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v13_respaldos.sql
-- Contenedor: CDB$ROOT (conexión local SYSDBA)
-- Prueba   : PR-22 (respaldos cifrados y restaurables)
-- Control  : ISO/IEC 27001:2022 A.8.13 (respaldo), A.8.24 (criptografía)
--
-- PR-22 (parte cifrado): la configuración de RMAN tiene el cifrado activado y
--        todas las piezas de respaldo de XEPDB1 (con_id 3) están cifradas.
--        La validación de restauración se prueba en v13_validar.rman y la
--        evalúa ejecutar_todo.sh (parte restore validate).
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v13_respaldos.txt

CONNECT / AS SYSDBA
@sql/02_verificacion/comun/cabecera.sql v13_respaldos PR-22

PROMPT
PROMPT --- Configuración de cifrado de RMAN
COLUMN name  FORMAT A40
COLUMN value FORMAT A30
SELECT name, value
FROM   v$rman_configuration
WHERE  name LIKE '%ENCRYPTION%' OR name LIKE '%RETENTION%'
ORDER  BY name;

PROMPT
PROMPT --- Piezas de respaldo de XEPDB1 (con_id 3) y su estado de cifrado
COLUMN tag       FORMAT A22
COLUMN encrypted FORMAT A9
COLUMN fin       FORMAT A17
COLUMN handle    FORMAT A60
SELECT bs.tag, p.encrypted,
       TO_CHAR(p.completion_time, 'YYYY-MM-DD HH24:MI') AS fin,
       SUBSTR(p.handle, -55) AS handle
FROM   v$backup_piece p
       JOIN v$backup_set bs ON bs.set_stamp = p.set_stamp AND bs.set_count = p.set_count
WHERE  p.status = 'A'
AND    EXISTS (SELECT 1 FROM v$backup_datafile d
               WHERE d.set_stamp = p.set_stamp AND d.set_count = p.set_count
               AND   d.con_id = 3)
ORDER  BY p.completion_time;

PROMPT
COLUMN resultado FORMAT A70
SELECT CASE WHEN COUNT(*) > 0 AND SUM(CASE WHEN p.encrypted = 'YES' THEN 0 ELSE 1 END) = 0
            THEN 'RESULTADO PR-22 (cifrado): CUMPLE (' || COUNT(*) || ' piezas, todas cifradas)'
            ELSE 'RESULTADO PR-22 (cifrado): NO CUMPLE'
       END AS resultado
FROM   v$backup_piece p
WHERE  p.status = 'A'
AND    EXISTS (SELECT 1 FROM v$backup_datafile d
               WHERE d.set_stamp = p.set_stamp AND d.set_count = p.set_count
               AND   d.con_id = 3);

SPOOL OFF
