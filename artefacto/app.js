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

  function kpi(n, titulo, detalle) {
    var k = el('div', 'kpi'); k.appendChild(el('div', 'n', String(n))); k.appendChild(el('div', 't', titulo));
    if (detalle) { var d = el('div', 'd'); d.innerHTML = detalle; k.appendChild(d); } return k;
  }

  // ---- Estado e historial -------------------------------------------------
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fechaCorta(iso) {
    var p = String(iso).split('-');
    return parseInt(p[2], 10) + ' ' + MESES[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function evaluaciones() { return DATA.historial.evaluaciones; }
  function estadoIndice(pct) {
    if (pct >= 90) return { clase: 'cumple', icono: '✓', texto: 'Buen estado' };
    if (pct >= 70) return { clase: 'parcial', icono: '!', texto: 'Requiere atención' };
    return { clase: 'no', icono: '✕', texto: 'En riesgo' };
  }
  function claseEstado(e) { return e === 'Cumple' ? 'cumple' : (e === 'Parcial' ? 'parcial' : 'no'); }
  function iconoEstado(e) { return e === 'Cumple' ? '✓' : (e === 'Parcial' ? '~' : '✕'); }
  function conSigno(n) { return (n > 0 ? '+' : '') + n; }
  function contarEstados(controles) {
    var c = { Cumple: 0, Parcial: 0, 'No cumple': 0 };
    Object.keys(controles).forEach(function (k) { c[controles[k]]++; });
    return c;
  }
  function miniLeyenda() { return el('p', 'mini-leyenda', DATA.historial.leyenda); }

  function controlPorCodigo(codigo) { return DATA.controles.filter(function (c) { return c.codigo === codigo; })[0]; }
  function matrizPorCodigo(codigo) { return DATA.matriz.rows.filter(function (m) { return m.control_codigo === codigo; })[0]; }
  function hallazgosDe(codigo) {
    return DATA.remediacion.rows.filter(function (h) {
      return String(h.control).split(',').map(function (s) { return s.trim(); }).indexOf(codigo) >= 0;
    });
  }

  // Línea de tendencia sin ejes para el encabezado del estado general.
  function tendencia() {
    var ev = evaluaciones(), W = 240, H = 64, m = 7;
    function x(i) { return m + (W - 2 * m) * i / (ev.length - 1); }
    function y(p) { return m + (H - 2 * m) * (1 - p / 100); }
    var puntos = ev.map(function (e, i) { return x(i).toFixed(1) + ',' + y(e.pct).toFixed(1); }).join(' ');
    var u = ev[ev.length - 1];
    var w = el('div', 'tendencia');
    w.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Tendencia del índice: de ' +
      ev[0].pct + ' % a ' + u.pct + ' % en ' + ev.length + ' evaluaciones">' +
      '<polyline class="graf-linea" points="' + puntos + '"/>' +
      '<circle class="graf-punto" r="4" cx="' + x(ev.length - 1).toFixed(1) + '" cy="' + y(u.pct).toFixed(1) + '"/></svg>';
    return w;
  }

  function encabezadoEstado() {
    var ev = evaluaciones(), act = ev[ev.length - 1], prev = ev[ev.length - 2];
    var est = estadoIndice(act.pct), c = contarEstados(act.controles), total = Object.keys(act.controles).length;
    var hero = el('section', 'hero borde-' + est.clase);
    hero.setAttribute('aria-label', 'Estado general de la base de datos');

    var izq = el('div', 'hero-indice');
    izq.appendChild(el('div', 'hero-etq', '¿Cómo se encuentra la base de datos?'));
    var fila = el('div', 'hero-fila');
    fila.appendChild(el('span', 'hero-n', act.pct + ' %'));
    fila.appendChild(el('span', 'insignia hero-estado est-' + est.clase, est.icono + ' ' + est.texto));
    izq.appendChild(fila);
    izq.appendChild(el('p', 'hero-texto', act.total_cumple + ' de ' + act.total + ' pruebas cumplen. De ' + total +
      ' controles, ' + c.Cumple + ' cumplen, ' + c.Parcial + ' son parciales y ' + c['No cumple'] + ' no cumplen.'));
    izq.appendChild(el('p', 'mini-leyenda', 'Índice: porcentaje de pruebas que cumplen. Buen estado desde 90 %, requiere atención desde 70 %, en riesgo por debajo de 70 %.'));
    hero.appendChild(izq);

    var der = el('div', 'hero-evolucion');
    der.appendChild(el('div', 'hero-etq', 'Evolución'));
    der.appendChild(tendencia());
    der.appendChild(el('div', 'hero-delta', ev[0].pct + ' % → ' + act.pct + ' % · ' +
      conSigno(act.pct - prev.pct) + ' pts desde ' + prev.id));
    var a = el('a', null, 'Ver las ' + ev.length + ' evaluaciones'); a.href = '#evolucion';
    der.appendChild(a);
    der.appendChild(miniLeyenda());
    hero.appendChild(der);
    return hero;
  }

  function panelAtencion() {
    var act = evaluaciones()[evaluaciones().length - 1];
    var grid = el('div', 'rejilla atencion');

    var ctl = el('div', 'ficha');
    ctl.appendChild(el('h4', null, 'Controles por atender'));
    DATA.matriz.rows.filter(function (m) { return act.controles[m.control_codigo] !== 'Cumple'; }).forEach(function (m) {
      var f = el('div', 'fila-aviso');
      f.appendChild(chipDetalle('control', m.control_codigo, m.control));
      f.appendChild(insigniaEstado(act.controles[m.control_codigo]));
      ctl.appendChild(f);
    });
    grid.appendChild(ctl);

    var hal = el('div', 'ficha');
    hal.appendChild(el('h4', null, 'Hallazgos prioritarios'));
    DATA.remediacion.rows.filter(function (h) { return h.id === 'H-01' || h.id === 'H-02'; }).forEach(function (h) {
      var f = el('div', 'fila-aviso');
      var t = el('div'); t.innerHTML = '<strong>' + esc(h.id) + '.</strong> ' + fmt(h.hallazgo);
      f.appendChild(t);
      f.appendChild(el('span', 'insignia est-parcial', h.plazo));
      hal.appendChild(f);
    });
    grid.appendChild(hal);
    return grid;
  }

  function tarjetasRiesgo() {
    var grid = el('div', 'rejilla riesgos-estado');
    DATA.riesgos.rows.forEach(function (r) {
      var ctrls = DATA.matriz.rows.filter(function (m) { return m.riesgos_list.indexOf(r.id) >= 0; });
      var ok = ctrls.filter(function (m) { return m.estado === 'Cumple'; }).length;
      var b = el('button', 'riesgo-tarjeta'); b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog');
      b.appendChild(el('span', 'riesgo-id', r.id));
      b.appendChild(el('span', 'riesgo-nombre', r.riesgo));
      var barra = el('span', 'barra-progreso'); var rel = el('i');
      rel.style.width = Math.round(100 * ok / (ctrls.length || 1)) + '%';
      barra.appendChild(rel); b.appendChild(barra);
      b.appendChild(el('span', 'riesgo-pie', ok + ' de ' + ctrls.length + ' controles cumplen · Nivel ' + r.nivel));
      b.addEventListener('click', function () { abrirDetalle('riesgo', r.id); });
      grid.appendChild(b);
    });
    return grid;
  }

  // ---- Panel de detalle: tarea, riesgo o control ----------------------------
  var panelDetalle = null, fondoDetalle = null, cuerpoDetalle = null, btnVolver = null;
  var pilaDetalle = [], actualDetalle = null, origenDetalle = null;

  function chipDetalle(tipo, id, texto) {
    var b = el('button', 'chip enlace', texto); b.type = 'button';
    b.setAttribute('aria-haspopup', 'dialog');
    b.addEventListener('click', function () { abrirDetalle(tipo, id); });
    return b;
  }
  function chips(tipo, ids) {
    var w = el('div', 'chips');
    ids.forEach(function (id) { w.appendChild(chipDetalle(tipo, id, id)); });
    return w;
  }
  function bloqueDetalle(titulo, contenido) {
    var s = el('div', 'detalle-bloque');
    s.appendChild(el('h4', null, titulo));
    if (typeof contenido === 'string') { var p = el('p'); p.innerHTML = contenido; s.appendChild(p); }
    else s.appendChild(contenido);
    cuerpoDetalle.appendChild(s);
  }
  function tituloDetalle(etiqueta, texto) {
    cuerpoDetalle.appendChild(el('div', 'detalle-tipo', etiqueta));
    var h = el('h3', null, texto); h.id = 'detalle-titulo';
    cuerpoDetalle.appendChild(h);
  }
  function chipsControl(codigos) {
    var w = el('div', 'chips');
    codigos.forEach(function (cod) {
      var m = matrizPorCodigo(cod);
      w.appendChild(chipDetalle('control', cod, iconoEstado(m.estado) + ' ' + m.control));
    });
    return w;
  }

  var pintores = {
    tarea: function (id) {
      var t = DATA.tareas.rows.filter(function (x) { return x.id === id; })[0];
      tituloDetalle('Tarea del DBA · ' + t.id, t.tarea);
      bloqueDetalle('Qué hace el DBA', fmt(t.actividad_del_dba_en_la_clinica));
      bloqueDetalle('Riesgos relacionados', chips('riesgo', t.riesgos_list));
      bloqueDetalle('Controles que la protegen', chipsControl(DATA.controles.filter(function (c) {
        return c.tareas_list.indexOf(t.id) >= 0;
      }).map(function (c) { return c.codigo; })));
    },
    riesgo: function (id) {
      var r = DATA.riesgos.rows.filter(function (x) { return x.id === id; })[0];
      tituloDetalle('Riesgo · ' + r.id, r.riesgo);
      var e = el('div', 'chips');
      e.appendChild(el('span', 'insignia est-' + (r.nivel_num <= 6 ? 'cumple' : (r.nivel_num <= 12 ? 'parcial' : 'no')), 'Nivel ' + r.nivel));
      e.appendChild(el('span', 'chip', 'Probabilidad ' + r.p));
      e.appendChild(el('span', 'chip', 'Impacto ' + r.i));
      cuerpoDetalle.appendChild(e);
      bloqueDetalle('Escenario en la clínica', fmt(r.escenario_en_la_clinica));
      bloqueDetalle('Activo afectado', fmt(r.activo_afectado));
      bloqueDetalle('Tareas relacionadas', chips('tarea', DATA.tareas.rows.filter(function (t) {
        return t.riesgos_list.indexOf(r.id) >= 0;
      }).map(function (t) { return t.id; })));
      bloqueDetalle('Controles que lo mitigan', chipsControl(DATA.controles.filter(function (c) {
        return c.riesgos_list.indexOf(r.id) >= 0;
      }).map(function (c) { return c.codigo; })));
    },
    control: function (codigo) {
      var c = controlPorCodigo(codigo), m = matrizPorCodigo(codigo);
      tituloDetalle('Control · ' + c.tema_label, c.codigo + ' ' + c.nombre);
      var e = el('div', 'chips');
      e.appendChild(insigniaEstado(m.estado));
      e.appendChild(el('span', 'chip', 'Madurez ' + m.criterio_0_4));
      cuerpoDetalle.appendChild(e);
      bloqueDetalle('Por qué importa', fmt(c.justificacion));
      bloqueDetalle('Cómo se implementa', fmt(c.implementacion));

      var ev = evaluaciones(), tira = el('div');
      var celdas = el('div', 'tira');
      ev.forEach(function (x) {
        var est = x.controles[codigo];
        var s = el('span', 'est-' + claseEstado(est), iconoEstado(est));
        s.title = x.id + ' · ' + fechaCorta(x.fecha) + ': ' + est;
        celdas.appendChild(s);
      });
      tira.appendChild(celdas);
      tira.appendChild(el('div', 'tira-pie', ev[0].id + ' → ' + ev[ev.length - 1].id));
      tira.appendChild(miniLeyenda());
      bloqueDetalle('Evolución', tira);

      var prs = DATA.pruebas.filter(function (p) { return p.control === codigo; });
      if (prs.length) {
        var lista = el('div');
        prs.forEach(function (p) {
          var f = el('div', 'fila-prueba');
          var cab = el('div', 'fila-prueba-cab');
          cab.appendChild(el('strong', null, p.id)); cab.appendChild(insigniaEstado(p.estado));
          f.appendChild(cab);
          var d = el('div'); d.innerHTML = fmt(p.obtenido); f.appendChild(d);
          lista.appendChild(f);
        });
        bloqueDetalle('Pruebas', lista);
      } else {
        bloqueDetalle('Pruebas', 'Sin prueba propia: se documenta con un script informativo.');
      }
      var hs = hallazgosDe(codigo);
      if (hs.length) {
        var lh = el('div');
        hs.forEach(function (h) {
          var p = el('p'); p.innerHTML = '<strong>' + esc(h.id) + ' (' + esc(h.plazo) + ').</strong> ' + fmt(h.accion_propuesta);
          lh.appendChild(p);
        });
        bloqueDetalle('Remediación pendiente', lh);
      }
      bloqueDetalle('Tareas relacionadas', chips('tarea', c.tareas_list));
      bloqueDetalle('Riesgos relacionados', chips('riesgo', c.riesgos_list));

      var ver = el('div', 'chips');
      if (m.evidencia_archivo) {
        var a = el('a', null, m.evidencia_archivo.replace('evidencias/', ''));
        a.href = '../' + m.evidencia_archivo; a.target = '_blank'; a.rel = 'noopener';
        ver.appendChild(a);
      }
      bloqueDetalle('Evidencia', ver);
    }
  };

  function crearDetalle() {
    fondoDetalle = el('div', 'detalle-fondo'); fondoDetalle.hidden = true;
    fondoDetalle.addEventListener('click', cerrarDetalle);
    panelDetalle = el('aside', 'detalle'); panelDetalle.hidden = true; panelDetalle.tabIndex = -1;
    panelDetalle.setAttribute('role', 'dialog'); panelDetalle.setAttribute('aria-modal', 'true');
    panelDetalle.setAttribute('aria-labelledby', 'detalle-titulo');
    var cab = el('div', 'detalle-cab');
    btnVolver = el('button', 'btn-detalle', '← Volver'); btnVolver.type = 'button';
    btnVolver.addEventListener('click', function () {
      var previo = pilaDetalle.pop();
      if (previo) mostrarDetalle(previo.tipo, previo.id);
    });
    var cerrar = el('button', 'btn-detalle', '✕ Cerrar'); cerrar.type = 'button'; cerrar.style.marginLeft = 'auto';
    cerrar.addEventListener('click', cerrarDetalle);
    cab.appendChild(btnVolver); cab.appendChild(cerrar); panelDetalle.appendChild(cab);
    cuerpoDetalle = el('div', 'detalle-cuerpo'); panelDetalle.appendChild(cuerpoDetalle);
    panelDetalle.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { cerrarDetalle(); return; }
      if (e.key !== 'Tab') return;
      var focos = Array.prototype.filter.call(panelDetalle.querySelectorAll('a, button'), function (x) { return !x.hidden; });
      var pri = focos[0], ult = focos[focos.length - 1];
      if (e.shiftKey && (document.activeElement === pri || document.activeElement === panelDetalle)) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    });
    document.body.appendChild(fondoDetalle); document.body.appendChild(panelDetalle);
  }

  function mostrarDetalle(tipo, id) {
    cuerpoDetalle.innerHTML = '';
    pintores[tipo](id);
    actualDetalle = { tipo: tipo, id: id };
    btnVolver.hidden = pilaDetalle.length === 0;
    panelDetalle.scrollTop = 0;
    panelDetalle.focus();
  }

  function abrirDetalle(tipo, id) {
    if (panelDetalle.hidden) {
      origenDetalle = document.activeElement; pilaDetalle = [];
      panelDetalle.hidden = false; fondoDetalle.hidden = false;
      document.body.classList.add('detalle-abierto');
    } else if (actualDetalle) {
      pilaDetalle.push(actualDetalle);
    }
    mostrarDetalle(tipo, id);
  }

  function cerrarDetalle() {
    panelDetalle.hidden = true; fondoDetalle.hidden = true;
    document.body.classList.remove('detalle-abierto');
    if (origenDetalle && document.contains(origenDetalle)) origenDetalle.focus();
  }

  // ---- Gráfico de evolución (SVG) --------------------------------------------
  function graficoEvolucion(cont, sel, alElegir) {
    var ev = evaluaciones();
    var W = Math.max(cont.clientWidth || 760, 280), H = W < 520 ? 240 : 300;
    var m = { t: 22, r: 18, b: 30, l: 42 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    var paso = W < 520 ? 5 : (W < 760 ? 2 : 1);
    function x(i) { return m.l + iw * i / (ev.length - 1); }
    function y(p) { return m.t + ih * (1 - p / 100); }
    var s = '<svg class="graf" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H +
      '" role="group" aria-label="Índice de confidencialidad por evaluación">';
    [0, 50, 100].forEach(function (p) {
      s += '<line class="graf-rejilla" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(p) + '" y2="' + y(p) + '"/>' +
        '<text class="graf-eje" x="' + (m.l - 8) + '" y="' + (y(p) + 4) + '" text-anchor="end">' + p + ' %</text>';
    });
    [70, 90].forEach(function (p) {
      s += '<line class="graf-umbral" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(p) + '" y2="' + y(p) + '"/>';
    });
    ev.forEach(function (e, i) {
      if (i === 0 || (i + 1) % paso === 0) {
        s += '<text class="graf-eje" x="' + x(i) + '" y="' + (H - 9) + '" text-anchor="middle">' + e.id.replace('E-', '') + '</text>';
      }
    });
    s += '<line class="graf-cruz" hidden x1="0" x2="0" y1="' + m.t + '" y2="' + (m.t + ih) + '"/>';
    s += '<polyline class="graf-linea" points="' + ev.map(function (e, i) { return x(i).toFixed(1) + ',' + y(e.pct).toFixed(1); }).join(' ') + '"/>';
    s += '<circle class="graf-seleccion" r="8" cx="' + x(sel) + '" cy="' + y(ev[sel].pct) + '"/>';
    ev.forEach(function (e, i) {
      if (e.tipo === 'regresion') {
        s += '<rect class="graf-regresion" width="10" height="10" x="' + (x(i) - 5) + '" y="' + (y(e.pct) - 5) +
          '" transform="rotate(45 ' + x(i) + ' ' + y(e.pct) + ')"/>';
      } else {
        s += '<circle class="graf-punto" r="4" cx="' + x(i) + '" cy="' + y(e.pct) + '"/>';
      }
    });
    var ult = ev.length - 1;
    s += '<text class="graf-valor" x="' + x(0) + '" y="' + (y(ev[0].pct) - 12) + '">' + ev[0].pct + ' %</text>';
    s += '<text class="graf-valor" x="' + x(ult) + '" y="' + (y(ev[ult].pct) - 12) + '" text-anchor="end">' + ev[ult].pct + ' %</text>';
    var banda = iw / (ev.length - 1);
    ev.forEach(function (e, i) {
      s += '<rect class="graf-zona" tabindex="0" role="button" data-i="' + i + '" x="' + (x(i) - banda / 2) + '" y="' + m.t +
        '" width="' + banda + '" height="' + ih + '" aria-label="' + esc(e.id + ', ' + fechaCorta(e.fecha) + ': ' + e.evento + ', ' + e.pct + ' %') + '"/>';
    });
    s += '</svg><div class="graf-tip" hidden></div>';
    cont.innerHTML = s;

    var tip = cont.querySelector('.graf-tip'), cruz = cont.querySelector('.graf-cruz');
    function mostrar(i) {
      var e = ev[i];
      tip.innerHTML = '<strong>' + esc(e.id) + '</strong> · ' + esc(fechaCorta(e.fecha)) + '<br>' + esc(e.evento) +
        '<br>' + e.total_cumple + ' de ' + e.total + ' pruebas · ' + e.pct + ' %';
      tip.hidden = false;
      tip.style.left = Math.max(0, Math.min(x(i) - tip.offsetWidth / 2, W - tip.offsetWidth)) + 'px';
      tip.style.top = Math.max(0, y(e.pct) - tip.offsetHeight - 14) + 'px';
      cruz.setAttribute('x1', x(i)); cruz.setAttribute('x2', x(i)); cruz.removeAttribute('hidden');
    }
    function ocultar() { tip.hidden = true; cruz.setAttribute('hidden', ''); }
    Array.prototype.forEach.call(cont.querySelectorAll('.graf-zona'), function (z) {
      var i = parseInt(z.getAttribute('data-i'), 10);
      z.addEventListener('mouseenter', function () { mostrar(i); });
      z.addEventListener('focus', function () { mostrar(i); });
      z.addEventListener('mouseleave', ocultar);
      z.addEventListener('blur', ocultar);
      z.addEventListener('click', function () { alElegir(i); });
      z.addEventListener('keydown', function (ev2) {
        if (ev2.key === 'Enter' || ev2.key === ' ') { ev2.preventDefault(); alElegir(i); }
      });
    });
  }

  // ---- Vistas -----------------------------------------------------------
  var vistas = [];
  function vista(id, titulo, subtitulo, render) { vistas.push({ id: id, titulo: titulo, subtitulo: subtitulo, render: render }); }

  function cab(v) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el('h2', 'titulo-vista', v.titulo));
    if (v.subtitulo) frag.appendChild(el('p', 'subtitulo', v.subtitulo));
    return frag;
  }

  // 1. Estado general
  vista('resumen', 'Estado general', null, function () {
    var f = document.createDocumentFragment();
    var m = DATA.meta;
    f.appendChild(el('h1', null, m.titulo));
    f.appendChild(el('p', 'subtitulo', [m.curso, m.escuela, 'Prof. ' + m.profesor, m.ciclo].filter(Boolean).join(' · ')));

    f.appendChild(encabezadoEstado());
    f.appendChild(el('h3', null, 'Qué requiere atención'));
    f.appendChild(panelAtencion());
    f.appendChild(el('h3', null, 'Protección frente a cada riesgo'));
    f.appendChild(tarjetasRiesgo());

    f.appendChild(el('h3', null, 'Alcance del marco'));
    // Indicadores calculados desde los datos.
    var estadosMatriz = { Cumple: 0, Parcial: 0, 'No cumple': 0 };
    DATA.matriz.rows.forEach(function (r) { estadosMatriz[r.estado] = (estadosMatriz[r.estado] || 0) + 1; });
    var estadosPr = { Cumple: 0, 'No cumple': 0, Parcial: 0 };
    DATA.pruebas.forEach(function (p) { estadosPr[p.estado] = (estadosPr[p.estado] || 0) + 1; });

    var kpis = el('div', 'rejilla kpis');
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

    f.appendChild(el('h3', null, 'Datos del proyecto'));
    var ficha = el('div', 'ficha');
    var dl = el('dl', 'meta-lista');
    [['Autor', m.autor], ['Curso', m.curso], ['Profesor', m.profesor], ['Ciclo', m.ciclo], ['Fecha', m.fecha]].forEach(function (p) {
      var d = el('div'); d.appendChild(el('dt', null, p[0])); d.appendChild(el('dd', null, p[1])); dl.appendChild(d);
    });
    ficha.appendChild(dl); f.appendChild(ficha);
    return f;
  });

  // Evolución: historial de evaluaciones
  vista('evolucion', 'Evolución', 'Historial de las veinte evaluaciones: seleccione un punto para ver qué cambió.', function () {
    var f = document.createDocumentFragment(); f.appendChild(cab(this));
    var ev = evaluaciones(), act = ev[ev.length - 1], sel = ev.length - 1;
    var regresiones = ev.filter(function (e) { return e.tipo === 'regresion'; });

    var kpis = el('div', 'rejilla kpis');
    kpis.appendChild(kpi(ev.length, 'Evaluaciones', fechaCorta(ev[0].fecha) + ' a ' + fechaCorta(act.fecha)));
    kpis.appendChild(kpi(act.pct + ' %', 'Índice actual', act.total_cumple + ' de ' + act.total + ' pruebas cumplen'));
    kpis.appendChild(kpi(conSigno(act.pct - ev[0].pct) + ' pts', 'Mejora total', 'Desde ' + ev[0].pct + ' % en ' + ev[0].id));
    kpis.appendChild(kpi(regresiones.length, 'Regresiones', 'Todas corregidas en la evaluación siguiente'));
    f.appendChild(kpis);

    f.appendChild(el('h3', null, 'Índice de confidencialidad'));
    var marco = el('div', 'ficha');
    var graf = el('div', 'graf-cont'); marco.appendChild(graf);
    var ley = el('div', 'leyenda');
    ley.innerHTML = '<span><i class="ley-punto"></i>Evaluación</span>' +
      '<span><i class="ley-regresion"></i>Regresión</span>' +
      '<span><i class="ley-umbral"></i>Umbrales de 70 % y 90 %</span>';
    marco.appendChild(ley);
    marco.appendChild(miniLeyenda());
    f.appendChild(marco);

    var detalle = el('div', 'ficha eval-detalle');
    detalle.setAttribute('aria-live', 'polite');
    f.appendChild(el('h3', null, 'Evaluación seleccionada'));
    f.appendChild(detalle);

    function pintaGrafico() { graficoEvolucion(graf, sel, elegir); }

    function chipsPrueba(ids) {
      var w = el('div', 'chips');
      ids.forEach(function (id) {
        var p = DATA.pruebas.filter(function (x) { return x.id === id; })[0];
        w.appendChild(chipDetalle('control', p.control, id + ' · ' + p.control));
      });
      return w;
    }

    function pintaDetalle() {
      var e = ev[sel], c = contarEstados(e.controles);
      detalle.innerHTML = '';
      var cabeza = el('div', 'eval-cab');
      cabeza.appendChild(el('h4', null, e.id + ' · ' + fechaCorta(e.fecha)));
      var etq = { base: ['chip', 'Línea base'], mejora: ['insignia est-cumple', 'Mejora'], regresion: ['insignia est-no', 'Regresión'] }[e.tipo];
      cabeza.appendChild(el('span', etq[0], etq[1]));
      var est = estadoIndice(e.pct);
      cabeza.appendChild(el('span', 'insignia est-' + est.clase, est.icono + ' ' + e.pct + ' % · ' + est.texto));
      detalle.appendChild(cabeza);
      detalle.appendChild(el('p', 'eval-evento', e.evento));
      detalle.appendChild(el('p', null, e.detalle));
      detalle.appendChild(el('p', 'eval-datos', e.total_cumple + ' de ' + e.total + ' pruebas cumplen · Controles: ' +
        c.Cumple + ' cumplen, ' + c.Parcial + ' parciales, ' + c['No cumple'] + ' no cumplen'));
      if (e.suben.length) { detalle.appendChild(el('div', 'etq', '✓ Pasaron a Cumple')); detalle.appendChild(chipsPrueba(e.suben)); }
      if (e.bajan.length) { detalle.appendChild(el('div', 'etq', '✕ Dejaron de cumplir')); detalle.appendChild(chipsPrueba(e.bajan)); }
      if (e.origen === 'real') {
        var a = el('a', null, 'Ver el resumen de pruebas'); a.href = '../evidencias/resumen_pruebas.md';
        a.target = '_blank'; a.rel = 'noopener';
        var p = el('p'); p.appendChild(a); detalle.appendChild(p);
      }
    }

    // Evolución por control: una fila por control y una columna por evaluación.
    f.appendChild(el('h3', null, 'Evolución por control'));
    var wrap = el('div', 'tabla-wrap');
    var t = el('table', 'evol');
    var thead = document.createElement('thead'), trh = document.createElement('tr');
    trh.appendChild(el('th', null, 'Control'));
    var botones = [];
    ev.forEach(function (e, i) {
      var th = document.createElement('th');
      var b = el('button', 'col-eval', e.id.replace('E-', '')); b.type = 'button';
      b.setAttribute('aria-label', 'Ver evaluación ' + e.id);
      b.addEventListener('click', function () { elegir(i); });
      th.appendChild(b); trh.appendChild(th); botones.push(b);
    });
    thead.appendChild(trh); t.appendChild(thead);
    var tbody = document.createElement('tbody');
    DATA.matriz.rows.forEach(function (m) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.appendChild(chipDetalle('control', m.control_codigo, m.control));
      tr.appendChild(th);
      ev.forEach(function (e) {
        var est = e.controles[m.control_codigo];
        var td = el('td', 'est-' + claseEstado(est), iconoEstado(est));
        td.title = e.id + ' · ' + m.control_codigo + ': ' + est;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    t.appendChild(tbody); wrap.appendChild(t); f.appendChild(wrap);
    var ley2 = el('div', 'leyenda');
    ['Cumple', 'Parcial', 'No cumple'].forEach(function (x) {
      var s = el('span'); var i = el('i', 'ley-estado est-' + claseEstado(x), iconoEstado(x));
      s.appendChild(i); s.appendChild(document.createTextNode(x)); ley2.appendChild(s);
    });
    f.appendChild(ley2);

    f.appendChild(el('h3', null, 'Registro de evaluaciones'));
    var filas = ev.map(function (e) {
      return { id: e.id, fecha: fechaCorta(e.fecha), evento: e.evento, pruebas: e.total_cumple + ' / ' + e.total,
        indice: e.pct + ' %', variacion: e.tipo === 'base' ? '—' : conSigno(e.variacion) };
    });
    var reg = tabla({ columns: [{ key: 'id', label: 'ID' }, { key: 'fecha', label: 'Fecha' }, { key: 'evento', label: 'Evento' },
      { key: 'pruebas', label: 'Pruebas' }, { key: 'indice', label: 'Índice' }, { key: 'variacion', label: 'Cambio' }], rows: filas });
    Array.prototype.forEach.call(reg.querySelectorAll('tbody tr'), function (tr, i) {
      tr.style.cursor = 'pointer'; tr.tabIndex = 0;
      function ir() { elegir(i); detalle.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      tr.addEventListener('click', ir);
      tr.addEventListener('keypress', function (e) { if (e.key === 'Enter') ir(); });
    });
    f.appendChild(reg);
    f.appendChild(miniLeyenda());

    function elegir(i) {
      sel = i; pintaGrafico(); pintaDetalle();
      botones.forEach(function (b, j) { b.classList.toggle('activo', j === i); });
      var z = graf.querySelector('.graf-zona[data-i="' + i + '"]');
      if (z && document.activeElement === document.body) z.focus({ preventScroll: true });
    }
    this.alMostrar = pintaGrafico;
    pintaDetalle();
    botones[sel].classList.add('activo');
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
      render: {
        id: function (v) { return chipDetalle('riesgo', v, v); },
        nivel: function (v, r) {
          return el('span', 'insignia est-' + (r.nivel_num <= 6 ? 'cumple' : (r.nivel_num <= 12 ? 'parcial' : 'no')), v);
        }
      }
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
  vista('matriz', 'Matriz de evaluación', 'Madurez (0 a 4) y estado por control. Haga clic en una tarea, un riesgo o un control para ver su detalle.', function () {
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
          tarea: function (v, r) { return chips('tarea', r.tareas_list); },
          riesgo: function (v, r) { return chips('riesgo', r.riesgos_list); },
          control: function (v, r) { return chipDetalle('control', r.control_codigo, v); },
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
          control: function (v) { return chipDetalle('control', v, v); },
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
      if (act && v.alMostrar) v.alMostrar();
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
    crearDetalle();
    construir();
    activar((location.hash || '').replace('#', '') || vistas[0].id);

    window.addEventListener('hashchange', function () { activar(location.hash.replace('#', '')); });
    window.addEventListener('resize', function () {
      var v = vistas.filter(function (x) { return location.hash === '#' + x.id; })[0];
      if (v && v.alMostrar) v.alMostrar();
    });
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
