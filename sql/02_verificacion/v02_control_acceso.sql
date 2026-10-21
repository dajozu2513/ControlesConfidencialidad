--------------------------------------------------------------------------------
-- Script   : sql/02_verificacion/v02_control_acceso.sql
-- Contenedor: XEPDB1
-- Pruebas  : PR-02 (privilegios directos o a PUBLIC), PR-03 (RECEP_SOLIS no
--            puede leer CONSULTAS)
-- Control  : ISO/IEC 27001:2022 A.5.15, A.8.3 (restricción del acceso)
--
-- PR-02: ningún privilegio sobre objetos de CLINICA otorgado a PUBLIC ni
--        directamente a un usuario (solo a través de roles) -> CUMPLE si 0.
-- PR-03: RECEP_SOLIS (rol de recepción) no tiene acceso a CLINICA.CONSULTAS;
--        al consultarla debe obtener ORA-00942. La conexión es por TCP.
--------------------------------------------------------------------------------
SET ECHO OFF
@sql/config_local.sql
SET VERIFY OFF
SET FEEDBACK OFF
WHENEVER SQLERROR CONTINUE

SPOOL evidencias/v02_control_acceso.txt

CONNECT / AS SYSDBA
ALTER SESSION SET CONTAINER = &pdb_nombre;
@sql/02_verificacion/comun/cabecera.sql v02_control_acceso PR-02,PR-03

PROMPT
PROMPT --- PR-02: privilegios sobre objetos de CLINICA (deben ser solo a roles)
COLUMN grantee    FORMAT A16
COLUMN table_name FORMAT A12
COLUMN privilege  FORMAT A12
COLUMN tipo       FORMAT A12
SELECT p.grantee, p.table_name, p.privilege,
       CASE WHEN p.grantee = 'PUBLIC' THEN 'PUBLIC'
            WHEN u.username IS NOT NULL THEN 'USUARIO'
            ELSE 'ROL' END AS tipo
FROM   dba_tab_privs p
       LEFT JOIN dba_users u ON u.username = p.grantee
WHERE  p.owner = 'CLINICA'
ORDER  BY tipo, p.grantee, p.table_name, p.privilege;

PROMPT
PROMPT --- PR-02: conteo de privilegios indebidos (PUBLIC o usuario directo)
COLUMN resultado FORMAT A60
SELECT CASE WHEN COUNT(*) = 0
            THEN 'RESULTADO PR-02: CUMPLE'
            ELSE 'RESULTADO PR-02: NO CUMPLE (' || COUNT(*) || ' concesiones directas)'
       END AS resultado
FROM   dba_tab_privs p
WHERE  p.owner = 'CLINICA'
AND    (p.grantee = 'PUBLIC'
        OR p.grantee IN (SELECT username FROM dba_users));

PROMPT
PROMPT --- PR-03: RECEP_SOLIS intenta leer CLINICA.CONSULTAS (se espera ORA-00942)
CONNECT RECEP_SOLIS/&pwd_recep_solis@//localhost:1521/&pdb_nombre
@sql/02_verificacion/comun/cabecera.sql v02_control_acceso(PR-03) PR-03

PROMPT Intento directo (evidencia del error):
SELECT COUNT(*) FROM clinica.consultas;

PROMPT Veredicto capturando el código ORA:
SET SERVEROUTPUT ON
DECLARE
  v_n NUMBER;
BEGIN
  EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM clinica.consultas' INTO v_n;
  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-03: NO CUMPLE (acceso permitido, '
                       || v_n || ' filas)');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -942 THEN
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-03: CUMPLE (ORA-00942, tabla no accesible)');
    ELSE
      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-03: NO CUMPLE (ORA' || SQLCODE || ')');
    END IF;
END;
/

SPOOL OFF
