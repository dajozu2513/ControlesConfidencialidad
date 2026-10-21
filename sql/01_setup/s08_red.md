# Endurecimiento de red de Oracle Net (s08)

Control principal: **ISO/IEC 27001:2022 A.8.20 Seguridad de redes**. Complementa A.8.24 (uso de criptografía) y A.5.14 (transferencia de información).

Archivo modificado: `sqlnet.ora` del servidor, en `<ORACLE_BASE_HOME>\network\admin` (en este equipo `C:\app\dajoz\product\21c\homes\OraDB21Home1\network\admin\sqlnet.ora`). En Oracle 21c el Oracle home es de solo lectura; la ruta correcta la devuelve `orabasehome`.

Script: `sql/01_setup/s08_red.sh <hostname> <ipv4_local>`. Antes de cada cambio respalda el archivo en `<ruta_respaldos>\sqlnet\` (fuera del repositorio). La evidencia queda en `evidencias/setup_s08_red.txt`.

## Parámetros

| Parámetro | Valor | Qué hace | Riesgo que mitiga | Control |
|---|---|---|---|---|
| `SQLNET.ENCRYPTION_SERVER` | `REQUIRED` | El servidor rechaza cualquier conexión que no negocie cifrado nativo de Oracle Net (ORA-12660 si el cliente lo rechaza). | Captura en la red de datos de pacientes y de sentencias SQL. | A.8.20, A.8.24 |
| `SQLNET.ENCRYPTION_TYPES_SERVER` | `(AES256)` | Limita el algoritmo de cifrado a AES de 256 bits. | Negociación de algoritmos débiles u obsoletos (DES, RC4, 3DES). | A.8.24 |
| `SQLNET.CRYPTO_CHECKSUM_SERVER` | `REQUIRED` | Exige una suma criptográfica de integridad en cada paquete. | Modificación o repetición de paquetes en tránsito. | A.8.20 |
| `SQLNET.CRYPTO_CHECKSUM_TYPES_SERVER` | `(SHA256)` | Limita el algoritmo de integridad a SHA-256. | Uso de MD5 o SHA-1. | A.8.24 |
| `TCP.VALIDNODE_CHECKING` | `YES` | El listener valida la dirección de origen de cada conexión contra la lista de nodos. | Conexiones desde equipos no autorizados. | A.8.20 |
| `TCP.INVITED_NODES` | `(127.0.0.1, localhost, ::1, Joel-Laptop, 192.168.0.21)` | Solo se aceptan conexiones desde el propio equipo (bucle local IPv4/IPv6, nombre e IP del equipo). | Acceso remoto al listener desde la red local. | A.8.20 |

Parámetros que ya estaban y se conservan:

- `SQLNET.AUTHENTICATION_SERVICES = (NTS)`: autenticación del sistema operativo Windows (necesaria para `sqlplus / as sysdba`).
- `NAMES.DIRECTORY_PATH = (TNSNAMES, EZCONNECT)`.
- `SQLNET.ALLOWED_LOGON_VERSION_SERVER = 12a` (paso 0, A.8.5).

## Aplicación

- Cifrado e integridad: se aplican a cada conexión nueva, sin reiniciar nada.
- `TCP.VALIDNODE_CHECKING` y `TCP.INVITED_NODES`: los lee el listener al arrancar, por lo que requieren `lsnrctl stop` y `lsnrctl start` (o `lsnrctl reload`).
- Las conexiones locales por `bequeath` (`sqlplus / as sysdba`) no pasan por la red ni por el listener: no se cifran ni se filtran por nodo.

Verificación: `v$session_connect_info.network_service_banner` de una sesión TCP debe mostrar el adaptador `AES256 Encryption service adapter` y el adaptador `SHA256 Crypto-checksumming service adapter` (prueba PR-24 y PR-25, `sql/02_verificacion/v15_red.sql`).

## Consideraciones

- La IPv4 `192.168.0.21` la asigna DHCP en la red Wi-Fi. Si cambia, el listener rechazará las conexiones que usen esa IP (las de `localhost` siguen funcionando). En ese caso se vuelve a ejecutar `s08_red.sh` con la IP nueva y se reinicia el listener.
- SQL Developer (JDBC thin) y SQL*Plus aceptan cifrado por defecto (`ENCRYPTION_CLIENT = ACCEPTED`), por lo que negocian AES256 sin configuración adicional.
- El cifrado nativo protege la confidencialidad e integridad pero no autentica al servidor. Para autenticación mutua con certificados se usaría TLS (TCPS), fuera del alcance de este proyecto.

## Cómo revertir

1. Restaurar la copia previa del archivo (la ruta exacta figura en `evidencias/setup_s08_red.txt`, sección 1):

   ```
   copy "<ruta_respaldos>\sqlnet\sqlnet.ora.<fecha>" "C:\app\dajoz\product\21c\homes\OraDB21Home1\network\admin\sqlnet.ora"
   ```

   O eliminar del `sqlnet.ora` las seis líneas agregadas bajo el comentario `# ISO 27001 A.8.20 / A.8.24`.
2. Reiniciar el listener para que deje de filtrar nodos: `lsnrctl stop` y `lsnrctl start`.
3. Abrir una sesión TCP nueva y confirmar en `v$session_connect_info` que ya no aparecen los adaptadores AES256 y SHA256 (o que su uso depende del cliente).

Revertir parcialmente: para permitir clientes sin cifrado sin desactivarlo, cambiar `REQUIRED` por `REQUESTED` en `SQLNET.ENCRYPTION_SERVER` y `SQLNET.CRYPTO_CHECKSUM_SERVER`.
