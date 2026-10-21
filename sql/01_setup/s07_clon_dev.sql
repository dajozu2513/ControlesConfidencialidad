--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s07_clon_dev.sql
-- Contenedor: XEPDB1 (ejecutar como SYS)
-- Fase PHVA: Hacer
-- Controles: ISO/IEC 27001:2022 A.8.11 (enmascaramiento de datos), A.8.31
--            (separación de entornos), A.8.33 (información de prueba)
--
-- Propósito:
--   Crear un clon de desarrollo CLINICA_DEV con enmascaramiento ESTÁTICO: los
--   datos se transforman durante la copia (CTAS), por lo que los valores
--   originales nunca se escriben en el esquema de desarrollo.
--     - Cédula            : generada con prefijo 9 (9-NNNN-NNNN), que no se
--                           usa en los datos de producción.
--     - Nombre            : "Paciente <id>".
--     - Fecha nacimiento  : desplazada al azar hasta 180 días.
--     - Teléfono          : aleatorio con formato NNNN-NNNN.
--     - Correo            : paciente<id>@ejemplo.test.
--     - Dirección         : "Dirección de prueba <id>".
--     - Diagnóstico y tratamiento: tomados de un catálogo genérico ficticio.
--     - Médicos           : nombre conservado ([PUBLICA]); usuario de BD
--                           reemplazado.
--   Los identificadores se conservan para mantener la integridad referencial.
--   Se otorga SELECT a ROL_DESARROLLO.
--
-- Requisito: s02 y s03 ejecutados. Se ejecuta como SYS, que no está sujeto a
--            VPD ni a Data Redaction y puede leer el origen completo.
-- Re-ejecutable: elimina el usuario CLINICA_DEV si existe.
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

SPOOL evidencias/setup_s07_clon_dev.txt

ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/01_setup/comun/encabezado.sql s07_clon_dev

--------------------------------------------------------------------------------
-- 1. Limpieza de una ejecución anterior (ORA-01918: usuario inexistente)
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. LIMPIEZA DE OBJETOS PREVIOS
BEGIN
  EXECUTE IMMEDIATE 'DROP USER clinica_dev CASCADE';
  DBMS_OUTPUT.PUT_LINE('Ejecutado: DROP USER clinica_dev CASCADE');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -1918 THEN
      DBMS_OUTPUT.PUT_LINE('Omitido  : DROP USER clinica_dev CASCADE (ORA-01918, no existía)');
    ELSE
      RAISE;
    END IF;
END;
/

--------------------------------------------------------------------------------
-- 2. Usuario CLINICA_DEV
--    Cuenta de esquema bloqueada. Usa el tablespace USERS (sin cifrar): el
--    clon no contiene datos reales, por lo que no requiere TDE.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. USUARIO CLINICA_DEV
BEGIN
  EXECUTE IMMEDIATE 'CREATE USER clinica_dev IDENTIFIED BY "&pwd_clinica_dev" '
                 || 'DEFAULT TABLESPACE users '
                 || 'QUOTA UNLIMITED ON users '
                 || 'ACCOUNT LOCK';
  DBMS_OUTPUT.PUT_LINE('Usuario CLINICA_DEV creado (bloqueado).');
END;
/

--------------------------------------------------------------------------------
-- 3. Copia enmascarada de MEDICOS
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. CLINICA_DEV.MEDICOS
CREATE TABLE clinica_dev.medicos AS
SELECT id,
       nombre,
       CAST('USUARIO_DEV_' || id AS VARCHAR2(30)) AS usuario_bd
FROM   clinica.medicos;

--------------------------------------------------------------------------------
-- 4. Copia enmascarada de PACIENTES
--    La cédula combina el prefijo 9, el id (garantiza unicidad) y 4 dígitos
--    aleatorios.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. CLINICA_DEV.PACIENTES
CREATE TABLE clinica_dev.pacientes AS
SELECT id,
       CAST('9-' || LPAD(id, 4, '0') || '-'
            || LPAD(TRUNC(DBMS_RANDOM.VALUE(0, 10000)), 4, '0') AS VARCHAR2(11)) AS cedula,
       CAST('Paciente ' || id AS VARCHAR2(100))                                   AS nombre,
       fecha_nacimiento + TRUNC(DBMS_RANDOM.VALUE(-180, 181))                     AS fecha_nacimiento,
       CAST(TRUNC(DBMS_RANDOM.VALUE(2000, 10000)) || '-'
            || LPAD(TRUNC(DBMS_RANDOM.VALUE(0, 10000)), 4, '0') AS VARCHAR2(9))  AS telefono,
       CAST('paciente' || id || '@ejemplo.test' AS VARCHAR2(100))                 AS correo,
       CAST('Dirección de prueba ' || id AS VARCHAR2(200))                        AS direccion
FROM   clinica.pacientes;

--------------------------------------------------------------------------------
-- 5. Copia enmascarada de CONSULTAS
--    Cada consulta recibe un par diagnóstico/tratamiento del catálogo
--    genérico, elegido por ORA_HASH del id (sin relación con el dato real).
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 5. CLINICA_DEV.CONSULTAS
CREATE TABLE clinica_dev.consultas AS
WITH catalogo AS (
  SELECT 1 AS n, 'Diagnóstico genérico de prueba A' AS diagnostico, 'Indicación genérica de prueba A' AS tratamiento FROM dual UNION ALL
  SELECT 2,      'Diagnóstico genérico de prueba B',                'Indicación genérica de prueba B'                FROM dual UNION ALL
  SELECT 3,      'Diagnóstico genérico de prueba C',                'Indicación genérica de prueba C'                FROM dual UNION ALL
  SELECT 4,      'Diagnóstico genérico de prueba D',                'Indicación genérica de prueba D'                FROM dual UNION ALL
  SELECT 5,      'Diagnóstico genérico de prueba E',                'Indicación genérica de prueba E'                FROM dual UNION ALL
  SELECT 6,      'Diagnóstico genérico de prueba F',                'Indicación genérica de prueba F'                FROM dual
)
SELECT c.id,
       c.paciente_id,
       c.medico_id,
       c.fecha,
       CAST(k.diagnostico AS VARCHAR2(200)) AS diagnostico,
       CAST(k.tratamiento AS VARCHAR2(300)) AS tratamiento
FROM   clinica.consultas c
       JOIN catalogo k ON k.n = ORA_HASH(c.id, 5) + 1;

--------------------------------------------------------------------------------
-- 6. Claves primarias y clasificación del clon
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 6. CLAVES Y COMENTARIOS
ALTER TABLE clinica_dev.medicos   ADD CONSTRAINT pk_dev_medicos   PRIMARY KEY (id);
ALTER TABLE clinica_dev.pacientes ADD CONSTRAINT pk_dev_pacientes PRIMARY KEY (id);
ALTER TABLE clinica_dev.consultas ADD CONSTRAINT pk_dev_consultas PRIMARY KEY (id);

COMMENT ON TABLE clinica_dev.medicos   IS '[INTERNA] Clon de desarrollo enmascarado de CLINICA.MEDICOS';
COMMENT ON TABLE clinica_dev.pacientes IS '[INTERNA] Clon de desarrollo enmascarado de CLINICA.PACIENTES';
COMMENT ON TABLE clinica_dev.consultas IS '[INTERNA] Clon de desarrollo enmascarado de CLINICA.CONSULTAS';

--------------------------------------------------------------------------------
-- 7. Acceso para desarrollo
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 7. PRIVILEGIOS DE ROL_DESARROLLO
GRANT SELECT ON clinica_dev.medicos   TO rol_desarrollo;
GRANT SELECT ON clinica_dev.pacientes TO rol_desarrollo;
GRANT SELECT ON clinica_dev.consultas TO rol_desarrollo;

--------------------------------------------------------------------------------
-- 8. Verificación
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 8. VERIFICACIÓN
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

PROMPT Muestra de pacientes enmascarados:
COLUMN cedula    FORMAT A11
COLUMN nombre    FORMAT A12
COLUMN telefono  FORMAT A9
COLUMN correo    FORMAT A26
COLUMN direccion FORMAT A24
SELECT id, cedula, nombre, fecha_nacimiento, telefono, correo, direccion
FROM   clinica_dev.pacientes
WHERE  id <= 5
ORDER  BY id;

PROMPT Muestra de consultas enmascaradas:
COLUMN diagnostico FORMAT A34
COLUMN tratamiento FORMAT A33
SELECT id, paciente_id, medico_id, diagnostico, tratamiento
FROM   clinica_dev.consultas
WHERE  id <= 5
ORDER  BY id;

PROMPT Coincidencias con datos de origen (todas deben ser 0):
SELECT (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.cedula   = d.cedula)   AS cedulas,
       (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.nombre   = d.nombre)   AS nombres,
       (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.telefono = d.telefono) AS telefonos,
       (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.correo   = d.correo)   AS correos,
       (SELECT COUNT(*) FROM clinica_dev.consultas d JOIN clinica.consultas c ON c.diagnostico = d.diagnostico) AS diagnosticos
FROM   dual;

PROMPT Cédulas del clon fuera del formato 9-NNNN-NNNN (debe ser 0):
SELECT COUNT(*) AS cedulas_invalidas
FROM   clinica_dev.pacientes
WHERE  NOT REGEXP_LIKE(cedula, '^9-[0-9]{4}-[0-9]{4}$');

PROMPT Estado de CLINICA_DEV y privilegios otorgados:
COLUMN username       FORMAT A12
COLUMN account_status FORMAT A16
SELECT username, account_status, default_tablespace
FROM   dba_users
WHERE  username = 'CLINICA_DEV';

COLUMN grantee    FORMAT A15
COLUMN table_name FORMAT A12
SELECT grantee, table_name, privilege
FROM   dba_tab_privs
WHERE  owner = 'CLINICA_DEV'
ORDER  BY table_name;

SPOOL OFF
