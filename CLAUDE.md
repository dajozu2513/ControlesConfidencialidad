# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repositorio

Proyecto universitario individual: marco de controles ISO/IEC 27001:2022 para la confidencialidad en Oracle 21c XE (Windows, PDB `XEPDB1`), sobre un escenario de clínica con datos ficticios. No hay aplicación que compilar: el código son scripts SQL, RMAN y bash que configuran y prueban una base de datos local, más un sitio estático que presenta los resultados.

Sigue el ciclo PHVA: `sql/00_entorno` y `sql/01_setup` (Hacer), `sql/02_verificacion` y `evidencias/` (Verificar), `docs/informe_iso27001_oracle.md` y `artefacto/` (Actuar y presentación). Los datos viven en las tablas del informe; `data/` solo contiene el historial de evaluaciones.

La instancia XE se eliminó de este equipo el 29 de octubre de 2026 (no existe `OracleServiceXE` y `oradata` está vacío), así que los scripts SQL no se pueden ejecutar hasta recrearla. Quedan el wallet y `respaldos_iso27001`.

## Reglas del proyecto

- Todo el contenido en español, sin emojis.
- Pedir confirmación antes de reiniciar la base de datos o el listener. `s01_tde_keystore.sql` (la primera vez) y `prueba_autologin.sql` reinician la instancia.
- Ante un `NO CUMPLE`, corregir el script solo si el error es del script; los fallos reales del control quedan documentados como hallazgo en `evidencias/resumen_pruebas.md`.
- Commits solo cuando se pidan y sin push salvo instrucción expresa.
- Documentar el uso de IA en `ia/registro-prompts.md`. La tabla debe coincidir con la sección 11 de `docs/informe_iso27001_oracle.md`.
- E-01 a E-19 del historial son simuladas: mantener visible la leyenda que lo indica en cada lugar donde aparezcan y no crear archivos de evidencia para ellas.
- No reintroducir datos personales: la cédula del estudiante figura como `[omitido]`.
- No leer ni imprimir `sql/config_local.sql` (contiene contraseñas y no se versiona). La plantilla es `sql/config_local.sql.ejemplo`.

## Comandos

Los scripts usan rutas relativas y deben ejecutarse **desde la raíz del repositorio**, en Git Bash:

```bash
export MSYS_NO_PATHCONV=1 NLS_LANG=AMERICAN_AMERICA.AL32UTF8
```

Ejecutar todas las verificaciones (v01 a v17, incluye RMAN y shell):

```bash
bash sql/02_verificacion/ejecutar_todo.sh
```

Ejecutar una sola verificación SQL (cada script abre su propia conexión):

```bash
printf '@sql/02_verificacion/v08_vpd.sql\nexit\n' | sqlplus -S -L /nolog
```

Ejecutar un script de configuración (estos sí esperan una sesión SYSDBA):

```bash
printf '@sql/01_setup/s02_esquema_clinica.sql\nexit\n' | sqlplus -S -L "/ as sysdba"
```

Regenerar los datos del artefacto (`py` si `python` abre la tienda de Microsoft):

```bash
python artefacto/build_data.py
```

Ver el artefacto: abrir `artefacto/index.html` directamente o servir desde la raíz.

```bash
python -m http.server 8765
```

Luego abrir `http://localhost:8765/artefacto/`. No hay linter ni pruebas unitarias; las pruebas son las PR-01 a PR-26 contra la base de datos.

## Arquitectura

### Configuración (`sql/01_setup`)

Los scripts `sNN_*` se ejecutan en orden numérico. El orden importa: `s00_sqlnet.sh` va antes de crear usuarios para que solo se generen verificadores 12C. Cada script es re-ejecutable y se detiene ante el primer error (`WHENEVER SQLERROR EXIT`).

Dependencias al re-ejecutar: s02 recrea el esquema, así que después hay que repetir s03 a s07; s03 recrea usuarios y roles, así que después hay que repetir s06 y s07.

### Verificación (`sql/02_verificacion`)

Cada `vNN_*.sql` carga `@sql/config_local.sql`, hace `SPOOL` a `evidencias/vNN_*.txt`, abre sus conexiones (`CONNECT / AS SYSDBA` y usuarios de prueba por TCP en `//localhost:1521/XEPDB1`), llama a `comun/cabecera.sql` y emite líneas `RESULTADO PR-XX: CUMPLE | NO CUMPLE`. Esas líneas son el contrato: `ejecutar_todo.sh` las resume con `grep` y `build_data.py` las usa para enlazar cada prueba con su evidencia.

Detalles que no se ven en un solo archivo:

- Los resultados de RMAN no salen del `.rman`: `ejecutar_todo.sh` los calcula a partir del log (PR-16 y PR-22). Ejecutar esos scripts sueltos no produce línea `RESULTADO`.
- `v15_red.sql` hace `SPOOL ... APPEND` sobre el archivo que antes escribe `ejecutar_todo.sh` con las líneas del `sqlnet.ora`; suelto, acumula salida.
- `v16_cifrado_tde.sql` crea el tablespace `TS_CONTROL_PLANO` y lo elimina `v16_busqueda_texto.sh`: deben correr en pareja.
- Aunque el README dice "solo pruebas", varias verificaciones cambian estado: v06 purga auditoría, v09 bloquea y desbloquea `MED_MORA`, v10 purga la papelera, v12 exporta y borra dumps.
- PR-12 compara con valores fijos (18, 12 y 30 filas) que dependen de los datos sembrados en s02.

Mantener `SET ECHO OFF` antes de `@sql/config_local.sql` y `SET VERIFY OFF` después: las evidencias se versionan y las contraseñas no deben llegar al `SPOOL`.

### Particularidades de Oracle XE y este equipo

- PR-21 es el único `NO CUMPLE` esperado (25 de 26): XE no tiene cifrado de Data Pump (`ORA-00439`). No es un error que corregir.
- `TCP.INVITED_NODES` incluye una IP asignada por DHCP. Si cambia, hay que volver a ejecutar `s08_red.sh <hostname> <ipv4>` y reiniciar el listener; detalle y reversión en `sql/01_setup/s08_red.md`.
- El Oracle home es de solo lectura: la ruta de `sqlnet.ora` se obtiene con `orabasehome`.
- El reinicio del listener desde `lsnrctl` falló con `TNS-01190`; se usó `net stop` y `net start` del servicio `OracleOraDB21Home1TNSListener` con permisos de administrador.

### Artefacto y flujo de datos

`docs/informe_iso27001_oracle.md` es la fuente oficial. `artefacto/build_data.py` (Python 3, solo biblioteca estándar) une el informe, el texto de los scripts de `sql/01_setup` y `sql/02_verificacion`, `ia/registro-prompts.md` y `data/historial_evaluaciones.json` en `artefacto/data.js`, que **no se edita a mano**. `app.js` es JavaScript sin frameworks y lee la constante global `DATA`; funciona como `file://`, y highlight.js desde cdnjs es opcional.

- Cualquier cambio en el informe, en los scripts o en el registro de IA exige regenerar `data.js`.
- `build_data.py` localiza las tablas por el texto de los encabezados y usa claves derivadas de los nombres de columna. Renombrar un encabezado o una columna del informe rompe la sección: revisar los `AVISO` y los conteos que imprime (5 riesgos, 12 tareas, 17 controles, 15 observables, 17 matriz, 26 pruebas, 20 evaluaciones, 6 remediaciones).
- El historial solo declara cambios por evaluación (`suben` y `bajan`); `construir_historial` acumula los resultados y avisa si E-20 no coincide con las secciones 8.2 y 9.4. Al cambiar resultados reales, hay que ajustar también el JSON.
- `app.js` abre el panel de detalle con `abrirDetalle(tipo, id)` para `tarea`, `riesgo` o `control`. El gráfico de Evolución se dibuja con el ancho real, por lo que se repinta al mostrar la vista y al cambiar el tamaño de la ventana.
- Los resultados no se propagan solos: `evidencias/resumen_pruebas.md` y la sección 9.4 del informe se actualizan a mano tras volver a ejecutar las pruebas.
- `entregables/artefacto_iso27001_dba.zip` es una copia empaquetada del entregable y no se regenera con ningún script del repositorio.
