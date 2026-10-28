// Generado por build_data.py a partir de docs/informe.md. No editar a mano.
const DATA = {
  "meta": {
    "titulo": "Controles ISO 27001:2022 para la Confidencialidad en Bases de Datos Oracle",
    "curso": "David Joel Soto Zuñiga",
    "escuela": "Escuela de Informática, Universidad Nacional",
    "profesor": "Johnny Villalobos Murillo",
    "ciclo": "II Ciclo 2026",
    "autor": "David Joel Soto Zuñiga",
    "fecha": "21 de octubre de 2026"
  },
  "phva": {
    "columns": [
      {
        "key": "etapa",
        "label": "Etapa"
      },
      {
        "key": "actividades",
        "label": "Actividades"
      },
      {
        "key": "secciones_del_informe",
        "label": "Secciones del informe"
      }
    ],
    "rows": [
      {
        "etapa": "Planificar",
        "actividades": "Identificar riesgos y tareas del DBA, seleccionar controles del Anexo A y definir criterios de madurez",
        "secciones_del_informe": "4, 5, 6 y 7"
      },
      {
        "etapa": "Hacer",
        "actividades": "Implementar los controles en Oracle con scripts de configuración",
        "secciones_del_informe": "6 y 9"
      },
      {
        "etapa": "Verificar",
        "actividades": "Ejecutar la batería de pruebas, recolectar evidencia y calificar la matriz",
        "secciones_del_informe": "8 y 9"
      },
      {
        "etapa": "Actuar",
        "actividades": "Definir acciones de remediación para controles en estado Parcial o No cumple",
        "secciones_del_informe": "10"
      }
    ]
  },
  "entorno": {
    "columns": [
      {
        "key": "elemento",
        "label": "Elemento"
      },
      {
        "key": "valor",
        "label": "Valor"
      }
    ],
    "rows": [
      {
        "elemento": "Motor",
        "valor": "Oracle Database 21c Express Edition 21.3.0.0.0"
      },
      {
        "elemento": "Arquitectura",
        "valor": "Multitenant: contenedor raíz `CDB$ROOT` (servicio XE) y PDB `XEPDB1` en modo READ WRITE"
      },
      {
        "elemento": "Modo de archivado",
        "valor": "ARCHIVELOG"
      },
      {
        "elemento": "Herramientas",
        "valor": "SQL*Plus, SQL Developer, Git"
      },
      {
        "elemento": "Conexión administrativa",
        "valor": "SYSDBA con autenticación del sistema operativo"
      },
      {
        "elemento": "Repositorio",
        "valor": "Scripts en `sql/`, evidencia en `evidencias/`, registro de IA en `ia/`"
      }
    ]
  },
  "capacidades": {
    "columns": [
      {
        "key": "funcion",
        "label": "Función"
      },
      {
        "key": "disponible",
        "label": "Disponible"
      },
      {
        "key": "estado_inicial",
        "label": "Estado inicial"
      }
    ],
    "rows": [
      {
        "funcion": "Transparent Data Encryption",
        "disponible": "Sí",
        "estado_inicial": "Keystore no configurado (`NOT_AVAILABLE`); `WALLET_ROOT` y `TDE_CONFIGURATION` vacíos; ningún tablespace cifrado"
      },
      {
        "funcion": "Data Redaction (`DBMS_REDACT`)",
        "disponible": "Sí",
        "estado_inicial": "Paquete válido, sin políticas"
      },
      {
        "funcion": "Virtual Private Database (`DBMS_RLS`)",
        "disponible": "Sí",
        "estado_inicial": "Paquete válido, opción de control de acceso de grano fino activa"
      },
      {
        "funcion": "Auditoría unificada",
        "disponible": "Parcial",
        "estado_inicial": "Modo mixto; políticas activas: `ORA_LOGON_FAILURES` y `ORA_SECURECONFIG`"
      },
      {
        "funcion": "Oracle Label Security",
        "disponible": "No",
        "estado_inicial": "No incluida en XE"
      },
      {
        "funcion": "Oracle Database Vault",
        "disponible": "No",
        "estado_inicial": "No incluida en XE"
      },
      {
        "funcion": "Cifrado de red",
        "disponible": "Por verificar",
        "estado_inicial": "La prueba se hizo con conexión local; requiere repetirse por TCP"
      }
    ]
  },
  "perfiles": {
    "columns": [
      {
        "key": "perfil",
        "label": "Perfil"
      },
      {
        "key": "necesidad_de_acceso",
        "label": "Necesidad de acceso"
      },
      {
        "key": "control_principal",
        "label": "Control principal"
      }
    ],
    "rows": [
      {
        "perfil": "Médico",
        "necesidad_de_acceso": "Solo las consultas de sus propios pacientes",
        "control_principal": "VPD"
      },
      {
        "perfil": "Recepción",
        "necesidad_de_acceso": "Datos de contacto, sin diagnósticos y con cédula parcial",
        "control_principal": "Privilegios de objeto y Data Redaction"
      },
      {
        "perfil": "Auditor",
        "necesidad_de_acceso": "Lectura de la auditoría, sin acceso a datos clínicos",
        "control_principal": "Rol `AUDIT_VIEWER`"
      },
      {
        "perfil": "DBA operativo",
        "necesidad_de_acceso": "Administración y respaldos, sin uso rutinario de SYSDBA",
        "control_principal": "Privilegios administrativos por tarea y auditoría"
      },
      {
        "perfil": "Desarrollador",
        "necesidad_de_acceso": "Solo clones DEV/TEST con datos enmascarados",
        "control_principal": "Enmascaramiento estático"
      }
    ]
  },
  "riesgos": {
    "columns": [
      {
        "key": "id",
        "label": "ID"
      },
      {
        "key": "riesgo",
        "label": "Riesgo"
      },
      {
        "key": "escenario_en_la_clinica",
        "label": "Escenario en la clínica"
      },
      {
        "key": "activo_afectado",
        "label": "Activo afectado"
      },
      {
        "key": "p",
        "label": "P"
      },
      {
        "key": "i",
        "label": "I"
      },
      {
        "key": "nivel",
        "label": "Nivel"
      }
    ],
    "rows": [
      {
        "id": "R-CONF-01",
        "riesgo": "Privilegios excesivos o cuentas privilegiadas compartidas",
        "escenario_en_la_clinica": "Un usuario de soporte con el rol DBA o con SELECT ANY TABLE consulta diagnósticos de pacientes; varias personas usan SYS",
        "activo_afectado": "Expedientes clínicos",
        "p": "4",
        "i": "5",
        "nivel": "20 Alto",
        "nivel_num": 20,
        "nivel_label": "Alto",
        "p_num": 4,
        "i_num": 5
      },
      {
        "id": "R-CONF-02",
        "riesgo": "Autenticación débil y servicios expuestos",
        "escenario_en_la_clinica": "Un atacante ingresa con una contraseña por defecto o de una cuenta inactiva, o aprovecha un listener sin restricciones o una versión sin parches",
        "activo_afectado": "Cuentas de base de datos y listener",
        "p": "3",
        "i": "5",
        "nivel": "15 Alto",
        "nivel_num": 15,
        "nivel_label": "Alto",
        "p_num": 3,
        "i_num": 5
      },
      {
        "id": "R-CONF-03",
        "riesgo": "Datos sin cifrar en reposo, en tránsito o en respaldos",
        "escenario_en_la_clinica": "Se copia un archivo de datos, un respaldo RMAN o un archivo de Data Pump sin cifrar, o se intercepta el tráfico entre la aplicación y la base",
        "activo_afectado": "Archivos de datos, respaldos y conexiones",
        "p": "3",
        "i": "5",
        "nivel": "15 Alto",
        "nivel_num": 15,
        "nivel_label": "Alto",
        "p_num": 3,
        "i_num": 5
      },
      {
        "id": "R-CONF-04",
        "riesgo": "Exposición de datos sensibles a usuarios sin necesidad de conocerlos",
        "escenario_en_la_clinica": "Recepción ve cédulas completas y diagnósticos; desarrolladores reciben un clon con datos reales de pacientes",
        "activo_afectado": "Columnas sensibles y clones DEV/TEST",
        "p": "4",
        "i": "4",
        "nivel": "16 Alto",
        "nivel_num": 16,
        "nivel_label": "Alto",
        "p_num": 4,
        "i_num": 4
      },
      {
        "id": "R-CONF-05",
        "riesgo": "Fuga de información sin detección",
        "escenario_en_la_clinica": "Un usuario privilegiado exporta datos y no queda registro revisable, o se purgan las trazas de auditoría sin control",
        "activo_afectado": "Auditoría y registros",
        "p": "3",
        "i": "4",
        "nivel": "12 Medio",
        "nivel_num": 12,
        "nivel_label": "Medio",
        "p_num": 3,
        "i_num": 4
      }
    ]
  },
  "tareas": {
    "columns": [
      {
        "key": "id",
        "label": "ID"
      },
      {
        "key": "tarea",
        "label": "Tarea"
      },
      {
        "key": "actividad_del_dba_en_la_clinica",
        "label": "Actividad del DBA en la clínica"
      },
      {
        "key": "riesgos",
        "label": "Riesgos"
      }
    ],
    "rows": [
      {
        "id": "T-01",
        "tarea": "Gestión de usuarios",
        "actividad_del_dba_en_la_clinica": "Crear cuentas nominales, bloquear cuentas por defecto e inactivas y dar de baja a quien deja la clínica",
        "riesgos": "R-CONF-01, R-CONF-02",
        "riesgos_list": [
          "R-CONF-01",
          "R-CONF-02"
        ]
      },
      {
        "id": "T-02",
        "tarea": "Gestión de privilegios",
        "actividad_del_dba_en_la_clinica": "Definir roles por perfil, revocar privilegios ANY y concesiones a PUBLIC, usar privilegios administrativos por tarea",
        "riesgos": "R-CONF-01",
        "riesgos_list": [
          "R-CONF-01"
        ]
      },
      {
        "id": "T-03",
        "tarea": "Autenticación",
        "actividad_del_dba_en_la_clinica": "Aplicar perfiles con complejidad, expiración y bloqueo por intentos fallidos",
        "riesgos": "R-CONF-02",
        "riesgos_list": [
          "R-CONF-02"
        ]
      },
      {
        "id": "T-04",
        "tarea": "Cifrado TDE",
        "actividad_del_dba_en_la_clinica": "Configurar el keystore, crear la llave maestra, cifrar el tablespace de expedientes y respaldar el keystore aparte",
        "riesgos": "R-CONF-03",
        "riesgos_list": [
          "R-CONF-03"
        ]
      },
      {
        "id": "T-05",
        "tarea": "Enmascaramiento dinámico",
        "actividad_del_dba_en_la_clinica": "Crear políticas de Data Redaction sobre cédula y contacto, y políticas VPD por médico",
        "riesgos": "R-CONF-04",
        "riesgos_list": [
          "R-CONF-04"
        ]
      },
      {
        "id": "T-06",
        "tarea": "Respaldos",
        "actividad_del_dba_en_la_clinica": "Configurar RMAN con cifrado, custodiar las copias y probar la restauración",
        "riesgos": "R-CONF-03",
        "riesgos_list": [
          "R-CONF-03"
        ]
      },
      {
        "id": "T-07",
        "tarea": "Auditoría",
        "actividad_del_dba_en_la_clinica": "Crear políticas unificadas sobre usuarios privilegiados, accesos a datos sensibles y exportaciones",
        "riesgos": "R-CONF-05",
        "riesgos_list": [
          "R-CONF-05"
        ]
      },
      {
        "id": "T-08",
        "tarea": "Parcheo",
        "actividad_del_dba_en_la_clinica": "Registrar la versión instalada y planificar actualizaciones; XE no recibe parches trimestrales, solo nuevas versiones",
        "riesgos": "R-CONF-02",
        "riesgos_list": [
          "R-CONF-02"
        ]
      },
      {
        "id": "T-09",
        "tarea": "Listener",
        "actividad_del_dba_en_la_clinica": "Restringir la administración remota, limitar los nodos que pueden conectarse y exigir cifrado en las conexiones",
        "riesgos": "R-CONF-02, R-CONF-03",
        "riesgos_list": [
          "R-CONF-02",
          "R-CONF-03"
        ]
      },
      {
        "id": "T-10",
        "tarea": "Eliminación segura",
        "actividad_del_dba_en_la_clinica": "Purgar la papelera de reciclaje, eliminar respaldos obsoletos y archivos de exportación según la retención definida",
        "riesgos": "R-CONF-03, R-CONF-05",
        "riesgos_list": [
          "R-CONF-03",
          "R-CONF-05"
        ]
      },
      {
        "id": "T-11",
        "tarea": "Gestión de logs",
        "actividad_del_dba_en_la_clinica": "Definir retención y purga controlada de la auditoría, proteger los registros y enviarlos a un SIEM",
        "riesgos": "R-CONF-05",
        "riesgos_list": [
          "R-CONF-05"
        ]
      },
      {
        "id": "T-12",
        "tarea": "Clones DEV/TEST",
        "actividad_del_dba_en_la_clinica": "Enmascarar de forma estática los datos antes de entregar un clon y usar cuentas distintas a las de producción",
        "riesgos": "R-CONF-04",
        "riesgos_list": [
          "R-CONF-04"
        ]
      }
    ]
  },
  "controles": [
    {
      "codigo": "A5.12",
      "nombre": "Clasificación de la información",
      "tema": "A5",
      "tema_label": "Organizacional (A5)",
      "tareas_y_riesgos": "T-05, T-12 · R-CONF-04",
      "tareas_list": [
        "T-05",
        "T-12"
      ],
      "riesgos_list": [
        "R-CONF-04"
      ],
      "justificacion": "Sin clasificar las columnas no se sabe qué ocultar ni qué enmascarar",
      "implementacion": "Etiquetar cada columna de `CLINICA` como Pública, Interna, Confidencial o Sensible con `COMMENT ON COLUMN`",
      "evidencia": "`SELECT table_name, column_name, comments FROM dba_col_comments WHERE owner = 'CLINICA'`"
    },
    {
      "codigo": "A5.15",
      "nombre": "Control de acceso",
      "tema": "A5",
      "tema_label": "Organizacional (A5)",
      "tareas_y_riesgos": "T-02 · R-CONF-01, R-CONF-04",
      "tareas_list": [
        "T-02"
      ],
      "riesgos_list": [
        "R-CONF-01",
        "R-CONF-04"
      ],
      "justificacion": "El acceso a expedientes debe responder a una política por perfil, no a concesiones individuales",
      "implementacion": "Un rol por perfil (médico, recepción, auditor) con privilegios de objeto; ninguna concesión a PUBLIC sobre `CLINICA`",
      "evidencia": "`SELECT grantee, table_name, privilege FROM dba_tab_privs WHERE owner = 'CLINICA'`"
    },
    {
      "codigo": "A5.16",
      "nombre": "Gestión de identidades",
      "tema": "A5",
      "tema_label": "Organizacional (A5)",
      "tareas_y_riesgos": "T-01 · R-CONF-01, R-CONF-02",
      "tareas_list": [
        "T-01"
      ],
      "riesgos_list": [
        "R-CONF-01",
        "R-CONF-02"
      ],
      "justificacion": "Cada acción debe atribuirse a una persona identificable",
      "implementacion": "Cuentas nominales únicas; cuentas por defecto bloqueadas; cuentas sin uso en 90 días bloqueadas",
      "evidencia": "`SELECT username, account_status, last_login FROM dba_users WHERE oracle_maintained = 'N'` y `SELECT * FROM dba_users_with_defpwd`"
    },
    {
      "codigo": "A5.17",
      "nombre": "Información de autenticación",
      "tema": "A5",
      "tema_label": "Organizacional (A5)",
      "tareas_y_riesgos": "T-03 · R-CONF-02",
      "tareas_list": [
        "T-03"
      ],
      "riesgos_list": [
        "R-CONF-02"
      ],
      "justificacion": "Las contraseñas débiles o compartidas anulan cualquier otro control de acceso",
      "implementacion": "Perfil `PERFIL_CLINICA` con función de verificación `ORA12C_STRONG_VERIFY_FUNCTION`, expiración y reutilización limitada",
      "evidencia": "`SELECT profile, resource_name, limit FROM dba_profiles WHERE resource_type = 'PASSWORD'`"
    },
    {
      "codigo": "A5.18",
      "nombre": "Derechos de acceso",
      "tema": "A5",
      "tema_label": "Organizacional (A5)",
      "tareas_y_riesgos": "T-01, T-02 · R-CONF-01",
      "tareas_list": [
        "T-01",
        "T-02"
      ],
      "riesgos_list": [
        "R-CONF-01"
      ],
      "justificacion": "Los derechos se acumulan con el tiempo si no se revisan",
      "implementacion": "Procedimiento de alta, cambio y baja; revisión periódica de usuarios y roles con un script de inventario",
      "evidencia": "Salida del script de revisión de `dba_role_privs` y `dba_sys_privs`, con fecha"
    },
    {
      "codigo": "A5.33",
      "nombre": "Protección de registros",
      "tema": "A5",
      "tema_label": "Organizacional (A5)",
      "tareas_y_riesgos": "T-07, T-11 · R-CONF-05",
      "tareas_list": [
        "T-07",
        "T-11"
      ],
      "riesgos_list": [
        "R-CONF-05"
      ],
      "justificacion": "El expediente clínico y la auditoría deben protegerse contra alteración y borrado",
      "implementacion": "Auditoría unificada en el esquema `AUDSYS`, de solo lectura; purga solo con `DBMS_AUDIT_MGMT` por un usuario con `AUDIT_ADMIN`",
      "evidencia": "Intento de `DELETE` sobre `AUDSYS` rechazado con error; `SELECT * FROM dba_audit_mgmt_config_params`"
    },
    {
      "codigo": "A8.2",
      "nombre": "Derechos de acceso privilegiado",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-02 · R-CONF-01",
      "tareas_list": [
        "T-02"
      ],
      "riesgos_list": [
        "R-CONF-01"
      ],
      "justificacion": "El DBA es el usuario con más poder sobre los expedientes",
      "implementacion": "Rol DBA solo para administradores nominales; sin privilegios ANY para usuarios de aplicación; SYSBACKUP y SYSKM en lugar de SYSDBA para tareas específicas",
      "evidencia": "`SELECT grantee FROM dba_role_privs WHERE granted_role = 'DBA'`, `SELECT grantee, privilege FROM dba_sys_privs WHERE privilege LIKE '%ANY%'` y `SELECT * FROM v$pwfile_users`"
    },
    {
      "codigo": "A8.3",
      "nombre": "Restricción de acceso a la información",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-05 · R-CONF-04",
      "tareas_list": [
        "T-05"
      ],
      "riesgos_list": [
        "R-CONF-04"
      ],
      "justificacion": "Un médico solo debe ver las consultas de sus pacientes",
      "implementacion": "Política VPD con `DBMS_RLS` sobre `CONSULTAS`, filtrada por el médico de la sesión",
      "evidencia": "`SELECT object_name, policy_name, enable FROM dba_policies WHERE object_owner = 'CLINICA'` y conteo de filas visto por cada médico"
    },
    {
      "codigo": "A8.5",
      "nombre": "Autenticación segura",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-03 · R-CONF-02",
      "tareas_list": [
        "T-03"
      ],
      "riesgos_list": [
        "R-CONF-02"
      ],
      "justificacion": "Los ataques de fuerza bruta deben bloquearse y quedar registrados",
      "implementacion": "`FAILED_LOGIN_ATTEMPTS` y `PASSWORD_LOCK_TIME` en el perfil; solo verificadores de contraseña de versión 12C",
      "evidencia": "`SELECT username, password_versions FROM dba_users` y registros de `ORA_LOGON_FAILURES` en `unified_audit_trail`"
    },
    {
      "codigo": "A8.10",
      "nombre": "Eliminación de información",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-10 · R-CONF-03, R-CONF-05",
      "tareas_list": [
        "T-10"
      ],
      "riesgos_list": [
        "R-CONF-03",
        "R-CONF-05"
      ],
      "justificacion": "Las copias residuales de datos clínicos siguen siendo datos personales",
      "implementacion": "Purga de la papelera de reciclaje, eliminación de respaldos obsoletos con RMAN y borrado de archivos de exportación vencidos",
      "evidencia": "`SELECT COUNT(*) FROM dba_recyclebin WHERE owner = 'CLINICA'` y salida de `REPORT OBSOLETE` en RMAN"
    },
    {
      "codigo": "A8.11",
      "nombre": "Enmascaramiento de datos",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-05, T-12 · R-CONF-04",
      "tareas_list": [
        "T-05",
        "T-12"
      ],
      "riesgos_list": [
        "R-CONF-04"
      ],
      "justificacion": "Recepción y desarrollo no necesitan ver cédulas ni diagnósticos reales",
      "implementacion": "Data Redaction parcial sobre la cédula y completa sobre el diagnóstico; script de enmascaramiento estático para clones",
      "evidencia": "`SELECT * FROM redaction_policies` y `SELECT * FROM redaction_columns`; `SELECT grantee FROM dba_sys_privs WHERE privilege = 'EXEMPT REDACTION POLICY'`"
    },
    {
      "codigo": "A8.12",
      "nombre": "Prevención de fuga de datos",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-07 · R-CONF-05",
      "tareas_list": [
        "T-07"
      ],
      "riesgos_list": [
        "R-CONF-05"
      ],
      "justificacion": "Una exportación masiva es el canal más directo de fuga",
      "implementacion": "Roles de Data Pump solo para el DBA; objetos DIRECTORY y enlaces de base de datos restringidos; política de auditoría sobre exportaciones",
      "evidencia": "`SELECT grantee, granted_role FROM dba_role_privs WHERE granted_role LIKE 'DATAPUMP%'`, `SELECT * FROM dba_db_links` y `SELECT * FROM audit_unified_enabled_policies`"
    },
    {
      "codigo": "A8.13",
      "nombre": "Respaldo de información",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-06 · R-CONF-03",
      "tareas_list": [
        "T-06"
      ],
      "riesgos_list": [
        "R-CONF-03"
      ],
      "justificacion": "Un respaldo sin cifrar es una copia completa de los expedientes",
      "implementacion": "RMAN con cifrado AES256 y prueba de restauración",
      "evidencia": "`SELECT * FROM v$rman_configuration` y `SELECT handle, encrypted FROM v$backup_piece`"
    },
    {
      "codigo": "A8.15",
      "nombre": "Registro",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-07, T-11 · R-CONF-05",
      "tareas_list": [
        "T-07",
        "T-11"
      ],
      "riesgos_list": [
        "R-CONF-05"
      ],
      "justificacion": "Sin registro no hay forma de detectar ni probar un acceso indebido",
      "implementacion": "Políticas unificadas sobre usuarios privilegiados, lectura de `CONSULTAS` y cambios de privilegios",
      "evidencia": "`SELECT policy_name, entity_name FROM audit_unified_enabled_policies` y consultas a `unified_audit_trail`"
    },
    {
      "codigo": "A8.20",
      "nombre": "Seguridad de redes",
      "tema": "A8",
      "tema_label": "Tecnológico (A8)",
      "tareas_y_riesgos": "T-09 · R-CONF-02, R-CONF-03",
      "tareas_list": [
        "T-09"
      ],
      "riesgos_list": [
        "R-CONF-02",
        "R-CONF-03"
      ],
      "justificacion": "El listener es la puerta de entrada a la base",
      "implementacion": "Cifrado obligatorio y verificación de nodos en `sqlnet.ora`; revisión de servicios expuestos en el listener",
      "evidencia": "`sqlnet.ora` con `SQLNET.ENCRYPTION_SERVER = REQUIRED` y `TCP.VALIDNODE_CHECKING = YES`; `SELECT network_service_banner FROM v$session_connect_info` desde una sesión TCP"
    },
    {
      "codigo": "A8.24",
      "nombre": "Uso de criptografía",
      "tema": "COMP",
      "tema_label": "Complementario",
      "tareas_y_riesgos": "T-04 · R-CONF-03",
      "tareas_list": [
        "T-04"
      ],
      "riesgos_list": [
        "R-CONF-03"
      ],
      "justificacion": "El cifrado en reposo requiere una gestión formal de llaves",
      "implementacion": "Keystore TDE bajo `WALLET_ROOT`, llave maestra, tablespace `CLINICA_DATA` cifrado con AES256 y respaldo del keystore fuera del servidor",
      "evidencia": "`SELECT * FROM v$encryption_wallet` y `SELECT tablespace_name, encrypted FROM dba_tablespaces`"
    },
    {
      "codigo": "A8.8",
      "nombre": "Gestión de vulnerabilidades técnicas",
      "tema": "COMP",
      "tema_label": "Complementario",
      "tareas_y_riesgos": "T-08 · R-CONF-02",
      "tareas_list": [
        "T-08"
      ],
      "riesgos_list": [
        "R-CONF-02"
      ],
      "justificacion": "Una versión con vulnerabilidades conocidas expone todos los controles",
      "implementacion": "Inventario de versión y componentes; plan de actualización a una versión soportada",
      "evidencia": "`SELECT banner_full FROM v$version`, `SELECT comp_name, version, status FROM dba_registry` y `SELECT * FROM dba_registry_sqlpatch`"
    }
  ],
  "observables": {
    "columns": [
      {
        "key": "n_o",
        "label": "N.º"
      },
      {
        "key": "control",
        "label": "Control"
      },
      {
        "key": "que_observa_el_auditor",
        "label": "Qué observa el auditor"
      },
      {
        "key": "criterio_de_cumplimiento",
        "label": "Criterio de cumplimiento"
      },
      {
        "key": "script_en_sql_02_verificacion",
        "label": "Script en `sql/02_verificacion/`"
      }
    ],
    "rows": [
      {
        "n_o": "OC-01",
        "control": "A5.12 Clasificación",
        "que_observa_el_auditor": "Etiquetas de clasificación en las columnas de `CLINICA`",
        "criterio_de_cumplimiento": "El 100 % de las columnas tiene etiqueta",
        "script_en_sql_02_verificacion": "`v01_clasificacion.sql`",
        "control_codigo": "A5.12",
        "control_nombre": "Clasificación",
        "script_archivo": "v01_clasificacion.sql"
      },
      {
        "n_o": "OC-02",
        "control": "A5.15 Control de acceso",
        "que_observa_el_auditor": "Privilegios de objeto sobre `CLINICA`",
        "criterio_de_cumplimiento": "Ninguna concesión a PUBLIC; todos los privilegios se otorgan mediante roles",
        "script_en_sql_02_verificacion": "`v02_control_acceso.sql`",
        "control_codigo": "A5.15",
        "control_nombre": "Control de acceso",
        "script_archivo": "v02_control_acceso.sql"
      },
      {
        "n_o": "OC-03",
        "control": "A5.16 Gestión de identidades",
        "que_observa_el_auditor": "Estado de las cuentas",
        "criterio_de_cumplimiento": "Ninguna cuenta abierta con contraseña por defecto; ninguna cuenta compartida",
        "script_en_sql_02_verificacion": "`v03_identidades.sql`",
        "control_codigo": "A5.16",
        "control_nombre": "Gestión de identidades",
        "script_archivo": "v03_identidades.sql"
      },
      {
        "n_o": "OC-04",
        "control": "A5.17 Información de autenticación",
        "que_observa_el_auditor": "Perfil de contraseñas asignado",
        "criterio_de_cumplimiento": "Función de verificación activa, vigencia de 90 días o menos y al menos 5 contraseñas sin reutilizar",
        "script_en_sql_02_verificacion": "`v04_perfil_contrasenas.sql`",
        "control_codigo": "A5.17",
        "control_nombre": "Información de autenticación",
        "script_archivo": "v04_perfil_contrasenas.sql"
      },
      {
        "n_o": "OC-05",
        "control": "A5.18 Derechos de acceso",
        "que_observa_el_auditor": "Inventario de usuarios, roles y último acceso",
        "criterio_de_cumplimiento": "Revisión fechada en los últimos 90 días; ninguna cuenta abierta sin acceso en más de 90 días",
        "script_en_sql_02_verificacion": "`v05_revision_derechos.sql`",
        "control_codigo": "A5.18",
        "control_nombre": "Derechos de acceso",
        "script_archivo": "v05_revision_derechos.sql"
      },
      {
        "n_o": "OC-06",
        "control": "A5.33 Protección de registros",
        "que_observa_el_auditor": "Integridad de la auditoría",
        "criterio_de_cumplimiento": "Un intento de borrar o modificar la auditoría es rechazado; la purga solo ocurre con `DBMS_AUDIT_MGMT`",
        "script_en_sql_02_verificacion": "`v06_proteccion_registros.sql`",
        "control_codigo": "A5.33",
        "control_nombre": "Protección de registros",
        "script_archivo": "v06_proteccion_registros.sql"
      },
      {
        "n_o": "OC-07",
        "control": "A8.2 Acceso privilegiado",
        "que_observa_el_auditor": "Rol DBA, privilegios ANY y archivo de contraseñas",
        "criterio_de_cumplimiento": "Rol DBA solo en cuentas administrativas nominales; ningún privilegio ANY en cuentas de aplicación",
        "script_en_sql_02_verificacion": "`v07_acceso_privilegiado.sql`",
        "control_codigo": "A8.2",
        "control_nombre": "Acceso privilegiado",
        "script_archivo": "v07_acceso_privilegiado.sql"
      },
      {
        "n_o": "OC-08",
        "control": "A8.3 Restricción de acceso",
        "que_observa_el_auditor": "Políticas VPD y filas visibles por médico",
        "criterio_de_cumplimiento": "Cada médico ve solo sus consultas",
        "script_en_sql_02_verificacion": "`v08_vpd.sql`",
        "control_codigo": "A8.3",
        "control_nombre": "Restricción de acceso",
        "script_archivo": "v08_vpd.sql"
      },
      {
        "n_o": "OC-09",
        "control": "A8.5 Autenticación segura",
        "que_observa_el_auditor": "Bloqueo por intentos y versión de verificadores",
        "criterio_de_cumplimiento": "5 intentos fallidos o menos antes del bloqueo; solo verificadores 12C; intentos fallidos registrados",
        "script_en_sql_02_verificacion": "`v09_autenticacion_segura.sql`",
        "control_codigo": "A8.5",
        "control_nombre": "Autenticación segura",
        "script_archivo": "v09_autenticacion_segura.sql"
      },
      {
        "n_o": "OC-10",
        "control": "A8.10 Eliminación de información",
        "que_observa_el_auditor": "Papelera de reciclaje y respaldos obsoletos",
        "criterio_de_cumplimiento": "Papelera de `CLINICA` vacía; ningún respaldo obsoleto",
        "script_en_sql_02_verificacion": "`v10_eliminacion.sql`",
        "control_codigo": "A8.10",
        "control_nombre": "Eliminación de información",
        "script_archivo": "v10_eliminacion.sql"
      },
      {
        "n_o": "OC-11",
        "control": "A8.11 Enmascaramiento",
        "que_observa_el_auditor": "Políticas de Data Redaction y exenciones",
        "criterio_de_cumplimiento": "Recepción ve la cédula parcial y el diagnóstico oculto; solo el DBA tiene `EXEMPT REDACTION POLICY`",
        "script_en_sql_02_verificacion": "`v11_enmascaramiento.sql`",
        "control_codigo": "A8.11",
        "control_nombre": "Enmascaramiento",
        "script_archivo": "v11_enmascaramiento.sql"
      },
      {
        "n_o": "OC-12",
        "control": "A8.12 Prevención de fuga",
        "que_observa_el_auditor": "Roles de Data Pump, enlaces y auditoría de exportaciones",
        "criterio_de_cumplimiento": "Roles de Data Pump solo en el DBA; ningún enlace de base de datos; exportaciones auditadas",
        "script_en_sql_02_verificacion": "`v12_fuga_datos.sql`",
        "control_codigo": "A8.12",
        "control_nombre": "Prevención de fuga",
        "script_archivo": "v12_fuga_datos.sql"
      },
      {
        "n_o": "OC-13",
        "control": "A8.13 Respaldos",
        "que_observa_el_auditor": "Configuración de RMAN y piezas de respaldo",
        "criterio_de_cumplimiento": "Todas las piezas con cifrado activo; restauración probada",
        "script_en_sql_02_verificacion": "`v13_respaldos.sql`",
        "control_codigo": "A8.13",
        "control_nombre": "Respaldos",
        "script_archivo": "v13_respaldos.sql"
      },
      {
        "n_o": "OC-14",
        "control": "A8.15 Registro",
        "que_observa_el_auditor": "Políticas de auditoría activas y registros generados",
        "criterio_de_cumplimiento": "Políticas activas sobre privilegiados, `CONSULTAS` y cambios de privilegios, con registros de las pruebas",
        "script_en_sql_02_verificacion": "`v14_auditoria.sql`",
        "control_codigo": "A8.15",
        "control_nombre": "Registro",
        "script_archivo": "v14_auditoria.sql"
      },
      {
        "n_o": "OC-15",
        "control": "A8.20 Seguridad de redes",
        "que_observa_el_auditor": "Configuración de red y cifrado de la sesión",
        "criterio_de_cumplimiento": "Sesión TCP con cifrado AES activo; verificación de nodos habilitada",
        "script_en_sql_02_verificacion": "`v15_red.sql`",
        "control_codigo": "A8.20",
        "control_nombre": "Seguridad de redes",
        "script_archivo": "v15_red.sql"
      }
    ]
  },
  "escala": {
    "columns": [
      {
        "key": "nivel",
        "label": "Nivel"
      },
      {
        "key": "nombre",
        "label": "Nombre"
      },
      {
        "key": "condicion_observable",
        "label": "Condición observable"
      }
    ],
    "rows": [
      {
        "nivel": "0",
        "nombre": "Inexistente",
        "condicion_observable": "El control no está implementado"
      },
      {
        "nivel": "1",
        "nombre": "Inicial",
        "condicion_observable": "Implementado de forma parcial o manual, sin documentación ni evidencia"
      },
      {
        "nivel": "2",
        "nombre": "Definido",
        "condicion_observable": "Implementado y documentado, sin una prueba que demuestre su efectividad"
      },
      {
        "nivel": "3",
        "nombre": "Verificado",
        "condicion_observable": "Implementado, documentado y con una prueba ejecutada que cumple el criterio de la sección 7"
      },
      {
        "nivel": "4",
        "nombre": "Optimizado",
        "condicion_observable": "Nivel 3 más monitoreo continuo o revisión periódica automatizada"
      }
    ]
  },
  "matriz": {
    "columns": [
      {
        "key": "tarea",
        "label": "Tarea"
      },
      {
        "key": "riesgo",
        "label": "Riesgo"
      },
      {
        "key": "control",
        "label": "Control"
      },
      {
        "key": "criterio_0_4",
        "label": "Criterio 0-4"
      },
      {
        "key": "evidencia",
        "label": "Evidencia"
      },
      {
        "key": "estado",
        "label": "Estado"
      }
    ],
    "rows": [
      {
        "tarea": "T-01",
        "riesgo": "R-CONF-01, R-CONF-02",
        "control": "A5.16 Gestión de identidades",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v03_identidades.txt`",
        "estado": "Cumple",
        "control_codigo": "A5.16",
        "control_nombre": "Gestión de identidades",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-01"
        ],
        "riesgos_list": [
          "R-CONF-01",
          "R-CONF-02"
        ],
        "evidencia_archivo": "evidencias/v03_identidades.txt"
      },
      {
        "tarea": "T-01, T-02",
        "riesgo": "R-CONF-01",
        "control": "A5.18 Derechos de acceso",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v05_revision_derechos.txt`",
        "estado": "Cumple",
        "control_codigo": "A5.18",
        "control_nombre": "Derechos de acceso",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-01",
          "T-02"
        ],
        "riesgos_list": [
          "R-CONF-01"
        ],
        "evidencia_archivo": "evidencias/v05_revision_derechos.txt"
      },
      {
        "tarea": "T-02",
        "riesgo": "R-CONF-01, R-CONF-04",
        "control": "A5.15 Control de acceso",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v02_control_acceso.txt`",
        "estado": "Cumple",
        "control_codigo": "A5.15",
        "control_nombre": "Control de acceso",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-02"
        ],
        "riesgos_list": [
          "R-CONF-01",
          "R-CONF-04"
        ],
        "evidencia_archivo": "evidencias/v02_control_acceso.txt"
      },
      {
        "tarea": "T-02",
        "riesgo": "R-CONF-01",
        "control": "A8.2 Acceso privilegiado",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v07_acceso_privilegiado.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.2",
        "control_nombre": "Acceso privilegiado",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-02"
        ],
        "riesgos_list": [
          "R-CONF-01"
        ],
        "evidencia_archivo": "evidencias/v07_acceso_privilegiado.txt"
      },
      {
        "tarea": "T-03",
        "riesgo": "R-CONF-02",
        "control": "A5.17 Información de autenticación",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v04_perfil_contrasenas.txt`",
        "estado": "Cumple",
        "control_codigo": "A5.17",
        "control_nombre": "Información de autenticación",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-03"
        ],
        "riesgos_list": [
          "R-CONF-02"
        ],
        "evidencia_archivo": "evidencias/v04_perfil_contrasenas.txt"
      },
      {
        "tarea": "T-03",
        "riesgo": "R-CONF-02",
        "control": "A8.5 Autenticación segura",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v09_autenticacion_segura.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.5",
        "control_nombre": "Autenticación segura",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-03"
        ],
        "riesgos_list": [
          "R-CONF-02"
        ],
        "evidencia_archivo": "evidencias/v09_autenticacion_segura.txt"
      },
      {
        "tarea": "T-04",
        "riesgo": "R-CONF-03",
        "control": "A8.24 Uso de criptografía",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v16_cifrado_tde.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.24",
        "control_nombre": "Uso de criptografía",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-04"
        ],
        "riesgos_list": [
          "R-CONF-03"
        ],
        "evidencia_archivo": "evidencias/v16_cifrado_tde.txt"
      },
      {
        "tarea": "T-05, T-12",
        "riesgo": "R-CONF-04",
        "control": "A5.12 Clasificación",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v01_clasificacion.txt`",
        "estado": "Cumple",
        "control_codigo": "A5.12",
        "control_nombre": "Clasificación",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-05",
          "T-12"
        ],
        "riesgos_list": [
          "R-CONF-04"
        ],
        "evidencia_archivo": "evidencias/v01_clasificacion.txt"
      },
      {
        "tarea": "T-05",
        "riesgo": "R-CONF-04",
        "control": "A8.3 Restricción de acceso",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v08_vpd.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.3",
        "control_nombre": "Restricción de acceso",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-05"
        ],
        "riesgos_list": [
          "R-CONF-04"
        ],
        "evidencia_archivo": "evidencias/v08_vpd.txt"
      },
      {
        "tarea": "T-05, T-12",
        "riesgo": "R-CONF-04",
        "control": "A8.11 Enmascaramiento",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v11_enmascaramiento.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.11",
        "control_nombre": "Enmascaramiento",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-05",
          "T-12"
        ],
        "riesgos_list": [
          "R-CONF-04"
        ],
        "evidencia_archivo": "evidencias/v11_enmascaramiento.txt"
      },
      {
        "tarea": "T-06",
        "riesgo": "R-CONF-03",
        "control": "A8.13 Respaldos",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v13_respaldos.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.13",
        "control_nombre": "Respaldos",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-06"
        ],
        "riesgos_list": [
          "R-CONF-03"
        ],
        "evidencia_archivo": "evidencias/v13_respaldos.txt"
      },
      {
        "tarea": "T-07",
        "riesgo": "R-CONF-05",
        "control": "A8.12 Prevención de fuga",
        "criterio_0_4": "2 Definido",
        "evidencia": "`evidencias/v12_fuga_datos.txt`",
        "estado": "Parcial",
        "control_codigo": "A8.12",
        "control_nombre": "Prevención de fuga",
        "nivel_num": 2,
        "nivel_label": "Definido",
        "tareas_list": [
          "T-07"
        ],
        "riesgos_list": [
          "R-CONF-05"
        ],
        "evidencia_archivo": "evidencias/v12_fuga_datos.txt"
      },
      {
        "tarea": "T-07, T-11",
        "riesgo": "R-CONF-05",
        "control": "A8.15 Registro",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v14_auditoria.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.15",
        "control_nombre": "Registro",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-07",
          "T-11"
        ],
        "riesgos_list": [
          "R-CONF-05"
        ],
        "evidencia_archivo": "evidencias/v14_auditoria.txt"
      },
      {
        "tarea": "T-07, T-11",
        "riesgo": "R-CONF-05",
        "control": "A5.33 Protección de registros",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v06_proteccion_registros.txt`",
        "estado": "Cumple",
        "control_codigo": "A5.33",
        "control_nombre": "Protección de registros",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-07",
          "T-11"
        ],
        "riesgos_list": [
          "R-CONF-05"
        ],
        "evidencia_archivo": "evidencias/v06_proteccion_registros.txt"
      },
      {
        "tarea": "T-08",
        "riesgo": "R-CONF-02",
        "control": "A8.8 Gestión de vulnerabilidades",
        "criterio_0_4": "2 Definido",
        "evidencia": "`evidencias/v17_version.txt`",
        "estado": "Parcial",
        "control_codigo": "A8.8",
        "control_nombre": "Gestión de vulnerabilidades",
        "nivel_num": 2,
        "nivel_label": "Definido",
        "tareas_list": [
          "T-08"
        ],
        "riesgos_list": [
          "R-CONF-02"
        ],
        "evidencia_archivo": "evidencias/v17_version.txt"
      },
      {
        "tarea": "T-09",
        "riesgo": "R-CONF-02, R-CONF-03",
        "control": "A8.20 Seguridad de redes",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v15_red.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.20",
        "control_nombre": "Seguridad de redes",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-09"
        ],
        "riesgos_list": [
          "R-CONF-02",
          "R-CONF-03"
        ],
        "evidencia_archivo": "evidencias/v15_red.txt"
      },
      {
        "tarea": "T-10",
        "riesgo": "R-CONF-03, R-CONF-05",
        "control": "A8.10 Eliminación de información",
        "criterio_0_4": "3 Verificado",
        "evidencia": "`evidencias/v10_eliminacion.txt`",
        "estado": "Cumple",
        "control_codigo": "A8.10",
        "control_nombre": "Eliminación de información",
        "nivel_num": 3,
        "nivel_label": "Verificado",
        "tareas_list": [
          "T-10"
        ],
        "riesgos_list": [
          "R-CONF-03",
          "R-CONF-05"
        ],
        "evidencia_archivo": "evidencias/v10_eliminacion.txt"
      }
    ]
  },
  "usuarios": {
    "columns": [
      {
        "key": "usuario",
        "label": "Usuario"
      },
      {
        "key": "rol",
        "label": "Rol"
      },
      {
        "key": "perfil_del_escenario",
        "label": "Perfil del escenario"
      }
    ],
    "rows": [
      {
        "usuario": "`CLINICA`",
        "rol": "Ninguno (cuenta propietaria, bloqueada tras la carga)",
        "perfil_del_escenario": "Dueño del esquema"
      },
      {
        "usuario": "`MED_ROJAS`, `MED_MORA`",
        "rol": "`ROL_MEDICO`",
        "perfil_del_escenario": "Médicos"
      },
      {
        "usuario": "`RECEP_SOLIS`",
        "rol": "`ROL_RECEPCION`",
        "perfil_del_escenario": "Recepción"
      },
      {
        "usuario": "`AUD_VEGA`",
        "rol": "`ROL_AUDITOR` (con `AUDIT_VIEWER`)",
        "perfil_del_escenario": "Auditor"
      },
      {
        "usuario": "`DBA_OPER`",
        "rol": "`DBA`, con privilegios administrativos `SYSBACKUP` y `SYSKM`",
        "perfil_del_escenario": "DBA operativo"
      },
      {
        "usuario": "`DEV_CALVO`",
        "rol": "`ROL_DESARROLLO`",
        "perfil_del_escenario": "Desarrollador, solo sobre `CLINICA_DEV`"
      }
    ]
  },
  "pruebas": [
    {
      "id": "PR-01",
      "tipo": "Configuración",
      "control": "A5.12",
      "procedimiento": "Contar las columnas de `CLINICA` sin comentario en `dba_col_comments`",
      "esperado": "0 columnas sin clasificar",
      "herramienta": "SQL*Plus",
      "obtenido": "0 columnas sin clasificar de 17",
      "estado": "Cumple",
      "evidencia": "../evidencias/v01_clasificacion.txt"
    },
    {
      "id": "PR-02",
      "tipo": "Configuración",
      "control": "A5.15",
      "procedimiento": "Listar privilegios sobre `CLINICA` otorgados a PUBLIC o a usuarios directos",
      "esperado": "0 filas; solo roles `ROL_*` como beneficiarios",
      "herramienta": "SQL*Plus",
      "obtenido": "0 privilegios a PUBLIC o directos a usuarios",
      "estado": "Cumple",
      "evidencia": "../evidencias/v02_control_acceso.txt"
    },
    {
      "id": "PR-03",
      "tipo": "Funcional",
      "control": "A5.15",
      "procedimiento": "Como `RECEP_SOLIS`, consultar `CLINICA.CONSULTAS`",
      "esperado": "Error ORA-00942: la tabla no es visible",
      "herramienta": "SQL*Plus",
      "obtenido": "`RECEP_SOLIS` recibe ORA-00942 al consultar `CONSULTAS`",
      "estado": "Cumple",
      "evidencia": "../evidencias/v02_control_acceso.txt"
    },
    {
      "id": "PR-04",
      "tipo": "Configuración",
      "control": "A5.16",
      "procedimiento": "Cruzar `dba_users_with_defpwd` con cuentas abiertas",
      "esperado": "0 cuentas abiertas con contraseña por defecto",
      "herramienta": "SQL*Plus",
      "obtenido": "0 cuentas abiertas con contraseña por defecto",
      "estado": "Cumple",
      "evidencia": "../evidencias/v03_identidades.txt"
    },
    {
      "id": "PR-05",
      "tipo": "Configuración",
      "control": "A5.17",
      "procedimiento": "Consultar los límites de `PERFIL_CLINICA` y los usuarios que lo tienen asignado",
      "esperado": "Función `ORA12C_STRONG_VERIFY_FUNCTION`, vigencia 90 días, reutilización 5; todos los usuarios de prueba asignados",
      "herramienta": "SQL*Plus",
      "obtenido": "Perfil con función de verificación, vigencia 90 y reutilización 5, asignado a los 6 usuarios",
      "estado": "Cumple",
      "evidencia": "../evidencias/v04_perfil_contrasenas.txt"
    },
    {
      "id": "PR-06",
      "tipo": "Funcional",
      "control": "A5.17",
      "procedimiento": "Cambiar la contraseña de `MED_ROJAS` a `abc123`",
      "esperado": "Error ORA-28003: la contraseña no cumple la verificación",
      "herramienta": "SQL*Plus",
      "obtenido": "Contraseña `abc123` rechazada con ORA-28003",
      "estado": "Cumple",
      "evidencia": "../evidencias/v04_perfil_contrasenas.txt"
    },
    {
      "id": "PR-07",
      "tipo": "Configuración",
      "control": "A5.18",
      "procedimiento": "Ejecutar el inventario de usuarios, roles y último acceso",
      "esperado": "Reporte fechado; 0 cuentas abiertas sin acceso en más de 90 días",
      "herramienta": "SQL*Plus",
      "obtenido": "Inventario fechado; 0 cuentas abiertas inactivas por más de 90 días",
      "estado": "Cumple",
      "evidencia": "../evidencias/v05_revision_derechos.txt"
    },
    {
      "id": "PR-08",
      "tipo": "Funcional",
      "control": "A5.33",
      "procedimiento": "Como `DBA_OPER`, ejecutar `DELETE` sobre `AUDSYS.AUD$UNIFIED`",
      "esperado": "Error ORA-46385: no se permite DML sobre la auditoría",
      "herramienta": "SQL*Plus",
      "obtenido": "SYS recibe ORA-46385; `DBA_OPER` recibe ORA-00942 (ni siquiera ve la tabla)",
      "estado": "Cumple",
      "evidencia": "../evidencias/v06_proteccion_registros.txt"
    },
    {
      "id": "PR-09",
      "tipo": "Funcional",
      "control": "A5.33",
      "procedimiento": "Purgar registros con `DBMS_AUDIT_MGMT` y consultar la auditoría",
      "esperado": "La purga queda registrada en `unified_audit_trail`",
      "herramienta": "SQL*Plus",
      "obtenido": "La purga con `DBMS_AUDIT_MGMT` queda registrada; los registros del día se conservan",
      "estado": "Cumple",
      "evidencia": "../evidencias/v06_proteccion_registros.txt"
    },
    {
      "id": "PR-10",
      "tipo": "Configuración",
      "control": "A8.2",
      "procedimiento": "Listar beneficiarios del rol DBA, privilegios ANY de cuentas no administrativas y `v$pwfile_users`",
      "esperado": "DBA solo en SYS, SYSTEM y `DBA_OPER`; 0 privilegios ANY fuera de ellos; `DBA_OPER` con SYSBACKUP y SYSKM",
      "herramienta": "SQL*Plus",
      "obtenido": "Rol DBA solo en cuentas administrativas; `DBA_OPER` con SYSBACKUP y SYSKM",
      "estado": "Cumple",
      "evidencia": "../evidencias/v07_acceso_privilegiado.txt"
    },
    {
      "id": "PR-11",
      "tipo": "Funcional",
      "control": "A8.2",
      "procedimiento": "Conectar como `DBA_OPER AS SYSBACKUP` y consultar `CLINICA.CONSULTAS`",
      "esperado": "Error: SYSBACKUP no tiene acceso a datos de aplicación",
      "herramienta": "SQL*Plus",
      "obtenido": "`DBA_OPER AS SYSBACKUP` no accede a `CONSULTAS`",
      "estado": "Cumple",
      "evidencia": "../evidencias/v07_acceso_privilegiado.txt"
    },
    {
      "id": "PR-12",
      "tipo": "Funcional",
      "control": "A8.3",
      "procedimiento": "Contar filas de `CONSULTAS` como `MED_ROJAS`, como `MED_MORA` y como dueño",
      "esperado": "Cada médico ve solo sus consultas; la suma coincide con el total",
      "herramienta": "SQL*Plus",
      "obtenido": "`MED_ROJAS` 18 filas, `MED_MORA` 12, dueño 30",
      "estado": "Cumple",
      "evidencia": "../evidencias/v08_vpd.txt"
    },
    {
      "id": "PR-13",
      "tipo": "Funcional",
      "control": "A8.5",
      "procedimiento": "Intentar 6 conexiones con contraseña errónea como `MED_MORA`",
      "esperado": "Cuenta en estado LOCKED(TIMED) tras el quinto intento; intentos con código 1017 en la auditoría",
      "herramienta": "SQL*Plus",
      "obtenido": "Cuenta en LOCKED(TIMED) tras el quinto intento; intentos con código 1017 en la auditoría",
      "estado": "Cumple",
      "evidencia": "../evidencias/v09_autenticacion_segura.txt"
    },
    {
      "id": "PR-14",
      "tipo": "Configuración",
      "control": "A8.5",
      "procedimiento": "Consultar `password_versions` de los usuarios de prueba",
      "esperado": "Solo el verificador 12C, con `SQLNET.ALLOWED_LOGON_VERSION_SERVER = 12a`",
      "herramienta": "SQL*Plus",
      "obtenido": "Los 6 usuarios solo con verificador 12C",
      "estado": "Cumple",
      "evidencia": "../evidencias/v09_autenticacion_segura.txt"
    },
    {
      "id": "PR-15",
      "tipo": "Funcional",
      "control": "A8.10",
      "procedimiento": "Crear y borrar una tabla temporal en `CLINICA`, purgar la papelera y consultar `dba_recyclebin`",
      "esperado": "0 objetos en la papelera de `CLINICA`",
      "herramienta": "SQL*Plus",
      "obtenido": "0 objetos en la papelera de `CLINICA`",
      "estado": "Cumple",
      "evidencia": "../evidencias/v10_eliminacion.txt"
    },
    {
      "id": "PR-16",
      "tipo": "Funcional",
      "control": "A8.10",
      "procedimiento": "Ejecutar `DELETE OBSOLETE` y luego `REPORT OBSOLETE`",
      "esperado": "Ningún respaldo obsoleto reportado",
      "herramienta": "RMAN",
      "obtenido": "`REPORT OBSOLETE` sin resultados tras `DELETE OBSOLETE`",
      "estado": "Cumple",
      "evidencia": "../evidencias/v10_obsoletos.txt"
    },
    {
      "id": "PR-17",
      "tipo": "Funcional",
      "control": "A8.11",
      "procedimiento": "Como `RECEP_SOLIS`, consultar cédula y teléfono de `PACIENTES`",
      "esperado": "Cédula con solo los últimos 4 dígitos visibles",
      "herramienta": "SQL*Plus",
      "obtenido": "Recepción ve cédula X-XXXX-NNNN y teléfono XXXX-NNNN",
      "estado": "Cumple",
      "evidencia": "../evidencias/v11_enmascaramiento.txt"
    },
    {
      "id": "PR-18",
      "tipo": "Configuración",
      "control": "A8.11",
      "procedimiento": "Consultar `redaction_policies` y beneficiarios de `EXEMPT REDACTION POLICY`",
      "esperado": "Políticas activas; exención solo en roles administrativos",
      "herramienta": "SQL*Plus",
      "obtenido": "Políticas activas; exención solo vía roles administrativos",
      "estado": "Cumple",
      "evidencia": "../evidencias/v11_enmascaramiento.txt"
    },
    {
      "id": "PR-19",
      "tipo": "Funcional",
      "control": "A8.11",
      "procedimiento": "Cruzar las cédulas de `CLINICA_DEV` con las de `CLINICA`",
      "esperado": "0 coincidencias: el clon no contiene datos reales",
      "herramienta": "SQL*Plus",
      "obtenido": "0 cédulas de `CLINICA_DEV` coinciden con `CLINICA`",
      "estado": "Cumple",
      "evidencia": "../evidencias/v11_enmascaramiento.txt"
    },
    {
      "id": "PR-20",
      "tipo": "Configuración",
      "control": "A8.12",
      "procedimiento": "Listar beneficiarios de roles de Data Pump, enlaces de base de datos y privilegios sobre directorios",
      "esperado": "Roles de Data Pump solo en DBA; 0 enlaces",
      "herramienta": "SQL*Plus",
      "obtenido": "Roles de Data Pump solo en DBA; 0 enlaces de usuario (solo el interno `DBMS_CLRDBLINK`)",
      "estado": "Cumple",
      "evidencia": "../evidencias/v12_fuga_datos.txt"
    },
    {
      "id": "PR-21",
      "tipo": "Funcional",
      "control": "A8.12",
      "procedimiento": "Exportar `CLINICA` con Data Pump como `DBA_OPER` y consultar la auditoría",
      "esperado": "Registro de la exportación en `unified_audit_trail`",
      "herramienta": "Data Pump, SQL*Plus",
      "obtenido": "Exportación cifrada rechazada con ORA-00439 (función no habilitada en XE); la exportación sin cifrar contiene el nombre del paciente en texto plano; la exportación sí queda auditada",
      "estado": "No cumple",
      "evidencia": "../evidencias/v12_expdp.txt"
    },
    {
      "id": "PR-22",
      "tipo": "Funcional",
      "control": "A8.13",
      "procedimiento": "Respaldar con cifrado activo, consultar `v$backup_piece` y validar la restauración",
      "esperado": "Piezas con `ENCRYPTED = YES`; `RESTORE ... VALIDATE` exitoso",
      "herramienta": "RMAN, SQL*Plus",
      "obtenido": "Piezas de respaldo con `ENCRYPTED = YES` (AES256); `RESTORE ... VALIDATE` exitoso",
      "estado": "Cumple",
      "evidencia": "../evidencias/v13_respaldos.txt"
    },
    {
      "id": "PR-23",
      "tipo": "Funcional",
      "control": "A8.15",
      "procedimiento": "Como `MED_ROJAS`, consultar `CONSULTAS` y revisar la auditoría",
      "esperado": "Registro con usuario, objeto y fecha de la consulta",
      "herramienta": "SQL*Plus",
      "obtenido": "`AUD_VEGA` ve el registro del acceso de `MED_ROJAS` a `CONSULTAS`",
      "estado": "Cumple",
      "evidencia": "../evidencias/v14_auditoria.txt"
    },
    {
      "id": "PR-24",
      "tipo": "Revisión de archivo",
      "control": "A8.20",
      "procedimiento": "Revisar `sqlnet.ora` del servidor",
      "esperado": "Cifrado e integridad en REQUIRED y verificación de nodos activa",
      "herramienta": "Editor de texto",
      "obtenido": "Cifrado e integridad en REQUIRED; con una IP fuera de la lista de nodos invitados, la conexión se rechaza con ORA-12537",
      "estado": "Cumple",
      "evidencia": "../evidencias/v15_red.txt"
    },
    {
      "id": "PR-25",
      "tipo": "Funcional",
      "control": "A8.20",
      "procedimiento": "Conectar por TCP a `XEPDB1` y consultar `v$session_connect_info` de la sesión",
      "esperado": "Servicio de cifrado AES256 activo",
      "herramienta": "SQL*Plus",
      "obtenido": "Sesión TCP con adaptadores AES256 y SHA256 activos",
      "estado": "Cumple",
      "evidencia": "../evidencias/v15_red.txt"
    },
    {
      "id": "PR-26",
      "tipo": "Funcional",
      "control": "A8.24",
      "procedimiento": "Forzar un checkpoint y buscar el nombre de un paciente en el archivo de datos cifrado y en uno sin cifrar",
      "esperado": "Texto no encontrado en el cifrado; encontrado en el de control",
      "herramienta": "PowerShell, SQL*Plus",
      "obtenido": "Nombre del paciente: 0 apariciones en el archivo cifrado y 1 en el de control",
      "estado": "Cumple",
      "evidencia": "../evidencias/v16_cifrado_tde.txt"
    }
  ],
  "remediacion": {
    "columns": [
      {
        "key": "id",
        "label": "ID"
      },
      {
        "key": "hallazgo",
        "label": "Hallazgo"
      },
      {
        "key": "control",
        "label": "Control"
      },
      {
        "key": "accion_propuesta",
        "label": "Acción propuesta"
      },
      {
        "key": "responsable",
        "label": "Responsable"
      },
      {
        "key": "plazo",
        "label": "Plazo"
      },
      {
        "key": "resultado_esperado",
        "label": "Resultado esperado"
      }
    ],
    "rows": [
      {
        "id": "H-01",
        "hallazgo": "XE no cifra exportaciones de Data Pump (ORA-00439); un archivo de exportación expone los datos en texto plano",
        "control": "A8.12, A8.10",
        "accion_propuesta": "Prohibir exportaciones de `CLINICA` fuera de un procedimiento autorizado; cifrar el directorio de Data Pump a nivel de sistema operativo; borrar el archivo apenas se use; en producción, usar una edición con cifrado de Data Pump",
        "responsable": "DBA y oficial de seguridad",
        "plazo": "30 días",
        "resultado_esperado": "Ningún archivo de exportación legible en texto plano; PR-21 en Cumple"
      },
      {
        "id": "H-02",
        "hallazgo": "`DBA_OPER` lee `PACIENTES` sin redacción, porque el rol DBA incluye SELECT ANY TABLE y EXEMPT REDACTION POLICY; sin Database Vault no hay control técnico que lo impida",
        "control": "A8.2, A8.11",
        "accion_propuesta": "Reemplazar el rol DBA de `DBA_OPER` por un rol propio sin SELECT ANY TABLE, EXP_FULL_DATABASE ni EXEMPT REDACTION POLICY; reservar el rol DBA para una cuenta de emergencia con contraseña en custodia y uso auditado; evaluar Database Vault en Enterprise Edition",
        "responsable": "DBA y oficial de seguridad",
        "plazo": "30 días",
        "resultado_esperado": "`DBA_OPER` ve la cédula redactada y 0 filas de `CONSULTAS`"
      },
      {
        "id": "H-03",
        "hallazgo": "La versión XE 21.3 no recibe parches de seguridad",
        "control": "A8.8",
        "accion_propuesta": "Planificar la migración a una versión de Oracle con soporte y actualizaciones vigentes; revisar los boletines de seguridad de Oracle cada trimestre",
        "responsable": "DBA",
        "plazo": "90 días",
        "resultado_esperado": "A8.8 en nivel 3, con versión soportada y revisión trimestral registrada"
      },
      {
        "id": "H-04",
        "hallazgo": "La auditoría opera en modo mixto y los registros no salen del servidor",
        "control": "A8.15, A5.33",
        "accion_propuesta": "Habilitar la auditoría unificada pura y enviar los registros a un SIEM fuera del alcance del DBA",
        "responsable": "DBA y equipo de seguridad",
        "plazo": "60 días",
        "resultado_esperado": "A8.15 y A5.33 en nivel 4"
      },
      {
        "id": "H-05",
        "hallazgo": "La revisión de derechos de acceso se ejecuta de forma manual",
        "control": "A5.18",
        "accion_propuesta": "Programar el script de inventario con `DBMS_SCHEDULER` cada mes y archivar el reporte firmado por el responsable",
        "responsable": "DBA",
        "plazo": "30 días",
        "resultado_esperado": "A5.18 en nivel 4"
      },
      {
        "id": "H-06",
        "hallazgo": "La lista de nodos invitados incluye una IP asignada por DHCP",
        "control": "A8.20",
        "accion_propuesta": "Asignar una IP fija o una reserva DHCP al servidor",
        "responsable": "Soporte de infraestructura",
        "plazo": "15 días",
        "resultado_esperado": "Filtrado por nodo estable ante cambios de red"
      }
    ]
  },
  "referencias": [
    {
      "texto": "Asamblea Legislativa de la República de Costa Rica. (2011). *Ley n.º 8968: Protección de la persona frente al tratamiento de sus datos personales*. <https://pwc.com/ia/es/servicios/Regulacion-Legal/CR-Ley-n-8968.pdf>",
      "url": "https://pwc.com/ia/es/servicios/Regulacion-Legal/CR-Ley-n-8968.pdf"
    },
    {
      "texto": "Hall, T. (s.f.). *Auditing enhancements in Oracle Database 21c*. Oracle-Base. <https://oracle-base.com/articles/21c/auditing-enhancements-21c>",
      "url": "https://oracle-base.com/articles/21c/auditing-enhancements-21c"
    },
    {
      "texto": "International Organization for Standardization. (2022a). *Information security, cybersecurity and privacy protection — Information security management systems — Requirements* (ISO/IEC 27001:2022).",
      "url": ""
    },
    {
      "texto": "International Organization for Standardization. (2022b). *Information security, cybersecurity and privacy protection — Information security controls* (ISO/IEC 27002:2022).",
      "url": ""
    },
    {
      "texto": "Joint Task Force. (2020). *Security and privacy controls for information systems and organizations* (NIST Special Publication 800-53, Rev. 5). National Institute of Standards and Technology. <https://doi.org/10.6028/NIST.SP.800-53r5>",
      "url": "https://doi.org/10.6028/NIST.SP.800-53r5"
    },
    {
      "texto": "Kertos. (s.f.). *ISO 27001 controls*. <https://www.kertos.io/en/blog/iso-27001-controls>",
      "url": "https://www.kertos.io/en/blog/iso-27001-controls"
    },
    {
      "texto": "Oracle. (s.f.). *Oracle Database unified audit: Best practice guidelines* \\[Documento técnico\\]. <https://www.oracle.com/docs/tech/dbsec/unified-audit-best-practice-guidelines.pdf>",
      "url": "https://www.oracle.com/docs/tech/dbsec/unified-audit-best-practice-guidelines.pdf"
    },
    {
      "texto": "Oracle. (2021). *Oracle Database security guide, 21c*. <https://docs.oracle.com/en/database/oracle/oracle-database/21/dbseg/>",
      "url": "https://docs.oracle.com/en/database/oracle/oracle-database/21/dbseg/"
    },
    {
      "texto": "Oracle. (2024). *Oracle Database advanced security guide, 21c* (F31829-15). <https://docs.oracle.com/en/database/oracle/oracle-database/21/asoag/>",
      "url": "https://docs.oracle.com/en/database/oracle/oracle-database/21/asoag/"
    },
    {
      "texto": "Poder Ejecutivo. (2012). *Decreto Ejecutivo n.º 37554-JP: Reglamento a la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales*. <https://www.tse.go.cr/pdf/normativa/reglamentoleyproteccionpersona.pdf>",
      "url": "https://www.tse.go.cr/pdf/normativa/reglamentoleyproteccionpersona.pdf"
    },
    {
      "texto": "Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). *Zero trust architecture* (NIST Special Publication 800-207). National Institute of Standards and Technology. <https://doi.org/10.6028/NIST.SP.800-207>",
      "url": "https://doi.org/10.6028/NIST.SP.800-207"
    },
    {
      "texto": "The Art of Service. (s.f.). *ISO 27001:2022: What changed and what it means for your ISMS*. <https://theartofservice.com/blog/iso-27001-2022-changes>",
      "url": "https://theartofservice.com/blog/iso-27001-2022-changes"
    }
  ],
  "prompts": {
    "columns": [
      {
        "key": "n_o",
        "label": "N.º"
      },
      {
        "key": "herramienta_ia",
        "label": "Herramienta IA"
      },
      {
        "key": "prompt_exacto_utilizado",
        "label": "Prompt exacto utilizado"
      },
      {
        "key": "aporte_de_la_ia",
        "label": "Aporte de la IA"
      },
      {
        "key": "validacion_correccion_del_estudiante",
        "label": "Validación / Corrección del estudiante"
      },
      {
        "key": "fuente_verificada",
        "label": "Fuente verificada"
      }
    ],
    "rows": [
      {
        "n_o": "IA-01",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Debemos hacer esto, lo haremos de manera ordenada, primero quiero que analices todo el documento, con base en eso, haz un plan de trabajo, y luego iremos desarrollando las tareas de ese plan. Supongo que ciertas tareas es mejor hacerlas aqui y otras en claude code, incluye tambien eso en el plan\". Contexto: enviado junto con el enunciado de la asignación en PDF.",
        "aporte_de_la_ia": "Análisis del enunciado, plan de trabajo por fases y reparto entre chat y Claude Code",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante contra el enunciado; correcto, sin cambios",
        "fuente_verificada": "Enunciado del curso"
      },
      {
        "n_o": "IA-02",
        "herramienta_ia": "Claude Code",
        "prompt_exacto_utilizado": "Proyecto universitario individual: marco de controles ISO/IEC 27001:2022 para confidencialidad en administración de bases de datos Oracle 21c. Entrega: 28 de octubre de 2026. Todo el contenido en español.\n\nTarea de esta sesión (solo preparación, no configures nada de seguridad todavía):\n\n1. Inicializa un repositorio Git con esta estructura:\niso27001-dba-confidencialidad/\nREADME.md\n.gitignore\ndocs/            (marco teórico e informe)\ndata/            (JSON: riesgos, tareas, controles, matriz, pruebas)\nsql/00_entorno/\nsql/01_setup/\nsql/02_verificacion/\nevidencias/      (salidas spool de los scripts)\nartefacto/       (sitio HTML interactivo)\nia/registro-prompts.md\n\n2. README.md: título, objetivo, estructura del repo, requisitos (Oracle 21c, SQL Developer / SQL*Plus), cómo ejecutar los scripts, metodología PHVA. Sin emojis.\n\n3. .gitignore: excluir archivos de wallet (*.p12, *.sso, ewallet*, cwallet*), credenciales y archivos .env.\n\n4. ia/registro-prompts.md: tabla con columnas Fecha | Herramienta IA | Prompt exacto | Aporte de la IA | Validación / Corrección del estudiante | Fuente verificada. Primera entrada (Claude, chat, 2026-10-21), prompt exacto:\n\"Debemos hacer esto, lo haremos de manera ordenada, primero quiero que analices todo el documento, con base en eso, haz un plan de trabajo, y luego iremos desarrollando las tareas de ese plan. Supongo que ciertas tareas es mejor hacerlas aqui y otras en claude code, incluye tambien eso en el plan\"\nAporte: análisis del enunciado y plan de trabajo por fases. Validación y fuente: dejar \"Pendiente\". Agrega también este prompt que te estoy dando como segunda entrada.\n\n5. sql/00_entorno/00_verificar_entorno.sql: script de solo lectura que haga SPOOL a evidencias/00_entorno.txt y reporte:\n- Versión y edición (v$version, v$instance), si es CDB y las PDB existentes (v$pdbs).\n- Opciones relevantes en v$option: Advanced Security, Unified Auditing, Fine-grained access control, Oracle Label Security.\n- Estado del wallet TDE (v$encryption_wallet) y parámetros wallet_root y tde_configuration.\n- Existencia de DBMS_REDACT y DBMS_RLS en dba_objects.\n- Políticas de auditoría unificada habilitadas (audit_unified_enabled_policies).\n- Cifrado de red de la sesión actual (v$session_connect_info).\nComentarios en español explicando cada bloque.\n\n6. Pregúntame los datos de conexión (no los guardes en el repo), ejecuta el script con SQL*Plus como SYSDBA contra el CDB root y luego contra la PDB, y muéstrame un resumen de qué funciones están disponibles y cuáles no.\n\n7. Haz el commit inicial.",
        "aporte_de_la_ia": "Estructura del repositorio, README y script de verificación del entorno",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante contra la documentación de Oracle; correcto, sin cambios",
        "fuente_verificada": "Oracle Database Reference 21c"
      },
      {
        "n_o": "IA-03",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Si quiero que la armes aquí como documento (exportable a PDF, y que crezca hasta ser el informe final)\". Contexto: respuesta a la pregunta de si el marco teórico se redactaba como documento que evolucionaría hasta el informe o como texto para Word.",
        "aporte_de_la_ia": "Introducción, marco teórico y referencias APA 7",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante: cifras de ISO, Ley 8968 y año de la guía de seguridad de Oracle; correcto, sin cambios",
        "fuente_verificada": "ISO/IEC 27001:2022 y 27002:2022; Ley 8968; NIST SP 800-207"
      },
      {
        "n_o": "IA-04",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "Salida completa de Claude Code de la Fase 0 pegada en el chat, con la versión de Oracle, las funciones de seguridad disponibles y no disponibles en XE y los ajustes de ejecución. Después, selección de la opción \"Clínica (Recomendado)\" entre tres escenarios propuestos: clínica, planilla y clientes financieros.",
        "aporte_de_la_ia": "Metodología, entorno, escenario de datos, riesgos R-CONF-01 a 05 y tareas T-01 a T-12",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante, incluidas las calificaciones de probabilidad e impacto; correcto, sin cambios",
        "fuente_verificada": "`evidencias/00_entorno.txt`"
      },
      {
        "n_o": "IA-05",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Sigamos\". Contexto: instrucción para avanzar a la Fase 3, el mapeo de los controles del Anexo A, después de revisar los riesgos y las tareas.",
        "aporte_de_la_ia": "Mapeo de los 15 controles y propuesta de 2 complementarios (A8.24 y A8.8)",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante contra ISO/IEC 27002:2022; correcto, sin cambios",
        "fuente_verificada": "ISO/IEC 27002:2022"
      },
      {
        "n_o": "IA-06",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Todas las preguntas dejemoslas para el final, hacemos un documento de preguntas y yo se las consulto al profesor, por ahora sigamos\". Contexto: indicación de reunir las dudas de alcance en un documento aparte y avanzar a la Fase 4.",
        "aporte_de_la_ia": "Lista de 15 controles observables, escala de madurez 0-4, matriz de evaluación y lista inicial de preguntas para el profesor",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante contra ISO/IEC 27002:2022; correcto, sin cambios",
        "fuente_verificada": "ISO/IEC 27002:2022"
      },
      {
        "n_o": "IA-07",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Ok, sigamos\". Contexto: aprobación para pasar al diseño de la batería de pruebas y del prompt de implementación.",
        "aporte_de_la_ia": "Batería de 26 pruebas y prompt de la Fase 5A",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante contra la documentación de Oracle; correcto, sin cambios",
        "fuente_verificada": "Oracle Security Guide 21c"
      },
      {
        "n_o": "IA-08",
        "herramienta_ia": "Claude Code",
        "prompt_exacto_utilizado": "Fase 5, parte A: implementar los controles de seguridad en Oracle 21c XE (Windows), sobre el repo iso27001-dba-confidencialidad. Todo en español, sin emojis. Usa Git Bash como en la sesión anterior (MSYS_NO_PATHCONV=1, NLS_LANG=AMERICAN_AMERICA.AL32UTF8).\n\nREGLAS GENERALES\n- Cada script en sql/01_setup/ hace SPOOL a evidencias/setup_&lt;nombre&gt;.txt, con encabezado de fecha y contenedor, y comentarios en español por bloque.\n- Scripts re-ejecutables: borra objetos previos si existen (bloques PL/SQL que ignoran ORA-00942, ORA-01918, ORA-01919, etc.).\n- Ninguna contraseña en scripts versionados. Crea sql/config_local.sql (agrégalo a .gitignore) con variables DEFINE para la contraseña del keystore y las de cada usuario. Genera contraseñas que cumplan ORA12C_STRONG_VERIFY_FUNCTION (mínimo 9 caracteres, 2 mayúsculas, 2 minúsculas, 2 dígitos y 2 caracteres especiales). Cada script hace @config_local.sql al inicio.\n- Datos 100 % ficticios.\n- Pídeme confirmación antes de reiniciar la base de datos.\n\nPASO 0. Respaldo y red\n- CREATE PFILE desde el SPFILE en un directorio fuera del repo y reporta la ruta.\n- Localiza el sqlnet.ora del servidor (usa orabasehome; 21c usa Oracle home de solo lectura). Respáldalo y agrega SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a. Esto debe hacerse ANTES de crear usuarios, para que solo se generen verificadores 12C. No cambies nada más de la red todavía.\n\ns01_tde_keystore.sql (CDB$ROOT, modo unido)\n- Crea el directorio para WALLET_ROOT fuera del repo. ALTER SYSTEM SET WALLET_ROOT=... SCOPE=SPFILE; reinicio (con mi confirmación); TDE_CONFIGURATION='KEYSTORE_CONFIGURATION=FILE' SCOPE=BOTH.\n- ADMINISTER KEY MANAGEMENT: crear keystore, abrirlo CONTAINER=ALL, SET KEY ... WITH BACKUP CONTAINER=ALL, crear keystore AUTO_LOGIN para que abra al reiniciar.\n- Copia de respaldo del keystore fuera del repo y fuera de WALLET_ROOT; reporta la ruta.\n\ns02_esquema_clinica.sql (XEPDB1)\n- Tablespace CLINICA_DATA (50M, autoextend) creado con ENCRYPTION USING 'AES256' ENCRYPT. XE no permite cifrar en línea un tablespace existente.\n- Usuario CLINICA con default tablespace CLINICA_DATA.\n- Tablas: MEDICOS(id, nombre, usuario_bd); PACIENTES(id, cedula VARCHAR2(11) con formato N-NNNN-NNNN, nombre, fecha_nacimiento, telefono NNNN-NNNN, correo, direccion); CONSULTAS(id, paciente_id, medico_id, fecha, diagnostico, tratamiento), con PK y FK.\n- Datos: 2 médicos con usuario_bd MED_ROJAS y MED_MORA; 20 pacientes; 30 consultas (18 de MED_ROJAS y 12 de MED_MORA).\n- COMMENT ON COLUMN en TODAS las columnas, con prefijo de clasificación [PUBLICA], [INTERNA], [CONFIDENCIAL] o [SENSIBLE] (diagnóstico y tratamiento son SENSIBLE; cédula y contacto son CONFIDENCIAL).\n- Al final: ALTER USER CLINICA ACCOUNT LOCK.\n\ns03_usuarios_roles.sql (XEPDB1)\n- Perfil PERFIL_CLINICA: PASSWORD_VERIFY_FUNCTION ORA12C_STRONG_VERIFY_FUNCTION, PASSWORD_LIFE_TIME 90, PASSWORD_REUSE_MAX 5, PASSWORD_REUSE_TIME 365, FAILED_LOGIN_ATTEMPTS 5, PASSWORD_LOCK_TIME 1/24, INACTIVE_ACCOUNT_TIME 90.\n- Roles: ROL_MEDICO (CREATE SESSION; SELECT sobre MEDICOS, PACIENTES y CONSULTAS; INSERT y UPDATE sobre CONSULTAS); ROL_RECEPCION (CREATE SESSION; SELECT, INSERT y UPDATE sobre PACIENTES; nada sobre CONSULTAS); ROL_AUDITOR (CREATE SESSION + AUDIT_VIEWER); ROL_DESARROLLO (CREATE SESSION; SELECT sobre las tablas de CLINICA_DEV, que se otorga en s07).\n- Usuarios con PERFIL_CLINICA: MED_ROJAS y MED_MORA (ROL_MEDICO), RECEP_SOLIS (ROL_RECEPCION), AUD_VEGA (ROL_AUDITOR), DEV_CALVO (ROL_DESARROLLO), DBA_OPER (rol DBA + GRANT SYSBACKUP y SYSKM).\n- Ningún privilegio directo a usuarios sobre objetos de CLINICA, ni nada a PUBLIC.\n\ns04_vpd.sql (XEPDB1)\n- Función CLINICA.FN_VPD_CONSULTAS(p_schema, p_obj) RETURN VARCHAR2: si SESSION_USER es un médico de MEDICOS, devuelve medico_id = (su id); si es CLINICA, devuelve NULL; en cualquier otro caso devuelve '1=0'.\n- DBMS_RLS.ADD_POLICY: CLINICA.CONSULTAS, POL_VPD_CONSULTAS, statement_types SELECT,INSERT,UPDATE,DELETE, update_check TRUE.\n\ns05_redaction.sql (XEPDB1)\n- Política POL_RED_PACIENTES sobre PACIENTES, con expresión SYS_CONTEXT('SYS_SESSION_ROLES','ROL_RECEPCION')='TRUE': CEDULA con redacción parcial que deja visibles solo los últimos 4 dígitos (X-XXXX-NNNN) y TELEFONO con redacción parcial (XXXX-NNNN).\n- Política POL_RED_CONSULTAS sobre CONSULTAS, con expresión SYS_CONTEXT('SYS_SESSION_ROLES','ROL_MEDICO')='FALSE': DIAGNOSTICO y TRATAMIENTO con redacción completa (defensa en profundidad para cualquier no médico con acceso).\n\ns06_auditoria.sql (XEPDB1)\n- POL_PRIVILEGIADOS: ACTIONS ALL, aplicada BY DBA_OPER.\n- POL_DATOS_SENSIBLES: SELECT, INSERT, UPDATE y DELETE sobre CLINICA.PACIENTES y CLINICA.CONSULTAS.\n- POL_CAMBIOS_PRIVILEGIOS: GRANT, REVOKE, CREATE/ALTER/DROP USER, CREATE/ALTER/DROP ROLE, ALTER PROFILE.\n- POL_EXPORTACIONES: ACTIONS COMPONENT=DATAPUMP EXPORT.\n- Habilita todas y confirma que ORA_LOGON_FAILURES siga activa.\n\ns07_clon_dev.sql (XEPDB1, como SYS)\n- Usuario CLINICA_DEV (bloqueado) con copia de las 3 tablas mediante CTAS y enmascaramiento estático: cédulas generadas con prefijo 9 (9-NNNN-NNNN, que no existe en datos reales), nombres \"Paciente &lt;id&gt;\", teléfonos aleatorios, correos paciente&lt;id&gt;@ejemplo.test y diagnósticos tomados de un catálogo genérico ficticio.\n- GRANT SELECT sobre esas tablas a ROL_DESARROLLO.\n\nEJECUCIÓN Y CIERRE\n- Ejecuta s01 a s07 en orden. Si algo falla, detente, muéstrame el error y propón la corrección antes de seguir.\n- Al final, muéstrame un resumen: objetos creados por script, estado del keystore (v$encryption_wallet en CDB y PDB), confirmación de que CLINICA_DATA está cifrado y rutas de los respaldos (pfile, sqlnet.ora y keystore).\n- Agrega este prompt completo a ia/registro-prompts.md, con Validación y Fuente en \"Pendiente\".\n- Haz commit con un mensaje descriptivo. No hagas push.",
        "aporte_de_la_ia": "Scripts de configuración s00 a s07 y su ejecución",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante con la ejecución de los scripts y sus evidencias; correcto, sin cambios",
        "fuente_verificada": "Oracle Advanced Security Guide 21c"
      },
      {
        "n_o": "IA-09",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "Salida completa de Claude Code de la Fase 5A pegada en el chat, con los objetos creados por cada script, el estado del keystore, las rutas de respaldo, los problemas corregidos y los pendientes, entre ellos el acceso de `DBA_OPER` a datos sin redacción.",
        "aporte_de_la_ia": "Prompt de la Fase 5B e incorporación del riesgo residual de `DBA_OPER` al plan de remediación",
        "validacion_correccion_del_estudiante": "Revisado por el estudiante; correcto, sin cambios",
        "fuente_verificada": "No aplica"
      },
      {
        "n_o": "IA-10",
        "herramienta_ia": "Claude Code",
        "prompt_exacto_utilizado": "Fase 5, parte B: red, AUTO_LOGIN, RMAN cifrado, scripts de verificación v01 a v17 y ejecución de las 26 pruebas (PR-01 a PR-26). Mismo repo, mismas reglas que la parte A: Git Bash con MSYS_NO_PATHCONV=1 y NLS_LANG=AMERICAN_AMERICA.AL32UTF8, encabezado común, @config_local.sql, sin contraseñas en archivos versionados ni en evidencias, comentarios en español, sin emojis. Pídeme confirmación antes de cada reinicio de la base o del listener.\n\nPASO 1. Red (sql/01_setup/s08_red.sh + s08_red.md)\n- Respalda de nuevo el sqlnet.ora del servidor (fuera del repo) y agrega: SQLNET.ENCRYPTION_SERVER REQUIRED, ENCRYPTION_TYPES_SERVER (AES256), CRYPTO_CHECKSUM_SERVER REQUIRED, CRYPTO_CHECKSUM_TYPES_SERVER (SHA256), TCP.VALIDNODE_CHECKING YES, TCP.INVITED_NODES con bucle local, hostname e IPv4 del equipo.\n- Verifica hostname e IP reales antes de reiniciar; reinicia el listener y comprueba XE y XEPDB1. s08_red.md documenta cada parámetro, su control (A8.20) y cómo revertirlo.\n\nPASO 2. Prueba de AUTO_LOGIN: reinicio con confirmación; v$encryption_wallet OPEN/AUTOLOGIN en CDB y PDB sin abrir nada manual; XEPDB1 en READ WRITE. Evidencia setup_autologin.txt.\n\nPASO 3. RMAN (s09_rman_cifrado.rman): ENCRYPTION FOR DATABASE ON, ALGORITHM AES256, RETENTION REDUNDANCY 1; respaldo de XEPDB1; log a setup_rman.txt. Si el cifrado falla en XE, detente y muéstrame el error.\n\nPASO 4. Scripts v01 a v17 en sql/02_verificacion/ (SPOOL que sobrescribe, encabezado con IDs de prueba, RESULTADO PR-XX con CASE, pruebas negativas con WHENEVER SQLERROR CONTINUE y código ORA, conexiones de usuarios por TCP). Cubren PR-01 a PR-26 (clasificación, control de acceso, identidades, perfil de contraseñas, revisión de derechos, protección de registros, acceso privilegiado, VPD, autenticación, eliminación segura y obsoletos RMAN, enmascaramiento, fuga de datos y expdp cifrado, respaldos y restore validate, auditoría, red, cifrado TDE con prueba de texto plano, versión). Más sql/02_verificacion/ejecutar_todo.sh.\n\nPASO 5. Ejecuta ejecutar_todo.sh; corrige scripts (no controles) ante NO CUMPLE por error de script; los fallos reales quedan como hallazgo. Genera evidencias/resumen_pruebas.md (ID, control, esperado, obtenido, CUMPLE/NO CUMPLE, evidencia). Deja el entorno limpio (MED_MORA desbloqueado, sin dumps/copias/tablespaces de control). Agrega este prompt a ia/registro-prompts.md (Validación y Fuente Pendiente), actualiza el README con 02_verificacion y haz commit (sin push). Muéstrame resumen_pruebas.md y los hallazgos.",
        "aporte_de_la_ia": "Configuración de red y RMAN, scripts v01 a v17 y ejecución de las 26 pruebas",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante con la ejecución de las pruebas y sus evidencias; correcto, sin cambios",
        "fuente_verificada": "Oracle Net Services y RMAN 21c"
      },
      {
        "n_o": "IA-11",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "Salida completa de Claude Code de la Fase 5B pegada en el chat, con los resultados de las 26 pruebas, el hallazgo PR-21 (ORA-00439), los ajustes de script y la prueba negativa del filtrado por nodo.",
        "aporte_de_la_ia": "Resultados obtenidos, calificación de la matriz y plan de remediación",
        "validacion_correccion_del_estudiante": "Verificado por el estudiante contra el resumen de pruebas; correcto, sin cambios",
        "fuente_verificada": "`evidencias/resumen_pruebas.md`"
      },
      {
        "n_o": "IA-12",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Sigamos\". Contexto: instrucción para avanzar a la Fase 8, el artefacto HTML interactivo.",
        "aporte_de_la_ia": "Prompt de la Fase 8",
        "validacion_correccion_del_estudiante": "Revisado por el estudiante; correcto, sin cambios",
        "fuente_verificada": "No aplica"
      },
      {
        "n_o": "IA-13",
        "herramienta_ia": "Claude Code",
        "prompt_exacto_utilizado": "Fase 8: artefacto HTML interactivo del proyecto, en artefacto/ del repo iso27001-dba-confidencialidad. Todo en español neutro, sin emojis.\n\nFUENTE ÚNICA DE DATOS\n- docs/informe.md es la fuente oficial (exportado del informe). No copies contenido a mano.\n- Crea artefacto/build_data.py (Python 3, solo biblioteca estándar) que: lea docs/informe.md y convierta a JSON cada tabla de las secciones 3.1, 3.3, 3.4, 4, 5, 6.1/6.2/6.3, 7, 8.1, 8.2, 9.1, 9.2, 9.4, 10 y las Referencias; una la batería (9.2) con los resultados (9.4) por ID; lea el texto de cada script de sql/01_setup/ y sql/02_verificacion/ (.sql, .sh, .rman, .md); lea ia/registro-prompts.md; y escriba artefacto/data.js con const DATA = {...}; para que funcione como archivo local y en GitHub Pages.\n- Si cambia el informe, basta con volver a ejecutar build_data.py.\n\nPÁGINA (index.html + styles.css + app.js): HTML/CSS/JS sin frameworks; única dependencia externa highlight.js desde cdnjs. Navegación lateral fija (menú desplegable en móvil) con 12 secciones: Resumen (con indicadores calculados y diagrama PHVA), Entorno, Riesgos (tabla + mapa de calor 5x5 con texto del nivel), Tareas (al seleccionar resalta riesgos y controles), Mapeo ISO (tarjetas con filtro por tema y buscador; evidencia como código copiable), Controles observables (enlace al visor de scripts), Matriz (insignias de madurez y estado, filtros, escala visible), Batería (filtros por tipo/control/estado y enlace a evidencia ../evidencias/archivo.txt), Scripts (visor agrupado, resaltado, copiar, enlace al repo), Remediación (ordenada por plazo), Uso de IA (prompts recortados que se expanden), Referencias (APA 7 con enlaces). Modo claro y oscuro, sin scroll horizontal en móvil, foco visible, estilos de impresión, rutas relativas.\n\nVERIFICACIÓN: ejecuta build_data.py y confirma conteos (5 riesgos, 12 tareas, 17 controles, 15 observables, 17 matriz, 26 pruebas, 6 remediaciones, todos los scripts); sirve con python -m http.server desde la raíz, abre /artefacto/ y comprueba consola sin errores, filtros, enlaces y vista a 375 px; revisa que ningún dato incluya contraseñas ni config_local.sql.\n\nCIERRE: sección en el README (regenerar datos, verlo localmente, publicar en GitHub Pages); agrega este prompt a ia/registro-prompts.md (Validación y Fuente Pendiente) y haz commit sin push; muestra los conteos y cualquier tabla no convertida.",
        "aporte_de_la_ia": "Artefacto HTML interactivo y generador de datos",
        "validacion_correccion_del_estudiante": "Revisado por el estudiante en el navegador; correcto, sin cambios",
        "fuente_verificada": "No aplica"
      },
      {
        "n_o": "IA-14",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Si\". Contexto: aceptación de la propuesta de redactar el guion del video mientras Claude Code construía el artefacto.",
        "aporte_de_la_ia": "Guion del video de 5 minutos (no utilizado: el profesor retiró el video de los entregables)",
        "validacion_correccion_del_estudiante": "Revisado por el estudiante; correcto, sin cambios",
        "fuente_verificada": "No aplica"
      },
      {
        "n_o": "IA-15",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "Salida de Claude Code de la Fase 8 pegada en el chat, con los conteos por sección del artefacto y las verificaciones realizadas.",
        "aporte_de_la_ia": "Sección 11, conclusiones y documento de preguntas para el profesor",
        "validacion_correccion_del_estudiante": "Revisado por el estudiante; correcto, sin cambios",
        "fuente_verificada": "No aplica"
      },
      {
        "n_o": "IA-16",
        "herramienta_ia": "Claude (chat)",
        "prompt_exacto_utilizado": "\"Ya tenemos que entregar esto nada mas corrijamos mis promts [...] Hazlos que suenen mas elaborados. Insertale mi firma a la declaracion, y mi numero de cedula es [omitido]. dame el promt final para claude code tambien\". Contexto: enviado con la imagen de la firma.",
        "aporte_de_la_ia": "Contexto de cada prompt en esta tabla, manteniendo su texto literal; inserción de firma y cédula; prompt final de cierre",
        "validacion_correccion_del_estudiante": "Revisado por el estudiante; correcto, sin cambios",
        "fuente_verificada": "No aplica"
      }
    ]
  },
  "scripts": [
    {
      "ruta": "sql/01_setup/comun/encabezado.sql",
      "carpeta": "01_setup",
      "subcarpeta": "comun",
      "nombre": "encabezado.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Encabezado común de evidencia para los scripts de sql/01_setup.\n-- Uso: @sql/01_setup/comun/encabezado.sql <nombre_script>\n-- Registra cuándo, con qué usuario y en qué contenedor se ejecutó el script.\n-- Se invoca después de ALTER SESSION SET CONTAINER; DBMS_OUTPUT se habilita\n-- aquí porque el cambio de contenedor descarta la habilitación previa.\n--------------------------------------------------------------------------------\nSET SERVEROUTPUT ON SIZE UNLIMITED\nPROMPT\nPROMPT ================================================================================\nPROMPT  EVIDENCIA DE CONFIGURACIÓN - &1\nPROMPT  Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c\nPROMPT ================================================================================\n\nCOLUMN fecha_hora    FORMAT A28\nCOLUMN usuario       FORMAT A10\nCOLUMN contenedor    FORMAT A12\nCOLUMN con_id        FORMAT A6\nCOLUMN instancia     FORMAT A10\nCOLUMN autenticacion FORMAT A13\n\nSELECT TO_CHAR(SYSTIMESTAMP, 'YYYY-MM-DD HH24:MI:SS TZH:TZM') AS fecha_hora,\n       SYS_CONTEXT('USERENV', 'SESSION_USER')                 AS usuario,\n       SYS_CONTEXT('USERENV', 'CON_NAME')                     AS contenedor,\n       SYS_CONTEXT('USERENV', 'CON_ID')                       AS con_id,\n       SYS_CONTEXT('USERENV', 'INSTANCE_NAME')                AS instancia,\n       SYS_CONTEXT('USERENV', 'AUTHENTICATION_METHOD')        AS autenticacion\nFROM   dual;\n\nCOLUMN fecha_hora    CLEAR\nCOLUMN usuario       CLEAR\nCOLUMN contenedor    CLEAR\nCOLUMN con_id        CLEAR\nCOLUMN instancia     CLEAR\nCOLUMN autenticacion CLEAR\n"
    },
    {
      "ruta": "sql/01_setup/comun/reiniciar_bd.sql",
      "carpeta": "01_setup",
      "subcarpeta": "comun",
      "nombre": "reiniciar_bd.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Reinicio controlado de la instancia (invocado por s01 solo cuando hace falta).\n-- SHUTDOWN IMMEDIATE espera a que terminen las transacciones activas mediante\n-- rollback; STARTUP vuelve a leer el SPFILE con el nuevo WALLET_ROOT.\n-- Al final se abren todas las PDB (XEPDB1 también tiene estado guardado OPEN).\n--------------------------------------------------------------------------------\nPROMPT Reinicio necesario: WALLET_ROOT del SPFILE difiere del valor en memoria.\nPROMPT Ejecutando SHUTDOWN IMMEDIATE y STARTUP...\nSHUTDOWN IMMEDIATE\nSTARTUP\nALTER PLUGGABLE DATABASE ALL OPEN;\n-- La sesión posterior al STARTUP es nueva: se vuelve a habilitar DBMS_OUTPUT.\nSET SERVEROUTPUT ON SIZE UNLIMITED\n"
    },
    {
      "ruta": "sql/01_setup/comun/sin_reinicio.sql",
      "carpeta": "01_setup",
      "subcarpeta": "comun",
      "nombre": "sin_reinicio.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Alternativa a reiniciar_bd.sql cuando WALLET_ROOT ya está vigente en memoria\n-- (re-ejecución de s01): no se reinicia la instancia.\n--------------------------------------------------------------------------------\nPROMPT WALLET_ROOT ya está vigente en la instancia: no se requiere reinicio.\n"
    },
    {
      "ruta": "sql/01_setup/prueba_autologin.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "prueba_autologin.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/prueba_autologin.sql\n-- Contenedor: CDB$ROOT y XEPDB1\n-- Fase PHVA: Verificar (complemento de s01)\n-- Controles: ISO/IEC 27001:2022 A.8.24 (uso de criptografía),\n--            A.8.14 (redundancia / disponibilidad tras reinicio)\n--\n-- Propósito:\n--   Comprobar que, tras un reinicio, el keystore AUTO_LOGIN (cwallet.sso)\n--   abre automáticamente en CDB$ROOT y en XEPDB1 sin ADMINISTER KEY\n--   MANAGEMENT manual, y que XEPDB1 vuelve a READ WRITE por su estado guardado.\n--   No se ejecuta ALTER PLUGGABLE DATABASE OPEN ni se abre el keystore.\n--\n-- ATENCIÓN: este script REINICIA LA INSTANCIA (SHUTDOWN IMMEDIATE / STARTUP).\n--\n-- Ejecución (desde la raíz del repositorio):\n--   sqlplus / as sysdba @sql/01_setup/prueba_autologin.sql\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_autologin.txt\n\nALTER SESSION SET CONTAINER = CDB$ROOT;\n@sql/01_setup/comun/encabezado.sql prueba_autologin\n\nCOLUMN wrl_parameter FORMAT A45\nCOLUMN status        FORMAT A20\nCOLUMN wallet_type   FORMAT A12\nCOLUMN keystore_mode FORMAT A8\nCOLUMN con_id        FORMAT 999999\nCOLUMN name          FORMAT A10\nCOLUMN open_mode     FORMAT A10\n\n--------------------------------------------------------------------------------\n-- 1. Estado antes del reinicio\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. ESTADO ANTES DEL REINICIO\nSELECT con_id, wrl_parameter, status, wallet_type, keystore_mode\nFROM   v$encryption_wallet\nORDER  BY con_id;\n\n--------------------------------------------------------------------------------\n-- 2. Reinicio de la instancia\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. REINICIO (SHUTDOWN IMMEDIATE / STARTUP)\nSHUTDOWN IMMEDIATE\nSTARTUP\nSET SERVEROUTPUT ON SIZE UNLIMITED\n\n--------------------------------------------------------------------------------\n-- 3. Estado después del reinicio en CDB$ROOT (sin intervención manual)\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. ESTADO DESPUÉS DEL REINICIO EN CDB$ROOT\nSELECT con_id, wrl_parameter, status, wallet_type, keystore_mode\nFROM   v$encryption_wallet\nORDER  BY con_id;\n\nSELECT con_id, name, open_mode\nFROM   v$pdbs\nORDER  BY con_id;\n\nCOLUMN resultado FORMAT A70\nSELECT CASE\n         WHEN status = 'OPEN' AND wallet_type = 'AUTOLOGIN'\n         THEN 'RESULTADO AUTO_LOGIN CDB$ROOT: CUMPLE'\n         ELSE 'RESULTADO AUTO_LOGIN CDB$ROOT: NO CUMPLE (' || status || '/' || wallet_type || ')'\n       END AS resultado\nFROM   v$encryption_wallet\nWHERE  con_id = 1;\n\n--------------------------------------------------------------------------------\n-- 4. Estado después del reinicio en XEPDB1\n--    Además de la vista, se lee una tabla del tablespace cifrado: si la clave\n--    maestra no estuviera disponible, la consulta fallaría (ORA-28365).\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. ESTADO DESPUÉS DEL REINICIO EN XEPDB1\nALTER SESSION SET CONTAINER = &pdb_nombre;\n\nSELECT con_id, status, wallet_type, keystore_mode\nFROM   v$encryption_wallet;\n\nSELECT COUNT(*) AS filas_consultas_cifradas FROM clinica.consultas;\n\nSELECT CASE\n         WHEN w.status = 'OPEN' AND w.wallet_type = 'AUTOLOGIN' AND p.open_mode = 'READ WRITE'\n         THEN 'RESULTADO AUTO_LOGIN XEPDB1: CUMPLE'\n         ELSE 'RESULTADO AUTO_LOGIN XEPDB1: NO CUMPLE (' || w.status || '/'\n              || w.wallet_type || '/' || p.open_mode || ')'\n       END AS resultado\nFROM   v$encryption_wallet w\n       CROSS JOIN v$pdbs p;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s00_respaldo_pfile.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s00_respaldo_pfile.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s00_respaldo_pfile.sql\n-- Contenedor: CDB$ROOT\n-- Fase PHVA: Hacer (paso 0, antes de cualquier cambio de configuración)\n--\n-- Propósito:\n--   Generar una copia de texto (PFILE) de los parámetros de inicialización\n--   almacenados en el SPFILE, en un directorio fuera del repositorio. Permite\n--   volver a la configuración original si un cambio posterior (WALLET_ROOT,\n--   TDE_CONFIGURATION) impide arrancar la instancia.\n--\n-- Ejecución (desde la raíz del repositorio):\n--   sqlplus / as sysdba @sql/01_setup/s00_respaldo_pfile.sql\n--   Re-ejecutable: cada ejecución crea un archivo nuevo con fecha y hora, de\n--   modo que nunca se sobrescribe el respaldo original.\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s00_respaldo_pfile.txt\n\nALTER SESSION SET CONTAINER = CDB$ROOT;\n@sql/01_setup/comun/encabezado.sql s00_respaldo_pfile\n\n--------------------------------------------------------------------------------\n-- 1. Directorio de respaldo\n--    Se crea fuera del repositorio, bajo ORACLE_BASE, donde la cuenta del\n--    servicio de Oracle tiene permiso de escritura.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. DIRECTORIO DE RESPALDO\nHOST if not exist \"&ruta_respaldos\\pfile\" mkdir \"&ruta_respaldos\\pfile\"\nPROMPT Directorio: &ruta_respaldos\\pfile\n\n--------------------------------------------------------------------------------\n-- 2. CREATE PFILE FROM SPFILE\n--    El nombre incluye fecha y hora para conservar todas las versiones.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. RESPALDO DEL SPFILE COMO PFILE\nDECLARE\n  v_archivo VARCHAR2(400) :=\n    '&ruta_respaldos\\pfile\\initXE_' || TO_CHAR(SYSDATE, 'YYYYMMDD_HH24MISS') || '.ora';\nBEGIN\n  EXECUTE IMMEDIATE 'CREATE PFILE = ''' || v_archivo || ''' FROM SPFILE';\n  DBMS_OUTPUT.PUT_LINE('PFILE generado: ' || v_archivo);\nEND;\n/\n\nCOLUMN name  FORMAT A20\nCOLUMN value FORMAT A70\n\nPROMPT\nPROMPT SPFILE de origen:\nSELECT name, value FROM v$parameter WHERE name = 'spfile';\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s00_sqlnet.sh",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s00_sqlnet.sh",
      "ext": "sh",
      "lenguaje": "bash",
      "contenido": "#!/usr/bin/env bash\n################################################################################\n# Script   : sql/01_setup/s00_sqlnet.sh\n# Fase PHVA: Hacer (paso 0, antes de crear usuarios)\n#\n# Propósito:\n#   Respaldar el sqlnet.ora del servidor y fijar\n#   SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a, para que las contraseñas de los\n#   usuarios creados después solo generen verificadores 12C (SHA-2 con PBKDF2)\n#   y se rechacen clientes que solo soportan verificadores antiguos (10G/11G).\n#\n#   En Oracle 21c el Oracle home es de solo lectura: la configuración de red\n#   vive en <ORACLE_BASE_HOME>/network/admin, ruta que devuelve orabasehome.\n#\n# Ejecución (Git Bash, desde la raíz del repositorio):\n#   bash sql/01_setup/s00_sqlnet.sh\n#   Re-ejecutable: si el parámetro ya tiene el valor 12a no modifica el archivo.\n#   La evidencia se escribe en evidencias/setup_s00_sqlnet.txt.\n################################################################################\nset -euo pipefail\n\nEVIDENCIA=\"evidencias/setup_s00_sqlnet.txt\"\n\n# 1. Ubicar el sqlnet.ora del servidor y el directorio de respaldos\n#    (la ruta de respaldos se toma de sql/config_local.sql, que no se versiona).\nBASE_HOME=$(orabasehome.exe | tr -d '\\r')\nSQLNET=\"$(cygpath -u \"$BASE_HOME\")/network/admin/sqlnet.ora\"\nRUTA_RESPALDOS=$(sed -nE 's/^DEFINE[[:space:]]+ruta_respaldos[[:space:]]*=[[:space:]]*(.+)$/\\1/p' sql/config_local.sql | tr -d '\\r')\nDIR_RESPALDO=\"$(cygpath -u \"$RUTA_RESPALDOS\")/sqlnet\"\nRESPALDO=\"$DIR_RESPALDO/sqlnet.ora.$(date +%Y%m%d_%H%M%S)\"\n\n{\n  echo \"================================================================================\"\n  echo \" EVIDENCIA DE CONFIGURACIÓN - s00_sqlnet\"\n  echo \" Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c\"\n  echo \"================================================================================\"\n  echo \"Fecha y hora      : $(date '+%Y-%m-%d %H:%M:%S %z')\"\n  echo \"Equipo / usuario  : $(hostname) / $(whoami)\"\n  echo \"ORACLE_BASE_HOME  : $BASE_HOME\"\n  echo \"sqlnet.ora        : $(cygpath -w \"$SQLNET\")\"\n  echo\n\n  # 2. Respaldo del archivo actual antes de cualquier cambio.\n  mkdir -p \"$DIR_RESPALDO\"\n  cp -p \"$SQLNET\" \"$RESPALDO\"\n  echo \"--- 1. RESPALDO ----------------------------------------------------------------\"\n  echo \"Copia creada en   : $(cygpath -w \"$RESPALDO\")\"\n  echo\n\n  # 3. Agregar o corregir el parámetro, respetando los finales de línea CRLF\n  #    del archivo original.\n  echo \"--- 2. SQLNET.ALLOWED_LOGON_VERSION_SERVER ---------------------------------------\"\n  if grep -qiE '^[[:space:]]*SQLNET\\.ALLOWED_LOGON_VERSION_SERVER[[:space:]]*=[[:space:]]*12a[[:space:]]*$' <(tr -d '\\r' < \"$SQLNET\"); then\n    echo \"El parámetro ya tiene el valor 12a; no se modifica el archivo.\"\n  elif grep -qiE '^[[:space:]]*SQLNET\\.ALLOWED_LOGON_VERSION_SERVER' \"$SQLNET\"; then\n    sed -i -E 's/^[[:space:]]*SQLNET\\.ALLOWED_LOGON_VERSION_SERVER[[:space:]]*=.*$/SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a\\r/I' \"$SQLNET\"\n    echo \"Valor existente reemplazado por 12a.\"\n  else\n    printf '\\r\\n# ISO 27001 A.8.5 / A.8.24: solo verificadores de contraseña 12C\\r\\nSQLNET.ALLOWED_LOGON_VERSION_SERVER=12a\\r\\n' >> \"$SQLNET\"\n    echo \"Parámetro agregado al final del archivo.\"\n  fi\n  echo\n\n  # 4. Diferencias entre el respaldo y el archivo vigente, y contenido final.\n  echo \"--- 3. DIFERENCIAS (respaldo -> vigente) ----------------------------------------\"\n  diff <(tr -d '\\r' < \"$RESPALDO\") <(tr -d '\\r' < \"$SQLNET\") || true\n  echo\n  echo \"--- 4. CONTENIDO VIGENTE ---------------------------------------------------------\"\n  tr -d '\\r' < \"$SQLNET\"\n} | tee \"$EVIDENCIA\"\n"
    },
    {
      "ruta": "sql/01_setup/s01_tde_keystore.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s01_tde_keystore.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s01_tde_keystore.sql\n-- Contenedor: CDB$ROOT (keystore en modo unido para toda la CDB)\n-- Fase PHVA: Hacer\n-- Controles: ISO/IEC 27001:2022 A.8.24 (uso de criptografía),\n--            A.5.33 (protección de registros), A.8.13 (respaldo de información)\n--\n-- Propósito:\n--   Configurar Transparent Data Encryption (TDE) con un keystore de software:\n--     1. Directorio WALLET_ROOT fuera del repositorio.\n--     2. WALLET_ROOT en el SPFILE y reinicio de la instancia (solo si hace falta).\n--     3. TDE_CONFIGURATION = KEYSTORE_CONFIGURATION=FILE.\n--     4. Creación del keystore, apertura en todos los contenedores, clave\n--        maestra con respaldo y keystore AUTO_LOGIN para abrir al reiniciar.\n--     5. Copia de respaldo del keystore fuera del repositorio y de WALLET_ROOT.\n--\n-- ATENCIÓN: este script REINICIA LA INSTANCIA la primera vez que se ejecuta.\n--\n-- Ejecución (desde la raíz del repositorio):\n--   sqlplus / as sysdba @sql/01_setup/s01_tde_keystore.sql\n--   Re-ejecutable: cada paso comprueba el estado actual antes de actuar\n--   (no reinicia, no recrea el keystore ni rota la clave si ya existen).\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s01_tde_keystore.txt\n\nALTER SESSION SET CONTAINER = CDB$ROOT;\n@sql/01_setup/comun/encabezado.sql s01_tde_keystore\n\n--------------------------------------------------------------------------------\n-- 1. Directorios del keystore y de su respaldo\n--    WALLET_ROOT\\tde es la ubicación que Oracle usa para el keystore TDE\n--    cuando TDE_CONFIGURATION indica KEYSTORE_CONFIGURATION=FILE.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. DIRECTORIOS DEL KEYSTORE\nHOST if not exist \"&ruta_wallet_root\\tde\" mkdir \"&ruta_wallet_root\\tde\"\nHOST if not exist \"&ruta_respaldos\\keystore\" mkdir \"&ruta_respaldos\\keystore\"\nPROMPT WALLET_ROOT          : &ruta_wallet_root\nPROMPT Respaldo del keystore: &ruta_respaldos\\keystore\n\n--------------------------------------------------------------------------------\n-- 2. WALLET_ROOT en el SPFILE\n--    Es un parámetro estático: se registra en el SPFILE y requiere reinicio.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. WALLET_ROOT EN SPFILE\nALTER SYSTEM SET WALLET_ROOT = '&ruta_wallet_root' SCOPE = SPFILE;\n\n--------------------------------------------------------------------------------\n-- 3. Reinicio condicional\n--    Si el valor en memoria ya coincide con el deseado (re-ejecución), se\n--    invoca sin_reinicio.sql; si no, reiniciar_bd.sql.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. REINICIO DE LA INSTANCIA\nCOLUMN script_reinicio NEW_VALUE v_script_reinicio NOPRINT\nSELECT CASE\n         WHEN UPPER(NVL(value, '-')) = UPPER('&ruta_wallet_root')\n         THEN 'sql/01_setup/comun/sin_reinicio.sql'\n         ELSE 'sql/01_setup/comun/reiniciar_bd.sql'\n       END AS script_reinicio\nFROM   v$parameter\nWHERE  name = 'wallet_root';\n@&v_script_reinicio\n\n--------------------------------------------------------------------------------\n-- 4. TDE_CONFIGURATION\n--    Indica que el keystore es de tipo archivo (software keystore) ubicado en\n--    WALLET_ROOT\\tde. Es dinámico: SCOPE=BOTH lo aplica sin reinicio.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. TDE_CONFIGURATION\nALTER SYSTEM SET TDE_CONFIGURATION = 'KEYSTORE_CONFIGURATION=FILE' SCOPE = BOTH;\n\n--------------------------------------------------------------------------------\n-- 5. Keystore y clave maestra (ADMINISTER KEY MANAGEMENT)\n--    Cada operación se ejecuta solo si el estado lo requiere:\n--      a) CREATE KEYSTORE           si no existe (estado NOT_AVAILABLE).\n--      b) SET KEYSTORE OPEN         si está cerrado (CONTAINER=ALL).\n--      c) SET KEY WITH BACKUP       si algún contenedor no tiene clave maestra\n--                                   (OPEN_NO_MASTER_KEY), en CONTAINER=ALL.\n--      d) CREATE AUTO_LOGIN KEYSTORE para que el keystore abra solo al\n--                                   reiniciar (cwallet.sso).\n--    Las sentencias se ejecutan con EXECUTE IMMEDIATE para no exponer la\n--    contraseña en la evidencia si ocurre un error.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 5. KEYSTORE Y CLAVE MAESTRA\nDECLARE\n  v_estado   v$encryption_wallet.status%TYPE;\n  v_sin_clave NUMBER;\n\n  FUNCTION estado_raiz RETURN VARCHAR2 IS\n    v VARCHAR2(30);\n  BEGIN\n    SELECT status INTO v FROM v$encryption_wallet WHERE con_id = 1;\n    RETURN v;\n  END;\nBEGIN\n  -- a) Crear el keystore protegido por contraseña (ewallet.p12).\n  v_estado := estado_raiz;\n  IF v_estado = 'NOT_AVAILABLE' THEN\n    EXECUTE IMMEDIATE\n      'ADMINISTER KEY MANAGEMENT CREATE KEYSTORE IDENTIFIED BY \"&pwd_keystore\"';\n    DBMS_OUTPUT.PUT_LINE('a) Keystore creado en &ruta_wallet_root\\tde');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('a) Keystore ya existe (estado ' || v_estado || '); no se crea.');\n  END IF;\n\n  -- b) Abrir el keystore en la raíz y en todas las PDB.\n  v_estado := estado_raiz;\n  IF v_estado = 'CLOSED' THEN\n    EXECUTE IMMEDIATE\n      'ADMINISTER KEY MANAGEMENT SET KEYSTORE OPEN IDENTIFIED BY \"&pwd_keystore\" CONTAINER = ALL';\n    DBMS_OUTPUT.PUT_LINE('b) Keystore abierto con CONTAINER=ALL.');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('b) Keystore ya abierto (estado ' || v_estado || ').');\n  END IF;\n\n  -- c) Crear la clave maestra (TDE master key) en todos los contenedores,\n  --    respaldando antes el keystore (WITH BACKUP).\n  SELECT COUNT(*) INTO v_sin_clave\n  FROM   v$encryption_wallet\n  WHERE  status = 'OPEN_NO_MASTER_KEY';\n  IF v_sin_clave > 0 THEN\n    EXECUTE IMMEDIATE\n      'ADMINISTER KEY MANAGEMENT SET KEY USING TAG ''s01_clave_inicial'' '\n      || 'IDENTIFIED BY \"&pwd_keystore\" WITH BACKUP USING ''s01_previo_set_key'' CONTAINER = ALL';\n    DBMS_OUTPUT.PUT_LINE('c) Clave maestra creada en todos los contenedores (WITH BACKUP).');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('c) Todos los contenedores ya tienen clave maestra; no se rota.');\n  END IF;\n\n  -- d) Keystore de inicio automático (cwallet.sso). ORA-46630 indica que ya existe.\n  BEGIN\n    EXECUTE IMMEDIATE\n      'ADMINISTER KEY MANAGEMENT CREATE AUTO_LOGIN KEYSTORE FROM KEYSTORE IDENTIFIED BY \"&pwd_keystore\"';\n    DBMS_OUTPUT.PUT_LINE('d) Keystore AUTO_LOGIN creado.');\n  EXCEPTION\n    WHEN OTHERS THEN\n      IF SQLCODE = -46630 THEN\n        DBMS_OUTPUT.PUT_LINE('d) Keystore AUTO_LOGIN ya existe (ORA-46630).');\n      ELSE\n        RAISE;\n      END IF;\n  END;\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 6. Respaldo del keystore fuera del repositorio y fuera de WALLET_ROOT\n--    BACKUP KEYSTORE genera ewallet_<fecha>_<identificador>.p12 en la ruta\n--    indicada. FORCE KEYSTORE abre temporalmente el keystore con contraseña\n--    si el que está en uso es el AUTO_LOGIN.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 6. RESPALDO DEL KEYSTORE\nBEGIN\n  EXECUTE IMMEDIATE\n    'ADMINISTER KEY MANAGEMENT BACKUP KEYSTORE USING ''s01_respaldo'' FORCE KEYSTORE '\n    || 'IDENTIFIED BY \"&pwd_keystore\" TO ''&ruta_respaldos\\keystore''';\n  DBMS_OUTPUT.PUT_LINE('Respaldo del keystore generado en &ruta_respaldos\\keystore');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 7. Verificación\n--    Parámetros vigentes, estado del keystore por contenedor y claves maestras.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 7. VERIFICACIÓN\n\nCOLUMN parametro FORMAT A20\nCOLUMN valor     FORMAT A60\n\nSELECT name AS parametro, value AS valor\nFROM   v$parameter\nWHERE  name IN ('wallet_root', 'tde_configuration')\nORDER  BY name;\n\nCOLUMN wrl_type        FORMAT A8\nCOLUMN wrl_parameter   FORMAT A50\nCOLUMN status          FORMAT A20\nCOLUMN wallet_type     FORMAT A12\nCOLUMN keystore_mode   FORMAT A8\nCOLUMN fully_backed_up FORMAT A9\nCOLUMN con_id          FORMAT 999999\n\nSELECT wrl_type, wrl_parameter, status, wallet_type, keystore_mode,\n       fully_backed_up, con_id\nFROM   v$encryption_wallet\nORDER  BY con_id;\n\nCOLUMN tag             FORMAT A20\nCOLUMN creation_time   FORMAT A20\nCOLUMN activation_time FORMAT A20\nCOLUMN keystore_type   FORMAT A18\nCOLUMN backed_up       FORMAT A9\n\nSELECT con_id,\n       tag,\n       TO_CHAR(creation_time,   'YYYY-MM-DD HH24:MI:SS') AS creation_time,\n       TO_CHAR(activation_time, 'YYYY-MM-DD HH24:MI:SS') AS activation_time,\n       keystore_type,\n       backed_up\nFROM   v$encryption_keys\nORDER  BY con_id, creation_time;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s02_esquema_clinica.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s02_esquema_clinica.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s02_esquema_clinica.sql\n-- Contenedor: XEPDB1 (definido en config_local.sql como pdb_nombre)\n-- Fase PHVA: Hacer\n-- Controles: ISO/IEC 27001:2022 A.5.12 (clasificación de la información),\n--            A.5.13 (etiquetado), A.8.24 (uso de criptografía)\n--\n-- Propósito:\n--   Crear el esquema de la clínica ficticia sobre el que se aplican los\n--   controles de confidencialidad:\n--     1. Tablespace CLINICA_DATA cifrado con TDE (AES256) desde su creación.\n--        Oracle XE no permite cifrar en línea un tablespace existente.\n--     2. Usuario propietario CLINICA (cuenta de esquema, bloqueada).\n--     3. Tablas MEDICOS, PACIENTES y CONSULTAS con PK, FK y validaciones.\n--     4. Datos 100 % ficticios: 2 médicos, 20 pacientes y 30 consultas.\n--     5. Clasificación de cada columna mediante COMMENT ON COLUMN con\n--        prefijo [PUBLICA], [INTERNA], [CONFIDENCIAL] o [SENSIBLE].\n--\n-- Requisito: s01 ejecutado (keystore abierto con clave maestra en la PDB).\n-- Re-ejecutable: elimina el usuario CLINICA y el tablespace si existen.\n-- Al re-ejecutarlo se pierden los privilegios y políticas de s03 a s07, por\n-- lo que deben volver a ejecutarse en orden.\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s02_esquema_clinica.txt\n\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/01_setup/comun/encabezado.sql s02_esquema_clinica\n\n--------------------------------------------------------------------------------\n-- 1. Limpieza de una ejecución anterior\n--    ORA-01918: el usuario no existe. ORA-00959: el tablespace no existe.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. LIMPIEZA DE OBJETOS PREVIOS\nDECLARE\n  PROCEDURE ejecutar(p_sql IN VARCHAR2, p_ignorar IN VARCHAR2) IS\n  BEGIN\n    EXECUTE IMMEDIATE p_sql;\n    DBMS_OUTPUT.PUT_LINE('Ejecutado: ' || p_sql);\n  EXCEPTION\n    WHEN OTHERS THEN\n      IF INSTR(',' || p_ignorar || ',', ',' || SQLCODE || ',') > 0 THEN\n        DBMS_OUTPUT.PUT_LINE('Omitido  : ' || p_sql || ' (ORA-'\n                             || LPAD(ABS(SQLCODE), 5, '0') || ', no existía)');\n      ELSE\n        RAISE;\n      END IF;\n  END;\nBEGIN\n  ejecutar('DROP USER clinica CASCADE', '-1918');\n  ejecutar('DROP TABLESPACE clinica_data INCLUDING CONTENTS AND DATAFILES', '-959');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 2. Tablespace cifrado\n--    ENCRYPTION USING 'AES256' ENCRYPT cifra todos los bloques del tablespace\n--    con la clave maestra de la PDB: los datafiles, los respaldos y los\n--    bloques en disco quedan ilegibles sin el keystore.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. TABLESPACE CLINICA_DATA CIFRADO (AES256)\nCREATE TABLESPACE clinica_data\n  DATAFILE '&ruta_datafiles\\CLINICA_DATA01.DBF' SIZE 50M REUSE\n  AUTOEXTEND ON NEXT 10M MAXSIZE 500M\n  ENCRYPTION USING 'AES256' ENCRYPT;\n\n--------------------------------------------------------------------------------\n-- 3. Usuario propietario del esquema\n--    Solo recibe cuota en CLINICA_DATA; no tiene CREATE SESSION ni otros\n--    privilegios. Los objetos los crea SYS en su nombre. Se crea mediante\n--    EXECUTE IMMEDIATE para no exponer la contraseña en la evidencia.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. USUARIO CLINICA\nBEGIN\n  EXECUTE IMMEDIATE 'CREATE USER clinica IDENTIFIED BY \"&pwd_clinica\" '\n                 || 'DEFAULT TABLESPACE clinica_data '\n                 || 'QUOTA UNLIMITED ON clinica_data '\n                 || 'ACCOUNT LOCK';\n  DBMS_OUTPUT.PUT_LINE('Usuario CLINICA creado (bloqueado, sin CREATE SESSION).');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 4. Tablas\n--    Las restricciones CHECK validan los formatos de cédula (N-NNNN-NNNN) y\n--    teléfono (NNNN-NNNN) que luego usan las políticas de Data Redaction.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. TABLAS\nCREATE TABLE clinica.medicos (\n  id          NUMBER(4)     CONSTRAINT pk_medicos PRIMARY KEY,\n  nombre      VARCHAR2(80)  NOT NULL,\n  usuario_bd  VARCHAR2(30)  NOT NULL CONSTRAINT uq_medicos_usuario UNIQUE\n) TABLESPACE clinica_data;\n\nCREATE TABLE clinica.pacientes (\n  id                NUMBER(6)     CONSTRAINT pk_pacientes PRIMARY KEY,\n  cedula            VARCHAR2(11)  NOT NULL CONSTRAINT uq_pacientes_cedula UNIQUE\n                                  CONSTRAINT ck_pacientes_cedula\n                                  CHECK (REGEXP_LIKE(cedula, '^[1-9]-[0-9]{4}-[0-9]{4}$')),\n  nombre            VARCHAR2(100) NOT NULL,\n  fecha_nacimiento  DATE          NOT NULL,\n  telefono          VARCHAR2(9)   CONSTRAINT ck_pacientes_telefono\n                                  CHECK (REGEXP_LIKE(telefono, '^[0-9]{4}-[0-9]{4}$')),\n  correo            VARCHAR2(100),\n  direccion         VARCHAR2(200)\n) TABLESPACE clinica_data;\n\nCREATE TABLE clinica.consultas (\n  id           NUMBER(8)      CONSTRAINT pk_consultas PRIMARY KEY,\n  paciente_id  NUMBER(6)      NOT NULL CONSTRAINT fk_consultas_paciente\n                              REFERENCES clinica.pacientes (id),\n  medico_id    NUMBER(4)      NOT NULL CONSTRAINT fk_consultas_medico\n                              REFERENCES clinica.medicos (id),\n  fecha        DATE           NOT NULL,\n  diagnostico  VARCHAR2(200)  NOT NULL,\n  tratamiento  VARCHAR2(300)\n) TABLESPACE clinica_data;\n\nCREATE INDEX clinica.ix_consultas_paciente ON clinica.consultas (paciente_id) TABLESPACE clinica_data;\nCREATE INDEX clinica.ix_consultas_medico   ON clinica.consultas (medico_id)   TABLESPACE clinica_data;\n\n--------------------------------------------------------------------------------\n-- 5. Clasificación de la información (COMMENT ON)\n--    [PUBLICA]      puede divulgarse sin restricción.\n--    [INTERNA]      uso interno de la clínica.\n--    [CONFIDENCIAL] identifica o permite contactar a una persona.\n--    [SENSIBLE]     dato de salud (categoría especial de datos personales).\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 5. CLASIFICACIÓN DE COLUMNAS\nCOMMENT ON TABLE clinica.medicos   IS '[INTERNA] Médicos de la clínica y su usuario de base de datos';\nCOMMENT ON TABLE clinica.pacientes IS '[CONFIDENCIAL] Datos de identificación y contacto de pacientes';\nCOMMENT ON TABLE clinica.consultas IS '[SENSIBLE] Atenciones médicas con diagnóstico y tratamiento';\n\nCOMMENT ON COLUMN clinica.medicos.id         IS '[INTERNA] Identificador interno del médico';\nCOMMENT ON COLUMN clinica.medicos.nombre     IS '[PUBLICA] Nombre profesional del médico';\nCOMMENT ON COLUMN clinica.medicos.usuario_bd IS '[INTERNA] Usuario de base de datos del médico (usado por la política VPD)';\n\nCOMMENT ON COLUMN clinica.pacientes.id               IS '[INTERNA] Identificador interno del paciente';\nCOMMENT ON COLUMN clinica.pacientes.cedula           IS '[CONFIDENCIAL] Cédula de identidad (N-NNNN-NNNN)';\nCOMMENT ON COLUMN clinica.pacientes.nombre           IS '[CONFIDENCIAL] Nombre completo del paciente';\nCOMMENT ON COLUMN clinica.pacientes.fecha_nacimiento IS '[CONFIDENCIAL] Fecha de nacimiento del paciente';\nCOMMENT ON COLUMN clinica.pacientes.telefono         IS '[CONFIDENCIAL] Teléfono de contacto (NNNN-NNNN)';\nCOMMENT ON COLUMN clinica.pacientes.correo           IS '[CONFIDENCIAL] Correo electrónico de contacto';\nCOMMENT ON COLUMN clinica.pacientes.direccion        IS '[CONFIDENCIAL] Dirección de residencia';\n\nCOMMENT ON COLUMN clinica.consultas.id          IS '[INTERNA] Identificador interno de la consulta';\nCOMMENT ON COLUMN clinica.consultas.paciente_id IS '[CONFIDENCIAL] Paciente atendido (vincula a la persona con la atención)';\nCOMMENT ON COLUMN clinica.consultas.medico_id   IS '[INTERNA] Médico tratante';\nCOMMENT ON COLUMN clinica.consultas.fecha       IS '[INTERNA] Fecha de la consulta';\nCOMMENT ON COLUMN clinica.consultas.diagnostico IS '[SENSIBLE] Diagnóstico médico';\nCOMMENT ON COLUMN clinica.consultas.tratamiento IS '[SENSIBLE] Tratamiento indicado';\n\n--------------------------------------------------------------------------------\n-- 6. Datos ficticios\n--    Nombres, cédulas, teléfonos, correos (dominio reservado .test) y\n--    direcciones son inventados. Las cédulas usan prefijos 1 a 7; el prefijo 9\n--    queda reservado para el clon enmascarado de desarrollo (s07).\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 6. DATOS FICTICIOS\nINSERT INTO clinica.medicos VALUES (1, 'Dra. Andrea Rojas Villalobos', 'MED_ROJAS');\nINSERT INTO clinica.medicos VALUES (2, 'Dr. Mauricio Mora Calderón',   'MED_MORA');\n\nINSERT INTO clinica.pacientes VALUES ( 1, '1-0452-0781', 'María Fernanda Solano Vargas', DATE '1985-03-14', '8812-4410', 'mfsolano@correo.test',   'San José, Curridabat, Granadilla');\nINSERT INTO clinica.pacientes VALUES ( 2, '2-0613-0245', 'José Pablo Araya Quesada',     DATE '1978-11-02', '8723-1198', 'jparaya@correo.test',    'Alajuela, Grecia, San Isidro');\nINSERT INTO clinica.pacientes VALUES ( 3, '1-1127-0533', 'Laura Jiménez Céspedes',       DATE '1992-06-21', '6045-7781', 'ljimenez@correo.test',   'San José, Desamparados, San Rafael Arriba');\nINSERT INTO clinica.pacientes VALUES ( 4, '3-0388-0912', 'Carlos Andrés Brenes Monge',   DATE '1969-01-30', '8390-2256', 'cabrenes@correo.test',   'Cartago, Paraíso, Orosi');\nINSERT INTO clinica.pacientes VALUES ( 5, '4-0201-0664', 'Sofía Alvarado Chaves',        DATE '2001-09-09', '7102-3348', 'salvarado@correo.test',  'Heredia, Barva, San Pedro');\nINSERT INTO clinica.pacientes VALUES ( 6, '1-0987-0120', 'Andrés Valverde Rojas',        DATE '1988-12-17', '8456-9012', 'avalverde@correo.test',  'San José, Moravia, San Vicente');\nINSERT INTO clinica.pacientes VALUES ( 7, '5-0312-0458', 'Daniela Campos Herrera',       DATE '1995-04-05', '8601-7735', 'dcampos@correo.test',    'Guanacaste, Liberia, Barrio Los Ángeles');\nINSERT INTO clinica.pacientes VALUES ( 8, '6-0274-0819', 'Miguel Ángel Porras Salas',    DATE '1974-08-23', '8877-6643', 'maporras@correo.test',   'Puntarenas, Esparza, Espíritu Santo');\nINSERT INTO clinica.pacientes VALUES ( 9, '7-0156-0371', 'Valeria Murillo Soto',         DATE '1999-02-11', '6123-4567', 'vmurillo@correo.test',   'Limón, Pococí, Guápiles');\nINSERT INTO clinica.pacientes VALUES (10, '1-1302-0846', 'Esteban Navarro Arias',        DATE '1983-07-28', '8999-1203', 'enavarro@correo.test',   'San José, Escazú, San Rafael');\nINSERT INTO clinica.pacientes VALUES (11, '2-0745-0119', 'Gabriela Ulate Fallas',        DATE '1990-10-03', '8234-5671', 'gulate@correo.test',     'Alajuela, San Ramón, Piedades Norte');\nINSERT INTO clinica.pacientes VALUES (12, '3-0459-0627', 'Ricardo Sánchez Mora',         DATE '1965-05-19', '8312-0098', 'rsanchez@correo.test',   'Cartago, La Unión, Tres Ríos');\nINSERT INTO clinica.pacientes VALUES (13, '4-0178-0954', 'Natalia Hidalgo Barrantes',    DATE '1997-12-01', '7012-8856', 'nhidalgo@correo.test',   'Heredia, Santo Domingo, Santa Rosa');\nINSERT INTO clinica.pacientes VALUES (14, '1-0866-0302', 'Felipe Castro Zúñiga',         DATE '1981-03-26', '8645-3321', 'fcastro@correo.test',    'San José, Tibás, Cinco Esquinas');\nINSERT INTO clinica.pacientes VALUES (15, '5-0221-0786', 'Paola Méndez Obando',          DATE '1987-09-15', '8578-6612', 'pmendez@correo.test',    'Guanacaste, Nicoya, San Martín');\nINSERT INTO clinica.pacientes VALUES (16, '2-0532-0411', 'Diego Alfaro Segura',          DATE '2003-01-08', '6301-2289', 'dalfaro@correo.test',    'Alajuela, Atenas, Jesús');\nINSERT INTO clinica.pacientes VALUES (17, '1-1415-0698', 'Camila Rodríguez León',        DATE '1993-11-30', '8790-4456', 'crodriguez@correo.test', 'San José, Goicoechea, Guadalupe');\nINSERT INTO clinica.pacientes VALUES (18, '6-0391-0233', 'Jorge Luis Chacón Ugalde',     DATE '1958-06-12', '8411-9087', 'jlchacon@correo.test',   'Puntarenas, Garabito, Jacó');\nINSERT INTO clinica.pacientes VALUES (19, '3-0512-0877', 'Mariana Quirós Ramírez',       DATE '1976-04-04', '8067-5543', 'mquiros@correo.test',    'Cartago, Oreamuno, San Rafael');\nINSERT INTO clinica.pacientes VALUES (20, '4-0290-0145', 'Sebastián Cordero Elizondo',   DATE '2000-08-19', '7234-1190', 'scordero@correo.test',   'Heredia, San Rafael, Los Ángeles');\n\n-- 18 consultas de MED_ROJAS (medico_id 1) y 12 de MED_MORA (medico_id 2).\nINSERT INTO clinica.consultas VALUES ( 1,  1, 1, DATE '2026-01-12', 'Hipertensión arterial esencial',      'Losartán 50 mg cada 24 horas; control en 3 meses');\nINSERT INTO clinica.consultas VALUES ( 2,  2, 1, DATE '2026-01-15', 'Diabetes mellitus tipo 2',            'Metformina 850 mg cada 12 horas; dieta y ejercicio');\nINSERT INTO clinica.consultas VALUES ( 3,  3, 2, DATE '2026-01-20', 'Faringitis aguda',                    'Amoxicilina 500 mg cada 8 horas por 7 días');\nINSERT INTO clinica.consultas VALUES ( 4,  4, 1, DATE '2026-01-22', 'Lumbalgia mecánica',                  'Ibuprofeno 400 mg cada 8 horas por 5 días; fisioterapia');\nINSERT INTO clinica.consultas VALUES ( 5,  5, 1, DATE '2026-02-03', 'Rinitis alérgica',                    'Loratadina 10 mg cada 24 horas por 14 días');\nINSERT INTO clinica.consultas VALUES ( 6,  6, 2, DATE '2026-02-05', 'Gastritis crónica',                   'Omeprazol 20 mg en ayunas por 30 días');\nINSERT INTO clinica.consultas VALUES ( 7,  7, 1, DATE '2026-02-10', 'Infección urinaria baja',             'Nitrofurantoína 100 mg cada 12 horas por 5 días');\nINSERT INTO clinica.consultas VALUES ( 8,  8, 1, DATE '2026-02-14', 'Hipertensión arterial esencial',      'Enalapril 10 mg cada 12 horas; dieta baja en sodio');\nINSERT INTO clinica.consultas VALUES ( 9,  9, 2, DATE '2026-02-18', 'Asma bronquial leve',                 'Salbutamol inhalado a demanda');\nINSERT INTO clinica.consultas VALUES (10, 10, 1, DATE '2026-02-25', 'Migraña sin aura',                    'Naproxeno 550 mg al inicio del dolor');\nINSERT INTO clinica.consultas VALUES (11, 11, 1, DATE '2026-03-04', 'Anemia ferropénica',                  'Sulfato ferroso 300 mg cada 24 horas por 3 meses');\nINSERT INTO clinica.consultas VALUES (12, 12, 2, DATE '2026-03-09', 'Diabetes mellitus tipo 2',            'Metformina 850 mg cada 12 horas; control de glicemia');\nINSERT INTO clinica.consultas VALUES (13,  1, 1, DATE '2026-03-16', 'Control de hipertensión arterial',    'Continuar losartán 50 mg; control en 3 meses');\nINSERT INTO clinica.consultas VALUES (14, 13, 1, DATE '2026-03-20', 'Dermatitis atópica',                  'Crema hidratante e hidrocortisona 1 % por 7 días');\nINSERT INTO clinica.consultas VALUES (15, 14, 2, DATE '2026-03-27', 'Esguince de tobillo grado I',         'Reposo, hielo, compresión y elevación; paracetamol 500 mg');\nINSERT INTO clinica.consultas VALUES (16, 15, 1, DATE '2026-04-02', 'Hipotiroidismo',                      'Levotiroxina 50 mcg en ayunas');\nINSERT INTO clinica.consultas VALUES (17, 16, 2, DATE '2026-04-08', 'Otitis media aguda',                  'Amoxicilina 500 mg cada 8 horas por 10 días');\nINSERT INTO clinica.consultas VALUES (18,  2, 1, DATE '2026-04-14', 'Control de diabetes mellitus tipo 2', 'Ajuste de metformina a 1000 mg cada 12 horas');\nINSERT INTO clinica.consultas VALUES (19, 17, 1, DATE '2026-04-21', 'Trastorno de ansiedad generalizada',  'Referencia a psicología; sertralina 50 mg cada 24 horas');\nINSERT INTO clinica.consultas VALUES (20, 18, 2, DATE '2026-04-28', 'Hiperplasia prostática benigna',      'Tamsulosina 0,4 mg cada 24 horas');\nINSERT INTO clinica.consultas VALUES (21, 19, 1, DATE '2026-05-05', 'Dislipidemia',                        'Atorvastatina 20 mg en la noche; dieta baja en grasas');\nINSERT INTO clinica.consultas VALUES (22, 20, 2, DATE '2026-05-12', 'Conjuntivitis bacteriana',            'Tobramicina colirio cada 6 horas por 7 días');\nINSERT INTO clinica.consultas VALUES (23,  3, 1, DATE '2026-05-19', 'Bronquitis aguda',                    'Acetilcisteína 600 mg cada 24 horas por 7 días');\nINSERT INTO clinica.consultas VALUES (24,  5, 2, DATE '2026-05-26', 'Rinitis alérgica persistente',        'Fluticasona nasal cada 24 horas por 30 días');\nINSERT INTO clinica.consultas VALUES (25,  6, 1, DATE '2026-06-02', 'Gastritis crónica en control',        'Omeprazol 20 mg por 15 días adicionales');\nINSERT INTO clinica.consultas VALUES (26,  8, 1, DATE '2026-06-09', 'Control de hipertensión arterial',    'Continuar enalapril 10 mg; perfil lipídico');\nINSERT INTO clinica.consultas VALUES (27,  9, 2, DATE '2026-06-16', 'Asma bronquial en control',           'Budesonida inhalada cada 12 horas');\nINSERT INTO clinica.consultas VALUES (28, 10, 1, DATE '2026-06-23', 'Migraña sin aura en control',         'Continuar tratamiento; diario de cefaleas');\nINSERT INTO clinica.consultas VALUES (29, 12, 2, DATE '2026-06-30', 'Control de diabetes mellitus tipo 2', 'Continuar metformina; hemoglobina glicosilada en 3 meses');\nINSERT INTO clinica.consultas VALUES (30, 14, 2, DATE '2026-07-07', 'Lumbalgia mecánica',                  'Diclofenaco 50 mg cada 12 horas por 5 días');\n\nCOMMIT;\n\n--------------------------------------------------------------------------------\n-- 7. Bloqueo de la cuenta propietaria\n--    Nadie inicia sesión como CLINICA: el acceso se da solo mediante roles.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 7. BLOQUEO DE LA CUENTA CLINICA\nALTER USER clinica ACCOUNT LOCK;\n\n--------------------------------------------------------------------------------\n-- 8. Verificación\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 8. VERIFICACIÓN\n\nPROMPT Cifrado del tablespace:\nCOLUMN tablespace_name FORMAT A15\nCOLUMN encrypted       FORMAT A9\nCOLUMN algoritmo       FORMAT A9\nCOLUMN estado_cifrado  FORMAT A14\n\nSELECT t.tablespace_name,\n       t.encrypted,\n       e.encryptionalg AS algoritmo,\n       e.status        AS estado_cifrado\nFROM   dba_tablespaces t\n       JOIN v$tablespace vt ON vt.name = t.tablespace_name\n       LEFT JOIN v$encrypted_tablespaces e\n              ON e.ts# = vt.ts# AND e.con_id = vt.con_id\nWHERE  t.tablespace_name = 'CLINICA_DATA';\n\nPROMPT Ubicación de las tablas:\nCOLUMN table_name FORMAT A12\nSELECT table_name, tablespace_name\nFROM   dba_tables\nWHERE  owner = 'CLINICA'\nORDER  BY table_name;\n\nPROMPT Cantidad de filas:\nCOLUMN tabla FORMAT A12\nSELECT 'MEDICOS' AS tabla, COUNT(*) AS filas FROM clinica.medicos\nUNION ALL\nSELECT 'PACIENTES', COUNT(*) FROM clinica.pacientes\nUNION ALL\nSELECT 'CONSULTAS', COUNT(*) FROM clinica.consultas;\n\nPROMPT Consultas por médico:\nCOLUMN usuario_bd FORMAT A12\nSELECT m.usuario_bd, COUNT(*) AS consultas\nFROM   clinica.consultas c\n       JOIN clinica.medicos m ON m.id = c.medico_id\nGROUP  BY m.usuario_bd\nORDER  BY m.usuario_bd;\n\nPROMPT Clasificación de columnas:\nCOLUMN tabla       FORMAT A10\nCOLUMN columna     FORMAT A17\nCOLUMN comentario  FORMAT A75\nSELECT table_name AS tabla, column_name AS columna, comments AS comentario\nFROM   dba_col_comments\nWHERE  owner = 'CLINICA'\nORDER  BY table_name, column_name;\n\nPROMPT Columnas sin clasificación (debe ser 0):\nSELECT COUNT(*) AS sin_clasificar\nFROM   dba_tab_columns c\n       LEFT JOIN dba_col_comments k\n              ON  k.owner = c.owner\n              AND k.table_name = c.table_name\n              AND k.column_name = c.column_name\nWHERE  c.owner = 'CLINICA'\nAND    NOT REGEXP_LIKE(NVL(k.comments, '-'), '^\\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\\]');\n\nPROMPT Estado de la cuenta propietaria:\nCOLUMN username       FORMAT A10\nCOLUMN account_status FORMAT A16\nSELECT username, account_status, default_tablespace\nFROM   dba_users\nWHERE  username = 'CLINICA';\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s03_usuarios_roles.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s03_usuarios_roles.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s03_usuarios_roles.sql\n-- Contenedor: XEPDB1\n-- Fase PHVA: Hacer\n-- Controles: ISO/IEC 27001:2022 A.5.15 (control de acceso), A.5.17\n--            (información de autenticación), A.5.18 (derechos de acceso),\n--            A.8.2 (derechos de acceso privilegiado), A.8.5 (autenticación\n--            segura), A.5.3 (segregación de funciones)\n--\n-- Propósito:\n--   1. Perfil PERFIL_CLINICA con política de contraseñas robusta.\n--   2. Roles funcionales con mínimo privilegio sobre el esquema CLINICA.\n--   3. Usuarios nominales asignados a un único rol según su función.\n--   Ningún usuario recibe privilegios directos sobre objetos de CLINICA y\n--   nada se otorga a PUBLIC.\n--\n-- Requisito: s02 ejecutado. SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a vigente\n--            (s00_sqlnet.sh + reinicio de s01), para generar solo\n--            verificadores 12C.\n-- Re-ejecutable: elimina usuarios, roles y perfil si existen. Después de\n-- re-ejecutarlo deben volver a ejecutarse s06 (al eliminar DBA_OPER se pierde\n-- la habilitación de POL_PRIVILEGIADOS) y s07 (privilegios de ROL_DESARROLLO).\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s03_usuarios_roles.txt\n\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/01_setup/comun/encabezado.sql s03_usuarios_roles\n\n--------------------------------------------------------------------------------\n-- 1. Limpieza de una ejecución anterior\n--    ORA-01918: usuario inexistente. ORA-01919: rol inexistente.\n--    ORA-02380: perfil inexistente.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. LIMPIEZA DE OBJETOS PREVIOS\nDECLARE\n  PROCEDURE ejecutar(p_sql IN VARCHAR2, p_ignorar IN VARCHAR2) IS\n  BEGIN\n    EXECUTE IMMEDIATE p_sql;\n    DBMS_OUTPUT.PUT_LINE('Ejecutado: ' || p_sql);\n  EXCEPTION\n    WHEN OTHERS THEN\n      IF INSTR(',' || p_ignorar || ',', ',' || SQLCODE || ',') > 0 THEN\n        DBMS_OUTPUT.PUT_LINE('Omitido  : ' || p_sql || ' (ORA-'\n                             || LPAD(ABS(SQLCODE), 5, '0') || ', no existía)');\n      ELSE\n        RAISE;\n      END IF;\n  END;\nBEGIN\n  FOR u IN (SELECT column_value AS nombre\n            FROM   TABLE(sys.odcivarchar2list('MED_ROJAS', 'MED_MORA', 'RECEP_SOLIS',\n                                              'AUD_VEGA', 'DEV_CALVO', 'DBA_OPER'))) LOOP\n    ejecutar('DROP USER ' || u.nombre || ' CASCADE', '-1918');\n  END LOOP;\n  FOR r IN (SELECT column_value AS nombre\n            FROM   TABLE(sys.odcivarchar2list('ROL_MEDICO', 'ROL_RECEPCION',\n                                              'ROL_AUDITOR', 'ROL_DESARROLLO'))) LOOP\n    ejecutar('DROP ROLE ' || r.nombre, '-1919');\n  END LOOP;\n  ejecutar('DROP PROFILE perfil_clinica CASCADE', '-2380');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 2. Perfil de contraseñas\n--    ORA12C_STRONG_VERIFY_FUNCTION exige como mínimo 9 caracteres, 2\n--    mayúsculas, 2 minúsculas, 2 dígitos y 2 caracteres especiales.\n--    Vigencia de 90 días, sin reutilizar las últimas 5 contraseñas ni repetir\n--    una durante 365 días, bloqueo de 1 hora tras 5 intentos fallidos y\n--    bloqueo automático de cuentas inactivas por 90 días.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. PERFIL PERFIL_CLINICA\nCREATE PROFILE perfil_clinica LIMIT\n  PASSWORD_VERIFY_FUNCTION ora12c_strong_verify_function\n  PASSWORD_LIFE_TIME       90\n  PASSWORD_REUSE_MAX       5\n  PASSWORD_REUSE_TIME      365\n  FAILED_LOGIN_ATTEMPTS    5\n  PASSWORD_LOCK_TIME       1/24\n  INACTIVE_ACCOUNT_TIME    90;\n\n--------------------------------------------------------------------------------\n-- 3. Roles funcionales (mínimo privilegio)\n--    ROL_MEDICO     : lee médicos, pacientes y consultas; registra y\n--                     actualiza consultas (VPD limita a sus propios pacientes).\n--    ROL_RECEPCION  : gestiona datos de pacientes; no accede a CONSULTAS.\n--    ROL_AUDITOR    : consulta la pista de auditoría (AUDIT_VIEWER).\n--    ROL_DESARROLLO : solo sesión; el SELECT sobre CLINICA_DEV se otorga en s07.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. ROLES\nCREATE ROLE rol_medico;\nGRANT CREATE SESSION TO rol_medico;\nGRANT SELECT ON clinica.medicos   TO rol_medico;\nGRANT SELECT ON clinica.pacientes TO rol_medico;\nGRANT SELECT, INSERT, UPDATE ON clinica.consultas TO rol_medico;\n\nCREATE ROLE rol_recepcion;\nGRANT CREATE SESSION TO rol_recepcion;\nGRANT SELECT, INSERT, UPDATE ON clinica.pacientes TO rol_recepcion;\n\nCREATE ROLE rol_auditor;\nGRANT CREATE SESSION TO rol_auditor;\nGRANT audit_viewer TO rol_auditor;\n\nCREATE ROLE rol_desarrollo;\nGRANT CREATE SESSION TO rol_desarrollo;\n\n--------------------------------------------------------------------------------\n-- 4. Usuarios nominales\n--    Todos con PERFIL_CLINICA. Se crean con EXECUTE IMMEDIATE para que la\n--    contraseña (tomada de config_local.sql) no aparezca en la evidencia.\n--    DBA_OPER administra la base de datos con el rol DBA y los privilegios\n--    administrativos separados SYSBACKUP (respaldos) y SYSKM (gestión de\n--    claves TDE), en lugar de usar SYS.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. USUARIOS\nDECLARE\n  PROCEDURE crear_usuario(p_usuario IN VARCHAR2, p_clave IN VARCHAR2, p_rol IN VARCHAR2) IS\n  BEGIN\n    EXECUTE IMMEDIATE 'CREATE USER ' || p_usuario\n                   || ' IDENTIFIED BY \"' || p_clave || '\"'\n                   || ' PROFILE perfil_clinica';\n    EXECUTE IMMEDIATE 'GRANT ' || p_rol || ' TO ' || p_usuario;\n    DBMS_OUTPUT.PUT_LINE('Usuario ' || RPAD(p_usuario, 12) || ' creado con ' || p_rol);\n  END;\nBEGIN\n  crear_usuario('MED_ROJAS',   '&pwd_med_rojas',   'ROL_MEDICO');\n  crear_usuario('MED_MORA',    '&pwd_med_mora',    'ROL_MEDICO');\n  crear_usuario('RECEP_SOLIS', '&pwd_recep_solis', 'ROL_RECEPCION');\n  crear_usuario('AUD_VEGA',    '&pwd_aud_vega',    'ROL_AUDITOR');\n  crear_usuario('DEV_CALVO',   '&pwd_dev_calvo',   'ROL_DESARROLLO');\n  crear_usuario('DBA_OPER',    '&pwd_dba_oper',    'DBA');\nEND;\n/\n\nGRANT SYSBACKUP TO dba_oper;\nGRANT SYSKM     TO dba_oper;\n\n--------------------------------------------------------------------------------\n-- 5. Verificación\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 5. VERIFICACIÓN\n\nPROMPT Límites de PERFIL_CLINICA:\nCOLUMN resource_name FORMAT A25\nCOLUMN limit         FORMAT A30\nSELECT resource_name, limit\nFROM   dba_profiles\nWHERE  profile = 'PERFIL_CLINICA'\nAND    resource_type = 'PASSWORD'\nORDER  BY resource_name;\n\nPROMPT Usuarios creados (verificadores de contraseña: solo 12C):\nCOLUMN username          FORMAT A12\nCOLUMN account_status    FORMAT A10\nCOLUMN profile           FORMAT A15\nCOLUMN password_versions FORMAT A17\nSELECT username, account_status, profile, password_versions\nFROM   dba_users\nWHERE  username IN ('MED_ROJAS', 'MED_MORA', 'RECEP_SOLIS', 'AUD_VEGA', 'DEV_CALVO', 'DBA_OPER')\nORDER  BY username;\n\nPROMPT Roles asignados a los usuarios:\nCOLUMN grantee      FORMAT A12\nCOLUMN granted_role FORMAT A15\nSELECT grantee, granted_role, admin_option, default_role\nFROM   dba_role_privs\nWHERE  grantee IN ('MED_ROJAS', 'MED_MORA', 'RECEP_SOLIS', 'AUD_VEGA', 'DEV_CALVO', 'DBA_OPER')\nORDER  BY grantee, granted_role;\n\nPROMPT Privilegios de sistema de los roles funcionales:\nCOLUMN grantee   FORMAT A15\nCOLUMN privilege FORMAT A20\nSELECT grantee, privilege\nFROM   dba_sys_privs\nWHERE  grantee LIKE 'ROL\\_%' ESCAPE '\\'\nORDER  BY grantee, privilege;\n\nPROMPT Privilegios sobre objetos de CLINICA:\nCOLUMN grantee    FORMAT A15\nCOLUMN table_name FORMAT A12\nSELECT grantee, table_name, privilege\nFROM   dba_tab_privs\nWHERE  owner = 'CLINICA'\nORDER  BY grantee, table_name, privilege;\n\nPROMPT Privilegios directos a usuarios o a PUBLIC sobre CLINICA (debe ser 0):\nSELECT COUNT(*) AS privilegios_indebidos\nFROM   dba_tab_privs p\nWHERE  p.owner = 'CLINICA'\nAND    (p.grantee = 'PUBLIC'\n        OR p.grantee IN (SELECT username FROM dba_users));\n\nPROMPT Privilegios administrativos (archivo de contraseñas):\nCOLUMN username FORMAT A12\nSELECT username, sysdba, sysbackup, syskm, con_id\nFROM   v$pwfile_users\nWHERE  username = 'DBA_OPER';\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s04_vpd.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s04_vpd.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s04_vpd.sql\n-- Contenedor: XEPDB1\n-- Fase PHVA: Hacer\n-- Controles: ISO/IEC 27001:2022 A.8.3 (restricción del acceso a la\n--            información), A.5.15 (control de acceso)\n--\n-- Propósito:\n--   Virtual Private Database (VPD) sobre CLINICA.CONSULTAS: cada médico solo\n--   ve, registra, modifica o elimina las consultas en las que es el médico\n--   tratante. El predicado lo agrega Oracle de forma transparente a cada\n--   sentencia, por lo que no depende de la aplicación.\n--\n--   Función de política CLINICA.FN_VPD_CONSULTAS:\n--     - SESSION_USER registrado en MEDICOS -> 'medico_id = <su id>'\n--     - SESSION_USER = CLINICA             -> NULL (sin restricción)\n--     - cualquier otro usuario             -> '1=0' (ninguna fila)\n--   SYS y los usuarios con EXEMPT ACCESS POLICY no están sujetos a VPD.\n--\n-- Requisito: s02 y s03 ejecutados.\n-- Re-ejecutable: elimina la política si existe y reemplaza la función.\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s04_vpd.txt\n\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/01_setup/comun/encabezado.sql s04_vpd\n\n--------------------------------------------------------------------------------\n-- 1. Limpieza de una ejecución anterior\n--    Se consulta DBA_POLICIES para eliminar la política solo si existe.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. LIMPIEZA DE LA POLÍTICA PREVIA\nDECLARE\n  v_existe NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_existe\n  FROM   dba_policies\n  WHERE  object_owner = 'CLINICA'\n  AND    object_name  = 'CONSULTAS'\n  AND    policy_name  = 'POL_VPD_CONSULTAS';\n\n  IF v_existe > 0 THEN\n    DBMS_RLS.DROP_POLICY(object_schema => 'CLINICA',\n                         object_name   => 'CONSULTAS',\n                         policy_name   => 'POL_VPD_CONSULTAS');\n    DBMS_OUTPUT.PUT_LINE('Política POL_VPD_CONSULTAS eliminada.');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('Política POL_VPD_CONSULTAS no existía.');\n  END IF;\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 2. Función de política\n--    Se crea en el esquema CLINICA (propietario de MEDICOS) con derechos del\n--    definidor, de modo que los médicos no necesitan privilegios adicionales.\n--    El id del médico se concatena como número, no como texto del usuario,\n--    lo que evita inyección en el predicado.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. FUNCIÓN CLINICA.FN_VPD_CONSULTAS\nCREATE OR REPLACE FUNCTION clinica.fn_vpd_consultas (\n  p_schema IN VARCHAR2,\n  p_obj    IN VARCHAR2\n) RETURN VARCHAR2\nIS\n  v_usuario   VARCHAR2(128) := SYS_CONTEXT('USERENV', 'SESSION_USER');\n  v_medico_id clinica.medicos.id%TYPE;\nBEGIN\n  -- El propietario del esquema no tiene restricción.\n  IF v_usuario = 'CLINICA' THEN\n    RETURN NULL;\n  END IF;\n\n  -- Un médico registrado solo ve sus propias consultas.\n  SELECT id\n  INTO   v_medico_id\n  FROM   clinica.medicos\n  WHERE  usuario_bd = v_usuario;\n\n  RETURN 'medico_id = ' || TO_CHAR(v_medico_id);\nEXCEPTION\n  -- Cualquier otro usuario no ve ninguna fila.\n  WHEN NO_DATA_FOUND THEN\n    RETURN '1=0';\nEND fn_vpd_consultas;\n/\n\nSHOW ERRORS FUNCTION clinica.fn_vpd_consultas\n\n--------------------------------------------------------------------------------\n-- 3. Política VPD\n--    statement_types abarca lectura y escritura. update_check => TRUE impide\n--    que un médico inserte o modifique una consulta dejándola fuera de su\n--    propio predicado (por ejemplo, asignarla a otro médico).\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. POLÍTICA POL_VPD_CONSULTAS\nBEGIN\n  DBMS_RLS.ADD_POLICY(\n    object_schema   => 'CLINICA',\n    object_name     => 'CONSULTAS',\n    policy_name     => 'POL_VPD_CONSULTAS',\n    function_schema => 'CLINICA',\n    policy_function => 'FN_VPD_CONSULTAS',\n    statement_types => 'SELECT,INSERT,UPDATE,DELETE',\n    update_check    => TRUE,\n    enable          => TRUE);\n  DBMS_OUTPUT.PUT_LINE('Política POL_VPD_CONSULTAS creada y habilitada.');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 4. Verificación\n--    La prueba funcional con cada médico se realiza en sql/02_verificacion.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. VERIFICACIÓN\n\nCOLUMN object_name     FORMAT A10\nCOLUMN policy_name     FORMAT A18\nCOLUMN function        FORMAT A17\nCOLUMN sel             FORMAT A3\nCOLUMN ins             FORMAT A3\nCOLUMN upd             FORMAT A3\nCOLUMN del             FORMAT A3\nCOLUMN chk_option      FORMAT A10\nCOLUMN enable          FORMAT A6\nCOLUMN policy_type     FORMAT A8\n\nSELECT object_name, policy_name, function, sel, ins, upd, del,\n       chk_option, enable, policy_type\nFROM   dba_policies\nWHERE  object_owner = 'CLINICA';\n\nCOLUMN object_name FORMAT A20\nCOLUMN object_type FORMAT A10\nCOLUMN status      FORMAT A7\nSELECT object_name, object_type, status\nFROM   dba_objects\nWHERE  owner = 'CLINICA'\nAND    object_name = 'FN_VPD_CONSULTAS';\n\nPROMPT Predicado que devuelve la función para la sesión actual (SYS -> 1=0):\nCOLUMN predicado FORMAT A20\nSELECT clinica.fn_vpd_consultas('CLINICA', 'CONSULTAS') AS predicado FROM dual;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s05_redaction.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s05_redaction.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s05_redaction.sql\n-- Contenedor: XEPDB1\n-- Fase PHVA: Hacer\n-- Controles: ISO/IEC 27001:2022 A.8.11 (enmascaramiento de datos),\n--            A.8.3 (restricción del acceso a la información)\n--\n-- Propósito:\n--   Oracle Data Redaction enmascara los datos en el momento de la consulta,\n--   sin modificarlos en disco:\n--     - POL_RED_PACIENTES : para sesiones con ROL_RECEPCION, la cédula se\n--       muestra como X-XXXX-NNNN y el teléfono como XXXX-NNNN.\n--     - POL_RED_CONSULTAS : para cualquier sesión sin ROL_MEDICO, diagnóstico\n--       y tratamiento se redactan por completo (defensa en profundidad: VPD\n--       ya devuelve 0 filas a los no médicos).\n--   SYS y los usuarios con EXEMPT REDACTION POLICY no están sujetos a la\n--   redacción.\n--\n-- Requisito: s02 y s03 ejecutados (roles existentes).\n-- Re-ejecutable: elimina las políticas si existen.\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s05_redaction.txt\n\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/01_setup/comun/encabezado.sql s05_redaction\n\n--------------------------------------------------------------------------------\n-- 1. Limpieza de una ejecución anterior\n--    Se consulta REDACTION_POLICIES para eliminar solo las que existen.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. LIMPIEZA DE POLÍTICAS PREVIAS\nBEGIN\n  FOR p IN (SELECT object_owner, object_name, policy_name\n            FROM   redaction_policies\n            WHERE  object_owner = 'CLINICA'\n            AND    policy_name IN ('POL_RED_PACIENTES', 'POL_RED_CONSULTAS')) LOOP\n    DBMS_REDACT.DROP_POLICY(object_schema => p.object_owner,\n                            object_name   => p.object_name,\n                            policy_name   => p.policy_name);\n    DBMS_OUTPUT.PUT_LINE('Política ' || p.policy_name || ' eliminada.');\n  END LOOP;\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 2. POL_RED_PACIENTES (redacción parcial para recepción)\n--    Formato de function_parameters para caracteres:\n--      'formato_entrada,formato_salida,caracter_mascara,inicio,fin'\n--    V = carácter que puede redactarse, F = carácter de formato que se\n--    conserva. Se redactan las posiciones V desde \"inicio\" hasta \"fin\".\n--      Cédula   1-0452-0781 -> VFVVVVFVVVV, V 1 a 5 -> X-XXXX-0781\n--      Teléfono 8812-4410   -> VVVVFVVVV,   V 1 a 4 -> XXXX-4410\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. POLÍTICA POL_RED_PACIENTES\nBEGIN\n  DBMS_REDACT.ADD_POLICY(\n    object_schema       => 'CLINICA',\n    object_name         => 'PACIENTES',\n    policy_name         => 'POL_RED_PACIENTES',\n    policy_description  => 'Recepción ve solo los últimos 4 dígitos de cédula y teléfono',\n    column_name         => 'CEDULA',\n    column_description  => '[CONFIDENCIAL] Cédula: X-XXXX-NNNN',\n    function_type       => DBMS_REDACT.PARTIAL,\n    function_parameters => 'VFVVVVFVVVV,V-VVVV-VVVV,X,1,5',\n    expression          => q'[SYS_CONTEXT('SYS_SESSION_ROLES','ROL_RECEPCION')='TRUE']',\n    enable              => TRUE);\n\n  DBMS_REDACT.ALTER_POLICY(\n    object_schema       => 'CLINICA',\n    object_name         => 'PACIENTES',\n    policy_name         => 'POL_RED_PACIENTES',\n    action              => DBMS_REDACT.ADD_COLUMN,\n    column_name         => 'TELEFONO',\n    column_description  => '[CONFIDENCIAL] Teléfono: XXXX-NNNN',\n    function_type       => DBMS_REDACT.PARTIAL,\n    function_parameters => 'VVVVFVVVV,VVVV-VVVV,X,1,4');\n\n  DBMS_OUTPUT.PUT_LINE('Política POL_RED_PACIENTES creada (CEDULA, TELEFONO).');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 3. POL_RED_CONSULTAS (redacción completa para no médicos)\n--    DBMS_REDACT.FULL reemplaza un VARCHAR2 por un espacio en blanco.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. POLÍTICA POL_RED_CONSULTAS\nBEGIN\n  DBMS_REDACT.ADD_POLICY(\n    object_schema       => 'CLINICA',\n    object_name         => 'CONSULTAS',\n    policy_name         => 'POL_RED_CONSULTAS',\n    policy_description  => 'Solo ROL_MEDICO ve diagnóstico y tratamiento',\n    column_name         => 'DIAGNOSTICO',\n    column_description  => '[SENSIBLE] Diagnóstico: redacción completa',\n    function_type       => DBMS_REDACT.FULL,\n    expression          => q'[SYS_CONTEXT('SYS_SESSION_ROLES','ROL_MEDICO')='FALSE']',\n    enable              => TRUE);\n\n  DBMS_REDACT.ALTER_POLICY(\n    object_schema       => 'CLINICA',\n    object_name         => 'CONSULTAS',\n    policy_name         => 'POL_RED_CONSULTAS',\n    action              => DBMS_REDACT.ADD_COLUMN,\n    column_name         => 'TRATAMIENTO',\n    column_description  => '[SENSIBLE] Tratamiento: redacción completa',\n    function_type       => DBMS_REDACT.FULL);\n\n  DBMS_OUTPUT.PUT_LINE('Política POL_RED_CONSULTAS creada (DIAGNOSTICO, TRATAMIENTO).');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 4. Verificación\n--    La prueba funcional con RECEP_SOLIS y los médicos se realiza en\n--    sql/02_verificacion. Aquí se listan las políticas y columnas y quién\n--    está exento de la redacción por privilegio.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. VERIFICACIÓN\n\nCOLUMN object_name FORMAT A10\nCOLUMN policy_name FORMAT A18\nCOLUMN expression  FORMAT A55\nCOLUMN enable      FORMAT A7\nSELECT object_name, policy_name, expression, enable\nFROM   redaction_policies\nWHERE  object_owner = 'CLINICA'\nORDER  BY object_name;\n\nCOLUMN column_name         FORMAT A12\nCOLUMN function_type       FORMAT A20\nCOLUMN function_parameters FORMAT A32\nSELECT object_name, column_name, function_type, function_parameters\nFROM   redaction_columns\nWHERE  object_owner = 'CLINICA'\nORDER  BY object_name, column_name;\n\nPROMPT Titulares de EXEMPT REDACTION POLICY (directo o por rol):\nCOLUMN grantee FORMAT A25\nSELECT grantee, privilege\nFROM   dba_sys_privs\nWHERE  privilege = 'EXEMPT REDACTION POLICY'\nORDER  BY grantee;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s06_auditoria.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s06_auditoria.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s06_auditoria.sql\n-- Contenedor: XEPDB1\n-- Fase PHVA: Hacer (y base para Verificar)\n-- Controles: ISO/IEC 27001:2022 A.8.15 (registro de eventos), A.8.16\n--            (seguimiento de actividades), A.8.2 (derechos de acceso\n--            privilegiado), A.8.12 (prevención de fuga de datos)\n--\n-- Propósito:\n--   Políticas de auditoría unificada (funcionan también en modo mixto):\n--     - POL_PRIVILEGIADOS       : toda acción del administrador DBA_OPER.\n--     - POL_DATOS_SENSIBLES     : lectura y modificación de PACIENTES y\n--                                 CONSULTAS por cualquier usuario.\n--     - POL_CAMBIOS_PRIVILEGIOS : gestión de usuarios, roles, privilegios\n--                                 y perfiles.\n--     - POL_EXPORTACIONES       : exportaciones con Data Pump.\n--   Además se confirma que la política predefinida ORA_LOGON_FAILURES\n--   (intentos fallidos de inicio de sesión) sigue habilitada.\n--\n-- Requisito: s02 y s03 ejecutados (tablas y usuario DBA_OPER existentes).\n-- Re-ejecutable: deshabilita y elimina las políticas si existen.\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s06_auditoria.txt\n\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/01_setup/comun/encabezado.sql s06_auditoria\n\n--------------------------------------------------------------------------------\n-- 1. Limpieza de una ejecución anterior\n--    Una política habilitada no puede eliminarse: primero se deshabilita\n--    (NOAUDIT) para cada usuario o rol en que esté activa y luego se elimina.\n--    ORA-46357: la política no existe.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. LIMPIEZA DE POLÍTICAS PREVIAS\nDECLARE\n  PROCEDURE ejecutar(p_sql IN VARCHAR2, p_ignorar IN VARCHAR2) IS\n  BEGIN\n    EXECUTE IMMEDIATE p_sql;\n    DBMS_OUTPUT.PUT_LINE('Ejecutado: ' || p_sql);\n  EXCEPTION\n    WHEN OTHERS THEN\n      IF INSTR(',' || p_ignorar || ',', ',' || SQLCODE || ',') > 0 THEN\n        DBMS_OUTPUT.PUT_LINE('Omitido  : ' || p_sql || ' (ORA-'\n                             || LPAD(ABS(SQLCODE), 5, '0') || ', no existía)');\n      ELSE\n        RAISE;\n      END IF;\n  END;\nBEGIN\n  FOR e IN (SELECT policy_name, entity_name, entity_type\n            FROM   audit_unified_enabled_policies\n            WHERE  policy_name IN ('POL_PRIVILEGIADOS', 'POL_DATOS_SENSIBLES',\n                                   'POL_CAMBIOS_PRIVILEGIOS', 'POL_EXPORTACIONES')) LOOP\n    IF e.entity_name = 'ALL USERS' THEN\n      ejecutar('NOAUDIT POLICY ' || e.policy_name, '-46357');\n    ELSIF e.entity_type = 'ROLE' THEN\n      ejecutar('NOAUDIT POLICY ' || e.policy_name || ' BY USERS WITH GRANTED ROLES '\n               || e.entity_name, '-46357');\n    ELSE\n      ejecutar('NOAUDIT POLICY ' || e.policy_name || ' BY ' || e.entity_name, '-46357');\n    END IF;\n  END LOOP;\n\n  FOR p IN (SELECT column_value AS nombre\n            FROM   TABLE(sys.odcivarchar2list('POL_PRIVILEGIADOS', 'POL_DATOS_SENSIBLES',\n                                              'POL_CAMBIOS_PRIVILEGIOS', 'POL_EXPORTACIONES'))) LOOP\n    ejecutar('DROP AUDIT POLICY ' || p.nombre, '-46357');\n  END LOOP;\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 2. POL_PRIVILEGIADOS\n--    ACTIONS ALL registra cualquier sentencia del usuario privilegiado.\n--    Se aplica solo a DBA_OPER (BY), para no generar volumen con el resto.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. POL_PRIVILEGIADOS\nCREATE AUDIT POLICY pol_privilegiados\n  ACTIONS ALL;\n\nAUDIT POLICY pol_privilegiados BY dba_oper;\n\n--------------------------------------------------------------------------------\n-- 3. POL_DATOS_SENSIBLES\n--    Acciones a nivel de objeto sobre las tablas con datos CONFIDENCIALES y\n--    SENSIBLES. Permite saber quién leyó o cambió datos de pacientes.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. POL_DATOS_SENSIBLES\nCREATE AUDIT POLICY pol_datos_sensibles\n  ACTIONS SELECT ON clinica.pacientes,\n          INSERT ON clinica.pacientes,\n          UPDATE ON clinica.pacientes,\n          DELETE ON clinica.pacientes,\n          SELECT ON clinica.consultas,\n          INSERT ON clinica.consultas,\n          UPDATE ON clinica.consultas,\n          DELETE ON clinica.consultas;\n\nAUDIT POLICY pol_datos_sensibles;\n\n--------------------------------------------------------------------------------\n-- 4. POL_CAMBIOS_PRIVILEGIOS\n--    Cambios en la gestión de identidades y derechos de acceso.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. POL_CAMBIOS_PRIVILEGIOS\nCREATE AUDIT POLICY pol_cambios_privilegios\n  ACTIONS GRANT, REVOKE,\n          CREATE USER, ALTER USER, DROP USER,\n          CREATE ROLE, ALTER ROLE, DROP ROLE,\n          ALTER PROFILE;\n\nAUDIT POLICY pol_cambios_privilegios;\n\n--------------------------------------------------------------------------------\n-- 5. POL_EXPORTACIONES\n--    Registra cada trabajo de exportación de Data Pump (posible extracción\n--    masiva de datos).\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 5. POL_EXPORTACIONES\nCREATE AUDIT POLICY pol_exportaciones\n  ACTIONS COMPONENT = DATAPUMP EXPORT;\n\nAUDIT POLICY pol_exportaciones;\n\n--------------------------------------------------------------------------------\n-- 6. Verificación\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 6. VERIFICACIÓN\n\nPROMPT Definición de las políticas del proyecto:\nCOLUMN policy_name   FORMAT A24\nCOLUMN audit_option  FORMAT A20\nCOLUMN option_type   FORMAT A20\nCOLUMN object_schema FORMAT A8\nCOLUMN object_name   FORMAT A10\nSELECT policy_name, audit_option, audit_option_type AS option_type,\n       object_schema, object_name\nFROM   audit_unified_policies\nWHERE  policy_name IN ('POL_PRIVILEGIADOS', 'POL_DATOS_SENSIBLES',\n                       'POL_CAMBIOS_PRIVILEGIOS', 'POL_EXPORTACIONES')\nORDER  BY policy_name, object_name, audit_option;\n\nPROMPT Políticas habilitadas en la PDB (incluye ORA_LOGON_FAILURES):\nCOLUMN enabled_option FORMAT A15\nCOLUMN entity_name    FORMAT A12\nCOLUMN entity_type    FORMAT A8\nCOLUMN success        FORMAT A7\nCOLUMN failure        FORMAT A7\nSELECT policy_name, enabled_option, entity_name, entity_type, success, failure\nFROM   audit_unified_enabled_policies\nORDER  BY policy_name;\n\nPROMPT Confirmación de ORA_LOGON_FAILURES:\nCOLUMN estado FORMAT A40\nSELECT CASE WHEN COUNT(*) > 0\n            THEN 'ORA_LOGON_FAILURES habilitada'\n            ELSE 'ORA_LOGON_FAILURES NO habilitada'\n       END AS estado\nFROM   audit_unified_enabled_policies\nWHERE  policy_name = 'ORA_LOGON_FAILURES';\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s07_clon_dev.sql",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s07_clon_dev.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/01_setup/s07_clon_dev.sql\n-- Contenedor: XEPDB1 (ejecutar como SYS)\n-- Fase PHVA: Hacer\n-- Controles: ISO/IEC 27001:2022 A.8.11 (enmascaramiento de datos), A.8.31\n--            (separación de entornos), A.8.33 (información de prueba)\n--\n-- Propósito:\n--   Crear un clon de desarrollo CLINICA_DEV con enmascaramiento ESTÁTICO: los\n--   datos se transforman durante la copia (CTAS), por lo que los valores\n--   originales nunca se escriben en el esquema de desarrollo.\n--     - Cédula            : generada con prefijo 9 (9-NNNN-NNNN), que no se\n--                           usa en los datos de producción.\n--     - Nombre            : \"Paciente <id>\".\n--     - Fecha nacimiento  : desplazada al azar hasta 180 días.\n--     - Teléfono          : aleatorio con formato NNNN-NNNN.\n--     - Correo            : paciente<id>@ejemplo.test.\n--     - Dirección         : \"Dirección de prueba <id>\".\n--     - Diagnóstico y tratamiento: tomados de un catálogo genérico ficticio.\n--     - Médicos           : nombre conservado ([PUBLICA]); usuario de BD\n--                           reemplazado.\n--   Los identificadores se conservan para mantener la integridad referencial.\n--   Se otorga SELECT a ROL_DESARROLLO.\n--\n-- Requisito: s02 y s03 ejecutados. Se ejecuta como SYS, que no está sujeto a\n--            VPD ni a Data Redaction y puede leer el origen completo.\n-- Re-ejecutable: elimina el usuario CLINICA_DEV si existe.\n--------------------------------------------------------------------------------\n\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK ON\nSET SERVEROUTPUT ON SIZE UNLIMITED\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TRIMOUT ON\nSET TAB OFF\nWHENEVER SQLERROR EXIT FAILURE ROLLBACK\n\nSPOOL evidencias/setup_s07_clon_dev.txt\n\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/01_setup/comun/encabezado.sql s07_clon_dev\n\n--------------------------------------------------------------------------------\n-- 1. Limpieza de una ejecución anterior (ORA-01918: usuario inexistente)\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 1. LIMPIEZA DE OBJETOS PREVIOS\nBEGIN\n  EXECUTE IMMEDIATE 'DROP USER clinica_dev CASCADE';\n  DBMS_OUTPUT.PUT_LINE('Ejecutado: DROP USER clinica_dev CASCADE');\nEXCEPTION\n  WHEN OTHERS THEN\n    IF SQLCODE = -1918 THEN\n      DBMS_OUTPUT.PUT_LINE('Omitido  : DROP USER clinica_dev CASCADE (ORA-01918, no existía)');\n    ELSE\n      RAISE;\n    END IF;\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 2. Usuario CLINICA_DEV\n--    Cuenta de esquema bloqueada. Usa el tablespace USERS (sin cifrar): el\n--    clon no contiene datos reales, por lo que no requiere TDE.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 2. USUARIO CLINICA_DEV\nBEGIN\n  EXECUTE IMMEDIATE 'CREATE USER clinica_dev IDENTIFIED BY \"&pwd_clinica_dev\" '\n                 || 'DEFAULT TABLESPACE users '\n                 || 'QUOTA UNLIMITED ON users '\n                 || 'ACCOUNT LOCK';\n  DBMS_OUTPUT.PUT_LINE('Usuario CLINICA_DEV creado (bloqueado).');\nEND;\n/\n\n--------------------------------------------------------------------------------\n-- 3. Copia enmascarada de MEDICOS\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 3. CLINICA_DEV.MEDICOS\nCREATE TABLE clinica_dev.medicos AS\nSELECT id,\n       nombre,\n       CAST('USUARIO_DEV_' || id AS VARCHAR2(30)) AS usuario_bd\nFROM   clinica.medicos;\n\n--------------------------------------------------------------------------------\n-- 4. Copia enmascarada de PACIENTES\n--    La cédula combina el prefijo 9, el id (garantiza unicidad) y 4 dígitos\n--    aleatorios.\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 4. CLINICA_DEV.PACIENTES\nCREATE TABLE clinica_dev.pacientes AS\nSELECT id,\n       CAST('9-' || LPAD(id, 4, '0') || '-'\n            || LPAD(TRUNC(DBMS_RANDOM.VALUE(0, 10000)), 4, '0') AS VARCHAR2(11)) AS cedula,\n       CAST('Paciente ' || id AS VARCHAR2(100))                                   AS nombre,\n       fecha_nacimiento + TRUNC(DBMS_RANDOM.VALUE(-180, 181))                     AS fecha_nacimiento,\n       CAST(TRUNC(DBMS_RANDOM.VALUE(2000, 10000)) || '-'\n            || LPAD(TRUNC(DBMS_RANDOM.VALUE(0, 10000)), 4, '0') AS VARCHAR2(9))  AS telefono,\n       CAST('paciente' || id || '@ejemplo.test' AS VARCHAR2(100))                 AS correo,\n       CAST('Dirección de prueba ' || id AS VARCHAR2(200))                        AS direccion\nFROM   clinica.pacientes;\n\n--------------------------------------------------------------------------------\n-- 5. Copia enmascarada de CONSULTAS\n--    Cada consulta recibe un par diagnóstico/tratamiento del catálogo\n--    genérico, elegido por ORA_HASH del id (sin relación con el dato real).\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 5. CLINICA_DEV.CONSULTAS\nCREATE TABLE clinica_dev.consultas AS\nWITH catalogo AS (\n  SELECT 1 AS n, 'Diagnóstico genérico de prueba A' AS diagnostico, 'Indicación genérica de prueba A' AS tratamiento FROM dual UNION ALL\n  SELECT 2,      'Diagnóstico genérico de prueba B',                'Indicación genérica de prueba B'                FROM dual UNION ALL\n  SELECT 3,      'Diagnóstico genérico de prueba C',                'Indicación genérica de prueba C'                FROM dual UNION ALL\n  SELECT 4,      'Diagnóstico genérico de prueba D',                'Indicación genérica de prueba D'                FROM dual UNION ALL\n  SELECT 5,      'Diagnóstico genérico de prueba E',                'Indicación genérica de prueba E'                FROM dual UNION ALL\n  SELECT 6,      'Diagnóstico genérico de prueba F',                'Indicación genérica de prueba F'                FROM dual\n)\nSELECT c.id,\n       c.paciente_id,\n       c.medico_id,\n       c.fecha,\n       CAST(k.diagnostico AS VARCHAR2(200)) AS diagnostico,\n       CAST(k.tratamiento AS VARCHAR2(300)) AS tratamiento\nFROM   clinica.consultas c\n       JOIN catalogo k ON k.n = ORA_HASH(c.id, 5) + 1;\n\n--------------------------------------------------------------------------------\n-- 6. Claves primarias y clasificación del clon\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 6. CLAVES Y COMENTARIOS\nALTER TABLE clinica_dev.medicos   ADD CONSTRAINT pk_dev_medicos   PRIMARY KEY (id);\nALTER TABLE clinica_dev.pacientes ADD CONSTRAINT pk_dev_pacientes PRIMARY KEY (id);\nALTER TABLE clinica_dev.consultas ADD CONSTRAINT pk_dev_consultas PRIMARY KEY (id);\n\nCOMMENT ON TABLE clinica_dev.medicos   IS '[INTERNA] Clon de desarrollo enmascarado de CLINICA.MEDICOS';\nCOMMENT ON TABLE clinica_dev.pacientes IS '[INTERNA] Clon de desarrollo enmascarado de CLINICA.PACIENTES';\nCOMMENT ON TABLE clinica_dev.consultas IS '[INTERNA] Clon de desarrollo enmascarado de CLINICA.CONSULTAS';\n\n--------------------------------------------------------------------------------\n-- 7. Acceso para desarrollo\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 7. PRIVILEGIOS DE ROL_DESARROLLO\nGRANT SELECT ON clinica_dev.medicos   TO rol_desarrollo;\nGRANT SELECT ON clinica_dev.pacientes TO rol_desarrollo;\nGRANT SELECT ON clinica_dev.consultas TO rol_desarrollo;\n\n--------------------------------------------------------------------------------\n-- 8. Verificación\n--------------------------------------------------------------------------------\nPROMPT\nPROMPT --- 8. VERIFICACIÓN\nALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';\n\nPROMPT Muestra de pacientes enmascarados:\nCOLUMN cedula    FORMAT A11\nCOLUMN nombre    FORMAT A12\nCOLUMN telefono  FORMAT A9\nCOLUMN correo    FORMAT A26\nCOLUMN direccion FORMAT A24\nSELECT id, cedula, nombre, fecha_nacimiento, telefono, correo, direccion\nFROM   clinica_dev.pacientes\nWHERE  id <= 5\nORDER  BY id;\n\nPROMPT Muestra de consultas enmascaradas:\nCOLUMN diagnostico FORMAT A34\nCOLUMN tratamiento FORMAT A33\nSELECT id, paciente_id, medico_id, diagnostico, tratamiento\nFROM   clinica_dev.consultas\nWHERE  id <= 5\nORDER  BY id;\n\nPROMPT Coincidencias con datos de origen (todas deben ser 0):\nSELECT (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.cedula   = d.cedula)   AS cedulas,\n       (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.nombre   = d.nombre)   AS nombres,\n       (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.telefono = d.telefono) AS telefonos,\n       (SELECT COUNT(*) FROM clinica_dev.pacientes d JOIN clinica.pacientes p ON p.correo   = d.correo)   AS correos,\n       (SELECT COUNT(*) FROM clinica_dev.consultas d JOIN clinica.consultas c ON c.diagnostico = d.diagnostico) AS diagnosticos\nFROM   dual;\n\nPROMPT Cédulas del clon fuera del formato 9-NNNN-NNNN (debe ser 0):\nSELECT COUNT(*) AS cedulas_invalidas\nFROM   clinica_dev.pacientes\nWHERE  NOT REGEXP_LIKE(cedula, '^9-[0-9]{4}-[0-9]{4}$');\n\nPROMPT Estado de CLINICA_DEV y privilegios otorgados:\nCOLUMN username       FORMAT A12\nCOLUMN account_status FORMAT A16\nSELECT username, account_status, default_tablespace\nFROM   dba_users\nWHERE  username = 'CLINICA_DEV';\n\nCOLUMN grantee    FORMAT A15\nCOLUMN table_name FORMAT A12\nSELECT grantee, table_name, privilege\nFROM   dba_tab_privs\nWHERE  owner = 'CLINICA_DEV'\nORDER  BY table_name;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/01_setup/s08_red.md",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s08_red.md",
      "ext": "md",
      "lenguaje": "markdown",
      "contenido": "# Endurecimiento de red de Oracle Net (s08)\n\nControl principal: **ISO/IEC 27001:2022 A.8.20 Seguridad de redes**. Complementa A.8.24 (uso de criptografía) y A.5.14 (transferencia de información).\n\nArchivo modificado: `sqlnet.ora` del servidor, en `<ORACLE_BASE_HOME>\\network\\admin` (en este equipo `C:\\app\\dajoz\\product\\21c\\homes\\OraDB21Home1\\network\\admin\\sqlnet.ora`). En Oracle 21c el Oracle home es de solo lectura; la ruta correcta la devuelve `orabasehome`.\n\nScript: `sql/01_setup/s08_red.sh <hostname> <ipv4_local>`. Antes de cada cambio respalda el archivo en `<ruta_respaldos>\\sqlnet\\` (fuera del repositorio). La evidencia queda en `evidencias/setup_s08_red.txt`.\n\n## Parámetros\n\n| Parámetro | Valor | Qué hace | Riesgo que mitiga | Control |\n|---|---|---|---|---|\n| `SQLNET.ENCRYPTION_SERVER` | `REQUIRED` | El servidor rechaza cualquier conexión que no negocie cifrado nativo de Oracle Net (ORA-12660 si el cliente lo rechaza). | Captura en la red de datos de pacientes y de sentencias SQL. | A.8.20, A.8.24 |\n| `SQLNET.ENCRYPTION_TYPES_SERVER` | `(AES256)` | Limita el algoritmo de cifrado a AES de 256 bits. | Negociación de algoritmos débiles u obsoletos (DES, RC4, 3DES). | A.8.24 |\n| `SQLNET.CRYPTO_CHECKSUM_SERVER` | `REQUIRED` | Exige una suma criptográfica de integridad en cada paquete. | Modificación o repetición de paquetes en tránsito. | A.8.20 |\n| `SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER` | `(SHA256)` | Limita el algoritmo de integridad a SHA-256. | Uso de MD5 o SHA-1. | A.8.24 |\n| `TCP.VALIDNODE_CHECKING` | `YES` | El listener valida la dirección de origen de cada conexión contra la lista de nodos. | Conexiones desde equipos no autorizados. | A.8.20 |\n| `TCP.INVITED_NODES` | `(127.0.0.1, localhost, ::1, Joel-Laptop, 192.168.0.21)` | Solo se aceptan conexiones desde el propio equipo (bucle local IPv4/IPv6, nombre e IP del equipo). | Acceso remoto al listener desde la red local. | A.8.20 |\n\nParámetros que ya estaban y se conservan:\n\n- `SQLNET.AUTHENTICATION_SERVICES = (NTS)`: autenticación del sistema operativo Windows (necesaria para `sqlplus / as sysdba`).\n- `NAMES.DIRECTORY_PATH = (TNSNAMES, EZCONNECT)`.\n- `SQLNET.ALLOWED_LOGON_VERSION_SERVER = 12a` (paso 0, A.8.5).\n\n## Aplicación\n\n- Cifrado e integridad: se aplican a cada conexión nueva, sin reiniciar nada.\n- `TCP.VALIDNODE_CHECKING` y `TCP.INVITED_NODES`: los lee el listener al arrancar, por lo que requieren `lsnrctl stop` y `lsnrctl start` (o `lsnrctl reload`).\n- Las conexiones locales por `bequeath` (`sqlplus / as sysdba`) no pasan por la red ni por el listener: no se cifran ni se filtran por nodo.\n\nVerificación: `v$session_connect_info.network_service_banner` de una sesión TCP debe mostrar el adaptador `AES256 Encryption service adapter` y el adaptador `SHA256 Crypto-checksumming service adapter` (prueba PR-24 y PR-25, `sql/02_verificacion/v15_red.sql`).\n\n## Consideraciones\n\n- La IPv4 `192.168.0.21` la asigna DHCP en la red Wi-Fi. Si cambia, el listener rechazará las conexiones que usen esa IP (las de `localhost` siguen funcionando). En ese caso se vuelve a ejecutar `s08_red.sh` con la IP nueva y se reinicia el listener.\n- SQL Developer (JDBC thin) y SQL*Plus aceptan cifrado por defecto (`ENCRYPTION_CLIENT = ACCEPTED`), por lo que negocian AES256 sin configuración adicional.\n- El cifrado nativo protege la confidencialidad e integridad pero no autentica al servidor. Para autenticación mutua con certificados se usaría TLS (TCPS), fuera del alcance de este proyecto.\n\n## Cómo revertir\n\n1. Restaurar la copia previa del archivo (la ruta exacta figura en `evidencias/setup_s08_red.txt`, sección 1):\n\n   ```\n   copy \"<ruta_respaldos>\\sqlnet\\sqlnet.ora.<fecha>\" \"C:\\app\\dajoz\\product\\21c\\homes\\OraDB21Home1\\network\\admin\\sqlnet.ora\"\n   ```\n\n   O eliminar del `sqlnet.ora` las seis líneas agregadas bajo el comentario `# ISO 27001 A.8.20 / A.8.24`.\n2. Reiniciar el listener para que deje de filtrar nodos: `lsnrctl stop` y `lsnrctl start`.\n3. Abrir una sesión TCP nueva y confirmar en `v$session_connect_info` que ya no aparecen los adaptadores AES256 y SHA256 (o que su uso depende del cliente).\n\nRevertir parcialmente: para permitir clientes sin cifrado sin desactivarlo, cambiar `REQUIRED` por `REQUESTED` en `SQLNET.ENCRYPTION_SERVER` y `SQLNET.CRYPTO_CHECKSUM_SERVER`.\n"
    },
    {
      "ruta": "sql/01_setup/s08_red.sh",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s08_red.sh",
      "ext": "sh",
      "lenguaje": "bash",
      "contenido": "#!/usr/bin/env bash\n################################################################################\n# Script   : sql/01_setup/s08_red.sh\n# Fase PHVA: Hacer\n# Controles: ISO/IEC 27001:2022 A.8.20 (seguridad de redes), A.8.24 (uso de\n#            criptografía)\n#\n# Propósito:\n#   Endurecer la configuración de red de Oracle Net en el sqlnet.ora del\n#   servidor (ver sql/01_setup/s08_red.md):\n#     - Cifrado nativo obligatorio con AES256.\n#     - Integridad (crypto-checksum) obligatoria con SHA256.\n#     - Lista de nodos invitados: solo el propio equipo puede conectarse.\n#   El cambio en TCP.* lo aplica el listener al reiniciarse; el cifrado y la\n#   integridad se aplican a cada conexión nueva.\n#\n# Ejecución (Git Bash, desde la raíz del repositorio):\n#   bash sql/01_setup/s08_red.sh <hostname> <ipv4_local>\n#   El reinicio del listener (lsnrctl stop / start) se hace aparte, después\n#   de revisar la evidencia.\n#   Re-ejecutable: cada parámetro se reemplaza si ya existe o se agrega si no.\n#   La evidencia se escribe en evidencias/setup_s08_red.txt.\n################################################################################\nset -euo pipefail\n\nif [ $# -ne 2 ]; then\n  echo \"Uso: bash sql/01_setup/s08_red.sh <hostname> <ipv4_local>\" >&2\n  exit 1\nfi\nHOST_EQUIPO=\"$1\"\nIP_EQUIPO=\"$2\"\nEVIDENCIA=\"evidencias/setup_s08_red.txt\"\n\n# 1. Ubicar el sqlnet.ora del servidor y el directorio de respaldos.\nBASE_HOME=$(orabasehome.exe | tr -d '\\r')\nSQLNET=\"$(cygpath -u \"$BASE_HOME\")/network/admin/sqlnet.ora\"\nRUTA_RESPALDOS=$(sed -nE 's/^DEFINE[[:space:]]+ruta_respaldos[[:space:]]*=[[:space:]]*(.+)$/\\1/p' sql/config_local.sql | tr -d '\\r')\nDIR_RESPALDO=\"$(cygpath -u \"$RUTA_RESPALDOS\")/sqlnet\"\nRESPALDO=\"$DIR_RESPALDO/sqlnet.ora.$(date +%Y%m%d_%H%M%S)\"\n\n# Fija \"PARAMETRO = valor\": reemplaza la línea si existe o la agrega al final\n# (con fin de línea CRLF, como el archivo original).\nfijar_parametro() {\n  local nombre=\"$1\" valor=\"$2\" patron\n  patron=\"^[[:space:]]*${nombre//./\\\\.}[[:space:]]*=\"\n  if grep -qiE \"$patron\" \"$SQLNET\"; then\n    sed -i -E \"s/${patron}.*\\$/${nombre} = ${valor}\\r/I\" \"$SQLNET\"\n    echo \"Reemplazado: ${nombre} = ${valor}\"\n  else\n    printf '%s = %s\\r\\n' \"$nombre\" \"$valor\" >> \"$SQLNET\"\n    echo \"Agregado   : ${nombre} = ${valor}\"\n  fi\n}\n\n{\n  echo \"================================================================================\"\n  echo \" EVIDENCIA DE CONFIGURACIÓN - s08_red\"\n  echo \" Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c\"\n  echo \"================================================================================\"\n  echo \"Fecha y hora      : $(date '+%Y-%m-%d %H:%M:%S %z')\"\n  echo \"Equipo / usuario  : $(hostname) / $(whoami)\"\n  echo \"sqlnet.ora        : $(cygpath -w \"$SQLNET\")\"\n  echo \"Nodos invitados   : 127.0.0.1, localhost, ::1, ${HOST_EQUIPO}, ${IP_EQUIPO}\"\n  echo\n\n  # 2. Respaldo del archivo actual antes de cualquier cambio.\n  mkdir -p \"$DIR_RESPALDO\"\n  cp -p \"$SQLNET\" \"$RESPALDO\"\n  echo \"--- 1. RESPALDO\"\n  echo \"Copia creada en   : $(cygpath -w \"$RESPALDO\")\"\n  echo\n\n  # 3. Parámetros de cifrado, integridad y nodos invitados.\n  echo \"--- 2. PARÁMETROS\"\n  if ! grep -q 'A.8.20' \"$SQLNET\"; then\n    printf '\\r\\n# ISO 27001 A.8.20 / A.8.24: cifrado e integridad obligatorios, nodos invitados\\r\\n' >> \"$SQLNET\"\n  fi\n  fijar_parametro \"SQLNET.ENCRYPTION_SERVER\"           \"REQUIRED\"\n  fijar_parametro \"SQLNET.ENCRYPTION_TYPES_SERVER\"     \"(AES256)\"\n  fijar_parametro \"SQLNET.CRYPTO_CHECKSUM_SERVER\"      \"REQUIRED\"\n  fijar_parametro \"SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER\" \"(SHA256)\"\n  fijar_parametro \"TCP.VALIDNODE_CHECKING\"             \"YES\"\n  fijar_parametro \"TCP.INVITED_NODES\"                  \"(127.0.0.1, localhost, ::1, ${HOST_EQUIPO}, ${IP_EQUIPO})\"\n  echo\n\n  # 4. Diferencias y contenido final.\n  echo \"--- 3. DIFERENCIAS (respaldo -> vigente)\"\n  diff <(tr -d '\\r' < \"$RESPALDO\") <(tr -d '\\r' < \"$SQLNET\") || true\n  echo\n  echo \"--- 4. CONTENIDO VIGENTE\"\n  tr -d '\\r' < \"$SQLNET\"\n} | tee \"$EVIDENCIA\"\n"
    },
    {
      "ruta": "sql/01_setup/s09_rman_cifrado.rman",
      "carpeta": "01_setup",
      "subcarpeta": "",
      "nombre": "s09_rman_cifrado.rman",
      "ext": "rman",
      "lenguaje": "sql",
      "contenido": "################################################################################\n# Script   : sql/01_setup/s09_rman_cifrado.rman\n# Contenedor: CDB (RMAN conectado a CDB$ROOT; respaldo solo de la PDB XEPDB1)\n# Fase PHVA: Hacer\n# Controles: ISO/IEC 27001:2022 A.8.13 (respaldo de la información),\n#            A.8.24 (uso de criptografía)\n#\n# Propósito:\n#   Configurar el cifrado de los respaldos de RMAN en modo transparente (usa\n#   la clave maestra del keystore TDE, abierto por AUTO_LOGIN) con AES256, y\n#   una política de retención por redundancia 1. Luego respaldar XEPDB1, que\n#   contiene el esquema CLINICA (no toda la CDB, para ahorrar espacio).\n#   Los respaldos van al área de recuperación (db_recovery_file_dest).\n#\n# Ejecución (Git Bash, desde la raíz del repositorio):\n#   export NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS'\n#   rman target / cmdfile=sql/01_setup/s09_rman_cifrado.rman log=evidencias/setup_rman.txt\n#   Re-ejecutable: CONFIGURE reemplaza la configuración y cada ejecución\n#   genera un respaldo nuevo.\n################################################################################\n\n# 1. Configuración vigente antes del cambio.\nSHOW ALL;\n\n# 2. Cifrado de todos los respaldos de la base de datos con AES256.\nCONFIGURE ENCRYPTION FOR DATABASE ON;\nCONFIGURE ENCRYPTION ALGORITHM 'AES256';\n\n# 3. Retención: basta con un respaldo completo por archivo de datos; los\n#    anteriores quedan obsoletos (se eliminan en la prueba PR-16).\nCONFIGURE RETENTION POLICY TO REDUNDANCY 1;\n\n# 4. Respaldo de la PDB XEPDB1 (la base está en ARCHIVELOG: respaldo en línea).\nBACKUP PLUGGABLE DATABASE XEPDB1 TAG 'S09_XEPDB1_CIFRADO';\n\n# 5. Configuración resultante y resumen de los respaldos de XEPDB1.\nSHOW ENCRYPTION FOR DATABASE;\nSHOW ENCRYPTION ALGORITHM;\nSHOW RETENTION POLICY;\nLIST BACKUP OF PLUGGABLE DATABASE XEPDB1 SUMMARY;\n"
    },
    {
      "ruta": "sql/02_verificacion/comun/cabecera.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "comun",
      "nombre": "cabecera.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Encabezado común de los scripts de verificación (sql/02_verificacion).\n-- Uso: @sql/02_verificacion/comun/cabecera.sql <nombre_script> <ids_pruebas>\n--   <ids_pruebas> sin espacios, por ejemplo PR-02,PR-03\n-- Registra fecha, contenedor, usuario conectado y las pruebas que cubre.\n-- Se reaplica el formato porque un CONNECT previo ejecuta glogin.sql.\n--------------------------------------------------------------------------------\nSET PAGESIZE 200\nSET LINESIZE 200\nSET TRIMSPOOL ON\nSET TAB OFF\nSET SERVEROUTPUT ON SIZE UNLIMITED\n\nPROMPT\nPROMPT ================================================================================\nPROMPT  VERIFICACIÓN - &1\nPROMPT  Pruebas cubiertas: &2\nPROMPT ================================================================================\n\nCOLUMN fecha_hora    FORMAT A28\nCOLUMN usuario       FORMAT A12\nCOLUMN contenedor    FORMAT A12\nCOLUMN sesion_ip     FORMAT A16\nCOLUMN protocolo     FORMAT A10\n\nSELECT TO_CHAR(SYSTIMESTAMP, 'YYYY-MM-DD HH24:MI:SS')    AS fecha_hora,\n       SYS_CONTEXT('USERENV', 'SESSION_USER')            AS usuario,\n       SYS_CONTEXT('USERENV', 'CON_NAME')                AS contenedor,\n       NVL(SYS_CONTEXT('USERENV', 'IP_ADDRESS'), 'local') AS sesion_ip,\n       NVL(SYS_CONTEXT('USERENV', 'NETWORK_PROTOCOL'), 'beq') AS protocolo\nFROM   dual;\n\nCLEAR COLUMNS\n"
    },
    {
      "ruta": "sql/02_verificacion/ejecutar_todo.sh",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "ejecutar_todo.sh",
      "ext": "sh",
      "lenguaje": "bash",
      "contenido": "#!/usr/bin/env bash\n################################################################################\n# Script   : sql/02_verificacion/ejecutar_todo.sh\n# Fase PHVA: Verificar\n#\n# Ejecuta las 17 verificaciones (v01 a v17) en orden y, para las pruebas que\n# dependen de RMAN o del sistema de archivos, calcula el resultado a partir de\n# la salida y lo añade a la evidencia correspondiente.\n#\n# Ejecución (Git Bash, desde la raíz del repositorio):\n#   bash sql/02_verificacion/ejecutar_todo.sh\n################################################################################\nset -uo pipefail\nexport MSYS_NO_PATHCONV=1 NLS_LANG=AMERICAN_AMERICA.AL32UTF8\n\ncd \"$(dirname \"$0\")/../..\" || exit 1\ncfg(){ sed -nE \"s/^DEFINE[[:space:]]+$1[[:space:]]*=[[:space:]]*\\\"?([^\\\"]*)\\\"?[[:space:]]*\\$/\\1/p\" sql/config_local.sql | tr -d '\\r'; }\nPDB=$(cfg pdb_nombre)\n\nsqlf(){ printf '@sql/02_verificacion/%s\\nexit\\n' \"$1\" | sqlplus -S -L /nolog > /dev/null 2>&1; }\nbanner(){ echo \"==================== $1\"; }\n\n# --- v01 a v09 (SQL) --------------------------------------------------------\nfor s in v01_clasificacion v02_control_acceso v03_identidades v04_perfil_contrasenas \\\n         v05_revision_derechos v06_proteccion_registros v07_acceso_privilegiado \\\n         v08_vpd v09_autenticacion_segura; do\n  banner \"$s\"; sqlf \"$s.sql\"\ndone\n\n# --- v10: PR-15 (SQL) + PR-16 (RMAN obsoletos) ------------------------------\nbanner \"v10_eliminacion\"; sqlf \"v10_eliminacion.sql\"\nbanner \"v10_obsoletos (RMAN)\"\nrman target / cmdfile=sql/02_verificacion/v10_obsoletos.rman log=evidencias/v10_obsoletos.txt > /dev/null 2>&1\nif grep -qi \"no obsolete backups found\" evidencias/v10_obsoletos.txt; then\n  echo \"RESULTADO PR-16: CUMPLE (no quedan respaldos obsoletos)\" >> evidencias/v10_obsoletos.txt\nelse\n  echo \"RESULTADO PR-16: NO CUMPLE (persisten respaldos obsoletos)\" >> evidencias/v10_obsoletos.txt\nfi\n\n# --- v11 (SQL) --------------------------------------------------------------\nbanner \"v11_enmascaramiento\"; sqlf \"v11_enmascaramiento.sql\"\n\n# --- v12: PR-20 (SQL) + PR-21 (expdp) ---------------------------------------\nbanner \"v12_fuga_datos\"; sqlf \"v12_fuga_datos.sql\"\nbanner \"v12_expdp (shell)\"; bash sql/02_verificacion/v12_expdp.sh > /dev/null 2>&1\n\n# --- v13: PR-22 cifrado (SQL) + restore validate (RMAN) ---------------------\nbanner \"v13_respaldos\"; sqlf \"v13_respaldos.sql\"\nbanner \"v13_validar (RMAN)\"\nrman target / cmdfile=sql/02_verificacion/v13_validar.rman log=evidencias/v13_validar.txt > /dev/null 2>&1\nif grep -q \"Finished restore\" evidencias/v13_validar.txt && ! grep -qE \"RMAN-[0-9]\" evidencias/v13_validar.txt; then\n  echo \"RESULTADO PR-22 (restore validate): CUMPLE\" >> evidencias/v13_respaldos.txt\nelse\n  echo \"RESULTADO PR-22 (restore validate): NO CUMPLE\" >> evidencias/v13_respaldos.txt\nfi\n\n# --- v14 (SQL) --------------------------------------------------------------\nbanner \"v14_auditoria\"; sqlf \"v14_auditoria.sql\"\n\n# --- v15: líneas del sqlnet.ora (shell) + banners de red (SQL, APPEND) ------\nbanner \"v15_red\"\nBASE_HOME=$(orabasehome.exe | tr -d '\\r')\nSQLNET=\"$(cygpath -u \"$BASE_HOME\")/network/admin/sqlnet.ora\"\n{\n  echo \"================================================================================\"\n  echo \" VERIFICACIÓN - v15_red (PR-24, PR-25)\"\n  echo \"================================================================================\"\n  echo \"Fecha y hora: $(date '+%Y-%m-%d %H:%M:%S %z')\"\n  echo\n  echo \"--- Parámetros de cifrado e integridad en el sqlnet.ora del servidor\"\n  tr -d '\\r' < \"$SQLNET\" | grep -iE 'ENCRYPTION|CRYPTO_CHECKSUM|VALIDNODE|INVITED' | sed 's/^/  /'\n} > evidencias/v15_red.txt\nsqlf \"v15_red.sql\"\n\n# --- v16: PR-26 vistas (SQL) + texto plano (shell) --------------------------\nbanner \"v16_cifrado_tde\"; sqlf \"v16_cifrado_tde.sql\"\nbanner \"v16_busqueda_texto (shell)\"; bash sql/02_verificacion/v16_busqueda_texto.sh > /dev/null 2>&1\n\n# --- v17 (SQL, informativo) -------------------------------------------------\nbanner \"v17_version\"; sqlf \"v17_version.sql\"\n\necho\necho \"==================== Resultados registrados\"\ngrep -h \"RESULTADO PR-\" evidencias/v*.txt | sort -t- -k2 -n\n"
    },
    {
      "ruta": "sql/02_verificacion/v01_clasificacion.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v01_clasificacion.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v01_clasificacion.sql\n-- Contenedor: XEPDB1 (conexión local SYSDBA)\n-- Prueba    : PR-01\n-- Control   : ISO/IEC 27001:2022 A.5.12 (clasificación), A.5.13 (etiquetado)\n--\n-- Verifica que todas las columnas del esquema CLINICA tienen un comentario de\n-- clasificación con uno de los prefijos [PUBLICA], [INTERNA], [CONFIDENCIAL]\n-- o [SENSIBLE]. El resultado CUMPLE si no hay columnas sin clasificar.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v01_clasificacion.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v01_clasificacion PR-01\n\nPROMPT\nPROMPT --- Clasificación de cada columna de CLINICA\nCOLUMN tabla      FORMAT A12\nCOLUMN columna    FORMAT A18\nCOLUMN clase      FORMAT A14\nCOLUMN comentario FORMAT A70\nSELECT c.table_name AS tabla,\n       c.column_name AS columna,\n       NVL(REGEXP_SUBSTR(k.comments, '^\\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\\]'),\n           '(sin clase)') AS clase,\n       k.comments AS comentario\nFROM   dba_tab_columns c\n       LEFT JOIN dba_col_comments k\n              ON k.owner = c.owner AND k.table_name = c.table_name\n             AND k.column_name = c.column_name\nWHERE  c.owner = 'CLINICA'\nORDER  BY c.table_name, c.column_name;\n\nPROMPT\nPROMPT --- Columnas sin comentario de clasificación válido\nCOLUMN sin_clasificar FORMAT 999\nSELECT COUNT(*) AS sin_clasificar\nFROM   dba_tab_columns c\n       LEFT JOIN dba_col_comments k\n              ON k.owner = c.owner AND k.table_name = c.table_name\n             AND k.column_name = c.column_name\nWHERE  c.owner = 'CLINICA'\nAND    NOT REGEXP_LIKE(NVL(k.comments, '-'), '^\\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\\]');\n\nPROMPT\nCOLUMN resultado FORMAT A60\nSELECT CASE WHEN COUNT(*) = 0\n            THEN 'RESULTADO PR-01: CUMPLE'\n            ELSE 'RESULTADO PR-01: NO CUMPLE (' || COUNT(*) || ' columnas sin clasificar)'\n       END AS resultado\nFROM   dba_tab_columns c\n       LEFT JOIN dba_col_comments k\n              ON k.owner = c.owner AND k.table_name = c.table_name\n             AND k.column_name = c.column_name\nWHERE  c.owner = 'CLINICA'\nAND    NOT REGEXP_LIKE(NVL(k.comments, '-'), '^\\[(PUBLICA|INTERNA|CONFIDENCIAL|SENSIBLE)\\]');\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v02_control_acceso.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v02_control_acceso.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v02_control_acceso.sql\n-- Contenedor: XEPDB1\n-- Pruebas  : PR-02 (privilegios directos o a PUBLIC), PR-03 (RECEP_SOLIS no\n--            puede leer CONSULTAS)\n-- Control  : ISO/IEC 27001:2022 A.5.15, A.8.3 (restricción del acceso)\n--\n-- PR-02: ningún privilegio sobre objetos de CLINICA otorgado a PUBLIC ni\n--        directamente a un usuario (solo a través de roles) -> CUMPLE si 0.\n-- PR-03: RECEP_SOLIS (rol de recepción) no tiene acceso a CLINICA.CONSULTAS;\n--        al consultarla debe obtener ORA-00942. La conexión es por TCP.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v02_control_acceso.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v02_control_acceso PR-02,PR-03\n\nPROMPT\nPROMPT --- PR-02: privilegios sobre objetos de CLINICA (deben ser solo a roles)\nCOLUMN grantee    FORMAT A16\nCOLUMN table_name FORMAT A12\nCOLUMN privilege  FORMAT A12\nCOLUMN tipo       FORMAT A12\nSELECT p.grantee, p.table_name, p.privilege,\n       CASE WHEN p.grantee = 'PUBLIC' THEN 'PUBLIC'\n            WHEN u.username IS NOT NULL THEN 'USUARIO'\n            ELSE 'ROL' END AS tipo\nFROM   dba_tab_privs p\n       LEFT JOIN dba_users u ON u.username = p.grantee\nWHERE  p.owner = 'CLINICA'\nORDER  BY tipo, p.grantee, p.table_name, p.privilege;\n\nPROMPT\nPROMPT --- PR-02: conteo de privilegios indebidos (PUBLIC o usuario directo)\nCOLUMN resultado FORMAT A60\nSELECT CASE WHEN COUNT(*) = 0\n            THEN 'RESULTADO PR-02: CUMPLE'\n            ELSE 'RESULTADO PR-02: NO CUMPLE (' || COUNT(*) || ' concesiones directas)'\n       END AS resultado\nFROM   dba_tab_privs p\nWHERE  p.owner = 'CLINICA'\nAND    (p.grantee = 'PUBLIC'\n        OR p.grantee IN (SELECT username FROM dba_users));\n\nPROMPT\nPROMPT --- PR-03: RECEP_SOLIS intenta leer CLINICA.CONSULTAS (se espera ORA-00942)\nCONNECT RECEP_SOLIS/&pwd_recep_solis@//localhost:1521/&pdb_nombre\n@sql/02_verificacion/comun/cabecera.sql v02_control_acceso(PR-03) PR-03\n\nPROMPT Intento directo (evidencia del error):\nSELECT COUNT(*) FROM clinica.consultas;\n\nPROMPT Veredicto capturando el código ORA:\nSET SERVEROUTPUT ON\nDECLARE\n  v_n NUMBER;\nBEGIN\n  EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM clinica.consultas' INTO v_n;\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-03: NO CUMPLE (acceso permitido, '\n                       || v_n || ' filas)');\nEXCEPTION\n  WHEN OTHERS THEN\n    IF SQLCODE = -942 THEN\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-03: CUMPLE (ORA-00942, tabla no accesible)');\n    ELSE\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-03: NO CUMPLE (ORA' || SQLCODE || ')');\n    END IF;\nEND;\n/\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v03_identidades.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v03_identidades.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v03_identidades.sql\n-- Contenedor: XEPDB1\n-- Prueba   : PR-04\n-- Control  : ISO/IEC 27001:2022 A.5.16 (gestión de identidades), A.8.5\n--\n-- PR-04: ninguna cuenta abierta usa una contraseña por defecto conocida\n--        (dba_users_with_defpwd). Se listan además las cuentas abiertas que\n--        no son mantenidas por Oracle.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v03_identidades.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v03_identidades PR-04\n\nPROMPT\nPROMPT --- Cuentas abiertas no mantenidas por Oracle\nCOLUMN username       FORMAT A16\nCOLUMN account_status FORMAT A16\nCOLUMN profile        FORMAT A16\nSELECT username, account_status, profile\nFROM   dba_users\nWHERE  oracle_maintained = 'N'\nAND    account_status LIKE 'OPEN%'\nORDER  BY username;\n\nPROMPT\nPROMPT --- Cuentas abiertas con contraseña por defecto conocida\nCOLUMN username FORMAT A20\nSELECT d.username\nFROM   dba_users_with_defpwd d\n       JOIN dba_users u ON u.username = d.username\nWHERE  u.account_status LIKE 'OPEN%'\nORDER  BY d.username;\n\nPROMPT\nCOLUMN resultado FORMAT A60\nSELECT CASE WHEN COUNT(*) = 0\n            THEN 'RESULTADO PR-04: CUMPLE'\n            ELSE 'RESULTADO PR-04: NO CUMPLE (' || COUNT(*) || ' cuentas con clave por defecto)'\n       END AS resultado\nFROM   dba_users_with_defpwd d\n       JOIN dba_users u ON u.username = d.username\nWHERE  u.account_status LIKE 'OPEN%';\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v04_perfil_contrasenas.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v04_perfil_contrasenas.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v04_perfil_contrasenas.sql\n-- Contenedor: XEPDB1\n-- Pruebas  : PR-05 (perfil aplicado), PR-06 (rechazo de contraseña débil)\n-- Control  : ISO/IEC 27001:2022 A.5.17 (información de autenticación), A.8.5\n--\n-- PR-05: PERFIL_CLINICA define la política de contraseñas y está asignado a\n--        los usuarios nominales.\n-- PR-06: una contraseña débil (abc123) es rechazada por la función de\n--        verificación; se espera ORA-28003. El valor abc123 es un literal\n--        deliberadamente débil, no una credencial del proyecto.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v04_perfil_contrasenas.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v04_perfil_contrasenas PR-05,PR-06\n\nPROMPT\nPROMPT --- PR-05: límites de PERFIL_CLINICA\nCOLUMN resource_name FORMAT A26\nCOLUMN limit         FORMAT A30\nSELECT resource_name, limit\nFROM   dba_profiles\nWHERE  profile = 'PERFIL_CLINICA' AND resource_type = 'PASSWORD'\nORDER  BY resource_name;\n\nPROMPT\nPROMPT --- PR-05: usuarios con PERFIL_CLINICA\nCOLUMN username FORMAT A16\nCOLUMN profile  FORMAT A16\nCOLUMN account_status FORMAT A16\nSELECT username, profile, account_status\nFROM   dba_users\nWHERE  profile = 'PERFIL_CLINICA'\nORDER  BY username;\n\nPROMPT\nCOLUMN resultado FORMAT A70\nSELECT CASE WHEN COUNT(*) >= 6\n            AND MAX(CASE WHEN resource_name = 'PASSWORD_VERIFY_FUNCTION'\n                         THEN limit END) = 'ORA12C_STRONG_VERIFY_FUNCTION'\n            THEN 'RESULTADO PR-05: CUMPLE'\n            ELSE 'RESULTADO PR-05: NO CUMPLE'\n       END AS resultado\nFROM   dba_profiles\nWHERE  profile = 'PERFIL_CLINICA' AND resource_type = 'PASSWORD';\n\nPROMPT\nPROMPT --- PR-06: intento de fijar una contraseña débil a MED_ROJAS (se espera ORA-28003)\nSET SERVEROUTPUT ON\nDECLARE\nBEGIN\n  EXECUTE IMMEDIATE 'ALTER USER med_rojas IDENTIFIED BY abc123';\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-06: NO CUMPLE (se aceptó una contraseña débil)');\nEXCEPTION\n  WHEN OTHERS THEN\n    IF SQLCODE = -28003 THEN\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-06: CUMPLE (ORA-28003, contraseña rechazada)');\n    ELSE\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-06: NO CUMPLE (ORA' || SQLCODE || ')');\n    END IF;\nEND;\n/\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v05_revision_derechos.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v05_revision_derechos.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v05_revision_derechos.sql\n-- Contenedor: XEPDB1\n-- Prueba   : PR-07\n-- Control  : ISO/IEC 27001:2022 A.5.18 (derechos de acceso), A.8.2\n--\n-- PR-07: inventario de las cuentas no mantenidas por Oracle con estado,\n--        último acceso, perfil, roles y privilegios de sistema. CUMPLE si\n--        no hay cuentas abiertas sin acceso durante más de 90 días.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v05_revision_derechos.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v05_revision_derechos PR-07\n\nPROMPT\nPROMPT --- Inventario de cuentas (estado, último acceso, perfil, roles)\nCOLUMN username       FORMAT A14\nCOLUMN account_status FORMAT A16\nCOLUMN ultimo_acceso  FORMAT A20\nCOLUMN profile        FORMAT A16\nCOLUMN roles          FORMAT A40\nSELECT u.username,\n       u.account_status,\n       NVL(TO_CHAR(u.last_login, 'YYYY-MM-DD HH24:MI'), '(nunca)') AS ultimo_acceso,\n       u.profile,\n       NVL((SELECT LISTAGG(rp.granted_role, ', ') WITHIN GROUP (ORDER BY rp.granted_role)\n            FROM   dba_role_privs rp WHERE rp.grantee = u.username), '(ninguno)') AS roles\nFROM   dba_users u\nWHERE  u.oracle_maintained = 'N'\nORDER  BY u.username;\n\nPROMPT\nPROMPT --- Privilegios de sistema por cuenta no mantenida por Oracle\nCOLUMN privilegios FORMAT A50\nSELECT u.username,\n       NVL((SELECT LISTAGG(sp.privilege, ', ') WITHIN GROUP (ORDER BY sp.privilege)\n            FROM   dba_sys_privs sp WHERE sp.grantee = u.username), '(ninguno)') AS privilegios\nFROM   dba_users u\nWHERE  u.oracle_maintained = 'N'\nORDER  BY u.username;\n\nPROMPT\nCOLUMN resultado FORMAT A70\nSELECT CASE WHEN COUNT(*) = 0\n            THEN 'RESULTADO PR-07: CUMPLE'\n            ELSE 'RESULTADO PR-07: NO CUMPLE (' || COUNT(*) || ' cuentas inactivas > 90 días)'\n       END AS resultado\nFROM   dba_users\nWHERE  oracle_maintained = 'N'\nAND    account_status LIKE 'OPEN%'\nAND    last_login IS NOT NULL\nAND    last_login < SYSTIMESTAMP - INTERVAL '90' DAY;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v06_proteccion_registros.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v06_proteccion_registros.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v06_proteccion_registros.sql\n-- Contenedor: XEPDB1\n-- Pruebas  : PR-08 (la pista de auditoría no se puede alterar por DML),\n--            PR-09 (purga controlada que conserva los registros recientes)\n-- Control  : ISO/IEC 27001:2022 A.5.28 (protección de evidencia), A.8.15\n--\n-- PR-08: DELETE directo sobre AUDSYS.AUD$UNIFIED, como DBA_OPER y como SYS,\n--        debe ser rechazado (se espera ORA-46385). Se emite una línea de\n--        resultado por cada intento.\n-- PR-09: con la marca de archivado fijada a ayer, CLEAN_AUDIT_TRAIL con\n--        use_last_arch_timestamp=TRUE no elimina los registros de hoy, y la\n--        propia operación de DBMS_AUDIT_MGMT queda registrada.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v06_proteccion_registros.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v06_proteccion_registros PR-08,PR-09\n\nPROMPT\nPROMPT --- PR-08 (DBA_OPER): DELETE sobre AUDSYS.AUD$UNIFIED (se espera ORA-46385)\nCONNECT DBA_OPER/&pwd_dba_oper@//localhost:1521/&pdb_nombre\nSET SERVEROUTPUT ON\nDECLARE\nBEGIN\n  EXECUTE IMMEDIATE 'DELETE FROM audsys.aud$unified';\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (DBA_OPER): NO CUMPLE (se permitió el DELETE)');\nEXCEPTION\n  WHEN OTHERS THEN\n    -- ORA-46385: DML/DDL no permitido sobre la tabla de auditoría.\n    -- ORA-00942 / ORA-01031: DBA_OPER ni siquiera puede ver AUDSYS.AUD$UNIFIED\n    -- (AUDSYS está excluido de los privilegios ANY), lo que también impide el\n    -- borrado. Cualquiera de los tres confirma el control.\n    IF SQLCODE IN (-46385, -942, -1031) THEN\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (DBA_OPER): CUMPLE (ORA' || SQLCODE || ')');\n    ELSE\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (DBA_OPER): NO CUMPLE (ORA' || SQLCODE || ')');\n    END IF;\nEND;\n/\n\nPROMPT\nPROMPT --- PR-08 (SYS): DELETE sobre AUDSYS.AUD$UNIFIED (se espera ORA-46385)\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\nSET SERVEROUTPUT ON\nDECLARE\nBEGIN\n  EXECUTE IMMEDIATE 'DELETE FROM audsys.aud$unified';\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (SYS): NO CUMPLE (se permitió el DELETE)');\nEXCEPTION\n  WHEN OTHERS THEN\n    IF SQLCODE IN (-46385, -1031) THEN\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (SYS): CUMPLE (ORA' || SQLCODE || ')');\n    ELSE\n      DBMS_OUTPUT.PUT_LINE('RESULTADO PR-08 (SYS): NO CUMPLE (ORA' || SQLCODE || ')');\n    END IF;\nEND;\n/\n\nPROMPT\nPROMPT --- PR-09: purga controlada de la auditoría unificada (conserva lo de hoy)\nCOLUMN total_antes FORMAT 999999\nSELECT COUNT(*) AS total_antes FROM unified_audit_trail;\n\nDECLARE\n  v_hoy_antes NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_hoy_antes\n  FROM   unified_audit_trail\n  WHERE  event_timestamp >= TRUNC(SYSTIMESTAMP);\n\n  -- Marca como archivados los registros hasta ayer.\n  DBMS_AUDIT_MGMT.SET_LAST_ARCHIVE_TIMESTAMP(\n    audit_trail_type  => DBMS_AUDIT_MGMT.AUDIT_TRAIL_UNIFIED,\n    last_archive_time => SYSTIMESTAMP - INTERVAL '1' DAY);\n\n  -- Limpia solo lo archivado (anterior a ayer); no toca lo de hoy.\n  DBMS_AUDIT_MGMT.CLEAN_AUDIT_TRAIL(\n    audit_trail_type        => DBMS_AUDIT_MGMT.AUDIT_TRAIL_UNIFIED,\n    use_last_arch_timestamp => TRUE);\n\n  -- Vuelca a disco los registros aún en memoria.\n  DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;\n\n  DBMS_OUTPUT.PUT_LINE('Registros de hoy antes de limpiar: ' || v_hoy_antes);\nEND;\n/\n\nPROMPT\nPROMPT --- PR-09: registros de hoy que permanecen y evidencia de la operación\nCOLUMN hoy_despues FORMAT 999999\nSELECT COUNT(*) AS hoy_despues\nFROM   unified_audit_trail\nWHERE  event_timestamp >= TRUNC(SYSTIMESTAMP);\n\nCOLUMN evento FORMAT A40\nCOLUMN cuando FORMAT A20\nSELECT DISTINCT action_name AS evento,\n       TO_CHAR(MAX(event_timestamp) OVER (PARTITION BY action_name), 'YYYY-MM-DD HH24:MI') AS cuando\nFROM   unified_audit_trail\nWHERE  UPPER(object_name) = 'DBMS_AUDIT_MGMT'\nAND    event_timestamp >= TRUNC(SYSTIMESTAMP);\n\nPROMPT\nCOLUMN resultado FORMAT A70\nSELECT CASE\n         WHEN (SELECT COUNT(*) FROM unified_audit_trail\n               WHERE event_timestamp >= TRUNC(SYSTIMESTAMP)) > 0\n          AND (SELECT COUNT(*) FROM unified_audit_trail\n               WHERE UPPER(object_name) = 'DBMS_AUDIT_MGMT'\n               AND   event_timestamp >= TRUNC(SYSTIMESTAMP)) > 0\n         THEN 'RESULTADO PR-09: CUMPLE'\n         ELSE 'RESULTADO PR-09: NO CUMPLE'\n       END AS resultado\nFROM   dual;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v07_acceso_privilegiado.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v07_acceso_privilegiado.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v07_acceso_privilegiado.sql\n-- Contenedor: XEPDB1\n-- Pruebas  : PR-10 (inventario de acceso privilegiado), PR-11 (un rol\n--            administrativo acotado no da acceso a los datos)\n-- Control  : ISO/IEC 27001:2022 A.8.2 (acceso privilegiado), A.5.15\n--\n-- PR-10: beneficiarios del rol DBA, privilegios ANY otorgados directamente a\n--        cuentas no administrativas (debe ser 0) y titulares de privilegios\n--        administrativos en el archivo de contraseñas.\n-- PR-11: DBA_OPER conectado AS SYSBACKUP no puede leer CLINICA.CONSULTAS.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v07_acceso_privilegiado.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v07_acceso_privilegiado PR-10,PR-11\n\nPROMPT\nPROMPT --- PR-10: beneficiarios del rol DBA\nCOLUMN grantee FORMAT A20\nCOLUMN admin_option FORMAT A12\nSELECT grantee, admin_option\nFROM   dba_role_privs\nWHERE  granted_role = 'DBA'\nORDER  BY grantee;\n\nPROMPT\nPROMPT --- PR-10: privilegios ANY otorgados directamente a cuentas no administrativas\nCOLUMN grantee   FORMAT A16\nCOLUMN privilege FORMAT A30\nSELECT grantee, privilege\nFROM   dba_sys_privs\nWHERE  privilege LIKE '%ANY%'\nAND    grantee IN (SELECT username FROM dba_users WHERE oracle_maintained = 'N')\nORDER  BY grantee, privilege;\n\nPROMPT\nPROMPT --- PR-10: titulares de privilegios administrativos (archivo de contraseñas)\nCOLUMN username FORMAT A16\nSELECT username, sysdba, sysbackup, syskm\nFROM   v$pwfile_users\nWHERE  username NOT IN ('SYS')\nORDER  BY username;\n\nPROMPT\nCOLUMN resultado FORMAT A70\nSELECT CASE WHEN COUNT(*) = 0\n            THEN 'RESULTADO PR-10: CUMPLE'\n            ELSE 'RESULTADO PR-10: NO CUMPLE (' || COUNT(*) || ' privilegios ANY directos)'\n       END AS resultado\nFROM   dba_sys_privs\nWHERE  privilege LIKE '%ANY%'\nAND    grantee IN (SELECT username FROM dba_users WHERE oracle_maintained = 'N');\n\nPROMPT\nPROMPT --- PR-11: DBA_OPER AS SYSBACKUP intenta leer CLINICA.CONSULTAS (debe fallar)\nCONNECT DBA_OPER/&pwd_dba_oper@//localhost:1521/&pdb_nombre AS SYSBACKUP\nSET SERVEROUTPUT ON\nDECLARE\n  v_n NUMBER;\nBEGIN\n  EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM clinica.consultas' INTO v_n;\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-11: NO CUMPLE (acceso permitido, ' || v_n || ' filas)');\nEXCEPTION\n  WHEN OTHERS THEN\n    IF SQLCODE IN (-942, -1031)\n    THEN DBMS_OUTPUT.PUT_LINE('RESULTADO PR-11: CUMPLE (ORA' || SQLCODE || ')');\n    ELSE DBMS_OUTPUT.PUT_LINE('RESULTADO PR-11: NO CUMPLE (ORA' || SQLCODE || ')');\n    END IF;\nEND;\n/\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v08_vpd.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v08_vpd.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v08_vpd.sql\n-- Contenedor: XEPDB1\n-- Prueba   : PR-12\n-- Control  : ISO/IEC 27001:2022 A.8.3 (restricción del acceso)\n--\n-- PR-12: la política VPD limita CONSULTAS a cada médico. Se espera que\n--        MED_ROJAS vea 18 filas, MED_MORA 12 y SYS (exento) 30. Se emite una\n--        línea de resultado por cada sesión y se lista la política.\n--        Conexiones de los médicos por TCP.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v08_vpd.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v08_vpd PR-12\n\nPROMPT\nPROMPT --- Política VPD sobre CLINICA.CONSULTAS\nCOLUMN object_name FORMAT A12\nCOLUMN policy_name FORMAT A20\nCOLUMN function    FORMAT A18\nCOLUMN enable      FORMAT A6\nSELECT object_name, policy_name, function, enable\nFROM   dba_policies\nWHERE  object_owner = 'CLINICA' AND object_name = 'CONSULTAS';\n\nPROMPT\nPROMPT --- Distribución real de CONSULTAS por médico (referencia)\nCOLUMN usuario_bd FORMAT A12\nCOLUMN filas      FORMAT 9999\nSELECT m.usuario_bd, COUNT(*) AS filas\nFROM   clinica.consultas c JOIN clinica.medicos m ON m.id = c.medico_id\nGROUP  BY m.usuario_bd ORDER BY m.usuario_bd;\n\nPROMPT\nPROMPT --- PR-12 (SYS, exento de VPD): se esperan 30 filas\nSET SERVEROUTPUT ON\nDECLARE\n  v_n NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_n FROM clinica.consultas;\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-12 (SYS): '\n    || CASE WHEN v_n = 30 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (' || v_n || ' filas)');\nEND;\n/\n\nPROMPT\nPROMPT --- PR-12 (MED_ROJAS, por TCP): se esperan 18 filas\nCONNECT MED_ROJAS/&pwd_med_rojas@//localhost:1521/&pdb_nombre\nSET SERVEROUTPUT ON\nDECLARE\n  v_n NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_n FROM clinica.consultas;\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-12 (MED_ROJAS): '\n    || CASE WHEN v_n = 18 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (' || v_n || ' filas)');\nEND;\n/\n\nPROMPT\nPROMPT --- PR-12 (MED_MORA, por TCP): se esperan 12 filas\nCONNECT MED_MORA/&pwd_med_mora@//localhost:1521/&pdb_nombre\nSET SERVEROUTPUT ON\nDECLARE\n  v_n NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_n FROM clinica.consultas;\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-12 (MED_MORA): '\n    || CASE WHEN v_n = 12 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (' || v_n || ' filas)');\nEND;\n/\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v09_autenticacion_segura.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v09_autenticacion_segura.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v09_autenticacion_segura.sql\n-- Contenedor: XEPDB1\n-- Pruebas  : PR-13 (bloqueo por intentos fallidos), PR-14 (auditoría de\n--            fallos y verificadores 12C)\n-- Control  : ISO/IEC 27001:2022 A.8.5 (autenticación segura), A.5.17, A.8.15\n--\n-- PR-13: tras varios intentos con contraseña errónea, MED_MORA queda en\n--        estado LOCKED(TIMED) (FAILED_LOGIN_ATTEMPTS = 5).\n-- PR-14: los intentos fallidos quedan registrados (return_code 1017) y los\n--        seis usuarios de prueba solo tienen verificador de contraseña 12C.\n-- Al final se desbloquea MED_MORA para dejar el entorno limpio.\n-- La contraseña 'clave_incorrecta' es un valor erróneo a propósito.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v09_autenticacion_segura.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v09_autenticacion_segura PR-13,PR-14\n\nPROMPT\nPROMPT --- PR-13: 6 intentos de conexión de MED_MORA con contraseña errónea\nCONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre\nCONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre\nCONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre\nCONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre\nCONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre\nCONNECT MED_MORA/clave_incorrecta@//localhost:1521/&pdb_nombre\n\nPROMPT\nPROMPT --- PR-13: estado de la cuenta MED_MORA tras los intentos\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\nCOLUMN username       FORMAT A12\nCOLUMN account_status FORMAT A16\nSELECT username, account_status FROM dba_users WHERE username = 'MED_MORA';\n\nCOLUMN resultado FORMAT A60\nSELECT CASE WHEN account_status = 'LOCKED(TIMED)'\n            THEN 'RESULTADO PR-13: CUMPLE (' || account_status || ')'\n            ELSE 'RESULTADO PR-13: NO CUMPLE (' || account_status || ')'\n       END AS resultado\nFROM   dba_users WHERE username = 'MED_MORA';\n\nPROMPT\nPROMPT --- PR-14: registro de los intentos fallidos (return_code 1017)\nEXEC DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;\n\nCOLUMN intentos_fallidos FORMAT 999999\nSELECT COUNT(*) AS intentos_fallidos\nFROM   unified_audit_trail\nWHERE  dbusername = 'MED_MORA' AND return_code = 1017\nAND    event_timestamp >= TRUNC(SYSTIMESTAMP);\n\nPROMPT\nPROMPT --- PR-14: verificadores de contraseña de los usuarios de prueba (solo 12C)\nCOLUMN username          FORMAT A14\nCOLUMN password_versions FORMAT A18\nSELECT username, password_versions\nFROM   dba_users\nWHERE  username IN ('MED_ROJAS','MED_MORA','RECEP_SOLIS','AUD_VEGA','DEV_CALVO','DBA_OPER')\nORDER  BY username;\n\nPROMPT\nSELECT CASE\n         WHEN (SELECT COUNT(*) FROM unified_audit_trail\n               WHERE dbusername = 'MED_MORA' AND return_code = 1017\n               AND   event_timestamp >= TRUNC(SYSTIMESTAMP)) >= 5\n          AND (SELECT COUNT(*) FROM dba_users\n               WHERE username IN ('MED_ROJAS','MED_MORA','RECEP_SOLIS','AUD_VEGA','DEV_CALVO','DBA_OPER')\n               AND   RTRIM(password_versions) <> '12C') = 0\n         THEN 'RESULTADO PR-14: CUMPLE'\n         ELSE 'RESULTADO PR-14: NO CUMPLE'\n       END AS resultado\nFROM   dual;\n\nPROMPT\nPROMPT --- Limpieza: desbloqueo de MED_MORA\nALTER USER med_mora ACCOUNT UNLOCK;\nSELECT username, account_status FROM dba_users WHERE username = 'MED_MORA';\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v10_eliminacion.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v10_eliminacion.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v10_eliminacion.sql\n-- Contenedor: XEPDB1\n-- Prueba   : PR-15 (eliminación segura de objetos; papelera vacía)\n-- Control  : ISO/IEC 27001:2022 A.8.10 (borrado de información)\n--\n-- PR-15: se crea y elimina una tabla temporal y se vacía la papelera de\n--        reciclaje; dba_recyclebin debe quedar en 0. El borrado obsoleto de\n--        respaldos (PR-16) se prueba en v10_obsoletos.rman.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v10_eliminacion.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v10_eliminacion PR-15\n\nPROMPT\nPROMPT --- Creación y borrado de CLINICA.TMP_BORRAR\nCREATE TABLE clinica.tmp_borrar (id NUMBER, dato VARCHAR2(30)) TABLESPACE clinica_data;\nINSERT INTO clinica.tmp_borrar VALUES (1, 'dato de prueba');\nCOMMIT;\nDROP TABLE clinica.tmp_borrar;\n\nPROMPT\nPROMPT --- Objetos de CLINICA en la papelera antes de purgar\nCOLUMN owner FORMAT A10\nCOLUMN original_name FORMAT A20\nSELECT owner, original_name, type\nFROM   dba_recyclebin\nWHERE  owner = 'CLINICA';\n\nPROMPT\nPROMPT --- Purga de la papelera\nPURGE DBA_RECYCLEBIN;\n\nPROMPT\nCOLUMN total_papelera FORMAT 999999\nSELECT COUNT(*) AS total_papelera FROM dba_recyclebin;\n\nPROMPT\nCOLUMN resultado FORMAT A60\nSELECT CASE WHEN COUNT(*) = 0\n            THEN 'RESULTADO PR-15: CUMPLE'\n            ELSE 'RESULTADO PR-15: NO CUMPLE (' || COUNT(*) || ' objetos en papelera)'\n       END AS resultado\nFROM   dba_recyclebin;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v10_obsoletos.rman",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v10_obsoletos.rman",
      "ext": "rman",
      "lenguaje": "sql",
      "contenido": "################################################################################\n# Script   : sql/02_verificacion/v10_obsoletos.rman\n# Prueba   : PR-16 (eliminación de respaldos obsoletos)\n# Control  : ISO/IEC 27001:2022 A.8.10 (borrado de información), A.8.13\n#\n# Con RETENTION POLICY REDUNDANCY 1, un segundo respaldo de XEPDB1 deja al\n# primero obsoleto. DELETE NOPROMPT OBSOLETE lo elimina y REPORT OBSOLETE no\n# debe listar respaldos obsoletos (lo valida ejecutar_todo.sh).\n#\n# Ejecución: rman target / cmdfile=sql/02_verificacion/v10_obsoletos.rman\n#            log=evidencias/v10_obsoletos.txt\n################################################################################\nSHOW RETENTION POLICY;\nBACKUP PLUGGABLE DATABASE XEPDB1 TAG 'V10_XEPDB1_SEGUNDO';\nDELETE NOPROMPT OBSOLETE;\nREPORT OBSOLETE;\n"
    },
    {
      "ruta": "sql/02_verificacion/v11_enmascaramiento.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v11_enmascaramiento.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v11_enmascaramiento.sql\n-- Contenedor: XEPDB1\n-- Pruebas  : PR-17 (redacción dinámica para recepción), PR-18 (políticas de\n--            redacción definidas), PR-19 (enmascaramiento estático del clon)\n-- Control  : ISO/IEC 27001:2022 A.8.11 (enmascaramiento de datos)\n--\n-- PR-17: RECEP_SOLIS ve la cédula como X-XXXX-NNNN y el teléfono como\n--        XXXX-NNNN (Data Redaction). Conexión por TCP.\n-- PR-18: existen las políticas y columnas de redacción y se listan los\n--        titulares de EXEMPT REDACTION POLICY (directos y por rol).\n-- PR-19: ninguna cédula del clon CLINICA_DEV coincide con una real de CLINICA.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v11_enmascaramiento.txt\n\nPROMPT\nPROMPT --- PR-17: RECEP_SOLIS consulta cédula y teléfono (deben verse redactados)\nCONNECT RECEP_SOLIS/&pwd_recep_solis@//localhost:1521/&pdb_nombre\n@sql/02_verificacion/comun/cabecera.sql v11_enmascaramiento PR-17,PR-18,PR-19\n\nCOLUMN cedula   FORMAT A12\nCOLUMN telefono FORMAT A10\nSELECT cedula, telefono\nFROM   clinica.pacientes\nORDER  BY id\nFETCH FIRST 5 ROWS ONLY;\n\nSET SERVEROUTPUT ON\nDECLARE\n  v_ok  NUMBER := 0;\n  v_tot NUMBER := 0;\nBEGIN\n  FOR r IN (SELECT cedula, telefono FROM clinica.pacientes ORDER BY id FETCH FIRST 5 ROWS ONLY) LOOP\n    v_tot := v_tot + 1;\n    IF REGEXP_LIKE(r.cedula, '^X-XXXX-[0-9]{4}$')\n       AND REGEXP_LIKE(r.telefono, '^XXXX-[0-9]{4}$') THEN\n      v_ok := v_ok + 1;\n    END IF;\n  END LOOP;\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-17: '\n    || CASE WHEN v_ok = v_tot AND v_tot = 5 THEN 'CUMPLE' ELSE 'NO CUMPLE' END\n    || ' (' || v_ok || '/' || v_tot || ' filas redactadas)');\nEND;\n/\n\nPROMPT\nPROMPT --- PR-18: políticas y columnas de Data Redaction\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\nCOLUMN object_name FORMAT A12\nCOLUMN policy_name FORMAT A20\nCOLUMN column_name FORMAT A12\nCOLUMN function_type FORMAT A20\nSELECT c.object_name, c.policy_name, c.column_name, c.function_type\nFROM   redaction_columns c\nWHERE  c.object_owner = 'CLINICA'\nORDER  BY c.object_name, c.column_name;\n\nPROMPT\nPROMPT --- PR-18: titulares de EXEMPT REDACTION POLICY (directo y por rol)\nCOLUMN grantee FORMAT A22\nCOLUMN via     FORMAT A22\nSELECT grantee, 'DIRECTO' AS via\nFROM   dba_sys_privs WHERE privilege = 'EXEMPT REDACTION POLICY'\nUNION\nSELECT rp.grantee, 'VIA ' || sp.grantee\nFROM   dba_sys_privs sp\n       JOIN dba_role_privs rp ON rp.granted_role = sp.grantee\nWHERE  sp.privilege = 'EXEMPT REDACTION POLICY'\nORDER  BY 1;\n\nPROMPT\nCOLUMN resultado FORMAT A60\nSELECT CASE WHEN COUNT(*) = 4\n            THEN 'RESULTADO PR-18: CUMPLE'\n            ELSE 'RESULTADO PR-18: NO CUMPLE (' || COUNT(*) || ' columnas redactadas, se esperan 4)'\n       END AS resultado\nFROM   redaction_columns\nWHERE  object_owner = 'CLINICA';\n\nPROMPT\nPROMPT --- PR-19: cruce de cédulas entre el clon y el origen (debe ser 0)\nCOLUMN coincidencias FORMAT 999999\nSELECT COUNT(*) AS coincidencias\nFROM   clinica_dev.pacientes d\n       JOIN clinica.pacientes p ON p.cedula = d.cedula;\n\nPROMPT\nSELECT CASE WHEN COUNT(*) = 0\n            THEN 'RESULTADO PR-19: CUMPLE'\n            ELSE 'RESULTADO PR-19: NO CUMPLE (' || COUNT(*) || ' cédulas coinciden)'\n       END AS resultado\nFROM   clinica_dev.pacientes d\n       JOIN clinica.pacientes p ON p.cedula = d.cedula;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v12_expdp.sh",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v12_expdp.sh",
      "ext": "sh",
      "lenguaje": "bash",
      "contenido": "#!/usr/bin/env bash\n################################################################################\n# Script   : sql/02_verificacion/v12_expdp.sh\n# Prueba   : PR-21 (exportación de datos cifrada)\n# Control  : ISO/IEC 27001:2022 A.8.12 (prevención de fuga), A.8.10 (borrado)\n#\n# Exporta el esquema CLINICA con Data Pump cifrado (ENCRYPTION=ALL,\n# ENCRYPTION_MODE=TRANSPARENT) y comprueba con grep que un nombre real NO\n# aparece en el .dmp. Si el cifrado de Data Pump no está disponible en XE, se\n# documenta el error, se exporta sin cifrar y se demuestra la fuga (el nombre\n# SÍ aparece). En ambos casos el .dmp y su log se borran al final (A.8.10).\n#\n# Ejecución: bash sql/02_verificacion/v12_expdp.sh\n# La contraseña se lee de config_local.sql y no se imprime ni se guarda.\n################################################################################\nset -uo pipefail\nexport MSYS_NO_PATHCONV=1 NLS_LANG=AMERICAN_AMERICA.AL32UTF8\n\nEVID=\"evidencias/v12_expdp.txt\"\nNOMBRE_REAL=\"Solano Vargas\"     # apellido del paciente 1 de CLINICA\ncfg(){ sed -nE \"s/^DEFINE[[:space:]]+$1[[:space:]]*=[[:space:]]*\\\"?([^\\\"]*)\\\"?[[:space:]]*\\$/\\1/p\" sql/config_local.sql | tr -d '\\r'; }\nPDB=$(cfg pdb_nombre)\nPWD_DBA=$(cfg pwd_dba_oper)\n\n# Ruta física de DATA_PUMP_DIR (específica de la PDB).\nDPDIR_WIN=$(printf 'set head off pages 0 feedback off trimspool on\\nalter session set container=%s;\\nselect directory_path from dba_directories where directory_name='\\''DATA_PUMP_DIR'\\'';\\nexit\\n' \"$PDB\" \\\n  | sqlplus -S -L \"/ as sysdba\" | tr -d '\\r' | sed '/^$/d' | tail -1)\nDPDIR=$(cygpath -u \"$(echo \"$DPDIR_WIN\" | sed 's#\\\\\\\\#/#g; s#\\\\#/#g')\")\n\nSTAMP=$(date +%Y%m%d_%H%M%S)\nDMP=\"expfuga_${STAMP}.dmp\"\nLOGF=\"expfuga_${STAMP}.log\"\n\n{\n  echo \"================================================================================\"\n  echo \" VERIFICACIÓN - v12_expdp (PR-21)\"\n  echo \" Marco ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c\"\n  echo \"================================================================================\"\n  echo \"Fecha y hora   : $(date '+%Y-%m-%d %H:%M:%S %z')\"\n  echo \"DATA_PUMP_DIR  : $DPDIR_WIN\"\n  echo \"Esquema        : CLINICA   Dumpfile: $DMP\"\n  echo\n\n  # 1. Exportación cifrada (modo transparente: usa el keystore TDE).\n  echo \"--- 1. EXPORTACIÓN CIFRADA (ENCRYPTION=ALL, ENCRYPTION_MODE=TRANSPARENT)\"\n  # La salida de expdp no contiene la contraseña, por lo que se muestra tal cual.\n  CIFRADO=\"SI\"\n  expdp \"DBA_OPER/${PWD_DBA}@//localhost:1521/${PDB}\" \\\n        schemas=CLINICA directory=DATA_PUMP_DIR dumpfile=\"$DMP\" logfile=\"$LOGF\" \\\n        encryption=all encryption_mode=transparent reuse_dumpfiles=yes \\\n        > \"$DPDIR/expdp_out.tmp\" 2>&1\n  RC=$?\n  grep -iE 'Export:|ORA-|UDE-|LRM-|completed|elapsed' \"$DPDIR/expdp_out.tmp\" | sed 's/^/  /'\n  rm -f \"$DPDIR/expdp_out.tmp\"\n\n  if [ $RC -ne 0 ] || [ ! -f \"$DPDIR/$DMP\" ]; then\n    echo\n    echo \"  El cifrado de Data Pump no se completó (código $RC). Se documenta como\"\n    echo \"  desviación y se repite la exportación SIN cifrado para evidenciar la fuga.\"\n    CIFRADO=\"NO\"\n    expdp \"DBA_OPER/${PWD_DBA}@//localhost:1521/${PDB}\" \\\n          schemas=CLINICA directory=DATA_PUMP_DIR dumpfile=\"$DMP\" logfile=\"$LOGF\" \\\n          reuse_dumpfiles=yes > \"$DPDIR/expdp_out.tmp\" 2>&1\n    grep -iE 'Export:|ORA-|UDE-|completed|elapsed' \"$DPDIR/expdp_out.tmp\" | sed 's/^/  /'\n    rm -f \"$DPDIR/expdp_out.tmp\"\n  fi\n  echo\n\n  # 2. Búsqueda del nombre real dentro del .dmp.\n  echo \"--- 2. BÚSQUEDA DE UN NOMBRE REAL EN EL DUMP (grep -a -c \\\"$NOMBRE_REAL\\\")\"\n  if [ -f \"$DPDIR/$DMP\" ]; then\n    COINC=$(grep -a -c -- \"$NOMBRE_REAL\" \"$DPDIR/$DMP\" 2>/dev/null); [ -z \"$COINC\" ] && COINC=0\n  else\n    COINC=\"(sin dump)\"\n  fi\n  echo \"  Coincidencias: $COINC\"\n  echo\n\n  # 3. Registro de la exportación en la auditoría unificada.\n  echo \"--- 3. AUDITORÍA DE LA EXPORTACIÓN (audit_type Datapump)\"\n  printf 'set head on pages 50 lines 160 feedback off\\nalter session set container=%s;\\nexec dbms_audit_mgmt.flush_unified_audit_trail;\\ncol action_name for a16\\ncol dbusername for a12\\ncol cuando for a20\\nselect dbusername, action_name, to_char(event_timestamp,'\\''YYYY-MM-DD HH24:MI:SS'\\'') cuando from unified_audit_trail where audit_type='\\''Datapump'\\'' and event_timestamp>=trunc(systimestamp) order by event_timestamp;\\nexit\\n' \"$PDB\" \\\n    | sqlplus -S -L \"/ as sysdba\" | tr -d '\\r' | grep -vE '^\\s*$' | sed 's/^/  /'\n  echo\n\n  # 4. Veredicto.\n  echo \"--- 4. RESULTADO\"\n  if [ \"$CIFRADO\" = \"SI\" ] && [ \"$COINC\" = \"0\" ]; then\n    echo \"RESULTADO PR-21: CUMPLE (export cifrado; el nombre real no aparece)\"\n  elif [ \"$CIFRADO\" = \"NO\" ]; then\n    echo \"RESULTADO PR-21: NO CUMPLE (cifrado de Data Pump no disponible en XE; el export\"\n    echo \"  sin cifrar expone el nombre real: $COINC coincidencias). Hallazgo de fuga.\"\n  else\n    echo \"RESULTADO PR-21: NO CUMPLE (export cifrado pero se hallaron $COINC coincidencias)\"\n  fi\n\n  # 5. Borrado seguro del dump y su log (A.8.10).\n  rm -f \"$DPDIR/$DMP\" \"$DPDIR/$LOGF\"\n  echo\n  echo \"--- 5. LIMPIEZA: dump y log eliminados de DATA_PUMP_DIR\"\n} | tee \"$EVID\"\n"
    },
    {
      "ruta": "sql/02_verificacion/v12_fuga_datos.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v12_fuga_datos.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v12_fuga_datos.sql\n-- Contenedor: XEPDB1\n-- Prueba   : PR-20 (superficie de fuga de datos)\n-- Control  : ISO/IEC 27001:2022 A.8.12 (prevención de fuga de datos)\n--\n-- PR-20: inventario de vías de salida de datos: beneficiarios de los roles\n--        de Data Pump, enlaces de base de datos (deben ser 0) y privilegios\n--        sobre directorios. La exportación cifrada se prueba en v12_expdp.sh.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v12_fuga_datos.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v12_fuga_datos PR-20\n\nPROMPT\nPROMPT --- Beneficiarios de roles de Data Pump\nCOLUMN grantee      FORMAT A20\nCOLUMN granted_role FORMAT A32\nSELECT grantee, granted_role\nFROM   dba_role_privs\nWHERE  granted_role LIKE '%DATAPUMP%'\nORDER  BY granted_role, grantee;\n\nPROMPT\nPROMPT --- Enlaces de base de datos (se excluye el interno DBMS_CLRDBLINK de Oracle)\nCOLUMN db_link FORMAT A20\nCOLUMN host    FORMAT A20\nCOLUMN nota    FORMAT A28\nSELECT owner, db_link, host,\n       CASE WHEN db_link = 'DBMS_CLRDBLINK' THEN 'interno de Oracle (extproc CLR)'\n            ELSE 'definido por el usuario' END AS nota\nFROM   dba_db_links ORDER BY owner, db_link;\n\nPROMPT\nPROMPT --- Privilegios sobre directorios\nCOLUMN grantee   FORMAT A18\nCOLUMN directorio FORMAT A20\nCOLUMN privilege FORMAT A10\nSELECT p.grantee, p.table_name AS directorio, p.privilege\nFROM   dba_tab_privs p\nWHERE  p.type = 'DIRECTORY'\nAND    p.grantee IN (SELECT username FROM dba_users WHERE oracle_maintained = 'N')\nORDER  BY p.grantee, p.table_name;\n\nPROMPT\nCOLUMN resultado FORMAT A70\nSELECT CASE WHEN (SELECT COUNT(*) FROM dba_db_links WHERE db_link <> 'DBMS_CLRDBLINK') = 0\n            THEN 'RESULTADO PR-20: CUMPLE (sin enlaces definidos por el usuario)'\n            ELSE 'RESULTADO PR-20: NO CUMPLE ('\n                 || (SELECT COUNT(*) FROM dba_db_links WHERE db_link <> 'DBMS_CLRDBLINK')\n                 || ' enlaces de usuario)'\n       END AS resultado\nFROM   dual;\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v13_respaldos.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v13_respaldos.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v13_respaldos.sql\n-- Contenedor: CDB$ROOT (conexión local SYSDBA)\n-- Prueba   : PR-22 (respaldos cifrados y restaurables)\n-- Control  : ISO/IEC 27001:2022 A.8.13 (respaldo), A.8.24 (criptografía)\n--\n-- PR-22 (parte cifrado): la configuración de RMAN tiene el cifrado activado y\n--        todas las piezas de respaldo de XEPDB1 (con_id 3) están cifradas.\n--        La validación de restauración se prueba en v13_validar.rman y la\n--        evalúa ejecutar_todo.sh (parte restore validate).\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v13_respaldos.txt\n\nCONNECT / AS SYSDBA\n@sql/02_verificacion/comun/cabecera.sql v13_respaldos PR-22\n\nPROMPT\nPROMPT --- Configuración de cifrado de RMAN\nCOLUMN name  FORMAT A40\nCOLUMN value FORMAT A30\nSELECT name, value\nFROM   v$rman_configuration\nWHERE  name LIKE '%ENCRYPTION%' OR name LIKE '%RETENTION%'\nORDER  BY name;\n\nPROMPT\nPROMPT --- Piezas de respaldo de XEPDB1 (con_id 3) y su estado de cifrado\nCOLUMN tag       FORMAT A22\nCOLUMN encrypted FORMAT A9\nCOLUMN fin       FORMAT A17\nCOLUMN handle    FORMAT A60\nSELECT bs.tag, p.encrypted,\n       TO_CHAR(p.completion_time, 'YYYY-MM-DD HH24:MI') AS fin,\n       SUBSTR(p.handle, -55) AS handle\nFROM   v$backup_piece p\n       JOIN v$backup_set bs ON bs.set_stamp = p.set_stamp AND bs.set_count = p.set_count\nWHERE  p.status = 'A'\nAND    EXISTS (SELECT 1 FROM v$backup_datafile d\n               WHERE d.set_stamp = p.set_stamp AND d.set_count = p.set_count\n               AND   d.con_id = 3)\nORDER  BY p.completion_time;\n\nPROMPT\nCOLUMN resultado FORMAT A70\nSELECT CASE WHEN COUNT(*) > 0 AND SUM(CASE WHEN p.encrypted = 'YES' THEN 0 ELSE 1 END) = 0\n            THEN 'RESULTADO PR-22 (cifrado): CUMPLE (' || COUNT(*) || ' piezas, todas cifradas)'\n            ELSE 'RESULTADO PR-22 (cifrado): NO CUMPLE'\n       END AS resultado\nFROM   v$backup_piece p\nWHERE  p.status = 'A'\nAND    EXISTS (SELECT 1 FROM v$backup_datafile d\n               WHERE d.set_stamp = p.set_stamp AND d.set_count = p.set_count\n               AND   d.con_id = 3);\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v13_validar.rman",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v13_validar.rman",
      "ext": "rman",
      "lenguaje": "sql",
      "contenido": "################################################################################\n# Script   : sql/02_verificacion/v13_validar.rman\n# Prueba   : PR-22 (parte restore validate)\n# Control  : ISO/IEC 27001:2022 A.8.13 (respaldo)\n#\n# Valida que XEPDB1 se puede restaurar a partir de los respaldos cifrados,\n# sin modificar la base (VALIDATE no restaura). El keystore AUTO_LOGIN debe\n# estar abierto para descifrar las piezas.\n#\n# Ejecución: rman target / cmdfile=sql/02_verificacion/v13_validar.rman\n#            log=evidencias/v13_validar.txt\n################################################################################\nRESTORE PLUGGABLE DATABASE XEPDB1 VALIDATE;\n"
    },
    {
      "ruta": "sql/02_verificacion/v14_auditoria.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v14_auditoria.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v14_auditoria.sql\n-- Contenedor: XEPDB1\n-- Prueba   : PR-23 (trazabilidad del acceso a datos sensibles)\n-- Control  : ISO/IEC 27001:2022 A.8.15 (registro), A.8.16 (seguimiento)\n--\n-- PR-23: un acceso de MED_ROJAS a CLINICA.CONSULTAS queda registrado en la\n--        auditoría unificada y el rol auditor (AUD_VEGA) puede consultarlo\n--        sin privilegios sobre los datos. Conexiones por TCP.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v14_auditoria.txt\n\nPROMPT\nPROMPT --- PR-23: MED_ROJAS accede a CLINICA.CONSULTAS (acción a auditar)\nCONNECT MED_ROJAS/&pwd_med_rojas@//localhost:1521/&pdb_nombre\n@sql/02_verificacion/comun/cabecera.sql v14_auditoria PR-23\nSELECT COUNT(*) AS filas_vistas FROM clinica.consultas;\n\nPROMPT\nPROMPT --- Volcado de la auditoría a disco (como SYS)\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\nEXEC DBMS_AUDIT_MGMT.FLUSH_UNIFIED_AUDIT_TRAIL;\n\nPROMPT\nPROMPT --- PR-23: el auditor AUD_VEGA consulta el registro del acceso de MED_ROJAS\nCONNECT AUD_VEGA/&pwd_aud_vega@//localhost:1521/&pdb_nombre\nCOLUMN dbusername  FORMAT A12\nCOLUMN object_name FORMAT A12\nCOLUMN action_name FORMAT A10\nCOLUMN cuando      FORMAT A20\nSELECT dbusername, object_name, action_name,\n       TO_CHAR(event_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS cuando\nFROM   unified_audit_trail\nWHERE  dbusername = 'MED_ROJAS'\nAND    object_schema = 'CLINICA' AND object_name = 'CONSULTAS'\nAND    event_timestamp >= TRUNC(SYSTIMESTAMP)\nORDER  BY event_timestamp;\n\nPROMPT\nPROMPT --- Políticas de auditoría habilitadas (vista del auditor)\nCOLUMN policy_name    FORMAT A26\nCOLUMN enabled_option FORMAT A14\nCOLUMN entity_name    FORMAT A12\nSELECT policy_name, enabled_option, entity_name\nFROM   audit_unified_enabled_policies\nORDER  BY policy_name, entity_name;\n\nPROMPT\nSET SERVEROUTPUT ON\nDECLARE\n  v_n NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_n\n  FROM   unified_audit_trail\n  WHERE  dbusername = 'MED_ROJAS'\n  AND    object_schema = 'CLINICA' AND object_name = 'CONSULTAS'\n  AND    event_timestamp >= TRUNC(SYSTIMESTAMP);\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-23: '\n    || CASE WHEN v_n > 0 THEN 'CUMPLE' ELSE 'NO CUMPLE' END\n    || ' (' || v_n || ' registros del acceso de MED_ROJAS)');\nEND;\n/\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v15_red.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v15_red.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v15_red.sql\n-- Contenedor: XEPDB1\n-- Pruebas  : PR-24 (cifrado de red AES256), PR-25 (integridad de red SHA256)\n-- Control  : ISO/IEC 27001:2022 A.8.20 (seguridad de redes), A.8.24\n--\n-- Se ejecuta DESPUÉS de que ejecutar_todo.sh escriba, al inicio de\n-- evidencias/v15_red.txt, las líneas relevantes del sqlnet.ora del servidor;\n-- por eso este script hace SPOOL en modo APPEND.\n-- PR-24/PR-25: una sesión por TCP (DBA_OPER) debe mostrar en\n-- v$session_connect_info el adaptador de cifrado AES256 y el de integridad\n-- SHA256.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v15_red.txt APPEND\n\nCONNECT DBA_OPER/&pwd_dba_oper@//localhost:1521/&pdb_nombre\n@sql/02_verificacion/comun/cabecera.sql v15_red PR-24,PR-25\n\nPROMPT\nPROMPT --- Adaptadores de servicio de red de la sesión TCP actual\nCOLUMN network_service_banner FORMAT A90\nSELECT network_service_banner\nFROM   v$session_connect_info\nWHERE  sid = SYS_CONTEXT('USERENV', 'SID')\nORDER  BY network_service_banner;\n\nPROMPT\nSET SERVEROUTPUT ON\nDECLARE\n  v_aes NUMBER;\n  v_sha NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_aes FROM v$session_connect_info\n   WHERE sid = SYS_CONTEXT('USERENV','SID')\n   AND   network_service_banner LIKE '%AES256%Encryption%';\n  SELECT COUNT(*) INTO v_sha FROM v$session_connect_info\n   WHERE sid = SYS_CONTEXT('USERENV','SID')\n   AND   network_service_banner LIKE '%SHA256%Crypto-checksumming%';\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-24: '\n    || CASE WHEN v_aes > 0 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (cifrado AES256)');\n  DBMS_OUTPUT.PUT_LINE('RESULTADO PR-25: '\n    || CASE WHEN v_sha > 0 THEN 'CUMPLE' ELSE 'NO CUMPLE' END || ' (integridad SHA256)');\nEND;\n/\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v16_busqueda_texto.sh",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v16_busqueda_texto.sh",
      "ext": "sh",
      "lenguaje": "bash",
      "contenido": "#!/usr/bin/env bash\n################################################################################\n# Script   : sql/02_verificacion/v16_busqueda_texto.sh\n# Prueba   : PR-26 (parte de texto plano en disco)\n# Control  : ISO/IEC 27001:2022 A.8.24 (uso de criptografía)\n#\n# Busca un nombre real en el datafile de CLINICA_DATA (cifrado: se espera 0) y\n# en el de TS_CONTROL_PLANO (sin cifrar: se espera > 0). Como Windows mantiene\n# abiertos los datafiles, si no se pueden leer directamente se hace una copia\n# imagen con RMAN (BACKUP AS COPY) fuera del repositorio, se busca en la copia\n# y se borra. Al final elimina el tablespace de control.\n#\n# Debe ejecutarse DESPUÉS de v16_cifrado_tde.sql. Añade (APPEND) su resultado a\n# evidencias/v16_cifrado_tde.txt.\n################################################################################\nset -uo pipefail\nexport MSYS_NO_PATHCONV=1 NLS_LANG=AMERICAN_AMERICA.AL32UTF8\n\nEVID=\"evidencias/v16_cifrado_tde.txt\"\nNOMBRE_REAL=\"Solano Vargas\"\ncfg(){ sed -nE \"s/^DEFINE[[:space:]]+$1[[:space:]]*=[[:space:]]*\\\"?([^\\\"]*)\\\"?[[:space:]]*\\$/\\1/p\" sql/config_local.sql | tr -d '\\r'; }\nPDB=$(cfg pdb_nombre)\nRUTA_RESP=$(cfg ruta_respaldos)\nTMPDIRW=\"${RUTA_RESP}\\\\tmp_pr26\"\nTMPDIR_U=$(cygpath -u \"$RUTA_RESP\")/tmp_pr26\nmkdir -p \"$TMPDIR_U\"\n\n# Número y ruta de cada datafile en la PDB.\nleer() {\n  printf 'set head off pages 0 feedback off trimspool on\\nalter session set container=%s;\\n%s\\nexit\\n' \"$PDB\" \"$1\" \\\n    | sqlplus -S -L \"/ as sysdba\" | tr -d '\\r' | sed '/^$/d' | tail -1\n}\nCLI_FILE=$(leer \"select file# from dba_data_files where tablespace_name='CLINICA_DATA';\")\nCLI_PATH=$(leer \"select file_name from dba_data_files where tablespace_name='CLINICA_DATA';\")\nCTL_FILE=$(leer \"select file# from dba_data_files where tablespace_name='TS_CONTROL_PLANO';\")\nCTL_PATH=$(leer \"select file_name from dba_data_files where tablespace_name='TS_CONTROL_PLANO';\")\n\n# Cuenta coincidencias en un datafile; si no se puede leer directamente (lock\n# de Windows), copia el datafile con RMAN y busca en la copia.\ncontar() {\n  local file_num=\"$1\" win_path=\"$2\" etiqueta=\"$3\" token=\"$4\"\n  local unix_path copia_win copia_unix c rc\n  unix_path=$(cygpath -u \"$(echo \"$win_path\" | sed 's#\\\\\\\\#/#g; s#\\\\#/#g')\")\n  c=$(grep -a -c -- \"$token\" \"$unix_path\" 2>/dev/null); rc=$?\n  if [ $rc -ge 2 ]; then\n    # Lectura directa bloqueada: copia imagen con RMAN.\n    copia_win=\"${TMPDIRW}\\\\${etiqueta}.dbf\"\n    copia_unix=\"${TMPDIR_U}/${etiqueta}.dbf\"\n    rm -f \"$copia_unix\"\n    rman target / > /dev/null 2>&1 <<RMAN\nBACKUP AS COPY DATAFILE $file_num FORMAT '$copia_win';\nexit\nRMAN\n    c=$(grep -a -c -- \"$token\" \"$copia_unix\" 2>/dev/null); [ -z \"$c\" ] && c=0\n    echo \"$c (vía copia RMAN)\"\n    rm -f \"$copia_unix\"\n  else\n    [ -z \"$c\" ] && c=0\n    echo \"$c (lectura directa)\"\n  fi\n}\n\n{\n  echo\n  echo \"--- PRUEBA DE TEXTO PLANO EN DISCO (PR-26)\"\n  echo \"Nombre buscado        : $NOMBRE_REAL\"\n  echo \"Datafile CLINICA_DATA : $CLI_PATH (archivo $CLI_FILE)\"\n  echo \"Datafile control plano: $CTL_PATH (archivo $CTL_FILE)\"\n  echo\n\n  CLI_RES=$(contar \"$CLI_FILE\" \"$CLI_PATH\" \"clinica_data\" \"$NOMBRE_REAL\")\n  CTL_RES=$(contar \"$CTL_FILE\" \"$CTL_PATH\" \"control_plano\" \"$NOMBRE_REAL\")\n  CLI_N=${CLI_RES%% *}\n  CTL_N=${CTL_RES%% *}\n  echo \"Coincidencias en CLINICA_DATA (cifrado) : $CLI_RES\"\n  echo \"Coincidencias en TS_CONTROL_PLANO (plano): $CTL_RES\"\n  echo\n\n  if [ \"$CLI_N\" = \"0\" ] && [ \"$CTL_N\" -gt 0 ] 2>/dev/null; then\n    echo \"RESULTADO PR-26: CUMPLE (datos cifrados ilegibles en disco; control en claro legible)\"\n  else\n    echo \"RESULTADO PR-26: NO CUMPLE (CLINICA_DATA=$CLI_N, control=$CTL_N)\"\n  fi\n\n  # Limpieza del tablespace de control.\n  printf 'alter session set container=%s;\\ndrop tablespace ts_control_plano including contents and datafiles;\\nexit\\n' \"$PDB\" \\\n    | sqlplus -S -L \"/ as sysdba\" > /dev/null 2>&1\n  echo\n  echo \"--- LIMPIEZA: TS_CONTROL_PLANO eliminado\"\n} | tee -a \"$EVID\"\n\nrmdir \"$TMPDIR_U\" 2>/dev/null || true\n"
    },
    {
      "ruta": "sql/02_verificacion/v16_cifrado_tde.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v16_cifrado_tde.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v16_cifrado_tde.sql\n-- Contenedor: XEPDB1\n-- Prueba   : PR-26 (cifrado en reposo efectivo) y A.8.24\n-- Control  : ISO/IEC 27001:2022 A.8.24 (uso de criptografía)\n--\n-- Parte de vistas de PR-26: el keystore está abierto, CLINICA_DATA figura en\n-- v$encrypted_tablespaces con AES256 y dba_tablespaces lo marca cifrado.\n-- Además prepara la prueba de texto plano: crea un tablespace de control SIN\n-- cifrar (TS_CONTROL_PLANO) con una tabla que contiene un nombre real y hace\n-- CHECKPOINT. La búsqueda en los datafiles y el borrado del tablespace de\n-- control los realiza v16_busqueda_texto.sh.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v16_cifrado_tde.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v16_cifrado_tde PR-26\n\nPROMPT\nPROMPT --- Estado del keystore en XEPDB1\nCOLUMN status      FORMAT A12\nCOLUMN wallet_type FORMAT A12\nSELECT con_id, status, wallet_type FROM v$encryption_wallet;\n\nPROMPT\nPROMPT --- Tablespaces cifrados (v$encrypted_tablespaces)\nCOLUMN nombre FORMAT A16\nCOLUMN encryptionalg FORMAT A12\nCOLUMN status FORMAT A10\nSELECT t.name AS nombre, e.encryptionalg, e.status\nFROM   v$encrypted_tablespaces e JOIN v$tablespace t ON t.ts# = e.ts#;\n\nPROMPT\nPROMPT --- Marca de cifrado en dba_tablespaces\nCOLUMN tablespace_name FORMAT A16\nCOLUMN encrypted FORMAT A9\nSELECT tablespace_name, encrypted FROM dba_tablespaces ORDER BY tablespace_name;\n\nPROMPT\nCOLUMN resultado FORMAT A70\nSELECT CASE WHEN enc.algoritmo = 'AES256' AND dt.encrypted = 'YES'\n            THEN 'RESULTADO PR-26 (vistas): CUMPLE (CLINICA_DATA cifrado ' || enc.algoritmo || ')'\n            ELSE 'RESULTADO PR-26 (vistas): NO CUMPLE'\n       END AS resultado\nFROM   (SELECT MAX(e.encryptionalg) AS algoritmo\n        FROM   v$encrypted_tablespaces e JOIN v$tablespace t ON t.ts# = e.ts#\n        WHERE  t.name = 'CLINICA_DATA') enc,\n       (SELECT encrypted FROM dba_tablespaces WHERE tablespace_name = 'CLINICA_DATA') dt;\n\nPROMPT\nPROMPT --- Preparación de la prueba de texto plano (tablespace de control sin cifrar)\nDECLARE\n  PROCEDURE ej(p IN VARCHAR2, ig IN VARCHAR2) IS\n  BEGIN EXECUTE IMMEDIATE p;\n  EXCEPTION WHEN OTHERS THEN IF INSTR(ig, TO_CHAR(SQLCODE)) = 0 THEN RAISE; END IF; END;\nBEGIN\n  ej('DROP TABLESPACE ts_control_plano INCLUDING CONTENTS AND DATAFILES', '-959');\n  EXECUTE IMMEDIATE 'CREATE TABLESPACE ts_control_plano DATAFILE '''\n        || '&ruta_datafiles\\TS_CONTROL_PLANO01.DBF'' SIZE 5M';\n  EXECUTE IMMEDIATE 'ALTER USER clinica QUOTA UNLIMITED ON ts_control_plano';\n  EXECUTE IMMEDIATE 'CREATE TABLE clinica.ctrl_plano (nombre VARCHAR2(100)) TABLESPACE ts_control_plano';\n  -- Mismo nombre real que el paciente 1 de CLINICA (dato de control).\n  EXECUTE IMMEDIATE 'INSERT INTO clinica.ctrl_plano VALUES (''María Fernanda Solano Vargas'')';\n  COMMIT;\nEND;\n/\nALTER SYSTEM CHECKPOINT;\n\nPROMPT Tablespace de control TS_CONTROL_PLANO creado (se elimina en v16_busqueda_texto.sh).\n\nSPOOL OFF\n"
    },
    {
      "ruta": "sql/02_verificacion/v17_version.sql",
      "carpeta": "02_verificacion",
      "subcarpeta": "",
      "nombre": "v17_version.sql",
      "ext": "sql",
      "lenguaje": "sql",
      "contenido": "--------------------------------------------------------------------------------\n-- Script   : sql/02_verificacion/v17_version.sql\n-- Contenedor: XEPDB1 y CDB$ROOT\n-- Control  : ISO/IEC 27001:2022 A.8.8 (gestión de vulnerabilidades técnicas)\n--\n-- Informativo (sin prueba PR): versión del motor, componentes del diccionario\n-- y parches aplicados, como base para la gestión de vulnerabilidades.\n--------------------------------------------------------------------------------\nSET ECHO OFF\n@sql/config_local.sql\nSET VERIFY OFF\nSET FEEDBACK OFF\nWHENEVER SQLERROR CONTINUE\n\nSPOOL evidencias/v17_version.txt\n\nCONNECT / AS SYSDBA\nALTER SESSION SET CONTAINER = &pdb_nombre;\n@sql/02_verificacion/comun/cabecera.sql v17_version A.8.8(informativo)\n\nPROMPT\nPROMPT --- Versión del motor\nCOLUMN banner_full FORMAT A80\nSELECT banner_full FROM v$version;\n\nPROMPT\nPROMPT --- Componentes del diccionario (dba_registry)\nCOLUMN comp_name FORMAT A40\nCOLUMN version   FORMAT A14\nCOLUMN status    FORMAT A10\nSELECT comp_name, version, status FROM dba_registry ORDER BY comp_name;\n\nPROMPT\nPROMPT --- Parches de SQL aplicados (dba_registry_sqlpatch)\nCOLUMN action   FORMAT A10\nCOLUMN status   FORMAT A10\nCOLUMN description FORMAT A50\nSELECT TO_CHAR(action_time, 'YYYY-MM-DD') AS fecha, action, status, description\nFROM   dba_registry_sqlpatch\nORDER  BY action_time;\n\nPROMPT\nPROMPT (Script informativo para A.8.8; no genera resultado PR.)\n\nSPOOL OFF\n"
    }
  ]
};
if (typeof module !== "undefined") { module.exports = DATA; }
