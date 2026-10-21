# Controles ISO 27001:2022 para la Confidencialidad en Bases de Datos Oracle

Administración de Bases de Datos · Escuela de Informática, Universidad Nacional · Prof. Johnny Villalobos Murillo · II Ciclo 2026

Oct 21, 2026 · @Joel Soto

## 1. Introducción y objetivos

Este informe diseña, implementa y verifica un marco de controles basado en ISO/IEC 27001:2022 (Anexo A) e ISO/IEC 27002:2022 para proteger la confidencialidad de los datos en las tareas del Administrador de Bases de Datos (DBA) sobre Oracle Database 21c. Cada control se acompaña de evidencia observable y de scripts SQL que un auditor externo puede ejecutar.

El DBA es el custodio técnico de los activos de información más críticos de una organización: administra cuentas, privilegios, cifrado, respaldos y entornos de prueba. Una falla en cualquiera de esas tareas puede exponer datos personales protegidos por la Ley 8968 de Costa Rica. El trabajo sigue el ciclo PHVA (Planificar-Hacer-Verificar-Actuar) y el principio de mínimo privilegio.

### Objetivo general

Diseñar e implementar un marco de controles basado en ISO/IEC 27001:2022 (Anexo A) e ISO/IEC 27002:2022 para mitigar riesgos de confidencialidad en las tareas del DBA, incluyendo una matriz de evaluación y pruebas observables auditables.

### Objetivos específicos

1. Identificar y clasificar cinco riesgos de confidencialidad (R-CONF-01 a R-CONF-05) asociados al motor Oracle.
2. Mapear doce tareas críticas del DBA: gestión de usuarios, privilegios, autenticación, cifrado TDE, enmascaramiento, respaldos, auditoría, parcheo, listener, eliminación segura, logs y clones DEV/TEST.
3. Seleccionar y justificar los controles del Anexo A 2022 pertinentes: A5.12, A5.15, A5.16, A5.17, A5.18, A5.33, A8.2, A8.3, A8.5, A8.10, A8.11, A8.12, A8.13, A8.15 y A8.20.
4. Diseñar una matriz de evaluación con criterios de madurez 0-4, evidencia y estado (Cumple, Parcial, No cumple).
5. Proponer y ejecutar pruebas técnicas (consultas SQL, revisión de configuraciones y auditorías) que demuestren la efectividad de los controles.

## 2. Marco teórico

La confidencialidad en una base de datos Oracle depende de capas complementarias: identidad y privilegios, cifrado, ocultamiento de datos, registro de actividad y cumplimiento legal. Esta sección resume el fundamento normativo y técnico de cada capa.

### 2.1 Cambios de ISO/IEC 27001:2022 respecto a 2013

La edición 2022 reorganizó el Anexo A de 114 controles en 14 dominios a 93 controles en 4 temas (ISO, 2022a). De los 93, 35 se mantuvieron, 23 se renombraron, 57 se fusionaron en 24 y 11 son nuevos (Kertos, s.f.).

| Aspecto | ISO/IEC 27001:2013 | ISO/IEC 27001:2022 |
| --- | --- | --- |
| Controles del Anexo A | 114 | 93 |
| Estructura | 14 dominios (A.5 a A.18) | 4 temas: organizacionales A5 (37), personas A6 (8), físicos A7 (14), tecnológicos A8 (34) |
| Controles nuevos | No aplica | 11: A5.7, A5.23, A5.30, A7.4, A8.9, A8.10, A8.11, A8.12, A8.16, A8.23, A8.28 |
| Guía de implementación | ISO/IEC 27002:2013 | ISO/IEC 27002:2022, con atributos por control (tipo, propiedad de seguridad, concepto de ciberseguridad) |
| Cláusulas del SGSI | Sin planificación formal de cambios | Nueva cláusula 6.3, planificación de cambios |

Tres de los controles nuevos están en el alcance de este proyecto: A8.10 (eliminación de información), A8.11 (enmascaramiento de datos) y A8.12 (prevención de fuga de datos). Las organizaciones certificadas bajo 2013 tuvieron hasta el 31 de octubre de 2025 para migrar a la versión 2022 (The Art of Service, s.f.), por lo que hoy toda certificación vigente usa el Anexo A de 2022.

### 2.2 Mínimo privilegio y separación de funciones en el rol DBA

El mínimo privilegio exige que cada cuenta tenga solo los permisos necesarios para su función, y la separación de funciones impide que una sola persona controle una tarea crítica de principio a fin (Joint Task Force, 2020). En ISO/IEC 27002:2022 estos principios se concretan en A5.15 (control de acceso), A5.18 (derechos de acceso) y A8.2 (derechos de acceso privilegiado) (ISO, 2022b).

El DBA es el caso más delicado, porque el privilegio SYSDBA concentra casi todo el poder sobre la base de datos. Desde la versión 12c, Oracle ofrece privilegios administrativos por tarea: SYSOPER (arranque y parada), SYSBACKUP (respaldo y recuperación), SYSDG (Data Guard) y SYSKM (gestión de llaves de cifrado) (Oracle, 2021). La práctica recomendada es:

- Usar privilegios de objeto en lugar de privilegios de sistema siempre que sea posible.
- Asignar privilegios mediante roles por función, no directamente a usuarios.
- Reservar SYS para acciones que lo requieran y usar cuentas nominales para la operación diaria.
- Separar la administración de la auditoría con los roles AUDIT\_ADMIN y AUDIT\_VIEWER.

### 2.3 Defensa en profundidad y Zero Trust aplicados a bases de datos

La defensa en profundidad apila controles independientes para que la falla de uno no exponga los datos. En una base Oracle, las capas son: red (listener y cifrado de conexiones), autenticación (perfiles y contraseñas), autorización (privilegios, roles y VPD), datos (TDE y Data Redaction) y detección (auditoría unificada).

Zero Trust parte de que no existe confianza implícita por la ubicación de red o la propiedad del activo, y protege recursos en lugar de segmentos de red (Rose et al., 2020). Aplicado a una base de datos, implica que una conexión desde la red interna no recibe más confianza que una externa, que cada sesión se autentica y autoriza de forma explícita, y que la actividad se monitorea de forma continua.

### 2.4 Controles técnicos de confidencialidad en Oracle 21c

Oracle cubre los mecanismos solicitados con funciones propias; algunos nombres difieren de los usados en otros motores.

| Control | Qué protege | Mecanismo en Oracle 21c | Evidencia observable |
| --- | --- | --- | --- |
| Transparent Data Encryption (TDE) | Datos en reposo: archivos de datos y respaldos | Keystore definido con los parámetros `WALLET_ROOT` y `TDE_CONFIGURATION`; cifrado de tablespace o de columna | `V$ENCRYPTION_WALLET`, `V$ENCRYPTED_TABLESPACES` |
| Data Redaction | Datos mostrados en consultas | Paquete `DBMS_REDACT`; redacción completa, parcial, aleatoria o nula en tiempo de ejecución | `REDACTION_POLICIES`, `REDACTION_COLUMNS` |
| Virtual Private Database (VPD) | Filas y columnas por usuario | Paquete `DBMS_RLS`; agrega un predicado WHERE a cada consulta | `DBA_POLICIES` |
| Cifrado en tránsito | Datos entre cliente y servidor | TLS (protocolo TCPS) o cifrado nativo de red (Native Network Encryption) | `V$SESSION_CONNECT_INFO`, `sqlnet.ora` |

TDE usa una arquitectura de dos niveles: una llave maestra, guardada en el keystore, cifra las llaves de cada tabla o tablespace (Oracle, 2024). Por eso el keystore debe respaldarse y custodiarse por separado de los datos.

Data Redaction oculta los datos en el momento de la consulta sin modificar lo almacenado (Oracle, 2024). Es el equivalente en Oracle de lo que SQL Server llama *Dynamic Data Masking*. Oracle advierte que, cuando se accede directo a la base, la redacción debe combinarse con controles sobre usuarios privilegiados, ya que el privilegio EXEMPT REDACTION POLICY la omite. El enmascaramiento estático para clones DEV/TEST (A8.11) es distinto: altera los datos de forma permanente en la copia.

VPD es la combinación de control de acceso de grano fino y contexto de aplicación; el servidor aplica la política sin importar desde qué herramienta se consulte (Oracle, 2021). Para el cifrado en tránsito, Oracle ofrece TLS, estándar de la industria, y su cifrado nativo; con el nativo, los clientes incompatibles pueden caer a conexiones sin cifrar, lo que debe evitarse con la configuración del servidor (Oracle, 2021).

La disponibilidad de TDE, Data Redaction y VPD depende de la edición instalada, por lo que se verifica de forma explícita en el entorno del proyecto (sección 3).

### 2.5 Prevención de fuga de datos y respaldos cifrados

El control A8.12 (nuevo en 2022) busca impedir la divulgación no autorizada de información por cualquier canal (ISO, 2022b). En la base de datos, los canales de fuga más comunes son las exportaciones con Data Pump, los objetos DIRECTORY con escritura al sistema de archivos, los enlaces de base de datos y las consultas masivas de cuentas privilegiadas. La prevención combina restricción de esos privilegios con auditoría de su uso.

Los respaldos son una copia completa de los datos y requieren la misma protección que la base en producción (A8.13). RMAN permite cifrar respaldos en modo transparente (con el keystore de TDE), por contraseña o dual. La eliminación segura (A8.10) cubre respaldos obsoletos, archivos de exportación y la papelera de reciclaje; destruir la llave de cifrado vuelve ilegibles todas las copias cifradas con ella.

### 2.6 Registro, monitoreo y correlación (SIEM)

En Oracle 21c, la auditoría unificada es el mecanismo vigente: consolida los registros de varias fuentes en la vista `UNIFIED_AUDIT_TRAIL`, y la auditoría tradicional quedó obsoleta en esta versión (Oracle, 2021). Incluye políticas predefinidas alineadas con requisitos regulatorios, y en 21c los cambios a políticas de objetos aplican de inmediato a todas las sesiones (Hall, s.f.).

El control A8.15 exige registrar eventos y proteger los registros contra alteración (ISO, 2022b). Las propias acciones de administración de auditoría quedan auditadas de forma obligatoria (Oracle, s.f.). Para la correlación, los registros se envían a un SIEM (Security Information and Event Management), que los cruza con eventos de red y del sistema operativo y los resguarda fuera del alcance del DBA.

### 2.7 Ley 8968 y su reglamento

La Ley 8968, Protección de la Persona frente al Tratamiento de sus Datos Personales, rige en Costa Rica desde el 5 de setiembre de 2011 y aplica a datos personales en bases de datos automatizadas o manuales (Asamblea Legislativa de la República de Costa Rica, 2011). Su reglamento es el Decreto Ejecutivo 37554-JP del 30 de octubre de 2012, y la autoridad de control es la Agencia de Protección de Datos de los Habitantes (PRODHAB) (Poder Ejecutivo, 2012).

Para el DBA, la ley impone dos obligaciones directas: adoptar medidas técnicas y organizativas que garanticen la seguridad de los datos, y mantener la confidencialidad de la información tratada. La ley distingue además los datos sensibles, relativos al fuero íntimo de la persona, que requieren la protección más alta. Los controles de este informe son la implementación técnica de esas obligaciones, y el control A5.34 (privacidad y protección de datos personales) es el puente formal entre la ley y la norma ISO.

## 3. Metodología y entorno

El proyecto aplica el ciclo PHVA sobre una instancia Oracle Database 21c Express Edition, cuyas capacidades de seguridad se verificaron antes de diseñar los controles.

### 3.1 Ciclo PHVA aplicado

| Etapa | Actividades | Secciones del informe |
| --- | --- | --- |
| Planificar | Identificar riesgos y tareas del DBA, seleccionar controles del Anexo A y definir criterios de madurez | 4, 5, 6 y 7 |
| Hacer | Implementar los controles en Oracle con scripts de configuración | 6 y 9 |
| Verificar | Ejecutar la batería de pruebas, recolectar evidencia y calificar la matriz | 8 y 9 |
| Actuar | Definir acciones de remediación para controles en estado Parcial o No cumple | 10 |

### 3.2 Entorno de trabajo

| Elemento | Valor |
| --- | --- |
| Motor | Oracle Database 21c Express Edition 21.3.0.0.0 |
| Arquitectura | Multitenant: contenedor raíz `CDB$ROOT` (servicio XE) y PDB `XEPDB1` en modo READ WRITE |
| Modo de archivado | ARCHIVELOG |
| Herramientas | SQL\*Plus, SQL Developer, Git |
| Conexión administrativa | SYSDBA con autenticación del sistema operativo |
| Repositorio | Scripts en `sql/`, evidencia en `evidencias/`, registro de IA en `ia/` |

### 3.3 Capacidades de seguridad verificadas

El script `sql/00_entorno/00_verificar_entorno.sql` se ejecutó en `CDB$ROOT` y en `XEPDB1` con resultados idénticos; la salida está en `evidencias/00_entorno.txt`.

| Función | Disponible | Estado inicial |
| --- | --- | --- |
| Transparent Data Encryption | Sí | Keystore no configurado (`NOT_AVAILABLE`); `WALLET_ROOT` y `TDE_CONFIGURATION` vacíos; ningún tablespace cifrado |
| Data Redaction (`DBMS_REDACT`) | Sí | Paquete válido, sin políticas |
| Virtual Private Database (`DBMS_RLS`) | Sí | Paquete válido, opción de control de acceso de grano fino activa |
| Auditoría unificada | Parcial | Modo mixto; políticas activas: `ORA_LOGON_FAILURES` y `ORA_SECURECONFIG` |
| Oracle Label Security | No | No incluida en XE |
| Oracle Database Vault | No | No incluida en XE |
| Cifrado de red | Por verificar | La prueba se hizo con conexión local; requiere repetirse por TCP |

Dos consecuencias guían el diseño. Primero, TDE, Data Redaction, VPD y la auditoría unificada pueden demostrarse en vivo, aunque TDE exige configurar el keystore desde cero. Segundo, sin Database Vault no es posible impedir técnicamente que un usuario SYSDBA lea los datos; esa brecha se compensa con privilegios administrativos por tarea, auditoría de usuarios privilegiados y separación de los roles de auditoría, y se refleja en la matriz de evaluación.

### 3.4 Escenario de datos

Los controles se aplican sobre el esquema `CLINICA` en `XEPDB1`, que simula una clínica privada. Contiene pacientes (cédula, nombre, fecha de nacimiento, teléfono, correo y dirección), médicos y consultas (diagnóstico y tratamiento). Los diagnósticos son datos sensibles según la Ley 8968, y la cédula y los datos de contacto son datos personales de acceso restringido.

| Perfil | Necesidad de acceso | Control principal |
| --- | --- | --- |
| Médico | Solo las consultas de sus propios pacientes | VPD |
| Recepción | Datos de contacto, sin diagnósticos y con cédula parcial | Privilegios de objeto y Data Redaction |
| Auditor | Lectura de la auditoría, sin acceso a datos clínicos | Rol `AUDIT_VIEWER` |
| DBA operativo | Administración y respaldos, sin uso rutinario de SYSDBA | Privilegios administrativos por tarea y auditoría |
| Desarrollador | Solo clones DEV/TEST con datos enmascarados | Enmascaramiento estático |

## 4. Riesgos de confidencialidad

Cuatro de los cinco riesgos identificados tienen nivel Alto; el más crítico es R-CONF-01, privilegios excesivos, con nivel 20 de 25.

La probabilidad (P) y el impacto (I) se califican de 1 a 5. El nivel es P × I: Bajo de 1 a 6, Medio de 8 a 12 y Alto de 15 a 25. El impacto 5 corresponde a la exposición de datos sensibles protegidos por la Ley 8968.

| ID | Riesgo | Escenario en la clínica | Activo afectado | P | I | Nivel |
| --- | --- | --- | --- | --- | --- | --- |
| R-CONF-01 | Privilegios excesivos o cuentas privilegiadas compartidas | Un usuario de soporte con el rol DBA o con SELECT ANY TABLE consulta diagnósticos de pacientes; varias personas usan SYS | Expedientes clínicos | 4 | 5 | 20 Alto |
| R-CONF-02 | Autenticación débil y servicios expuestos | Un atacante ingresa con una contraseña por defecto o de una cuenta inactiva, o aprovecha un listener sin restricciones o una versión sin parches | Cuentas de base de datos y listener | 3 | 5 | 15 Alto |
| R-CONF-03 | Datos sin cifrar en reposo, en tránsito o en respaldos | Se copia un archivo de datos, un respaldo RMAN o un archivo de Data Pump sin cifrar, o se intercepta el tráfico entre la aplicación y la base | Archivos de datos, respaldos y conexiones | 3 | 5 | 15 Alto |
| R-CONF-04 | Exposición de datos sensibles a usuarios sin necesidad de conocerlos | Recepción ve cédulas completas y diagnósticos; desarrolladores reciben un clon con datos reales de pacientes | Columnas sensibles y clones DEV/TEST | 4 | 4 | 16 Alto |
| R-CONF-05 | Fuga de información sin detección | Un usuario privilegiado exporta datos y no queda registro revisable, o se purgan las trazas de auditoría sin control | Auditoría y registros | 3 | 4 | 12 Medio |

## 5. Tareas críticas del DBA

Las doce tareas cubren los cinco riesgos; R-CONF-02 y R-CONF-03 son los que más tareas involucran, con cuatro cada uno.

| ID | Tarea | Actividad del DBA en la clínica | Riesgos |
| --- | --- | --- | --- |
| T-01 | Gestión de usuarios | Crear cuentas nominales, bloquear cuentas por defecto e inactivas y dar de baja a quien deja la clínica | R-CONF-01, R-CONF-02 |
| T-02 | Gestión de privilegios | Definir roles por perfil, revocar privilegios ANY y concesiones a PUBLIC, usar privilegios administrativos por tarea | R-CONF-01 |
| T-03 | Autenticación | Aplicar perfiles con complejidad, expiración y bloqueo por intentos fallidos | R-CONF-02 |
| T-04 | Cifrado TDE | Configurar el keystore, crear la llave maestra, cifrar el tablespace de expedientes y respaldar el keystore aparte | R-CONF-03 |
| T-05 | Enmascaramiento dinámico | Crear políticas de Data Redaction sobre cédula y contacto, y políticas VPD por médico | R-CONF-04 |
| T-06 | Respaldos | Configurar RMAN con cifrado, custodiar las copias y probar la restauración | R-CONF-03 |
| T-07 | Auditoría | Crear políticas unificadas sobre usuarios privilegiados, accesos a datos sensibles y exportaciones | R-CONF-05 |
| T-08 | Parcheo | Registrar la versión instalada y planificar actualizaciones; XE no recibe parches trimestrales, solo nuevas versiones | R-CONF-02 |
| T-09 | Listener | Restringir la administración remota, limitar los nodos que pueden conectarse y exigir cifrado en las conexiones | R-CONF-02, R-CONF-03 |
| T-10 | Eliminación segura | Purgar la papelera de reciclaje, eliminar respaldos obsoletos y archivos de exportación según la retención definida | R-CONF-03, R-CONF-05 |
| T-11 | Gestión de logs | Definir retención y purga controlada de la auditoría, proteger los registros y enviarlos a un SIEM | R-CONF-05 |
| T-12 | Clones DEV/TEST | Enmascarar de forma estática los datos antes de entregar un clon y usar cuentas distintas a las de producción | R-CONF-04 |

## 6. Mapeo de controles ISO/IEC 27001:2022

Los 15 controles solicitados se implementan con funciones nativas de Oracle 21c XE. Se agregan dos controles complementarios: A8.24, porque el cifrado TDE (T-04) no queda cubierto por ninguno de los 15, y A8.8, porque el parcheo (T-08) tampoco.

### 6.1 Controles organizacionales (A5)

| Control | Tareas y riesgos | Justificación | Implementación en Oracle 21c XE | Evidencia observable |
| --- | --- | --- | --- | --- |
| A5.12 Clasificación de la información | T-05, T-12 · R-CONF-04 | Sin clasificar las columnas no se sabe qué ocultar ni qué enmascarar | Etiquetar cada columna de `CLINICA` como Pública, Interna, Confidencial o Sensible con `COMMENT ON COLUMN` | `SELECT table_name, column_name, comments FROM dba_col_comments WHERE owner = 'CLINICA'` |
| A5.15 Control de acceso | T-02 · R-CONF-01, R-CONF-04 | El acceso a expedientes debe responder a una política por perfil, no a concesiones individuales | Un rol por perfil (médico, recepción, auditor) con privilegios de objeto; ninguna concesión a PUBLIC sobre `CLINICA` | `SELECT grantee, table_name, privilege FROM dba_tab_privs WHERE owner = 'CLINICA'` |
| A5.16 Gestión de identidades | T-01 · R-CONF-01, R-CONF-02 | Cada acción debe atribuirse a una persona identificable | Cuentas nominales únicas; cuentas por defecto bloqueadas; cuentas sin uso en 90 días bloqueadas | `SELECT username, account_status, last_login FROM dba_users WHERE oracle_maintained = 'N'` y `SELECT * FROM dba_users_with_defpwd` |
| A5.17 Información de autenticación | T-03 · R-CONF-02 | Las contraseñas débiles o compartidas anulan cualquier otro control de acceso | Perfil `PERFIL_CLINICA` con función de verificación `ORA12C_STRONG_VERIFY_FUNCTION`, expiración y reutilización limitada | `SELECT profile, resource_name, limit FROM dba_profiles WHERE resource_type = 'PASSWORD'` |
| A5.18 Derechos de acceso | T-01, T-02 · R-CONF-01 | Los derechos se acumulan con el tiempo si no se revisan | Procedimiento de alta, cambio y baja; revisión periódica de usuarios y roles con un script de inventario | Salida del script de revisión de `dba_role_privs` y `dba_sys_privs`, con fecha |
| A5.33 Protección de registros | T-07, T-11 · R-CONF-05 | El expediente clínico y la auditoría deben protegerse contra alteración y borrado | Auditoría unificada en el esquema `AUDSYS`, de solo lectura; purga solo con `DBMS_AUDIT_MGMT` por un usuario con `AUDIT_ADMIN` | Intento de `DELETE` sobre `AUDSYS` rechazado con error; `SELECT * FROM dba_audit_mgmt_config_params` |

### 6.2 Controles tecnológicos (A8)

| Control | Tareas y riesgos | Justificación | Implementación en Oracle 21c XE | Evidencia observable |
| --- | --- | --- | --- | --- |
| A8.2 Derechos de acceso privilegiado | T-02 · R-CONF-01 | El DBA es el usuario con más poder sobre los expedientes | Rol DBA solo para administradores nominales; sin privilegios ANY para usuarios de aplicación; SYSBACKUP y SYSKM en lugar de SYSDBA para tareas específicas | `SELECT grantee FROM dba_role_privs WHERE granted_role = 'DBA'`, `SELECT grantee, privilege FROM dba_sys_privs WHERE privilege LIKE '%ANY%'` y `SELECT * FROM v$pwfile_users` |
| A8.3 Restricción de acceso a la información | T-05 · R-CONF-04 | Un médico solo debe ver las consultas de sus pacientes | Política VPD con `DBMS_RLS` sobre `CONSULTAS`, filtrada por el médico de la sesión | `SELECT object_name, policy_name, enable FROM dba_policies WHERE object_owner = 'CLINICA'` y conteo de filas visto por cada médico |
| A8.5 Autenticación segura | T-03 · R-CONF-02 | Los ataques de fuerza bruta deben bloquearse y quedar registrados | `FAILED_LOGIN_ATTEMPTS` y `PASSWORD_LOCK_TIME` en el perfil; solo verificadores de contraseña de versión 12C | `SELECT username, password_versions FROM dba_users` y registros de `ORA_LOGON_FAILURES` en `unified_audit_trail` |
| A8.10 Eliminación de información | T-10 · R-CONF-03, R-CONF-05 | Las copias residuales de datos clínicos siguen siendo datos personales | Purga de la papelera de reciclaje, eliminación de respaldos obsoletos con RMAN y borrado de archivos de exportación vencidos | `SELECT COUNT(*) FROM dba_recyclebin WHERE owner = 'CLINICA'` y salida de `REPORT OBSOLETE` en RMAN |
| A8.11 Enmascaramiento de datos | T-05, T-12 · R-CONF-04 | Recepción y desarrollo no necesitan ver cédulas ni diagnósticos reales | Data Redaction parcial sobre la cédula y completa sobre el diagnóstico; script de enmascaramiento estático para clones | `SELECT * FROM redaction_policies` y `SELECT * FROM redaction_columns`; `SELECT grantee FROM dba_sys_privs WHERE privilege = 'EXEMPT REDACTION POLICY'` |
| A8.12 Prevención de fuga de datos | T-07 · R-CONF-05 | Una exportación masiva es el canal más directo de fuga | Roles de Data Pump solo para el DBA; objetos DIRECTORY y enlaces de base de datos restringidos; política de auditoría sobre exportaciones | `SELECT grantee, granted_role FROM dba_role_privs WHERE granted_role LIKE 'DATAPUMP%'`, `SELECT * FROM dba_db_links` y `SELECT * FROM audit_unified_enabled_policies` |
| A8.13 Respaldo de información | T-06 · R-CONF-03 | Un respaldo sin cifrar es una copia completa de los expedientes | RMAN con cifrado AES256 y prueba de restauración | `SELECT * FROM v$rman_configuration` y `SELECT handle, encrypted FROM v$backup_piece` |
| A8.15 Registro | T-07, T-11 · R-CONF-05 | Sin registro no hay forma de detectar ni probar un acceso indebido | Políticas unificadas sobre usuarios privilegiados, lectura de `CONSULTAS` y cambios de privilegios | `SELECT policy_name, entity_name FROM audit_unified_enabled_policies` y consultas a `unified_audit_trail` |
| A8.20 Seguridad de redes | T-09 · R-CONF-02, R-CONF-03 | El listener es la puerta de entrada a la base | Cifrado obligatorio y verificación de nodos en `sqlnet.ora`; revisión de servicios expuestos en el listener | `sqlnet.ora` con `SQLNET.ENCRYPTION_SERVER = REQUIRED` y `TCP.VALIDNODE_CHECKING = YES`; `SELECT network_service_banner FROM v$session_connect_info` desde una sesión TCP |

### 6.3 Controles complementarios

| Control | Tareas y riesgos | Justificación | Implementación en Oracle 21c XE | Evidencia observable |
| --- | --- | --- | --- | --- |
| A8.24 Uso de criptografía | T-04 · R-CONF-03 | El cifrado en reposo requiere una gestión formal de llaves | Keystore TDE bajo `WALLET_ROOT`, llave maestra, tablespace `CLINICA_DATA` cifrado con AES256 y respaldo del keystore fuera del servidor | `SELECT * FROM v$encryption_wallet` y `SELECT tablespace_name, encrypted FROM dba_tablespaces` |
| A8.8 Gestión de vulnerabilidades técnicas | T-08 · R-CONF-02 | Una versión con vulnerabilidades conocidas expone todos los controles | Inventario de versión y componentes; plan de actualización a una versión soportada | `SELECT banner_full FROM v$version`, `SELECT comp_name, version, status FROM dba_registry` y `SELECT * FROM dba_registry_sqlpatch` |

## 7. Controles observables por auditor externo

Cada uno de los 15 controles tiene un criterio de cumplimiento verificable y un script que un auditor puede ejecutar con permisos de solo lectura; los dos controles complementarios usan los scripts `v16_cifrado_tde.sql` y `v17_version.sql`.

| N.º | Control | Qué observa el auditor | Criterio de cumplimiento | Script en `sql/02_verificacion/` |
| --- | --- | --- | --- | --- |
| OC-01 | A5.12 Clasificación | Etiquetas de clasificación en las columnas de `CLINICA` | El 100 % de las columnas tiene etiqueta | `v01_clasificacion.sql` |
| OC-02 | A5.15 Control de acceso | Privilegios de objeto sobre `CLINICA` | Ninguna concesión a PUBLIC; todos los privilegios se otorgan mediante roles | `v02_control_acceso.sql` |
| OC-03 | A5.16 Gestión de identidades | Estado de las cuentas | Ninguna cuenta abierta con contraseña por defecto; ninguna cuenta compartida | `v03_identidades.sql` |
| OC-04 | A5.17 Información de autenticación | Perfil de contraseñas asignado | Función de verificación activa, vigencia de 90 días o menos y al menos 5 contraseñas sin reutilizar | `v04_perfil_contrasenas.sql` |
| OC-05 | A5.18 Derechos de acceso | Inventario de usuarios, roles y último acceso | Revisión fechada en los últimos 90 días; ninguna cuenta abierta sin acceso en más de 90 días | `v05_revision_derechos.sql` |
| OC-06 | A5.33 Protección de registros | Integridad de la auditoría | Un intento de borrar o modificar la auditoría es rechazado; la purga solo ocurre con `DBMS_AUDIT_MGMT` | `v06_proteccion_registros.sql` |
| OC-07 | A8.2 Acceso privilegiado | Rol DBA, privilegios ANY y archivo de contraseñas | Rol DBA solo en cuentas administrativas nominales; ningún privilegio ANY en cuentas de aplicación | `v07_acceso_privilegiado.sql` |
| OC-08 | A8.3 Restricción de acceso | Políticas VPD y filas visibles por médico | Cada médico ve solo sus consultas | `v08_vpd.sql` |
| OC-09 | A8.5 Autenticación segura | Bloqueo por intentos y versión de verificadores | 5 intentos fallidos o menos antes del bloqueo; solo verificadores 12C; intentos fallidos registrados | `v09_autenticacion_segura.sql` |
| OC-10 | A8.10 Eliminación de información | Papelera de reciclaje y respaldos obsoletos | Papelera de `CLINICA` vacía; ningún respaldo obsoleto | `v10_eliminacion.sql` |
| OC-11 | A8.11 Enmascaramiento | Políticas de Data Redaction y exenciones | Recepción ve la cédula parcial y el diagnóstico oculto; solo el DBA tiene `EXEMPT REDACTION POLICY` | `v11_enmascaramiento.sql` |
| OC-12 | A8.12 Prevención de fuga | Roles de Data Pump, enlaces y auditoría de exportaciones | Roles de Data Pump solo en el DBA; ningún enlace de base de datos; exportaciones auditadas | `v12_fuga_datos.sql` |
| OC-13 | A8.13 Respaldos | Configuración de RMAN y piezas de respaldo | Todas las piezas con cifrado activo; restauración probada | `v13_respaldos.sql` |
| OC-14 | A8.15 Registro | Políticas de auditoría activas y registros generados | Políticas activas sobre privilegiados, `CONSULTAS` y cambios de privilegios, con registros de las pruebas | `v14_auditoria.sql` |
| OC-15 | A8.20 Seguridad de redes | Configuración de red y cifrado de la sesión | Sesión TCP con cifrado AES activo; verificación de nodos habilitada | `v15_red.sql` |

## 8. Matriz de evaluación

De los 17 controles evaluados, 15 cumplen con nivel 3 (Verificado) y 2 quedan en Parcial con nivel 2: A8.12, porque XE no permite cifrar las exportaciones, y A8.8, porque XE no recibe parches. Ningún control llega al nivel 4, ya que no hay monitoreo continuo ni revisiones automatizadas; esas mejoras están en la sección 10.

### 8.1 Escala de madurez

| Nivel | Nombre | Condición observable |
| --- | --- | --- |
| 0 | Inexistente | El control no está implementado |
| 1 | Inicial | Implementado de forma parcial o manual, sin documentación ni evidencia |
| 2 | Definido | Implementado y documentado, sin una prueba que demuestre su efectividad |
| 3 | Verificado | Implementado, documentado y con una prueba ejecutada que cumple el criterio de la sección 7 |
| 4 | Optimizado | Nivel 3 más monitoreo continuo o revisión periódica automatizada |

Regla de estado: nivel 3 o 4 es Cumple, nivel 1 o 2 es Parcial y nivel 0 es No cumple.

### 8.2 Matriz

| Tarea | Riesgo | Control | Criterio 0-4 | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- |
| T-01 | R-CONF-01, R-CONF-02 | A5.16 Gestión de identidades | 3 Verificado | `evidencias/v03_identidades.txt` | Cumple |
| T-01, T-02 | R-CONF-01 | A5.18 Derechos de acceso | 3 Verificado | `evidencias/v05_revision_derechos.txt` | Cumple |
| T-02 | R-CONF-01, R-CONF-04 | A5.15 Control de acceso | 3 Verificado | `evidencias/v02_control_acceso.txt` | Cumple |
| T-02 | R-CONF-01 | A8.2 Acceso privilegiado | 3 Verificado | `evidencias/v07_acceso_privilegiado.txt` | Cumple |
| T-03 | R-CONF-02 | A5.17 Información de autenticación | 3 Verificado | `evidencias/v04_perfil_contrasenas.txt` | Cumple |
| T-03 | R-CONF-02 | A8.5 Autenticación segura | 3 Verificado | `evidencias/v09_autenticacion_segura.txt` | Cumple |
| T-04 | R-CONF-03 | A8.24 Uso de criptografía | 3 Verificado | `evidencias/v16_cifrado_tde.txt` | Cumple |
| T-05, T-12 | R-CONF-04 | A5.12 Clasificación | 3 Verificado | `evidencias/v01_clasificacion.txt` | Cumple |
| T-05 | R-CONF-04 | A8.3 Restricción de acceso | 3 Verificado | `evidencias/v08_vpd.txt` | Cumple |
| T-05, T-12 | R-CONF-04 | A8.11 Enmascaramiento | 3 Verificado | `evidencias/v11_enmascaramiento.txt` | Cumple |
| T-06 | R-CONF-03 | A8.13 Respaldos | 3 Verificado | `evidencias/v13_respaldos.txt` | Cumple |
| T-07 | R-CONF-05 | A8.12 Prevención de fuga | 2 Definido | `evidencias/v12_fuga_datos.txt` | Parcial |
| T-07, T-11 | R-CONF-05 | A8.15 Registro | 3 Verificado | `evidencias/v14_auditoria.txt` | Cumple |
| T-07, T-11 | R-CONF-05 | A5.33 Protección de registros | 3 Verificado | `evidencias/v06_proteccion_registros.txt` | Cumple |
| T-08 | R-CONF-02 | A8.8 Gestión de vulnerabilidades | 2 Definido | `evidencias/v17_version.txt` | Parcial |
| T-09 | R-CONF-02, R-CONF-03 | A8.20 Seguridad de redes | 3 Verificado | `evidencias/v15_red.txt` | Cumple |
| T-10 | R-CONF-03, R-CONF-05 | A8.10 Eliminación de información | 3 Verificado | `evidencias/v10_eliminacion.txt` | Cumple |

## 9. Batería de pruebas y scripts

La batería tiene 26 pruebas: 10 de configuración, que leen el diccionario o archivos, y 16 funcionales, que intentan una acción con un usuario de prueba y comprueban que el control la permite o la bloquea. Los resultados obtenidos se agregarán en la sección 9.4 tras la ejecución.

### 9.1 Usuarios y roles de prueba

| Usuario | Rol | Perfil del escenario |
| --- | --- | --- |
| `CLINICA` | Ninguno (cuenta propietaria, bloqueada tras la carga) | Dueño del esquema |
| `MED_ROJAS`, `MED_MORA` | `ROL_MEDICO` | Médicos |
| `RECEP_SOLIS` | `ROL_RECEPCION` | Recepción |
| `AUD_VEGA` | `ROL_AUDITOR` (con `AUDIT_VIEWER`) | Auditor |
| `DBA_OPER` | `DBA`, con privilegios administrativos `SYSBACKUP` y `SYSKM` | DBA operativo |
| `DEV_CALVO` | `ROL_DESARROLLO` | Desarrollador, solo sobre `CLINICA_DEV` |

### 9.2 Batería

| ID | Tipo | Control | Procedimiento | Resultado esperado | Herramienta |
| --- | --- | --- | --- | --- | --- |
| PR-01 | Configuración | A5.12 | Contar las columnas de `CLINICA` sin comentario en `dba_col_comments` | 0 columnas sin clasificar | SQL\*Plus |
| PR-02 | Configuración | A5.15 | Listar privilegios sobre `CLINICA` otorgados a PUBLIC o a usuarios directos | 0 filas; solo roles `ROL_*` como beneficiarios | SQL\*Plus |
| PR-03 | Funcional | A5.15 | Como `RECEP_SOLIS`, consultar `CLINICA.CONSULTAS` | Error ORA-00942: la tabla no es visible | SQL\*Plus |
| PR-04 | Configuración | A5.16 | Cruzar `dba_users_with_defpwd` con cuentas abiertas | 0 cuentas abiertas con contraseña por defecto | SQL\*Plus |
| PR-05 | Configuración | A5.17 | Consultar los límites de `PERFIL_CLINICA` y los usuarios que lo tienen asignado | Función `ORA12C_STRONG_VERIFY_FUNCTION`, vigencia 90 días, reutilización 5; todos los usuarios de prueba asignados | SQL\*Plus |
| PR-06 | Funcional | A5.17 | Cambiar la contraseña de `MED_ROJAS` a `abc123` | Error ORA-28003: la contraseña no cumple la verificación | SQL\*Plus |
| PR-07 | Configuración | A5.18 | Ejecutar el inventario de usuarios, roles y último acceso | Reporte fechado; 0 cuentas abiertas sin acceso en más de 90 días | SQL\*Plus |
| PR-08 | Funcional | A5.33 | Como `DBA_OPER`, ejecutar `DELETE` sobre `AUDSYS.AUD$UNIFIED` | Error ORA-46385: no se permite DML sobre la auditoría | SQL\*Plus |
| PR-09 | Funcional | A5.33 | Purgar registros con `DBMS_AUDIT_MGMT` y consultar la auditoría | La purga queda registrada en `unified_audit_trail` | SQL\*Plus |
| PR-10 | Configuración | A8.2 | Listar beneficiarios del rol DBA, privilegios ANY de cuentas no administrativas y `v$pwfile_users` | DBA solo en SYS, SYSTEM y `DBA_OPER`; 0 privilegios ANY fuera de ellos; `DBA_OPER` con SYSBACKUP y SYSKM | SQL\*Plus |
| PR-11 | Funcional | A8.2 | Conectar como `DBA_OPER AS SYSBACKUP` y consultar `CLINICA.CONSULTAS` | Error: SYSBACKUP no tiene acceso a datos de aplicación | SQL\*Plus |
| PR-12 | Funcional | A8.3 | Contar filas de `CONSULTAS` como `MED_ROJAS`, como `MED_MORA` y como dueño | Cada médico ve solo sus consultas; la suma coincide con el total | SQL\*Plus |
| PR-13 | Funcional | A8.5 | Intentar 6 conexiones con contraseña errónea como `MED_MORA` | Cuenta en estado LOCKED(TIMED) tras el quinto intento; intentos con código 1017 en la auditoría | SQL\*Plus |
| PR-14 | Configuración | A8.5 | Consultar `password_versions` de los usuarios de prueba | Solo el verificador 12C, con `SQLNET.ALLOWED_LOGON_VERSION_SERVER = 12a` | SQL\*Plus |
| PR-15 | Funcional | A8.10 | Crear y borrar una tabla temporal en `CLINICA`, purgar la papelera y consultar `dba_recyclebin` | 0 objetos en la papelera de `CLINICA` | SQL\*Plus |
| PR-16 | Funcional | A8.10 | Ejecutar `DELETE OBSOLETE` y luego `REPORT OBSOLETE` | Ningún respaldo obsoleto reportado | RMAN |
| PR-17 | Funcional | A8.11 | Como `RECEP_SOLIS`, consultar cédula y teléfono de `PACIENTES` | Cédula con solo los últimos 4 dígitos visibles | SQL\*Plus |
| PR-18 | Configuración | A8.11 | Consultar `redaction_policies` y beneficiarios de `EXEMPT REDACTION POLICY` | Políticas activas; exención solo en roles administrativos | SQL\*Plus |
| PR-19 | Funcional | A8.11 | Cruzar las cédulas de `CLINICA_DEV` con las de `CLINICA` | 0 coincidencias: el clon no contiene datos reales | SQL\*Plus |
| PR-20 | Configuración | A8.12 | Listar beneficiarios de roles de Data Pump, enlaces de base de datos y privilegios sobre directorios | Roles de Data Pump solo en DBA; 0 enlaces | SQL\*Plus |
| PR-21 | Funcional | A8.12 | Exportar `CLINICA` con Data Pump como `DBA_OPER` y consultar la auditoría | Registro de la exportación en `unified_audit_trail` | Data Pump, SQL\*Plus |
| PR-22 | Funcional | A8.13 | Respaldar con cifrado activo, consultar `v$backup_piece` y validar la restauración | Piezas con `ENCRYPTED = YES`; `RESTORE ... VALIDATE` exitoso | RMAN, SQL\*Plus |
| PR-23 | Funcional | A8.15 | Como `MED_ROJAS`, consultar `CONSULTAS` y revisar la auditoría | Registro con usuario, objeto y fecha de la consulta | SQL\*Plus |
| PR-24 | Revisión de archivo | A8.20 | Revisar `sqlnet.ora` del servidor | Cifrado e integridad en REQUIRED y verificación de nodos activa | Editor de texto |
| PR-25 | Funcional | A8.20 | Conectar por TCP a `XEPDB1` y consultar `v$session_connect_info` de la sesión | Servicio de cifrado AES256 activo | SQL\*Plus |
| PR-26 | Funcional | A8.24 | Forzar un checkpoint y buscar el nombre de un paciente en el archivo de datos cifrado y en uno sin cifrar | Texto no encontrado en el cifrado; encontrado en el de control | PowerShell, SQL\*Plus |

Los controles complementarios se verifican además con consultas de configuración en `v16_cifrado_tde.sql` (estado del keystore y tablespaces cifrados) y `v17_version.sql` (versión y componentes).

### 9.3 Scripts de configuración

Los scripts de `sql/01_setup/` implementan los controles en este orden:

1. `s01_tde_keystore.sql`: parámetros `WALLET_ROOT` y `TDE_CONFIGURATION`, keystore y llave maestra.
2. `s02_esquema_clinica.sql`: tablespace `CLINICA_DATA` cifrado con AES256, tablas, datos ficticios y comentarios de clasificación.
3. `s03_usuarios_roles.sql`: perfil, roles por función y usuarios de prueba.
4. `s04_vpd.sql`: política VPD sobre `CONSULTAS`.
5. `s05_redaction.sql`: políticas de Data Redaction sobre `PACIENTES` y `CONSULTAS`.
6. `s06_auditoria.sql`: políticas de auditoría unificada.
7. `s07_clon_dev.sql`: esquema `CLINICA_DEV` con enmascaramiento estático.
8. `s08_red.md`: cambios a `sqlnet.ora` y recarga del listener.
9. `s09_rman_cifrado.rman`: configuración de cifrado y respaldo.

XE no permite cifrar en línea un tablespace existente, por lo que `CLINICA_DATA` se crea cifrado desde el inicio.

### 9.4 Resultados obtenidos

De las 26 pruebas, 25 cumplen el resultado esperado; PR-21 no cumple por una limitación de Oracle XE, que no incluye el cifrado de exportaciones de Data Pump. La ejecución completa se realiza con `sql/02_verificacion/ejecutar_todo.sh` y el consolidado está en `evidencias/resumen_pruebas.md`.

| ID | Control | Resultado obtenido | Estado |
| --- | --- | --- | --- |
| PR-01 | A5.12 | 0 columnas sin clasificar de 17 | Cumple |
| PR-02 | A5.15 | 0 privilegios a PUBLIC o directos a usuarios | Cumple |
| PR-03 | A5.15 | `RECEP_SOLIS` recibe ORA-00942 al consultar `CONSULTAS` | Cumple |
| PR-04 | A5.16 | 0 cuentas abiertas con contraseña por defecto | Cumple |
| PR-05 | A5.17 | Perfil con función de verificación, vigencia 90 y reutilización 5, asignado a los 6 usuarios | Cumple |
| PR-06 | A5.17 | Contraseña `abc123` rechazada con ORA-28003 | Cumple |
| PR-07 | A5.18 | Inventario fechado; 0 cuentas abiertas inactivas por más de 90 días | Cumple |
| PR-08 | A5.33 | SYS recibe ORA-46385; `DBA_OPER` recibe ORA-00942 (ni siquiera ve la tabla) | Cumple |
| PR-09 | A5.33 | La purga con `DBMS_AUDIT_MGMT` queda registrada; los registros del día se conservan | Cumple |
| PR-10 | A8.2 | Rol DBA solo en cuentas administrativas; `DBA_OPER` con SYSBACKUP y SYSKM | Cumple |
| PR-11 | A8.2 | `DBA_OPER AS SYSBACKUP` no accede a `CONSULTAS` | Cumple |
| PR-12 | A8.3 | `MED_ROJAS` 18 filas, `MED_MORA` 12, dueño 30 | Cumple |
| PR-13 | A8.5 | Cuenta en LOCKED(TIMED) tras el quinto intento; intentos con código 1017 en la auditoría | Cumple |
| PR-14 | A8.5 | Los 6 usuarios solo con verificador 12C | Cumple |
| PR-15 | A8.10 | 0 objetos en la papelera de `CLINICA` | Cumple |
| PR-16 | A8.10 | `REPORT OBSOLETE` sin resultados tras `DELETE OBSOLETE` | Cumple |
| PR-17 | A8.11 | Recepción ve cédula X-XXXX-NNNN y teléfono XXXX-NNNN | Cumple |
| PR-18 | A8.11 | Políticas activas; exención solo vía roles administrativos | Cumple |
| PR-19 | A8.11 | 0 cédulas de `CLINICA_DEV` coinciden con `CLINICA` | Cumple |
| PR-20 | A8.12 | Roles de Data Pump solo en DBA; 0 enlaces de usuario (solo el interno `DBMS_CLRDBLINK`) | Cumple |
| PR-21 | A8.12 | Exportación cifrada rechazada con ORA-00439 (función no habilitada en XE); la exportación sin cifrar contiene el nombre del paciente en texto plano; la exportación sí queda auditada | No cumple |
| PR-22 | A8.13 | Piezas de respaldo con `ENCRYPTED = YES` (AES256); `RESTORE ... VALIDATE` exitoso | Cumple |
| PR-23 | A8.15 | `AUD_VEGA` ve el registro del acceso de `MED_ROJAS` a `CONSULTAS` | Cumple |
| PR-24 | A8.20 | Cifrado e integridad en REQUIRED; con una IP fuera de la lista de nodos invitados, la conexión se rechaza con ORA-12537 | Cumple |
| PR-25 | A8.20 | Sesión TCP con adaptadores AES256 y SHA256 activos | Cumple |
| PR-26 | A8.24 | Nombre del paciente: 0 apariciones en el archivo cifrado y 1 en el de control | Cumple |

Tres pruebas requirieron ajustar el script, no el control: PR-08 aceptó ORA-00942 como rechazo válido para `DBA_OPER`, PR-14 recortó un espacio final en `password_versions` y PR-20 excluyó el enlace interno de Oracle. Además, la prueba de AUTO\_LOGIN confirmó que tras un reinicio el keystore abre solo y los datos cifrados se leen sin intervención.

## 10. Plan de remediación (Actuar)

El plan cierra los dos controles en estado Parcial, reduce el riesgo residual del acceso privilegiado y propone las mejoras necesarias para llevar los controles al nivel 4. H-01 y H-02 son prioritarios, porque hoy permiten que un usuario privilegiado lea o extraiga datos sensibles en texto plano.

| ID | Hallazgo | Control | Acción propuesta | Responsable | Plazo | Resultado esperado |
| --- | --- | --- | --- | --- | --- | --- |
| H-01 | XE no cifra exportaciones de Data Pump (ORA-00439); un archivo de exportación expone los datos en texto plano | A8.12, A8.10 | Prohibir exportaciones de `CLINICA` fuera de un procedimiento autorizado; cifrar el directorio de Data Pump a nivel de sistema operativo; borrar el archivo apenas se use; en producción, usar una edición con cifrado de Data Pump | DBA y oficial de seguridad | 30 días | Ningún archivo de exportación legible en texto plano; PR-21 en Cumple |
| H-02 | `DBA_OPER` lee `PACIENTES` sin redacción, porque el rol DBA incluye SELECT ANY TABLE y EXEMPT REDACTION POLICY; sin Database Vault no hay control técnico que lo impida | A8.2, A8.11 | Reemplazar el rol DBA de `DBA_OPER` por un rol propio sin SELECT ANY TABLE, EXP\_FULL\_DATABASE ni EXEMPT REDACTION POLICY; reservar el rol DBA para una cuenta de emergencia con contraseña en custodia y uso auditado; evaluar Database Vault en Enterprise Edition | DBA y oficial de seguridad | 30 días | `DBA_OPER` ve la cédula redactada y 0 filas de `CONSULTAS` |
| H-03 | La versión XE 21.3 no recibe parches de seguridad | A8.8 | Planificar la migración a una versión de Oracle con soporte y actualizaciones vigentes; revisar los boletines de seguridad de Oracle cada trimestre | DBA | 90 días | A8.8 en nivel 3, con versión soportada y revisión trimestral registrada |
| H-04 | La auditoría opera en modo mixto y los registros no salen del servidor | A8.15, A5.33 | Habilitar la auditoría unificada pura y enviar los registros a un SIEM fuera del alcance del DBA | DBA y equipo de seguridad | 60 días | A8.15 y A5.33 en nivel 4 |
| H-05 | La revisión de derechos de acceso se ejecuta de forma manual | A5.18 | Programar el script de inventario con `DBMS_SCHEDULER` cada mes y archivar el reporte firmado por el responsable | DBA | 30 días | A5.18 en nivel 4 |
| H-06 | La lista de nodos invitados incluye una IP asignada por DHCP | A8.20 | Asignar una IP fija o una reserva DHCP al servidor | Soporte de infraestructura | 15 días | Filtrado por nodo estable ante cambios de red |

Cada acción se verifica con la misma batería: al completarla se vuelve a ejecutar `ejecutar_todo.sh` y se actualiza la matriz de la sección 8, lo que inicia un nuevo ciclo PHVA.

## Referencias

Asamblea Legislativa de la República de Costa Rica. (2011). *Ley n.º 8968: Protección de la persona frente al tratamiento de sus datos personales*. <https://pwc.com/ia/es/servicios/Regulacion-Legal/CR-Ley-n-8968.pdf>

Hall, T. (s.f.). *Auditing enhancements in Oracle Database 21c*. Oracle-Base. <https://oracle-base.com/articles/21c/auditing-enhancements-21c>

International Organization for Standardization. (2022a). *Information security, cybersecurity and privacy protection — Information security management systems — Requirements* (ISO/IEC 27001:2022).

International Organization for Standardization. (2022b). *Information security, cybersecurity and privacy protection — Information security controls* (ISO/IEC 27002:2022).

Joint Task Force. (2020). *Security and privacy controls for information systems and organizations* (NIST Special Publication 800-53, Rev. 5). National Institute of Standards and Technology. <https://doi.org/10.6028/NIST.SP.800-53r5>

Kertos. (s.f.). *ISO 27001 controls*. <https://www.kertos.io/en/blog/iso-27001-controls>

Oracle. (s.f.). *Oracle Database unified audit: Best practice guidelines* \[Documento técnico\]. <https://www.oracle.com/docs/tech/dbsec/unified-audit-best-practice-guidelines.pdf>

Oracle. (2021). *Oracle Database security guide, 21c*. <https://docs.oracle.com/en/database/oracle/oracle-database/21/dbseg/>

Oracle. (2024). *Oracle Database advanced security guide, 21c* (F31829-15). <https://docs.oracle.com/en/database/oracle/oracle-database/21/asoag/>

Poder Ejecutivo. (2012). *Decreto Ejecutivo n.º 37554-JP: Reglamento a la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales*. <https://www.tse.go.cr/pdf/normativa/reglamentoleyproteccionpersona.pdf>

Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). *Zero trust architecture* (NIST Special Publication 800-207). National Institute of Standards and Technology. <https://doi.org/10.6028/NIST.SP.800-207>

The Art of Service. (s.f.). *ISO 27001:2022: What changed and what it means for your ISMS*. <https://theartofservice.com/blog/iso-27001-2022-changes>
