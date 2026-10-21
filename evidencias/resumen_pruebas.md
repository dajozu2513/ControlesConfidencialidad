# Resumen de pruebas de verificación (PR-01 a PR-26)

Fase PHVA: Verificar. Entorno: Oracle Database 21c Express Edition 21.3.0.0.0, PDB XEPDB1. Ejecución: `bash sql/02_verificacion/ejecutar_todo.sh` (Git Bash, `MSYS_NO_PATHCONV=1`, `NLS_LANG=AMERICAN_AMERICA.AL32UTF8`).

Resultado global: **25 de 26 pruebas CUMPLEN**. La única excepción es PR-21, por una limitación de la edición Express (ver hallazgos).

| ID | Control ISO/IEC 27001:2022 | Resultado esperado | Resultado obtenido | Veredicto | Evidencia |
|---|---|---|---|---|---|
| PR-01 | A.5.12 / A.5.13 Clasificación y etiquetado | 0 columnas sin clasificar | 0 sin clasificar (17 columnas con prefijo) | CUMPLE | `v01_clasificacion.txt` |
| PR-02 | A.5.15 / A.8.3 Control de acceso | 0 privilegios directos o a PUBLIC | 0 (solo a través de roles) | CUMPLE | `v02_control_acceso.txt` |
| PR-03 | A.8.3 Restricción del acceso | RECEP_SOLIS no lee CONSULTAS (ORA-00942) | ORA-00942 | CUMPLE | `v02_control_acceso.txt` |
| PR-04 | A.5.16 Gestión de identidades | 0 cuentas abiertas con clave por defecto | 0 | CUMPLE | `v03_identidades.txt` |
| PR-05 | A.5.17 / A.8.5 Autenticación | Perfil con función fuerte aplicado a los usuarios | PERFIL_CLINICA (ORA12C_STRONG) en 6 usuarios | CUMPLE | `v04_perfil_contrasenas.txt` |
| PR-06 | A.8.5 Autenticación segura | Contraseña débil rechazada (ORA-28003) | ORA-28003 | CUMPLE | `v04_perfil_contrasenas.txt` |
| PR-07 | A.5.18 Derechos de acceso | 0 cuentas abiertas inactivas > 90 días | 0 | CUMPLE | `v05_revision_derechos.txt` |
| PR-08 | A.5.28 / A.8.15 Protección de la evidencia | DELETE sobre AUD$UNIFIED rechazado (DBA_OPER y SYS) | DBA_OPER ORA-00942, SYS ORA-46385 | CUMPLE | `v06_proteccion_registros.txt` |
| PR-09 | A.5.28 Protección de registros | Purga conserva lo de hoy y queda auditada | Registros de hoy preservados; operación DBMS_AUDIT_MGMT auditada | CUMPLE | `v06_proteccion_registros.txt` |
| PR-10 | A.8.2 Acceso privilegiado | 0 privilegios ANY directos a cuentas no administrativas | 0 | CUMPLE | `v07_acceso_privilegiado.txt` |
| PR-11 | A.8.2 Acceso privilegiado | DBA_OPER AS SYSBACKUP no lee CONSULTAS | ORA-01031 | CUMPLE | `v07_acceso_privilegiado.txt` |
| PR-12 | A.8.3 Restricción del acceso (VPD) | 18 / 12 / 30 filas (ROJAS / MORA / SYS) | 18 / 12 / 30 | CUMPLE | `v08_vpd.txt` |
| PR-13 | A.8.5 Autenticación segura | MED_MORA LOCKED(TIMED) tras 5 fallos | LOCKED(TIMED) | CUMPLE | `v09_autenticacion_segura.txt` |
| PR-14 | A.8.15 Registro de eventos | Fallos auditados (1017) y solo verificador 12C | 5 registros return_code 1017; 6/6 usuarios solo 12C | CUMPLE | `v09_autenticacion_segura.txt` |
| PR-15 | A.8.10 Borrado de información | Papelera de reciclaje vacía | dba_recyclebin = 0 | CUMPLE | `v10_eliminacion.txt` |
| PR-16 | A.8.10 / A.8.13 Respaldo | Sin respaldos obsoletos | "no obsolete backups found" | CUMPLE | `v10_obsoletos.txt` |
| PR-17 | A.8.11 Enmascaramiento | Recepción ve cédula X-XXXX-NNNN y teléfono XXXX-NNNN | 5/5 filas redactadas | CUMPLE | `v11_enmascaramiento.txt` |
| PR-18 | A.8.11 Enmascaramiento | Políticas y columnas de redacción definidas | 4 columnas redactadas (2 políticas) | CUMPLE | `v11_enmascaramiento.txt` |
| PR-19 | A.8.11 Enmascaramiento | 0 cédulas del clon iguales al origen | 0 | CUMPLE | `v11_enmascaramiento.txt` |
| PR-20 | A.8.12 Prevención de fuga | 0 enlaces de base de datos definidos por el usuario | 0 (solo DBMS_CLRDBLINK, interno de Oracle) | CUMPLE | `v12_fuga_datos.txt` |
| PR-21 | A.8.12 Prevención de fuga | Exportación cifrada sin datos legibles | ORA-00439 (cifrado de Data Pump no disponible en XE); export sin cifrar expone el nombre real (1 coincidencia, ORA-39173) | **NO CUMPLE (Parcial)** | `v12_expdp.txt` |
| PR-22 | A.8.13 / A.8.24 Respaldo cifrado | Piezas de XEPDB1 cifradas y restauración validable | 1 pieza, cifrada (YES); RESTORE ... VALIDATE exitoso | CUMPLE | `v13_respaldos.txt`, `v13_validar.txt` |
| PR-23 | A.8.15 / A.8.16 Registro y seguimiento | Acceso de MED_ROJAS auditado y visible para el auditor | 4 registros, consultados por AUD_VEGA | CUMPLE | `v14_auditoria.txt` |
| PR-24 | A.8.20 / A.8.24 Seguridad de redes | Cifrado de red AES256 en sesión TCP | Adaptador AES256 presente | CUMPLE | `v15_red.txt` |
| PR-25 | A.8.20 Seguridad de redes | Integridad de red SHA256 en sesión TCP | Adaptador SHA256 presente | CUMPLE | `v15_red.txt` |
| PR-26 | A.8.24 Uso de criptografía | Datos ilegibles en disco (cifrado); control legible | CLINICA_DATA = 0; TS_CONTROL_PLANO = 1 | CUMPLE | `v16_cifrado_tde.txt` |

Script informativo adicional: `v17_version.txt` documenta la versión del motor y los componentes del diccionario (A.8.8, gestión de vulnerabilidades técnicas); no genera una prueba PR.

## Hallazgos y desviaciones

1. **PR-21 (NO CUMPLE / Parcial) — Cifrado de Data Pump no disponible en Oracle XE.** La exportación con `ENCRYPTION=ALL ENCRYPTION_MODE=TRANSPARENT` falla con `ORA-39002 / ORA-00439: feature not enabled: Dump File Encryption`. Al exportar sin cifrar, el archivo `.dmp` contiene el nombre real del paciente en texto plano (`ORA-39173: Encrypted data has been stored unencrypted in dump file set`), lo que confirma el riesgo de fuga. Es una limitación de la edición Express (el cifrado de Data Pump requiere Advanced Security en Enterprise Edition). Mitigaciones alternativas en XE: exportar a un tablespace/directorio sobre almacenamiento cifrado por el sistema operativo, restringir y auditar `DATA_PUMP_DIR` (ya cubierto por POL_EXPORTACIONES, PR-21 muestra la acción EXPORT auditada) y borrar los dump inmediatamente (el script lo hace).

2. **Filtrado por nodo activado (A.8.20) — resuelto.** Los parámetros `TCP.VALIDNODE_CHECKING` y `TCP.INVITED_NODES` quedaron escritos en el `sqlnet.ora`. El servicio de Windows `OracleOraDB21Home1TNSListener` se reinició (desde `lsnrctl` daba `TNS-01190: not authorized`; se usó `net stop/start` con permisos de administrador). Tras el reinicio, las conexiones desde los nodos invitados (127.0.0.1, localhost, 192.168.0.21, Joel-Laptop) funcionan, y una prueba negativa retirando temporalmente la IP de la lista confirmó el rechazo (`ORA-12537: TNS:connection closed`). El cifrado y la integridad de red (PR-24, PR-25) ya se aplicaban por conexión. Evidencia en `setup_s08_red.txt` (sección 8); procedimiento y reversión en `sql/01_setup/s08_red.md`.

3. **PR-08 (DBA_OPER) devuelve ORA-00942 en lugar de ORA-46385.** En XE, DBA_OPER (rol DBA) ni siquiera puede ver `AUDSYS.AUD$UNIFIED` porque AUDSYS está excluido de los privilegios `ANY`. La imposibilidad de verla es una protección equivalente o más fuerte que el rechazo del DML, por lo que la prueba se considera CUMPLE (SYS sí obtiene el ORA-46385 esperado).

4. **PR-12: exportación parcial por VPD.** Durante PR-21, la exportación de `CLINICA.CONSULTAS` por DBA_OPER generó `ORA-39181: Only partial table data may be exported due to fine grain access control`, efecto colateral de la política VPD. No afecta la demostración de fuga, que se basa en los nombres de `PACIENTES`.
