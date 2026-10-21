--------------------------------------------------------------------------------
-- Script   : sql/01_setup/s02_esquema_clinica.sql
-- Contenedor: XEPDB1 (definido en config_local.sql como pdb_nombre)
-- Fase PHVA: Hacer
-- Controles: ISO/IEC 27001:2022 A.5.12 (clasificación de la información),
--            A.5.13 (etiquetado), A.8.24 (uso de criptografía)
--
-- Propósito:
--   Crear el esquema de la clínica ficticia sobre el que se aplican los
--   controles de confidencialidad:
--     1. Tablespace CLINICA_DATA cifrado con TDE (AES256) desde su creación.
--        Oracle XE no permite cifrar en línea un tablespace existente.
--     2. Usuario propietario CLINICA (cuenta de esquema, bloqueada).
--     3. Tablas MEDICOS, PACIENTES y CONSULTAS con PK, FK y validaciones.
--     4. Datos 100 % ficticios: 2 médicos, 20 pacientes y 30 consultas.
--     5. Clasificación de cada columna mediante COMMENT ON COLUMN con
--        prefijo [PUBLICA], [INTERNA], [CONFIDENCIAL] o [SENSIBLE].
--
-- Requisito: s01 ejecutado (keystore abierto con clave maestra en la PDB).
-- Re-ejecutable: elimina el usuario CLINICA y el tablespace si existen.
-- Al re-ejecutarlo se pierden los privilegios y políticas de s03 a s07, por
-- lo que deben volver a ejecutarse en orden.
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

SPOOL evidencias/setup_s02_esquema_clinica.txt

ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/01_setup/comun/encabezado.sql s02_esquema_clinica

--------------------------------------------------------------------------------
-- 1. Limpieza de una ejecución anterior
--    ORA-01918: el usuario no existe. ORA-00959: el tablespace no existe.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 1. LIMPIEZA DE OBJETOS PREVIOS
DECLARE
  PROCEDURE ejecutar(p_sql IN VARCHAR2, p_ignorar IN VARCHAR2) IS
  BEGIN
    EXECUTE IMMEDIATE p_sql;
    DBMS_OUTPUT.PUT_LINE('Ejecutado: ' || p_sql);
  EXCEPTION
    WHEN OTHERS THEN
      IF INSTR(',' || p_ignorar || ',', ',' || SQLCODE || ',') > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Omitido  : ' || p_sql || ' (ORA-'
                             || LPAD(ABS(SQLCODE), 5, '0') || ', no existía)');
      ELSE
        RAISE;
      END IF;
  END;
BEGIN
  ejecutar('DROP USER clinica CASCADE', '-1918');
  ejecutar('DROP TABLESPACE clinica_data INCLUDING CONTENTS AND DATAFILES', '-959');
END;
/

--------------------------------------------------------------------------------
-- 2. Tablespace cifrado
--    ENCRYPTION USING 'AES256' ENCRYPT cifra todos los bloques del tablespace
--    con la clave maestra de la PDB: los datafiles, los respaldos y los
--    bloques en disco quedan ilegibles sin el keystore.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 2. TABLESPACE CLINICA_DATA CIFRADO (AES256)
CREATE TABLESPACE clinica_data
  DATAFILE '&ruta_datafiles\CLINICA_DATA01.DBF' SIZE 50M REUSE
  AUTOEXTEND ON NEXT 10M MAXSIZE 500M
  ENCRYPTION USING 'AES256' ENCRYPT;

--------------------------------------------------------------------------------
-- 3. Usuario propietario del esquema
--    Solo recibe cuota en CLINICA_DATA; no tiene CREATE SESSION ni otros
--    privilegios. Los objetos los crea SYS en su nombre. Se crea mediante
--    EXECUTE IMMEDIATE para no exponer la contraseña en la evidencia.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 3. USUARIO CLINICA
BEGIN
  EXECUTE IMMEDIATE 'CREATE USER clinica IDENTIFIED BY "&pwd_clinica" '
                 || 'DEFAULT TABLESPACE clinica_data '
                 || 'QUOTA UNLIMITED ON clinica_data '
                 || 'ACCOUNT LOCK';
  DBMS_OUTPUT.PUT_LINE('Usuario CLINICA creado (bloqueado, sin CREATE SESSION).');
END;
/

--------------------------------------------------------------------------------
-- 4. Tablas
--    Las restricciones CHECK validan los formatos de cédula (N-NNNN-NNNN) y
--    teléfono (NNNN-NNNN) que luego usan las políticas de Data Redaction.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 4. TABLAS
CREATE TABLE clinica.medicos (
  id          NUMBER(4)     CONSTRAINT pk_medicos PRIMARY KEY,
  nombre      VARCHAR2(80)  NOT NULL,
  usuario_bd  VARCHAR2(30)  NOT NULL CONSTRAINT uq_medicos_usuario UNIQUE
) TABLESPACE clinica_data;

CREATE TABLE clinica.pacientes (
  id                NUMBER(6)     CONSTRAINT pk_pacientes PRIMARY KEY,
  cedula            VARCHAR2(11)  NOT NULL CONSTRAINT uq_pacientes_cedula UNIQUE
                                  CONSTRAINT ck_pacientes_cedula
                                  CHECK (REGEXP_LIKE(cedula, '^[1-9]-[0-9]{4}-[0-9]{4}$')),
  nombre            VARCHAR2(100) NOT NULL,
  fecha_nacimiento  DATE          NOT NULL,
  telefono          VARCHAR2(9)   CONSTRAINT ck_pacientes_telefono
                                  CHECK (REGEXP_LIKE(telefono, '^[0-9]{4}-[0-9]{4}$')),
  correo            VARCHAR2(100),
  direccion         VARCHAR2(200)
) TABLESPACE clinica_data;

CREATE TABLE clinica.consultas (
  id           NUMBER(8)      CONSTRAINT pk_consultas PRIMARY KEY,
  paciente_id  NUMBER(6)      NOT NULL CONSTRAINT fk_consultas_paciente
                              REFERENCES clinica.pacientes (id),
  medico_id    NUMBER(4)      NOT NULL CONSTRAINT fk_consultas_medico
                              REFERENCES clinica.medicos (id),
  fecha        DATE           NOT NULL,
  diagnostico  VARCHAR2(200)  NOT NULL,
  tratamiento  VARCHAR2(300)
) TABLESPACE clinica_data;

CREATE INDEX clinica.ix_consultas_paciente ON clinica.consultas (paciente_id) TABLESPACE clinica_data;
CREATE INDEX clinica.ix_consultas_medico   ON clinica.consultas (medico_id)   TABLESPACE clinica_data;

--------------------------------------------------------------------------------
-- 5. Clasificación de la información (COMMENT ON)
--    [PUBLICA]      puede divulgarse sin restricción.
--    [INTERNA]      uso interno de la clínica.
--    [CONFIDENCIAL] identifica o permite contactar a una persona.
--    [SENSIBLE]     dato de salud (categoría especial de datos personales).
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 5. CLASIFICACIÓN DE COLUMNAS
COMMENT ON TABLE clinica.medicos   IS '[INTERNA] Médicos de la clínica y su usuario de base de datos';
COMMENT ON TABLE clinica.pacientes IS '[CONFIDENCIAL] Datos de identificación y contacto de pacientes';
COMMENT ON TABLE clinica.consultas IS '[SENSIBLE] Atenciones médicas con diagnóstico y tratamiento';

COMMENT ON COLUMN clinica.medicos.id         IS '[INTERNA] Identificador interno del médico';
COMMENT ON COLUMN clinica.medicos.nombre     IS '[PUBLICA] Nombre profesional del médico';
COMMENT ON COLUMN clinica.medicos.usuario_bd IS '[INTERNA] Usuario de base de datos del médico (usado por la política VPD)';

COMMENT ON COLUMN clinica.pacientes.id               IS '[INTERNA] Identificador interno del paciente';
COMMENT ON COLUMN clinica.pacientes.cedula           IS '[CONFIDENCIAL] Cédula de identidad (N-NNNN-NNNN)';
COMMENT ON COLUMN clinica.pacientes.nombre           IS '[CONFIDENCIAL] Nombre completo del paciente';
COMMENT ON COLUMN clinica.pacientes.fecha_nacimiento IS '[CONFIDENCIAL] Fecha de nacimiento del paciente';
COMMENT ON COLUMN clinica.pacientes.telefono         IS '[CONFIDENCIAL] Teléfono de contacto (NNNN-NNNN)';
COMMENT ON COLUMN clinica.pacientes.correo           IS '[CONFIDENCIAL] Correo electrónico de contacto';
COMMENT ON COLUMN clinica.pacientes.direccion        IS '[CONFIDENCIAL] Dirección de residencia';

COMMENT ON COLUMN clinica.consultas.id          IS '[INTERNA] Identificador interno de la consulta';
COMMENT ON COLUMN clinica.consultas.paciente_id IS '[CONFIDENCIAL] Paciente atendido (vincula a la persona con la atención)';
COMMENT ON COLUMN clinica.consultas.medico_id   IS '[INTERNA] Médico tratante';
COMMENT ON COLUMN clinica.consultas.fecha       IS '[INTERNA] Fecha de la consulta';
COMMENT ON COLUMN clinica.consultas.diagnostico IS '[SENSIBLE] Diagnóstico médico';
COMMENT ON COLUMN clinica.consultas.tratamiento IS '[SENSIBLE] Tratamiento indicado';

--------------------------------------------------------------------------------
-- 6. Datos ficticios
--    Nombres, cédulas, teléfonos, correos (dominio reservado .test) y
--    direcciones son inventados. Las cédulas usan prefijos 1 a 7; el prefijo 9
--    queda reservado para el clon enmascarado de desarrollo (s07).
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 6. DATOS FICTICIOS
INSERT INTO clinica.medicos VALUES (1, 'Dra. Andrea Rojas Villalobos', 'MED_ROJAS');
INSERT INTO clinica.medicos VALUES (2, 'Dr. Mauricio Mora Calderón',   'MED_MORA');

INSERT INTO clinica.pacientes VALUES ( 1, '1-0452-0781', 'María Fernanda Solano Vargas', DATE '1985-03-14', '8812-4410', 'mfsolano@correo.test',   'San José, Curridabat, Granadilla');
INSERT INTO clinica.pacientes VALUES ( 2, '2-0613-0245', 'José Pablo Araya Quesada',     DATE '1978-11-02', '8723-1198', 'jparaya@correo.test',    'Alajuela, Grecia, San Isidro');
INSERT INTO clinica.pacientes VALUES ( 3, '1-1127-0533', 'Laura Jiménez Céspedes',       DATE '1992-06-21', '6045-7781', 'ljimenez@correo.test',   'San José, Desamparados, San Rafael Arriba');
INSERT INTO clinica.pacientes VALUES ( 4, '3-0388-0912', 'Carlos Andrés Brenes Monge',   DATE '1969-01-30', '8390-2256', 'cabrenes@correo.test',   'Cartago, Paraíso, Orosi');
INSERT INTO clinica.pacientes VALUES ( 5, '4-0201-0664', 'Sofía Alvarado Chaves',        DATE '2001-09-09', '7102-3348', 'salvarado@correo.test',  'Heredia, Barva, San Pedro');
INSERT INTO clinica.pacientes VALUES ( 6, '1-0987-0120', 'Andrés Valverde Rojas',        DATE '1988-12-17', '8456-9012', 'avalverde@correo.test',  'San José, Moravia, San Vicente');
INSERT INTO clinica.pacientes VALUES ( 7, '5-0312-0458', 'Daniela Campos Herrera',       DATE '1995-04-05', '8601-7735', 'dcampos@correo.test',    'Guanacaste, Liberia, Barrio Los Ángeles');
INSERT INTO clinica.pacientes VALUES ( 8, '6-0274-0819', 'Miguel Ángel Porras Salas',    DATE '1974-08-23', '8877-6643', 'maporras@correo.test',   'Puntarenas, Esparza, Espíritu Santo');
INSERT INTO clinica.pacientes VALUES ( 9, '7-0156-0371', 'Valeria Murillo Soto',         DATE '1999-02-11', '6123-4567', 'vmurillo@correo.test',   'Limón, Pococí, Guápiles');
INSERT INTO clinica.pacientes VALUES (10, '1-1302-0846', 'Esteban Navarro Arias',        DATE '1983-07-28', '8999-1203', 'enavarro@correo.test',   'San José, Escazú, San Rafael');
INSERT INTO clinica.pacientes VALUES (11, '2-0745-0119', 'Gabriela Ulate Fallas',        DATE '1990-10-03', '8234-5671', 'gulate@correo.test',     'Alajuela, San Ramón, Piedades Norte');
INSERT INTO clinica.pacientes VALUES (12, '3-0459-0627', 'Ricardo Sánchez Mora',         DATE '1965-05-19', '8312-0098', 'rsanchez@correo.test',   'Cartago, La Unión, Tres Ríos');
INSERT INTO clinica.pacientes VALUES (13, '4-0178-0954', 'Natalia Hidalgo Barrantes',    DATE '1997-12-01', '7012-8856', 'nhidalgo@correo.test',   'Heredia, Santo Domingo, Santa Rosa');
INSERT INTO clinica.pacientes VALUES (14, '1-0866-0302', 'Felipe Castro Zúñiga',         DATE '1981-03-26', '8645-3321', 'fcastro@correo.test',    'San José, Tibás, Cinco Esquinas');
INSERT INTO clinica.pacientes VALUES (15, '5-0221-0786', 'Paola Méndez Obando',          DATE '1987-09-15', '8578-6612', 'pmendez@correo.test',    'Guanacaste, Nicoya, San Martín');
INSERT INTO clinica.pacientes VALUES (16, '2-0532-0411', 'Diego Alfaro Segura',          DATE '2003-01-08', '6301-2289', 'dalfaro@correo.test',    'Alajuela, Atenas, Jesús');
INSERT INTO clinica.pacientes VALUES (17, '1-1415-0698', 'Camila Rodríguez León',        DATE '1993-11-30', '8790-4456', 'crodriguez@correo.test', 'San José, Goicoechea, Guadalupe');
INSERT INTO clinica.pacientes VALUES (18, '6-0391-0233', 'Jorge Luis Chacón Ugalde',     DATE '1958-06-12', '8411-9087', 'jlchacon@correo.test',   'Puntarenas, Garabito, Jacó');
INSERT INTO clinica.pacientes VALUES (19, '3-0512-0877', 'Mariana Quirós Ramírez',       DATE '1976-04-04', '8067-5543', 'mquiros@correo.test',    'Cartago, Oreamuno, San Rafael');
INSERT INTO clinica.pacientes VALUES (20, '4-0290-0145', 'Sebastián Cordero Elizondo',   DATE '2000-08-19', '7234-1190', 'scordero@correo.test',   'Heredia, San Rafael, Los Ángeles');

-- 18 consultas de MED_ROJAS (medico_id 1) y 12 de MED_MORA (medico_id 2).
INSERT INTO clinica.consultas VALUES ( 1,  1, 1, DATE '2026-01-12', 'Hipertensión arterial esencial',      'Losartán 50 mg cada 24 horas; control en 3 meses');
INSERT INTO clinica.consultas VALUES ( 2,  2, 1, DATE '2026-01-15', 'Diabetes mellitus tipo 2',            'Metformina 850 mg cada 12 horas; dieta y ejercicio');
INSERT INTO clinica.consultas VALUES ( 3,  3, 2, DATE '2026-01-20', 'Faringitis aguda',                    'Amoxicilina 500 mg cada 8 horas por 7 días');
INSERT INTO clinica.consultas VALUES ( 4,  4, 1, DATE '2026-01-22', 'Lumbalgia mecánica',                  'Ibuprofeno 400 mg cada 8 horas por 5 días; fisioterapia');
INSERT INTO clinica.consultas VALUES ( 5,  5, 1, DATE '2026-02-03', 'Rinitis alérgica',                    'Loratadina 10 mg cada 24 horas por 14 días');
INSERT INTO clinica.consultas VALUES ( 6,  6, 2, DATE '2026-02-05', 'Gastritis crónica',                   'Omeprazol 20 mg en ayunas por 30 días');
INSERT INTO clinica.consultas VALUES ( 7,  7, 1, DATE '2026-02-10', 'Infección urinaria baja',             'Nitrofurantoína 100 mg cada 12 horas por 5 días');
INSERT INTO clinica.consultas VALUES ( 8,  8, 1, DATE '2026-02-14', 'Hipertensión arterial esencial',      'Enalapril 10 mg cada 12 horas; dieta baja en sodio');
INSERT INTO clinica.consultas VALUES ( 9,  9, 2, DATE '2026-02-18', 'Asma bronquial leve',                 'Salbutamol inhalado a demanda');
INSERT INTO clinica.consultas VALUES (10, 10, 1, DATE '2026-02-25', 'Migraña sin aura',                    'Naproxeno 550 mg al inicio del dolor');
INSERT INTO clinica.consultas VALUES (11, 11, 1, DATE '2026-03-04', 'Anemia ferropénica',                  'Sulfato ferroso 300 mg cada 24 horas por 3 meses');
INSERT INTO clinica.consultas VALUES (12, 12, 2, DATE '2026-03-09', 'Diabetes mellitus tipo 2',            'Metformina 850 mg cada 12 horas; control de glicemia');
INSERT INTO clinica.consultas VALUES (13,  1, 1, DATE '2026-03-16', 'Control de hipertensión arterial',    'Continuar losartán 50 mg; control en 3 meses');
INSERT INTO clinica.consultas VALUES (14, 13, 1, DATE '2026-03-20', 'Dermatitis atópica',                  'Crema hidratante e hidrocortisona 1 % por 7 días');
INSERT INTO clinica.consultas VALUES (15, 14, 2, DATE '2026-03-27', 'Esguince de tobillo grado I',         'Reposo, hielo, compresión y elevación; paracetamol 500 mg');
INSERT INTO clinica.consultas VALUES (16, 15, 1, DATE '2026-04-02', 'Hipotiroidismo',                      'Levotiroxina 50 mcg en ayunas');
INSERT INTO clinica.consultas VALUES (17, 16, 2, DATE '2026-04-08', 'Otitis media aguda',                  'Amoxicilina 500 mg cada 8 horas por 10 días');
INSERT INTO clinica.consultas VALUES (18,  2, 1, DATE '2026-04-14', 'Control de diabetes mellitus tipo 2', 'Ajuste de metformina a 1000 mg cada 12 horas');
INSERT INTO clinica.consultas VALUES (19, 17, 1, DATE '2026-04-21', 'Trastorno de ansiedad generalizada',  'Referencia a psicología; sertralina 50 mg cada 24 horas');
INSERT INTO clinica.consultas VALUES (20, 18, 2, DATE '2026-04-28', 'Hiperplasia prostática benigna',      'Tamsulosina 0,4 mg cada 24 horas');
INSERT INTO clinica.consultas VALUES (21, 19, 1, DATE '2026-05-05', 'Dislipidemia',                        'Atorvastatina 20 mg en la noche; dieta baja en grasas');
INSERT INTO clinica.consultas VALUES (22, 20, 2, DATE '2026-05-12', 'Conjuntivitis bacteriana',            'Tobramicina colirio cada 6 horas por 7 días');
INSERT INTO clinica.consultas VALUES (23,  3, 1, DATE '2026-05-19', 'Bronquitis aguda',                    'Acetilcisteína 600 mg cada 24 horas por 7 días');
INSERT INTO clinica.consultas VALUES (24,  5, 2, DATE '2026-05-26', 'Rinitis alérgica persistente',        'Fluticasona nasal cada 24 horas por 30 días');
INSERT INTO clinica.consultas VALUES (25,  6, 1, DATE '2026-06-02', 'Gastritis crónica en control',        'Omeprazol 20 mg por 15 días adicionales');
INSERT INTO clinica.consultas VALUES (26,  8, 1, DATE '2026-06-09', 'Control de hipertensión arterial',    'Continuar enalapril 10 mg; perfil lipídico');
INSERT INTO clinica.consultas VALUES (27,  9, 2, DATE '2026-06-16', 'Asma bronquial en control',           'Budesonida inhalada cada 12 horas');
INSERT INTO clinica.consultas VALUES (28, 10, 1, DATE '2026-06-23', 'Migraña sin aura en control',         'Continuar tratamiento; diario de cefaleas');
INSERT INTO clinica.consultas VALUES (29, 12, 2, DATE '2026-06-30', 'Control de diabetes mellitus tipo 2', 'Continuar metformina; hemoglobina glicosilada en 3 meses');
INSERT INTO clinica.consultas VALUES (30, 14, 2, DATE '2026-07-07', 'Lumbalgia mecánica',                  'Diclofenaco 50 mg cada 12 horas por 5 días');

COMMIT;

--------------------------------------------------------------------------------
-- 7. Bloqueo de la cuenta propietaria
--    Nadie inicia sesión como CLINICA: el acceso se da solo mediante roles.
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 7. BLOQUEO DE LA CUENTA CLINICA
ALTER USER clinica ACCOUNT LOCK;

--------------------------------------------------------------------------------
-- 8. Verificación
--------------------------------------------------------------------------------
PROMPT
PROMPT --- 8. VERIFICACIÓN

PROMPT Cifrado del tablespace:
COLUMN tablespace_name FORMAT A15
COLUMN encrypted       FORMAT A9
COLUMN algoritmo       FORMAT A9
COLUMN estado_cifrado  FORMAT A14

SELECT t.tablespace_name,
       t.encrypted,
       e.encryptionalg AS algoritmo,
       e.status        AS estado_cifrado
FROM   dba_tablespaces t
       JOIN v$tablespace vt ON vt.name = t.tablespace_name
       LEFT JOIN v$encrypted_tablespaces e
              ON e.ts# = vt.ts# AND e.con_id = vt.con_id
WHERE  t.tablespace_name = 'CLINICA_DATA';

PROMPT Ubicación de las tablas:
COLUMN table_name FORMAT A12
SELECT table_name, tablespace_name
FROM   dba_tables
WHERE  owner = 'CLINICA'
ORDER  BY table_name;

PROMPT Cantidad de filas:
COLUMN tabla FORMAT A12
SELECT 'MEDICOS' AS tabla, COUNT(*) AS filas FROM clinica.medicos
UNION ALL
SELECT 'PACIENTES', COUNT(*) FROM clinica.pacientes
UNION ALL
SELECT 'CONSULTAS', COUNT(*) FROM clinica.consultas;

PROMPT Consultas por médico:
COLUMN usuario_bd FORMAT A12
SELECT m.usuario_bd, COUNT(*) AS consultas
FROM   clinica.consultas c
       JOIN clinica.medicos m ON m.id = c.medico_id
GROUP  BY m.usuario_bd
ORDER  BY m.usuario_bd;

PROMPT Clasificación de columnas:
COLUMN tabla       FORMAT A10
COLUMN columna     FORMAT A17
COLUMN comentario  FORMAT A75
SELECT table_name AS tabla, column_name AS columna, comments AS comentario
FROM   dba_col_comments
WHERE  owner = 'CLINICA'
ORDER  BY table_name, column_name;

PROMPT Columnas sin clasificación (debe ser 0):
SELECT COUNT(*) AS sin_clasificar
FROM   dba_tab_columns c
       LEFT JOIN dba_col_comments k
              ON  k.owner = c.owner
              AND k.table_name = c.table_name
              AND k.column_name = c.column_name
WHERE  c.owner = 'CLINICA'
AND    NOT REGEXP_LIKE(NVL(k.comments, '-'), '^\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\]');

PROMPT Estado de la cuenta propietaria:
COLUMN username       FORMAT A10
COLUMN account_status FORMAT A16
SELECT username, account_status, default_tablespace
FROM   dba_users
WHERE  username = 'CLINICA';

SPOOL OFF
