#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_data.py  -  Genera artefacto/data.js a partir de la fuente oficial.

Fuente única de datos:
  - docs/informe.md  : informe oficial (tablas de las secciones 3 a 10 y Referencias).
  - sql/01_setup/ y sql/02_verificacion/ : texto de los scripts (.sql, .sh, .rman, .md).
  - ia/registro-prompts.md : registro de uso de IA.
  - evidencias/*.txt : solo para resolver el archivo de evidencia de cada prueba.

Salida:
  - artefacto/data.js con "const DATA = {...};" (JSON embebido), para que la
    página funcione abierta como archivo local (file://) o servida localmente.

Solo biblioteca estándar de Python 3. Si cambia el informe, basta con volver a
ejecutar este script. No incluye contraseñas: no lee sql/config_local.sql ni
los archivos de evidencia salvo las líneas "RESULTADO PR-xx" para los enlaces.
"""

import json
import os
import re
import sys
import unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INFORME = os.path.join(RAIZ, 'docs', 'informe.md')
REGISTRO = os.path.join(RAIZ, 'ia', 'registro-prompts.md')
DIRS_SCRIPTS = ['sql/01_setup', 'sql/02_verificacion']
DIR_EVIDENCIAS = os.path.join(RAIZ, 'evidencias')
SALIDA = os.path.join(RAIZ, 'artefacto', 'data.js')

AUTOR = 'David Joel Soto Zuñiga'  # autor del proyecto (indicado para el artefacto)


# --------------------------------------------------------------------------
# Utilidades de texto
# --------------------------------------------------------------------------
def slug(texto):
    """Convierte un encabezado de columna en una clave sin acentos ni símbolos."""
    t = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('ascii')
    t = t.lower().strip()
    t = re.sub(r'[^a-z0-9]+', '_', t).strip('_')
    return t or 'col'


def desescapar(celda):
    """Quita los escapes de Markdown usados en el informe para mostrar el texto."""
    reemplazos = {
        r'\|': '|', r'\*': '*', r'\$': '$', r'\[': '[', r'\]': ']',
        r'\_': '_', r'\<': '<', r'\>': '>',
    }
    for a, b in reemplazos.items():
        celda = celda.replace(a, b)
    return celda.strip()


def dividir_fila(linea):
    """Divide una fila de tabla Markdown respetando los pipes escapados (\\|)."""
    linea = linea.strip()
    if linea.startswith('|'):
        linea = linea[1:]
    if linea.endswith('|'):
        linea = linea[:-1]
    partes = re.split(r'(?<!\\)\|', linea)
    return [desescapar(p) for p in partes]


# --------------------------------------------------------------------------
# Parsers de Markdown
# --------------------------------------------------------------------------
def leer(ruta):
    with open(ruta, 'r', encoding='utf-8') as f:
        return f.read()


def indice_encabezado(lineas, titulo):
    """Devuelve el índice de la línea de encabezado que empieza con 'titulo'.

    'titulo' incluye los '#'; la comparación ignora acentos y mayúsculas para
    ser tolerante a pequeñas diferencias de tipografía.
    """
    objetivo = slug(titulo.lstrip('#'))
    for i, ln in enumerate(lineas):
        s = ln.strip()
        if s.startswith('#') and slug(s.lstrip('#')).startswith(objetivo):
            return i
    return -1


def tabla_despues(lineas, titulo):
    """Parsea la primera tabla Markdown que sigue al encabezado 'titulo'.

    Devuelve (columnas, filas): columnas es [{'key','label'}], filas es
    [ {key: valor} ]. Se detiene en el siguiente encabezado.
    """
    i = indice_encabezado(lineas, titulo)
    if i < 0:
        return None, None
    j = i + 1
    # Avanzar hasta la primera fila de tabla, sin cruzar a otra sección.
    while j < len(lineas):
        s = lineas[j].strip()
        if s.startswith('#'):
            return None, None
        if s.startswith('|'):
            break
        j += 1
    if j >= len(lineas):
        return None, None
    bloque = []
    while j < len(lineas) and lineas[j].strip().startswith('|'):
        bloque.append(lineas[j])
        j += 1
    if len(bloque) < 2:
        return None, None
    cabecera = dividir_fila(bloque[0])
    columnas = [{'key': slug(c), 'label': c} for c in cabecera]
    # Asegurar claves únicas.
    vistas = {}
    for col in columnas:
        k = col['key']
        if k in vistas:
            vistas[k] += 1
            col['key'] = '%s_%d' % (k, vistas[k])
        else:
            vistas[k] = 0
    filas = []
    for linea in bloque[2:]:  # saltar la fila separadora (---)
        celdas = dividir_fila(linea)
        if not any(celdas):
            continue
        fila = {}
        for idx, col in enumerate(columnas):
            fila[col['key']] = celdas[idx] if idx < len(celdas) else ''
        filas.append(fila)
    return columnas, filas


def seccion(lineas, titulo):
    cols, filas = tabla_despues(lineas, titulo)
    if cols is None:
        print('  AVISO: no se pudo convertir la tabla de "%s"' % titulo, file=sys.stderr)
        return {'columns': [], 'rows': []}
    return {'columns': cols, 'rows': filas}


# --------------------------------------------------------------------------
# Enriquecimiento de secciones específicas
# --------------------------------------------------------------------------
def lista_ids(texto, patron):
    return re.findall(patron, texto or '')


def partir_control(texto):
    """'A5.12 Clasificación de la información' -> ('A5.12', 'Clasificación...')."""
    m = re.match(r'\s*(A\d+\.\d+)\s*(.*)', texto or '')
    if m:
        return m.group(1), m.group(2).strip()
    return '', (texto or '').strip()


def enriquecer_riesgos(sec):
    for r in sec['rows']:
        m = re.match(r'\s*(\d+)\s+(.*)', r.get('nivel', ''))
        if m:
            r['nivel_num'] = int(m.group(1))
            r['nivel_label'] = m.group(2).strip()
        else:
            r['nivel_num'] = 0
            r['nivel_label'] = ''
        try:
            r['p_num'] = int(r.get('p', ''))
            r['i_num'] = int(r.get('i', ''))
        except ValueError:
            r['p_num'] = r['i_num'] = 0
    return sec


def enriquecer_tareas(sec):
    for t in sec['rows']:
        t['riesgos_list'] = lista_ids(t.get('riesgos', ''), r'R-CONF-\d+')
    return sec


def construir_controles(lineas):
    grupos = [
        ('### 6.1 Controles organizacionales (A5)', 'A5', 'Organizacional (A5)'),
        ('### 6.2 Controles tecnológicos (A8)', 'A8', 'Tecnológico (A8)'),
        ('### 6.3 Controles complementarios', 'COMP', 'Complementario'),
    ]
    filas = []
    for titulo, tema, tema_label in grupos:
        _, fs = tabla_despues(lineas, titulo)
        if not fs:
            print('  AVISO: tabla de controles "%s" vacía' % titulo, file=sys.stderr)
            continue
        for f in fs:
            codigo, nombre = partir_control(f.get('control', ''))
            tyr = f.get('tareas_y_riesgos', '')
            filas.append({
                'codigo': codigo,
                'nombre': nombre,
                'tema': tema,
                'tema_label': tema_label,
                'tareas_y_riesgos': tyr,
                'tareas_list': lista_ids(tyr, r'T-\d+'),
                'riesgos_list': lista_ids(tyr, r'R-CONF-\d+'),
                'justificacion': f.get('justificacion', ''),
                'implementacion': f.get('implementacion_en_oracle_21c_xe', '')
                                   or f.get('implementacion', ''),
                'evidencia': f.get('evidencia_observable', ''),
            })
    return filas


def enriquecer_observables(sec):
    for o in sec['rows']:
        codigo, nombre = partir_control(o.get('control', ''))
        o['control_codigo'] = codigo
        o['control_nombre'] = nombre
        # El script aparece como `v01_clasificacion.sql` entre acentos graves.
        m = re.search(r'([a-z0-9_]+\.(?:sql|sh|rman))', o.get('script_en_sql_02_verificacion', '')
                      or o.get('script', ''))
        o['script_archivo'] = m.group(1) if m else ''
    return sec


def enriquecer_matriz(sec):
    for m in sec['rows']:
        codigo, nombre = partir_control(m.get('control', ''))
        m['control_codigo'] = codigo
        m['control_nombre'] = nombre
        crit = m.get('criterio_0_4', '')
        mm = re.match(r'\s*(\d+)\s*(.*)', crit)
        m['nivel_num'] = int(mm.group(1)) if mm else 0
        m['nivel_label'] = mm.group(2).strip() if mm else crit
        m['tareas_list'] = lista_ids(m.get('tarea', ''), r'T-\d+')
        m['riesgos_list'] = lista_ids(m.get('riesgo', ''), r'R-CONF-\d+')
        em = re.search(r'(evidencias/[a-z0-9_]+\.txt)', m.get('evidencia', ''))
        m['evidencia_archivo'] = em.group(1) if em else ''
    return sec


def mapa_evidencias_por_prueba():
    """Asocia cada PR con el archivo de evidencia donde aparece su RESULTADO."""
    mapa = {}
    if not os.path.isdir(DIR_EVIDENCIAS):
        return mapa
    for nombre in sorted(os.listdir(DIR_EVIDENCIAS)):
        if not nombre.endswith('.txt'):
            continue
        try:
            with open(os.path.join(DIR_EVIDENCIAS, nombre), 'r',
                      encoding='utf-8', errors='replace') as f:
                texto = f.read()
        except OSError:
            continue
        for pr in re.findall(r'RESULTADO\s+(PR-\d+)', texto):
            mapa.setdefault(pr, nombre)
    return mapa


def construir_pruebas(lineas):
    _, bateria = tabla_despues(lineas, '### 9.2 Batería')
    _, resultados = tabla_despues(lineas, '### 9.4 Resultados obtenidos')
    bateria = bateria or []
    resultados = resultados or []
    por_id = {}
    for b in bateria:
        por_id[b.get('id', '').strip()] = {
            'id': b.get('id', '').strip(),
            'tipo': b.get('tipo', ''),
            'control': b.get('control', ''),
            'procedimiento': b.get('procedimiento', ''),
            'esperado': b.get('resultado_esperado', ''),
            'herramienta': b.get('herramienta', ''),
            'obtenido': '',
            'estado': '',
        }
    for r in resultados:
        pid = r.get('id', '').strip()
        reg = por_id.setdefault(pid, {'id': pid, 'tipo': '', 'control': r.get('control', ''),
                                      'procedimiento': '', 'esperado': '', 'herramienta': ''})
        reg['obtenido'] = r.get('resultado_obtenido', '')
        reg['estado'] = r.get('estado', '')
        if not reg.get('control'):
            reg['control'] = r.get('control', '')
    evid = mapa_evidencias_por_prueba()

    def num(pid):
        m = re.search(r'(\d+)', pid)
        return int(m.group(1)) if m else 0

    filas = sorted(por_id.values(), key=lambda x: num(x['id']))
    for f in filas:
        archivo = evid.get(f['id'], '')
        f['evidencia'] = ('../evidencias/' + archivo) if archivo else ''
    return filas


def construir_referencias(texto):
    m = re.search(r'##\s+Referencias\s*(.*)$', texto, re.S)
    refs = []
    if not m:
        return refs
    bloque = m.group(1).strip()
    for parrafo in re.split(r'\n\s*\n', bloque):
        p = ' '.join(l.strip() for l in parrafo.splitlines()).strip()
        if not p:
            continue
        url = ''
        mu = re.search(r'<(https?://[^>]+)>', p)
        if mu:
            url = mu.group(1)
        else:
            mu = re.search(r'(https?://\S+)', p)
            if mu:
                url = mu.group(1).rstrip('.>')
        refs.append({'texto': p, 'url': url})
    return refs


def construir_prompts():
    if not os.path.isfile(REGISTRO):
        return {'columns': [], 'rows': []}
    lineas = leer(REGISTRO).splitlines()
    # La tabla del registro empieza en la primera fila de encabezado (contiene
    # 'Herramienta IA', tanto en el formato con 'Fecha' como en el de la sección 11).
    inicio = next((i for i, l in enumerate(lineas)
                   if l.strip().startswith('|') and 'Herramienta IA' in l), -1)
    if inicio < 0:
        return {'columns': [], 'rows': []}
    bloque = []
    j = inicio
    while j < len(lineas) and lineas[j].strip().startswith('|'):
        bloque.append(lineas[j])
        j += 1
    cabecera = dividir_fila(bloque[0])
    columnas = [{'key': slug(c), 'label': c} for c in cabecera]
    filas = []
    for linea in bloque[2:]:
        celdas = dividir_fila(linea)
        fila = {}
        for idx, col in enumerate(columnas):
            val = celdas[idx] if idx < len(celdas) else ''
            val = val.replace('<br>', '\n')
            fila[col['key']] = val
        filas.append(fila)
    return {'columns': columnas, 'rows': filas}


# --------------------------------------------------------------------------
# Scripts
# --------------------------------------------------------------------------
def lenguaje_por_ext(ext):
    return {'.sql': 'sql', '.rman': 'sql', '.sh': 'bash', '.md': 'markdown'}.get(ext, 'plaintext')


def construir_scripts():
    exts = ('.sql', '.sh', '.rman', '.md')
    scripts = []
    for base in DIRS_SCRIPTS:
        abs_base = os.path.join(RAIZ, base)
        for dirpath, _, files in os.walk(abs_base):
            for nombre in sorted(files):
                if nombre == 'config_local.sql' or nombre.startswith('config_local'):
                    continue
                ext = os.path.splitext(nombre)[1].lower()
                if ext not in exts:
                    continue
                ruta_abs = os.path.join(dirpath, nombre)
                rel = os.path.relpath(ruta_abs, RAIZ).replace('\\', '/')
                carpeta = '01_setup' if '01_setup' in base else '02_verificacion'
                sub = os.path.relpath(dirpath, abs_base).replace('\\', '/')
                sub = '' if sub == '.' else sub
                with open(ruta_abs, 'r', encoding='utf-8', errors='replace') as f:
                    contenido = f.read()
                scripts.append({
                    'ruta': rel,
                    'carpeta': carpeta,
                    'subcarpeta': sub,
                    'nombre': nombre,
                    'ext': ext.lstrip('.'),
                    'lenguaje': lenguaje_por_ext(ext),
                    'contenido': contenido,
                })
    orden = {'01_setup': 0, '02_verificacion': 1}
    scripts.sort(key=lambda s: (orden.get(s['carpeta'], 9), s['ruta']))
    return scripts


# --------------------------------------------------------------------------
# Metadatos
# --------------------------------------------------------------------------
def construir_meta(texto):
    lineas = [l.strip() for l in texto.splitlines()]
    titulo = ''
    for l in lineas:
        if l.startswith('# '):
            titulo = l[2:].strip()
            break
    # Línea de curso: 'Administración... · Escuela... · Prof. ... · II Ciclo 2026'
    curso = escuela = profesor = ciclo = ''
    for l in lineas:
        if '·' in l and 'Prof.' in l:
            partes = [p.strip() for p in l.split('·')]
            if len(partes) >= 1:
                curso = partes[0]
            for p in partes:
                if p.lower().startswith('escuela') or 'Universidad' in p:
                    escuela = p
                elif p.startswith('Prof.'):
                    profesor = p.replace('Prof.', '').strip()
                elif 'Ciclo' in p:
                    ciclo = p
            break
    return {
        'titulo': titulo,
        'curso': curso,
        'escuela': escuela,
        'profesor': profesor,
        'ciclo': ciclo,
        'autor': AUTOR,
        'fecha': '21 de octubre de 2026',
    }


# --------------------------------------------------------------------------
# Programa principal
# --------------------------------------------------------------------------
def main():
    if not os.path.isfile(INFORME):
        print('ERROR: no existe %s' % INFORME, file=sys.stderr)
        return 1
    texto = leer(INFORME)
    lineas = texto.splitlines()

    data = {}
    data['meta'] = construir_meta(texto)
    data['phva'] = seccion(lineas, '### 3.1 Ciclo PHVA aplicado')
    data['entorno'] = seccion(lineas, '### 3.2 Entorno de trabajo')
    data['capacidades'] = seccion(lineas, '### 3.3 Capacidades de seguridad verificadas')
    data['perfiles'] = seccion(lineas, '### 3.4 Escenario de datos')
    data['riesgos'] = enriquecer_riesgos(seccion(lineas, '## 4. Riesgos de confidencialidad'))
    data['tareas'] = enriquecer_tareas(seccion(lineas, '## 5. Tareas críticas del DBA'))
    data['controles'] = construir_controles(lineas)
    data['observables'] = enriquecer_observables(
        seccion(lineas, '## 7. Controles observables por auditor externo'))
    data['escala'] = seccion(lineas, '### 8.1 Escala de madurez')
    data['matriz'] = enriquecer_matriz(seccion(lineas, '### 8.2 Matriz'))
    data['usuarios'] = seccion(lineas, '### 9.1 Usuarios y roles de prueba')
    data['pruebas'] = construir_pruebas(lineas)
    data['remediacion'] = seccion(lineas, '## 10. Plan de remediación')
    data['referencias'] = construir_referencias(texto)
    data['prompts'] = construir_prompts()
    data['scripts'] = construir_scripts()

    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    cuerpo = json.dumps(data, ensure_ascii=False, indent=2)
    with open(SALIDA, 'w', encoding='utf-8') as f:
        f.write('// Generado por build_data.py a partir de docs/informe.md. No editar a mano.\n')
        f.write('const DATA = ')
        f.write(cuerpo)
        f.write(';\n')
        f.write('if (typeof module !== "undefined") { module.exports = DATA; }\n')

    # Informe de conteos en consola.
    print('data.js generado en %s' % os.path.relpath(SALIDA, RAIZ))
    print('Conteos por sección:')
    conteos = [
        ('PHVA (3.1)', len(data['phva']['rows'])),
        ('Entorno (3.2)', len(data['entorno']['rows'])),
        ('Capacidades (3.3)', len(data['capacidades']['rows'])),
        ('Perfiles (3.4)', len(data['perfiles']['rows'])),
        ('Riesgos (4)', len(data['riesgos']['rows'])),
        ('Tareas (5)', len(data['tareas']['rows'])),
        ('Controles mapeados (6)', len(data['controles'])),
        ('Observables (7)', len(data['observables']['rows'])),
        ('Escala (8.1)', len(data['escala']['rows'])),
        ('Matriz (8.2)', len(data['matriz']['rows'])),
        ('Usuarios (9.1)', len(data['usuarios']['rows'])),
        ('Pruebas (9.2+9.4)', len(data['pruebas'])),
        ('Remediación (10)', len(data['remediacion']['rows'])),
        ('Referencias', len(data['referencias'])),
        ('Prompts de IA', len(data['prompts']['rows'])),
        ('Scripts', len(data['scripts'])),
    ]
    for nombre, n in conteos:
        print('  %-26s %3d' % (nombre, n))

    # Pruebas sin resultado o sin evidencia (para control de calidad).
    sin_estado = [p['id'] for p in data['pruebas'] if not p['estado']]
    sin_evid = [p['id'] for p in data['pruebas'] if not p['evidencia']]
    if sin_estado:
        print('  AVISO: pruebas sin estado: %s' % ', '.join(sin_estado))
    if sin_evid:
        print('  AVISO: pruebas sin archivo de evidencia: %s' % ', '.join(sin_evid))
    return 0


if __name__ == '__main__':
    sys.exit(main())
