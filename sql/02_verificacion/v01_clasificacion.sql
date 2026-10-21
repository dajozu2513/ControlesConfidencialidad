--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v01_clasificacion.sql
-- Contenedor: XEPDB1 (conexión local SYSDBA)
-- Prueba    : PR-01
-- Control   : ISO/IEC 27001:2022 A.5.12 (clasificación), A.5.13 (etiquetado)
--
-- Verifica que todas las columnas del esquema CLINICA tienen un comentario de
-- clasificación con uno de los prefijos [PUBLICA], [INTERNA], [CONFIDENCIAL]
-- o [SENSIBLE]. El resultado CUMPLE si no hay columnas sin clasificar.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v01_clasificacion.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v01_clasificacion PR-01

PROMPT
PROMPT --- Clasificación de cada columna de CLINICA
COLUMN tabla      FORMAT A12
COLUMN columna    FORMAT A18
COLUMN clase      FORMAT A14
COLUMN comentario FORMAT A70
SELECT c.table_name AS tabla,
       c.column_name AS columna,
       NVL(REGEXP_SUBSTR(k.comments, '^\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\]'),
           '(sin clase)') AS clase,
       k.comments AS comentario
FROM   dba_tab_columns c
       LEFT JOIN dba_col_comments k
              ON k.owner = c.owner AND k.table_name = c.table_name
             AND k.column_name = c.column_name
WHERE  c.owner = 'CLINICA'
ORDER  BY c.table_name, c.column_name;

PROMPT
PROMPT --- Columnas sin comentario de clasificación válido
COLUMN sin_clasificar FORMAT 999
SELECT COUNT(*) AS sin_clasificar
FROM   dba_tab_columns c
       LEFT JOIN dba_col_comments k
              ON k.owner = c.owner AND k.table_name = c.table_name
             AND k.column_name = c.column_name
WHERE  c.owner = 'CLINICA'
AND    NOT REGEXP_LIKE(NVL(k.comments, '-'), '^\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\]');

PROMPT
COLUMN resultado FORMAT A60
SELECT CASE WHEN COUNT(*) = 0
            THEN 'RESULTADO PR-01: CUMPLE'
            ELSE 'RESULTADO PR-01: NO CUMPLE (' || COUNT(*) || ' columnas sin clasificar)'
       END AS resultado
FROM   dba_tab_columns c
       LEFT JOIN dba_col_comments k
              ON k.owner = c.owner AND k.table_name = c.table_name
             AND k.column_name = c.column_name
WHERE  c.owner = 'CLINICA'
AND    NOT REGEXP_LIKE(NVL(k.comments, '-'), '^\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\]');

SPOOL OFF
