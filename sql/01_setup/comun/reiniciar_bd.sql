--------------------------------------------------------------------------------
-- Reinicio controlado de la instancia (invocado por s01 solo cuando hace falta).
-- SHUTDOWN IMMEDIATE espera a que terminen las transacciones activas mediante
-- rollback; STARTUP vuelve a leer el SPFILE con el nuevo WALLET_ROOT.
-- Al final se abren todas las PDB (XEPDB1 también tiene estado guardado OPEN).
--------------------------------------------------------------------------------
PROMPT Reinicio necesario: WALLET_ROOT del SPFILE difiere del valor en memoria.
PROMPT Ejecutando SHUTDOWN IMMEDIATE y STARTUP...
SHUTDOWN IMMEDIATE
STARTUP
ALTER PLUGGABLE DATABASE ALL OPEN;
-- La sesión posterior al STARTUP es nueva: se vuelve a habilitar DBMS_OUTPUT.
SET SERVEROUTPUT ON SIZE UNLIMITED
