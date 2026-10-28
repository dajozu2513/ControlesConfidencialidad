/* ==========================================================================
   Artefacto ISO/IEC 27001:2022 - Confidencialidad en Oracle 21c
   Lógica de la página sin frameworks. Lee la constante global DATA (data.js).
   ========================================================================== */
(function () {
  'use strict';

  // ---- Utilidades -------------------------------------------------------
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Formato Markdown en línea: `código`, **negrita**, *cursiva*, enlaces y URLs.
  function fmt(raw) {
    if (raw == null) return '';
    var partes = String(raw).split('`');
    var out = '';
    for (var i = 0; i < partes.length; i++) {
      if (i % 2 === 1) { out += '<code>' + esc(partes[i]) + '</code>'; continue; }
      var s = esc(partes[i]);
      s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        function (m, t, u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + t + '</a>'; });
      s = s.replace(/&lt;(https?:\/\/[^&\s]+)&gt;/g,
        function (m, u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + u + '</a>'; });
      s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,
        function (m, p, u) { return p + '<a href="' + u + '" target="_blank" rel="noopener">' + u + '</a>'; });
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      out += s;
    }
    return out;
  }

  function copiar(texto, btn) {
    function ok() { var t = btn.textContent; btn.textContent = 'Copiado'; btn.classList.add('ok');
      setTimeout(function () { btn.textContent = t; btn.classList.remove('ok'); }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = texto; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta); ok();
      } catch (e) { /* silencioso */ }
    }
  }

  function bloqueCodigo(texto, lang) {
    var wrap = el('div', 'codigo');
    var pre = document.createElement('pre');
    var code = document.createElement('code');
    if (lang && lang !== 'plaintext' && lang !== 'markdown') code.className = 'language-' + lang;
    code.textContent = texto;
    pre.appendChild(code); wrap.appendChild(pre);
    var btn = el('button', 'btn-copiar', 'Copiar'); btn.type = 'button';
    btn.addEventListener('click', function () { copiar(texto, btn); });
    wrap.appendChild(btn);
    if (window.hljs && code.className) { try { window.hljs.highlightElement(code); } catch (e) {} }
    return wrap;
  }

  // Tabla genérica a partir de {columns, rows}. opts.render[key] = fn(valor, fila) -> nodo|html.
  function tabla(seccion, opts) {
    opts = opts || {};
    var cols = (seccion.columns || []).filter(function (c) {
      return !opts.omitir || opts.omitir.indexOf(c.key) < 0;
    });
    var wrap = el('div', 'tabla-wrap');
    var t = document.createElement('table');
    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    cols.forEach(function (c) { trh.appendChild(el('th', null, opts.labels && opts.labels[c.key] || c.label)); });
    thead.appendChild(trh); t.appendChild(thead);
    var tbody = document.createElement('tbody');
    (seccion.rows || []).forEach(function (fila) {
      var tr = document.createElement('tr');
      cols.forEach(function (c) {
        var td = document.createElement('td');
        var r = opts.render && opts.render[c.key];
        if (r) {
          var res = r(fila[c.key], fila);
          if (res instanceof Node) td.appendChild(res);
          else td.innerHTML = res;
        } else {
          td.innerHTML = fmt(fila[c.key]);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody); wrap.appendChild(t);
    return wrap;
  }

  function insigniaEstado(estado) {
    var e = (estado || '').toLowerCase();
    var clase = e.indexOf('no') === 0 ? 'est-no' : (e.indexOf('parcial') >= 0 ? 'est-parcial' : 'est-cumple');
    var s = el('span', 'insignia ' + clase, estado || '');
    return s;
  }

  function nivelClase(n) { return n <= 6 ? 'bajo' : (n <= 12 ? 'medio' : 'alto'); }
  function nivelPalabra(n) { return n <= 6 ? 'Bajo' : (n <= 12 ? 'Medio' : 'Alto'); }

  // ---- Vistas -----------------------------------------------------------
  var vistas = [];
  function vista(id, titulo, subtitulo, render) { vistas.push({ id: id, titulo: titulo, subtitulo: subtitulo, render: render }); }

  function cab(v) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el('h2', 'titulo-vista', v.titulo));
    if (v.subtitulo) frag.appendChild(el('p', 'subtitulo', v.subtitulo));
    return frag;
  }

  // 1. Resumen
  vista('resumen', 'Resumen', null, function () {
    var f = document.createDocumentFragment();
    var m = DATA.meta;
    f.appendChild(el('h1', null, m.titulo));
    f.appendChild(el('p', 'subtitulo', [m.curso, m.escuela, 'Prof. ' + m.profesor, m.ciclo].filter(Boolean).join(' · ')));

    var ficha = el('div', 'ficha');
    var dl = el('dl', 'meta-lista');
    [['Autor', m.autor], ['Curso', m.curso], ['Profesor', m.profesor], ['Ciclo', m.ciclo], ['Fecha', m.fecha]].forEach(function (p) {
      var d = el('div'); d.appendChild(el('dt', null, p[0])); d.appendChild(el('dd', null, p[1])); dl.appendChild(d);
    });
    ficha.appendChild(dl); f.appendChild(ficha);

    // Indicadores calculados desde los datos.
    var estadosMatriz = { Cumple: 0, Parcial: 0, 'No cumple': 0 };
    DATA.matriz.rows.forEach(function (r) { estadosMatriz[r.estado] = (estadosMatriz[r.estado] || 0) + 1; });
    var estadosPr = { Cumple: 0, 'No cumple': 0, Parcial: 0 };
    DATA.pruebas.forEach(function (p) { estadosPr[p.estado] = (estadosPr[p.estado] || 0) + 1; });

    var kpis = el('div', 'rejilla kpis');
    function kpi(n, titulo, detalle) {
      var k = el('div', 'kpi'); k.appendChild(el('div', 'n', String(n))); k.appendChild(el('div', 't', titulo));
      if (detalle) { var d = el('div', 'd'); d.innerHTML = detalle; k.appendChild(d); } return k;
    }
    kpis.appendChild(kpi(DATA.controles.length, 'Controles evaluados',
      estadosMatriz.Cumple + ' Cumple · ' + estadosMatriz.Parcial + ' Parcial'));
    kpis.appendChild(kpi(DATA.pruebas.length, 'Pruebas ejecutadas',
      estadosPr.Cumple + ' Cumple · ' + (estadosPr['No cumple'] || 0) + ' No cumple'));
    kpis.appendChild(kpi(DATA.riesgos.rows.length, 'Riesgos de confidencialidad'));
    kpis.appendChild(kpi(DATA.tareas.rows.length, 'Tareas del DBA'));
    f.appendChild(kpis);

    f.appendChild(el('h3', null, 'Ciclo PHVA'));
    var phva = el('div', 'rejilla phva');
    DATA.phva.rows.forEach(function (r) {
      var c = el('div', 'etapa');
      c.appendChild(el('h4', null, r.etapa));
      c.appendChild(el('div', null, r.actividades));
      var sec = el('div', 'sec'); sec.textContent = 'Secciones: ' + (r.secciones_del_informe || '');
      c.appendChild(sec); phva.appendChild(c);
    });
    f.appendChild(phva);
    return f;
  });

  // 2. Entorno
  vista('entorno', 'Entorno', 'Motor, capacidades de seguridad verificadas y perfiles del escenario.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    f.appendChild(el('h3', null, 'Entorno de trabajo'));
    f.appendChild(tabla(DATA.entorno));
    f.appendChild(el('h3', null, 'Capacidades de seguridad verificadas'));
    f.appendChild(tabla(DATA.capacidades, {
      render: { disponible: function (v) {
        var clase = v === 'Sí' ? 'est-cumple' : (v === 'No' ? 'est-no' : 'est-parcial');
        return el('span', 'insignia ' + clase, v);
      } }
    }));
    f.appendChild(el('h3', null, 'Perfiles del escenario (CLINICA)'));
    f.appendChild(tabla(DATA.perfiles));
    return f;
  });

  // 3. Riesgos
  vista('riesgos', 'Riesgos', 'Cinco riesgos de confidencialidad y su ubicación en el mapa de calor (probabilidad × impacto).', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    f.appendChild(tabla(DATA.riesgos, {
      omitir: ['nivel_num', 'nivel_label', 'p_num', 'i_num'],
      render: { nivel: function (v, r) {
        return el('span', 'insignia est-' + (r.nivel_num <= 6 ? 'cumple' : (r.nivel_num <= 12 ? 'parcial' : 'no')), v);
      } }
    }));

    f.appendChild(el('h3', null, 'Mapa de calor'));
    var hw = el('div', 'heat-wrap');
    var t = el('table', 'heat');
    var cap = document.createElement('caption');
    cap.textContent = 'Filas: probabilidad (1 a 5). Columnas: impacto (1 a 5). El nivel es probabilidad × impacto.';
    t.appendChild(cap);
    var thead = document.createElement('thead'); var trh = document.createElement('tr');
    trh.appendChild(el('th', null, 'P \\ I'));
    for (var i = 1; i <= 5; i++) trh.appendChild(el('th', null, String(i)));
    thead.appendChild(trh); t.appendChild(thead);
    var tbody = document.createElement('tbody');
    for (var p = 5; p >= 1; p--) {
      var tr = document.createElement('tr');
      tr.appendChild(el('th', null, String(p)));
      for (var im = 1; im <= 5; im++) {
        var n = p * im;
        var td = el('td', nivelClase(n));
        var dentro = DATA.riesgos.rows.filter(function (r) { return r.p_num === p && r.i_num === im; });
        if (dentro.length) {
          dentro.forEach(function (r) { td.appendChild(el('span', 'celda-riesgo', r.id)); });
          td.appendChild(el('span', 'celda-nivel', n + ' ' + nivelPalabra(n)));
        } else {
          td.appendChild(el('span', 'celda-nivel', n + ' ' + nivelPalabra(n)));
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    t.appendChild(tbody); hw.appendChild(t); f.appendChild(hw);

    var ley = el('div', 'leyenda');
    [['bajo', 'Bajo (1-6)'], ['medio', 'Medio (8-12)'], ['alto', 'Alto (15-25)']].forEach(function (p) {
      var s = el('span'); var i = el('i'); i.style.background = 'var(--nivel-' + p[0] + '-bg)';
      s.appendChild(i); s.appendChild(document.createTextNode(p[1])); ley.appendChild(s);
    });
    f.appendChild(ley);
    return f;
  });

  // 4. Tareas del DBA
  vista('tareas', 'Tareas del DBA', 'Doce tareas críticas. Seleccione una para ver sus riesgos y controles relacionados.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var detalle = el('div', 'ficha');
    detalle.id = 'tarea-detalle';
    detalle.innerHTML = '<em>Seleccione una tarea de la tabla para ver sus riesgos y controles.</em>';

    var riesgoNombre = {};
    DATA.riesgos.rows.forEach(function (r) { riesgoNombre[r.id] = r.riesgo; });

    function seleccionar(t, tr) {
      var tbody = tr.parentNode;
      Array.prototype.forEach.call(tbody.children, function (x) { x.style.background = ''; });
      tr.style.background = 'var(--superficie-2)';
      detalle.innerHTML = '';
      detalle.appendChild(el('h4', null, t.id + ' · ' + t.tarea));
      detalle.appendChild(el('div', null, t.actividad_del_dba_en_la_clinica || ''));
      var rb = el('div'); rb.style.marginTop = '10px';
      rb.appendChild(el('strong', null, 'Riesgos: '));
      t.riesgos_list.forEach(function (rid) {
        rb.appendChild(el('span', 'chip', rid + (riesgoNombre[rid] ? ' · ' + riesgoNombre[rid] : '')));
      });
      detalle.appendChild(rb);
      var cb = el('div'); cb.style.marginTop = '8px';
      cb.appendChild(el('strong', null, 'Controles: '));
      DATA.controles.filter(function (c) { return c.tareas_list.indexOf(t.id) >= 0; }).forEach(function (c) {
        var chip = el('span', 'chip enlace', c.codigo + ' ' + c.nombre);
        chip.setAttribute('role', 'link'); chip.tabIndex = 0;
        chip.addEventListener('click', function () { irA('mapeo'); resaltarControl(c.codigo); });
        chip.addEventListener('keypress', function (e) { if (e.key === 'Enter') { irA('mapeo'); resaltarControl(c.codigo); } });
        cb.appendChild(chip);
      });
      detalle.appendChild(cb);
    }

    f.appendChild(tabla(DATA.tareas, {
      omitir: ['riesgos_list'],
      onFila: null
    }));
    // Añadir interacción a las filas tras renderizar.
    var wrap = f.querySelector('.tabla-wrap');
    var filas = wrap.querySelectorAll('tbody tr');
    DATA.tareas.rows.forEach(function (t, idx) {
      var tr = filas[idx]; if (!tr) return;
      tr.style.cursor = 'pointer'; tr.tabIndex = 0;
      tr.addEventListener('click', function () { seleccionar(t, tr); });
      tr.addEventListener('keypress', function (e) { if (e.key === 'Enter') seleccionar(t, tr); });
    });
    f.appendChild(el('h3', null, 'Tarea seleccionada'));
    f.appendChild(detalle);
    return f;
  });

  // 5. Mapeo ISO
  var resaltarControlPendiente = null;
  vista('mapeo', 'Mapeo ISO', 'Diecisiete controles del Anexo A implementados en Oracle 21c XE. Filtre por tema o busque texto.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var filtros = el('div', 'filtros');
    var selTema = el('select'); selTema.id = 'mapeo-tema';
    [['', 'Todos los temas'], ['A5', 'Organizacionales (A5)'], ['A8', 'Tecnológicos (A8)'], ['COMP', 'Complementarios']]
      .forEach(function (o) { var op = el('option', null, o[1]); op.value = o[0]; selTema.appendChild(op); });
    var lTema = el('label', null, 'Tema'); lTema.appendChild(selTema);
    var busca = el('input'); busca.type = 'search'; busca.placeholder = 'Buscar control, tarea o texto…'; busca.id = 'mapeo-busca';
    var lBusca = el('label', null, 'Buscar'); lBusca.appendChild(busca);
    var contador = el('div', 'contador'); contador.id = 'mapeo-contador';
    filtros.appendChild(lTema); filtros.appendChild(lBusca); filtros.appendChild(contador);
    f.appendChild(filtros);

    var grid = el('div', 'rejilla controles'); grid.id = 'mapeo-grid';
    f.appendChild(grid);

    function pinta() {
      grid.innerHTML = '';
      var tema = selTema.value; var q = busca.value.trim().toLowerCase();
      var n = 0;
      DATA.controles.forEach(function (c) {
        if (tema && c.tema !== tema) return;
        var blob = (c.codigo + ' ' + c.nombre + ' ' + c.justificacion + ' ' + c.implementacion + ' ' +
          c.tareas_list.join(' ') + ' ' + c.riesgos_list.join(' ')).toLowerCase();
        if (q && blob.indexOf(q) < 0) return;
        n++;
        var card = el('div', 'control'); card.id = 'ctrl-' + c.codigo;
        var h = el('h4'); h.innerHTML = '<span class="cod">' + esc(c.codigo) + '</span> ' + esc(c.nombre);
        card.appendChild(h);
        card.appendChild(el('div', 'tema', c.tema_label));
        var pj = el('p'); pj.innerHTML = '<strong>Justificación.</strong> ' + fmt(c.justificacion); card.appendChild(pj);
        var pi = el('p'); pi.innerHTML = '<strong>Implementación.</strong> ' + fmt(c.implementacion); card.appendChild(pi);
        var tr = el('div', 'etq'); tr.innerHTML = 'Tareas: ' + c.tareas_list.map(esc).join(', ') +
          ' · Riesgos: ' + c.riesgos_list.map(esc).join(', '); card.appendChild(tr);
        card.appendChild(el('div', 'etq', 'Consulta de evidencia:'));
        // La evidencia suele venir como `consulta` en línea; se extrae el texto del código.
        var codigo = (c.evidencia.match(/`([^`]+)`/g) || []).map(function (s) { return s.replace(/`/g, ''); }).join('\n');
        if (!codigo) codigo = c.evidencia.replace(/`/g, '');
        card.appendChild(bloqueCodigo(codigo, 'sql'));
        grid.appendChild(card);
      });
      contador.textContent = n + ' de ' + DATA.controles.length + ' controles';
      if (resaltarControlPendiente) { var r = resaltarControlPendiente; resaltarControlPendiente = null; resaltarControl(r); }
    }
    selTema.addEventListener('change', pinta);
    busca.addEventListener('input', pinta);
    pinta();
    return f;
  });

  function resaltarControl(codigo) {
    var card = document.getElementById('ctrl-' + codigo);
    if (!card) { resaltarControlPendiente = codigo; return; }
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.transition = 'outline .2s'; card.style.outline = '3px solid var(--primario)';
    setTimeout(function () { card.style.outline = ''; }, 1600);
  }

  // 6. Controles observables
  vista('observables', 'Controles observables', 'Quince controles que un auditor externo puede verificar con scripts de solo lectura.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    f.appendChild(tabla(DATA.observables, {
      omitir: ['control_codigo', 'control_nombre', 'script_archivo'],
      render: {
        script_en_sql_02_verificacion: function (v, r) { return botonScript(r.script_archivo); }
      }
    }));
    return f;
  });

  function botonScript(archivo) {
    if (!archivo) return document.createTextNode('');
    var b = el('button', 'chip enlace', archivo); b.type = 'button';
    b.addEventListener('click', function () { abrirScript(archivo); });
    return b;
  }

  // 7. Matriz de evaluación
  vista('matriz', 'Matriz de evaluación', 'Madurez (0 a 4) y estado por control. La escala se muestra arriba.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    f.appendChild(el('h3', null, 'Escala de madurez'));
    f.appendChild(tabla(DATA.escala));

    f.appendChild(el('h3', null, 'Matriz'));
    var filtros = el('div', 'filtros');
    var sel = el('select'); sel.id = 'matriz-estado';
    [['', 'Todos los estados'], ['Cumple', 'Cumple'], ['Parcial', 'Parcial'], ['No cumple', 'No cumple']]
      .forEach(function (o) { var op = el('option', null, o[1]); op.value = o[0]; sel.appendChild(op); });
    var l = el('label', null, 'Estado'); l.appendChild(sel);
    var contador = el('div', 'contador');
    filtros.appendChild(l); filtros.appendChild(contador); f.appendChild(filtros);

    var cont = el('div'); f.appendChild(cont);
    function pinta() {
      cont.innerHTML = '';
      var e = sel.value;
      var rows = DATA.matriz.rows.filter(function (r) { return !e || r.estado === e; });
      contador.textContent = rows.length + ' de ' + DATA.matriz.rows.length + ' controles';
      cont.appendChild(tabla({ columns: DATA.matriz.columns, rows: rows }, {
        omitir: ['control_codigo', 'control_nombre', 'nivel_num', 'nivel_label', 'tareas_list', 'riesgos_list', 'evidencia_archivo'],
        render: {
          criterio_0_4: function (v, r) { return el('span', 'insignia madurez est-' + (r.estado === 'Cumple' ? 'cumple' : (r.estado === 'Parcial' ? 'parcial' : 'no')), v); },
          evidencia: function (v, r) {
            if (!r.evidencia_archivo) return fmt(v);
            var a = el('a', null, r.evidencia_archivo.replace('evidencias/', ''));
            a.href = '../' + r.evidencia_archivo; a.target = '_blank'; a.rel = 'noopener'; return a;
          },
          estado: function (v) { return insigniaEstado(v); }
        }
      }));
    }
    sel.addEventListener('change', pinta); pinta();
    return f;
  });

  // 8. Batería de pruebas
  vista('bateria', 'Batería de pruebas', 'Veintiséis pruebas con resultado esperado y obtenido. Enlace a la evidencia de cada una.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var tipos = unicos(DATA.pruebas.map(function (p) { return p.tipo; }));
    var controles = unicos(DATA.pruebas.map(function (p) { return p.control; }));
    var estados = unicos(DATA.pruebas.map(function (p) { return p.estado; }));

    var filtros = el('div', 'filtros');
    var selTipo = selectFiltro('Tipo', tipos);
    var selCtrl = selectFiltro('Control', controles);
    var selEst = selectFiltro('Estado', estados);
    var contador = el('div', 'contador');
    filtros.appendChild(selTipo.label); filtros.appendChild(selCtrl.label); filtros.appendChild(selEst.label);
    filtros.appendChild(contador); f.appendChild(filtros);

    var cont = el('div'); f.appendChild(cont);
    function pinta() {
      cont.innerHTML = '';
      var rows = DATA.pruebas.filter(function (p) {
        return (!selTipo.sel.value || p.tipo === selTipo.sel.value) &&
               (!selCtrl.sel.value || p.control === selCtrl.sel.value) &&
               (!selEst.sel.value || p.estado === selEst.sel.value);
      });
      contador.textContent = rows.length + ' de ' + DATA.pruebas.length + ' pruebas';
      var cols = [
        { key: 'id', label: 'ID' }, { key: 'tipo', label: 'Tipo' }, { key: 'control', label: 'Control' },
        { key: 'procedimiento', label: 'Procedimiento' }, { key: 'esperado', label: 'Resultado esperado' },
        { key: 'obtenido', label: 'Resultado obtenido' }, { key: 'estado', label: 'Estado' },
        { key: 'evidencia', label: 'Evidencia' }
      ];
      cont.appendChild(tabla({ columns: cols, rows: rows }, {
        render: {
          estado: function (v) { return insigniaEstado(v); },
          evidencia: function (v) {
            if (!v) return document.createTextNode('—');
            var a = el('a', null, v.replace('../evidencias/', '')); a.href = v; a.target = '_blank'; a.rel = 'noopener'; return a;
          }
        }
      }));
    }
    [selTipo, selCtrl, selEst].forEach(function (s) { s.sel.addEventListener('change', pinta); });
    pinta();
    return f;
  });

  // 9. Scripts
  var scriptSeleccionado = null;
  vista('scripts', 'Scripts', 'Scripts de configuración y verificación, con resaltado de sintaxis y copia.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var visor = el('div', 'visor');
    var lista = el('div', 'visor-lista');
    var panel = el('div', 'visor-panel');
    visor.appendChild(lista); visor.appendChild(panel); f.appendChild(visor);

    var grupos = [['01_setup', 'Configuración (sql/01_setup)'], ['02_verificacion', 'Verificación (sql/02_verificacion)']];
    grupos.forEach(function (g) {
      lista.appendChild(el('div', 'grupo', g[1]));
      DATA.scripts.filter(function (s) { return s.carpeta === g[0]; }).forEach(function (s) {
        var b = el('button', null, (s.subcarpeta ? s.subcarpeta + '/' : '') + s.nombre);
        b.type = 'button'; b.setAttribute('data-nombre', s.nombre);
        b.addEventListener('click', function () { mostrar(s, b); });
        lista.appendChild(b);
      });
    });

    function mostrar(s, btn) {
      Array.prototype.forEach.call(lista.querySelectorAll('button'), function (x) { x.classList.remove('activo'); });
      if (btn) btn.classList.add('activo');
      panel.innerHTML = '';
      var cabd = el('div', 'cab');
      cabd.appendChild(el('span', 'ruta', s.ruta));
      var repo = el('a', null, 'Abrir el archivo'); repo.href = '../' + s.ruta; repo.target = '_blank'; repo.rel = 'noopener';
      cabd.appendChild(repo);
      panel.appendChild(cabd);
      panel.appendChild(bloqueCodigo(s.contenido, s.lenguaje));
      scriptSeleccionado = s.nombre;
    }

    // Selector reutilizable: lo invoca abrirScript() tras cambiar de vista.
    seleccionarScriptRef = function (nombre) {
      var botones = lista.querySelectorAll('button');
      for (var i = 0; i < botones.length; i++) {
        if (botones[i].getAttribute('data-nombre') === nombre) {
          var s = DATA.scripts.filter(function (x) { return x.nombre === nombre; })[0];
          mostrar(s, botones[i]);
          return true;
        }
      }
      return false;
    };
    // Selección inicial: el primer script.
    if (DATA.scripts[0]) seleccionarScriptRef(DATA.scripts[0].nombre);
    return f;
  });

  var seleccionarScriptRef = null;
  function abrirScript(nombre) {
    irA('scripts');
    if (seleccionarScriptRef) seleccionarScriptRef(nombre);
  }

  // 10. Remediación
  vista('remediacion', 'Remediación', 'Plan de acción (Actuar), ordenado por plazo.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var rows = DATA.remediacion.rows.slice().sort(function (a, b) { return dias(a.plazo) - dias(b.plazo); });
    f.appendChild(tabla({ columns: DATA.remediacion.columns, rows: rows }));
    return f;
  });
  function dias(txt) { var m = String(txt || '').match(/(\d+)/); return m ? parseInt(m[1], 10) : 9999; }

  // 11. Uso de IA
  vista('ia', 'Uso de IA', 'Registro de prompts: herramienta, prompt exacto, aporte, validación y fuente.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var cols = DATA.prompts.columns.filter(function (c) { return c.key !== 'fecha'; });
    var promptKey = null;
    cols.forEach(function (c) { if (c.key.indexOf('prompt') >= 0) promptKey = c.key; });
    f.appendChild(tabla({ columns: cols, rows: DATA.prompts.rows }, {
      render: (function () {
        var r = {};
        if (promptKey) r[promptKey] = function (v) {
          var wrap = el('div', 'prompt-celda');
          var p = el('div', 'prompt-texto recortado'); p.textContent = v;
          wrap.appendChild(p);
          if ((v || '').length > 160) {
            var b = el('button', 'btn-expandir', 'Ver completo'); b.type = 'button';
            b.addEventListener('click', function () {
              var ab = p.classList.toggle('recortado');
              b.textContent = ab ? 'Ver completo' : 'Ver menos';
            });
            wrap.appendChild(b);
          }
          return wrap;
        };
        return r;
      })()
    }));
    return f;
  });

  // 12. Referencias
  vista('referencias', 'Referencias', 'Fuentes citadas en formato APA 7.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var ul = el('ul', 'refs');
    DATA.referencias.forEach(function (r) { var li = document.createElement('li'); li.innerHTML = fmt(r.texto); ul.appendChild(li); });
    f.appendChild(ul);
    return f;
  });

  // ---- Infraestructura: selects, nav, enrutado, tema ---------------------
  function unicos(arr) { var o = {}; arr.forEach(function (x) { if (x) o[x] = 1; }); return Object.keys(o).sort(); }
  function selectFiltro(nombre, valores) {
    var sel = el('select'); var todos = el('option', null, 'Todos'); todos.value = ''; sel.appendChild(todos);
    valores.forEach(function (v) { var op = el('option', null, v); op.value = v; sel.appendChild(op); });
    var label = el('label', null, nombre); label.appendChild(sel);
    return { sel: sel, label: label };
  }

  function construir() {
    var cont = document.getElementById('vistas');
    var navLista = document.getElementById('nav-lista');
    vistas.forEach(function (v, idx) {
      var sec = el('section', 'vista'); sec.id = 'v-' + v.id; sec.setAttribute('aria-labelledby', 'nav-' + v.id);
      sec.appendChild(v.render.call(v));
      cont.appendChild(sec);
      var li = document.createElement('li');
      var a = el('a'); a.href = '#' + v.id; a.id = 'nav-' + v.id;
      a.innerHTML = '<span class="num">' + (idx + 1) + '</span><span>' + esc(v.titulo) + '</span>';
      a.addEventListener('click', function () { cerrarMenu(); });
      li.appendChild(a); navLista.appendChild(li);
    });
  }

  function irA(id) { if (location.hash !== '#' + id) location.hash = id; else activar(id); }

  function activar(id) {
    var existe = vistas.some(function (v) { return v.id === id; });
    if (!existe) id = vistas[0].id;
    vistas.forEach(function (v) {
      var sec = document.getElementById('v-' + v.id);
      var a = document.getElementById('nav-' + v.id);
      var act = v.id === id;
      sec.classList.toggle('activa', act);
      a.classList.toggle('activo', act);
      if (act) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var main = document.getElementById('contenido');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function cerrarMenu() { document.getElementById('nav').classList.remove('abierto');
    document.getElementById('btn-menu').setAttribute('aria-expanded', 'false'); }

  // Tema claro/oscuro.
  function sistemaOscuro() { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
  function temaEfectivo() {
    var attr = document.documentElement.getAttribute('data-tema');
    if (attr) return attr;
    return sistemaOscuro() ? 'dark' : 'light';
  }
  function aplicarHljs(oscuro) {
    var lz = document.getElementById('hljs-light'), dk = document.getElementById('hljs-dark');
    if (lz) lz.disabled = oscuro; if (dk) dk.disabled = !oscuro;
  }
  function fijarTema(t) {
    document.documentElement.setAttribute('data-tema', t);
    try { localStorage.setItem('tema', t); } catch (e) {}
    aplicarHljs(t === 'dark');
  }
  function initTema() {
    var guardado = null;
    try { guardado = localStorage.getItem('tema'); } catch (e) {}
    if (guardado) document.documentElement.setAttribute('data-tema', guardado);
    aplicarHljs(temaEfectivo() === 'dark');
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (!document.documentElement.getAttribute('data-tema')) aplicarHljs(sistemaOscuro());
      });
    }
  }

  // ---- Arranque ---------------------------------------------------------
  function init() {
    if (typeof DATA === 'undefined') {
      document.getElementById('vistas').innerHTML = '<p>No se pudieron cargar los datos (data.js). Ejecute build_data.py.</p>';
      return;
    }
    initTema();
    construir();
    activar((location.hash || '').replace('#', '') || vistas[0].id);

    window.addEventListener('hashchange', function () { activar(location.hash.replace('#', '')); });
    document.getElementById('btn-menu').addEventListener('click', function () {
      var nav = document.getElementById('nav'); var abierto = nav.classList.toggle('abierto');
      this.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    document.getElementById('btn-tema').addEventListener('click', function () {
      fijarTema(temaEfectivo() === 'dark' ? 'light' : 'dark');
    });
  }

  // Exponer para enlaces internos.
  window.abrirScript = abrirScript;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
