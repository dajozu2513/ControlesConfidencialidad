# Marco de controles ISO/IEC 27001:2022 para la confidencialidad en la administración de bases de datos Oracle 21c

Proyecto universitario individual. Fecha de entrega: 28 de octubre de 2026.

## Objetivo

Diseñar, implementar y verificar un marco de controles basado en ISO/IEC 27001:2022 (Anexo A) orientado a proteger la **confidencialidad** de la información gestionada en una base de datos Oracle 21c, desde la perspectiva de las tareas del administrador de bases de datos (DBA).

El marco relaciona:

- los **riesgos** de confidencialidad identificados en la operación de la base de datos,
- las **tareas** del DBA que intervienen en esos riesgos,
- los **controles** del Anexo A de ISO/IEC 27001:2022 aplicables,
- su **implementación técnica** en Oracle 21c (scripts SQL),
- y las **pruebas** que demuestran su efectividad (evidencias).

## Estructura del repositorio

```
iso27001-dba-confidencialidad/
  README.md               Este documento
  .gitignore              Exclusiones (wallets, credenciales, .env)
  docs/                   Marco teórico e informe final
  data/                   Archivos JSON: riesgos, tareas, controles, matriz y pruebas
  sql/
    00_entorno/           Scripts de solo lectura para verificar el entorno
    01_setup/             Scripts de configuración de los controles
    02_verificacion/      Scripts de prueba y verificación de los controles
  evidencias/             Salidas (SPOOL) generadas por los scripts
  artefacto/              Sitio HTML interactivo que presenta el marco
  ia/
    registro-prompts.md   Registro del uso de herramientas de IA
```

## Requisitos

- Oracle Database 21c (probado con la edición Express, arquitectura multitenant CDB/PDB).
- SQL*Plus (incluido en la instalación de Oracle) u Oracle SQL Developer.
- Una cuenta con privilegio SYSDBA para los scripts de entorno y configuración.
- Git, para el control de versiones del proyecto.

## Cómo ejecutar los scripts

Los scripts generan su evidencia con `SPOOL` usando rutas relativas, por lo que deben ejecutarse **desde la raíz del repositorio**.

1. Abrir una terminal en la raíz del repositorio.
2. Conectarse con SQL*Plus y ejecutar el script deseado. Ejemplo para el contenedor raíz (CDB$ROOT):

   ```
   sqlplus / as sysdba @sql/00_entorno/00_verificar_entorno.sql
   ```

   Ejemplo para la base de datos conectable (PDB), usando el nombre de servicio correspondiente:

   ```
   sqlplus sys@//localhost:1521/XEPDB1 as sysdba @sql/00_entorno/00_verificar_entorno.sql
   ```

   Con autenticación del sistema operativo también se puede entrar a la PDB cambiando de contenedor antes de ejecutar el script:

   ```
   sqlplus / as sysdba
   SQL> ALTER SESSION SET CONTAINER = XEPDB1;
   SQL> @sql/00_entorno/00_verificar_entorno.sql
   ```

3. Revisar la salida generada en la carpeta `evidencias/`. Los scripts no terminan con `EXIT` para poder usarlos también desde SQL Developer; en SQL*Plus se sale con `EXIT`.

Para que los acentos se conserven en los archivos de evidencia, se recomienda definir `NLS_LANG=AMERICAN_AMERICA.AL32UTF8` en la terminal antes de abrir SQL*Plus. El script `00_verificar_entorno.sql` agrega su salida (`APPEND`) a `evidencias/00_entorno.txt`, de modo que las ejecuciones en CDB$ROOT y en la PDB quedan en el mismo archivo.

En SQL Developer se puede abrir el script y ejecutarlo como script (F5), cuidando que el directorio de trabajo sea la raíz del repositorio para que el `SPOOL` se escriba en `evidencias/`.

Orden previsto de ejecución:

| Carpeta | Propósito | Modifica la base de datos |
|---|---|---|
| `sql/00_entorno` | Verificar versión, opciones y estado inicial | No |
| `sql/01_setup` | Implementar los controles | Sí |
| `sql/02_verificacion` | Probar los controles y generar evidencias | No (solo pruebas) |

Las credenciales nunca se guardan en el repositorio: se ingresan de forma interactiva al conectarse.

### Implementación de los controles (`sql/01_setup`)

Los scripts de configuración leen las rutas del servidor y las contraseñas desde `sql/config_local.sql`, que **no se versiona**. Para prepararlo, copiar la plantilla `sql/config_local.sql.ejemplo` como `sql/config_local.sql` y completar cada valor. Las contraseñas deben cumplir `ORA12C_STRONG_VERIFY_FUNCTION`.

Orden de ejecución (como SYSDBA, desde la raíz del repositorio, en Git Bash con `MSYS_NO_PATHCONV=1` y `NLS_LANG=AMERICAN_AMERICA.AL32UTF8`):

| Script | Contenedor | Qué hace | Evidencia |
|---|---|---|---|
| `s00_respaldo_pfile.sql` | CDB$ROOT | Respaldo del SPFILE como PFILE fuera del repositorio | `setup_s00_respaldo_pfile.txt` |
| `s00_sqlnet.sh` (bash) | Servidor | Respaldo de sqlnet.ora y `SQLNET.ALLOWED_LOGON_VERSION_SERVER=12a` | `setup_s00_sqlnet.txt` |
| `s01_tde_keystore.sql` | CDB$ROOT | WALLET_ROOT, **reinicio de la instancia**, keystore TDE unido, clave maestra, AUTO_LOGIN y respaldo | `setup_s01_tde_keystore.txt` |
| `s02_esquema_clinica.sql` | XEPDB1 | Tablespace cifrado AES256, esquema CLINICA, datos ficticios y clasificación de columnas | `setup_s02_esquema_clinica.txt` |
| `s03_usuarios_roles.sql` | XEPDB1 | Perfil de contraseñas, roles funcionales y usuarios nominales | `setup_s03_usuarios_roles.txt` |
| `s04_vpd.sql` | XEPDB1 | Política VPD sobre CONSULTAS por médico tratante | `setup_s04_vpd.txt` |
| `s05_redaction.sql` | XEPDB1 | Data Redaction de cédula, teléfono, diagnóstico y tratamiento | `setup_s05_redaction.txt` |
| `s06_auditoria.sql` | XEPDB1 | Políticas de auditoría unificada | `setup_s06_auditoria.txt` |
| `s07_clon_dev.sql` | XEPDB1 | Clon de desarrollo CLINICA_DEV con enmascaramiento estático | `setup_s07_clon_dev.txt` |

Ejemplo:

```
printf '@sql/01_setup/s02_esquema_clinica.sql\nexit\n' | sqlplus -S -L "/ as sysdba"
```

Todos los scripts son re-ejecutables y se detienen ante el primer error (`WHENEVER SQLERROR EXIT`). Dependencias al re-ejecutar: s02 recrea el esquema, por lo que después deben repetirse s03 a s07; s03 recrea usuarios y roles, por lo que después deben repetirse s06 y s07.

Pasos adicionales de la fase 5B (red, AUTO_LOGIN y respaldos cifrados):

| Script | Tipo | Qué hace | Evidencia |
|---|---|---|---|
| `s08_red.sh <hostname> <ipv4>` + `s08_red.md` | bash | Cifrado e integridad de red obligatorios (AES256/SHA256) y nodos invitados; requiere reinicio del listener | `setup_s08_red.txt` |
| `prueba_autologin.sql` | SQL | Reinicia la instancia y comprueba que el keystore AUTO_LOGIN abre solo | `setup_autologin.txt` |
| `s09_rman_cifrado.rman` | RMAN | Cifrado de respaldos AES256 y respaldo de XEPDB1 | `setup_rman.txt` |

## Verificación de los controles (`sql/02_verificacion`)

Diecisiete scripts (v01 a v17) prueban los controles y generan evidencias `evidencias/vNN_*.txt`. Cada uno sobrescribe su evidencia, lleva un encabezado con fecha, contenedor, usuario y las pruebas que cubre, y emite por cada prueba una línea `RESULTADO PR-XX: CUMPLE | NO CUMPLE`. Las conexiones de los usuarios de prueba son por TCP (`usuario/clave@//localhost:1521/XEPDB1`).

Ejecución completa (orquesta SQL, RMAN y los scripts de shell de apoyo):

```bash
bash sql/02_verificacion/ejecutar_todo.sh
```

El script imprime al final todas las líneas `RESULTADO PR-XX`. El resumen consolidado de las 26 pruebas está en [`evidencias/resumen_pruebas.md`](evidencias/resumen_pruebas.md), con los hallazgos y desviaciones. Scripts de apoyo: `v12_expdp.sh` (exportación cifrada), `v16_busqueda_texto.sh` (búsqueda en datafiles) y los `*.rman` de respaldos obsoletos y validación de restauración.

## Artefacto interactivo (`artefacto/`)

El sitio HTML de `artefacto/` presenta todo el proyecto (resumen, riesgos, tareas, mapeo ISO, matriz, batería de pruebas, scripts, remediación, uso de IA y referencias) a partir de una única fuente de datos.

### Regenerar los datos

La fuente oficial es `docs/informe.md`. El script `artefacto/build_data.py` (Python 3, solo biblioteca estándar) convierte sus tablas, el texto de los scripts y el registro de IA en `artefacto/data.js`. Tras cambiar el informe, basta con volver a ejecutarlo:

```bash
python artefacto/build_data.py
```

En Windows, si `python` abre la tienda de Microsoft, usar el lanzador `py`:

```bash
py artefacto/build_data.py
```

El script imprime en consola los conteos por sección. No incluye contraseñas: no lee `sql/config_local.sql`.

### Verlo localmente

Servir el repositorio desde su raíz y abrir `/artefacto/` (las rutas a evidencias y scripts son relativas):

```bash
python -m http.server 8765
```

Luego abrir `http://localhost:8765/artefacto/` en el navegador. También funciona abriendo `artefacto/index.html` como archivo local, aunque los enlaces a `../evidencias/` y `../sql/` requieren el servidor.

### Publicarlo en GitHub Pages

1. Subir el repositorio a GitHub.
2. En el repositorio: Settings > Pages.
3. En "Build and deployment", elegir "Deploy from a branch".
4. Seleccionar la rama (por ejemplo `main`) y la carpeta raíz (`/root`), y guardar.
5. El artefacto queda disponible en `https://<usuario>.github.io/<repositorio>/artefacto/`.

Como todas las rutas del artefacto son relativas, funciona servido desde la raíz del repositorio sin cambios.

## Metodología PHVA

El proyecto sigue el ciclo Planificar-Hacer-Verificar-Actuar (PHVA), coherente con la estructura de mejora continua de ISO/IEC 27001:2022:

| Fase | Actividades | Productos en el repositorio |
|---|---|---|
| Planificar | Marco teórico, identificación de riesgos de confidencialidad, tareas del DBA, selección de controles del Anexo A | `docs/`, `data/` |
| Hacer | Verificación del entorno e implementación técnica de los controles en Oracle 21c | `sql/00_entorno/`, `sql/01_setup/` |
| Verificar | Ejecución de pruebas y recolección de evidencias de efectividad | `sql/02_verificacion/`, `evidencias/` |
| Actuar | Análisis de resultados, brechas encontradas y propuestas de mejora | `docs/`, `artefacto/` |

## Uso de inteligencia artificial

Todo uso de herramientas de IA se documenta en `ia/registro-prompts.md`, indicando el prompt exacto, el aporte de la herramienta, la validación realizada por el estudiante y la fuente utilizada para verificarlo.
