'use client';

import "./que-nota-soy.css";
import { useState, useEffect, useRef, useCallback } from "react";

/*
  MINIJUEGO 1 — "¿Qué nota soy?"  ·  Empíricamente
  -------------------------------------------------
  3 niveles internos:
    Nivel 1: nota ↔ cifrado (Do↔C), en ambas direcciones, al azar
    Nivel 2: muestra una cuerda al aire → ¿qué nota es?
    Nivel 3: muestra traste (0–12) + cuerda → ¿qué nota es?
  3 instrumentos: guitarra acústica, eléctrica, bajo.

  Tipografías: Unbounded (display) + Space Grotesk (UI) + Space Mono (datos).
  Para producción en Next.js puedes cargarlas con next/font en vez del @import.

  INTEGRACIÓN FUTURA (cuentas de alumnos):
    Prop opcional `onComplete(resultado)`. Al terminar una partida entrega:
      { instrumento, nivel, aciertos, intentos, rachaMax, precision, fecha }
    >>> AQUÍ se conecta a la base de datos / perfil del alumno cuando armemos las cuentas. <<<
    Por ahora el récord vive solo en la sesión, como acordamos.
*/

const CHROM = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const A_NOMBRE = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };
const NATS = ["C", "D", "E", "F", "G", "A", "B"];
const NOMBRES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

const INSTRUMENTOS = {
  acustica: {
    label: "Acústica", tipo: "cuerdas",
    cuerdas: [
      { n: 6, nota: "E" }, { n: 5, nota: "A" }, { n: 4, nota: "D" },
      { n: 3, nota: "G" }, { n: 2, nota: "B" }, { n: 1, nota: "E" },
    ],
  },
  electrica: {
    label: "Eléctrica", tipo: "cuerdas",
    cuerdas: [
      { n: 6, nota: "E" }, { n: 5, nota: "A" }, { n: 4, nota: "D" },
      { n: 3, nota: "G" }, { n: 2, nota: "B" }, { n: 1, nota: "E" },
    ],
  },
  bajo: {
    label: "Bajo", tipo: "cuerdas",
    cuerdas: [
      { n: 4, nota: "E" }, { n: 3, nota: "A" }, { n: 2, nota: "D" }, { n: 1, nota: "G" },
    ],
  },
  piano: {
    label: "Piano", tipo: "teclado",
  },
};

const DURACION = 120;

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
function distractores(correcto, pool, cantidad) {
  return shuffle(pool.filter((x) => x !== correcto)).slice(0, cantidad);
}
function notaEnTraste(notaAlAire, traste) {
  return CHROM[(CHROM.indexOf(notaAlAire) + traste) % 12];
}

function generarReto(instrumento, nivel) {
  const inst = INSTRUMENTOS[instrumento];

  if (nivel === 1) {
    const dir = Math.random() < 0.5 ? "aCifrado" : "aNombre";
    const nat = rnd(NATS);
    if (dir === "aCifrado") {
      const correcto = nat;
      return {
        nivel: 1, pregunta: "¿Cuál es el cifrado de esta nota?",
        display: { tipo: "tile", texto: A_NOMBRE[nat], sub: "nota" },
        correcto, opciones: shuffle([correcto, ...distractores(correcto, NATS, 3)]),
      };
    }
    const correcto = A_NOMBRE[nat];
    return {
      nivel: 1, pregunta: "¿Qué nota es este cifrado?",
      display: { tipo: "tile", texto: nat, sub: "cifrado" },
      correcto, opciones: shuffle([correcto, ...distractores(correcto, NOMBRES, 3)]),
    };
  }

  // ---- PIANO (teclado) ----
  if (inst.tipo === "teclado") {
    if (nivel === 2) {
      const correcto = rnd(NATS); // solo teclas blancas, 1 octava
      return {
        nivel: 2, pregunta: "¿Qué nota es esta tecla?",
        display: { tipo: "teclado", octavas: 1, highlight: { nota: correcto, octava: 0 } },
        correcto, opciones: shuffle([correcto, ...distractores(correcto, NATS, 3)]),
      };
    }
    // nivel 3: 2 octavas, cualquier tecla (incluidas negras), posición específica
    const correcto = rnd(CHROM);
    const octava = Math.floor(Math.random() * 2); // 0 = baja, 1 = alta
    return {
      nivel: 3, pregunta: "¿Qué nota es esta tecla?",
      display: { tipo: "teclado", octavas: 2, highlight: { nota: correcto, octava } },
      correcto, opciones: shuffle([correcto, ...distractores(correcto, CHROM, 3)]),
    };
  }

  // ---- CUERDAS (guitarra / bajo) ----
  if (nivel === 2) {
    const idx = Math.floor(Math.random() * inst.cuerdas.length);
    const correcto = inst.cuerdas[idx].nota;
    return {
      nivel: 2, pregunta: "¿Qué nota da esta cuerda al aire?",
      display: { tipo: "fret", instrumento, highlight: { stringIndex: idx, traste: 0 } },
      correcto, opciones: shuffle([correcto, ...distractores(correcto, NATS, 3)]),
    };
  }

  const idx = Math.floor(Math.random() * inst.cuerdas.length);
  const traste = 1 + Math.floor(Math.random() * 12);
  const correcto = notaEnTraste(inst.cuerdas[idx].nota, traste);
  return {
    nivel: 3, pregunta: "¿Qué nota suena en esta posición?",
    display: { tipo: "fret", instrumento, highlight: { stringIndex: idx, traste } },
    correcto, opciones: shuffle([correcto, ...distractores(correcto, CHROM, 3)]),
  };
}

/* ---------- Diapasón (SVG) ---------- */
function Diapason({ instrumento, highlight }) {
  const cuerdas = INSTRUMENTOS[instrumento].cuerdas;
  const N = cuerdas.length;
  const FRETS = 12;
  const leftPad = 52, fretW = 42, topPad = 26, stringGap = 26, bottomPad = 30;
  const W = leftPad + FRETS * fretW + 18;
  const H = topPad + (N - 1) * stringGap + bottomPad;
  const yString = (i) => topPad + i * stringGap;
  const xFretCenter = (f) => leftPad + (f - 0.5) * fretW;
  const inlays = [3, 5, 7, 9];
  const YELLOW = "#FBC82D", BLUE = "#3088DA";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="qn-fret" preserveAspectRatio="xMidYMid meet">
      <rect x={leftPad} y={topPad - 12} width={FRETS * fretW} height={(N - 1) * stringGap + 24}
        rx="4" fill="#0b1b30" stroke="rgba(180,232,74,.14)" />
      {inlays.map((f) => (
        <circle key={f} cx={xFretCenter(f)} cy={topPad + ((N - 1) * stringGap) / 2}
          r="4" fill="rgba(126,151,180,.25)" />
      ))}
      <circle cx={xFretCenter(12)} cy={topPad + 4} r="3.4" fill="rgba(126,151,180,.25)" />
      <circle cx={xFretCenter(12)} cy={topPad + (N - 1) * stringGap - 4} r="3.4" fill="rgba(126,151,180,.25)" />
      <rect x={leftPad - 4} y={topPad - 12} width="4" height={(N - 1) * stringGap + 24} fill="#cdd7e6" />
      {Array.from({ length: FRETS }).map((_, k) => (
        <line key={k} x1={leftPad + (k + 1) * fretW} y1={topPad - 12}
          x2={leftPad + (k + 1) * fretW} y2={topPad + (N - 1) * stringGap + 12}
          stroke="rgba(160,180,205,.2)" strokeWidth="1.5" />
      ))}
      {Array.from({ length: FRETS + 1 }).map((_, f) => (
        <text key={"n" + f} x={f === 0 ? leftPad - 2 : xFretCenter(f)}
          y={topPad + (N - 1) * stringGap + 24} textAnchor="middle"
          fontSize="11" fill="#6f87a3" fontFamily="'Space Mono', monospace">{f}</text>
      ))}
      {cuerdas.map((c, i) => {
        const open = highlight.traste === 0 && highlight.stringIndex === i;
        return (
          <g key={i}>
            <line x1={leftPad - 4} y1={yString(i)} x2={leftPad + FRETS * fretW} y2={yString(i)}
              stroke={open ? BLUE : "rgba(214,224,240,.5)"} strokeWidth={1 + (N - i) * 0.35}
              style={open ? { filter: "drop-shadow(0 0 5px " + BLUE + ")" } : null} />
            <text x="20" y={yString(i) + 4} textAnchor="middle" fontSize="11"
              fill="#8da3bd" fontFamily="'Space Mono', monospace">{c.n}</text>
          </g>
        );
      })}
      {highlight.traste === 0 ? (
        <g>
          <circle cx={leftPad - 22} cy={yString(highlight.stringIndex)} r="9"
            fill="none" stroke={BLUE} strokeWidth="2.5" />
          <text x={leftPad - 22} y={yString(highlight.stringIndex) + 4} textAnchor="middle"
            fontSize="11" fill={BLUE} fontWeight="bold" fontFamily="'Space Mono', monospace">0</text>
        </g>
      ) : (
        <circle cx={xFretCenter(highlight.traste)} cy={yString(highlight.stringIndex)} r="11"
          fill={YELLOW} stroke="#1A1B1F" strokeWidth="2.5" />
      )}
    </svg>
  );
}

/* ---------- Teclado / Piano (SVG, 1 o 2 octavas) ---------- */
function Teclado({ highlight, octavas = 1 }) {
  const Ww = 40, Wh = 152, Bw = 26, Bh = 96;
  const whitesBase = ["C", "D", "E", "F", "G", "A", "B"];
  const blacksBase = [
    { nota: "C#", after: 0 }, { nota: "D#", after: 1 },
    { nota: "F#", after: 3 }, { nota: "G#", after: 4 }, { nota: "A#", after: 5 },
  ];
  const whites = [];
  const blacks = [];
  for (let o = 0; o < octavas; o++) {
    whitesBase.forEach((n, i) => whites.push({ nota: n, octava: o, pos: o * 7 + i }));
    blacksBase.forEach((b) => blacks.push({ nota: b.nota, octava: o, after: o * 7 + b.after }));
  }
  const nWhite = whites.length;
  const W = nWhite * Ww, H = Wh;
  const YELLOW = "#FBC82D";
  const oct = highlight.octava ?? 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="qn-piano" preserveAspectRatio="xMidYMid meet"
      style={{ maxWidth: octavas === 2 ? 472 : 300 }}>
      {whites.map((w) => {
        const on = highlight.nota === w.nota && oct === w.octava;
        return (
          <rect key={"w" + w.pos} x={w.pos * Ww + 1} y={0} width={Ww - 2} height={Wh} rx="5"
            fill={on ? YELLOW : "#ECEFF3"} stroke="#2c2f36" strokeWidth="1.2"
            style={on ? { filter: "drop-shadow(0 0 6px " + YELLOW + ")" } : null} />
        );
      })}
      {blacks.map((b, idx) => {
        const on = highlight.nota === b.nota && oct === b.octava;
        const x = (b.after + 1) * Ww - Bw / 2;
        return (
          <rect key={"b" + idx} x={x} y={0} width={Bw} height={Bh} rx="4"
            fill={on ? YELLOW : "#15171c"} stroke="#000" strokeWidth="1"
            style={on ? { filter: "drop-shadow(0 0 6px " + YELLOW + ")" } : null} />
        );
      })}
    </svg>
  );
}
let _audioCtx = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!_audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _audioCtx = new AC();
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}
function tono(freq, inicio, dur, tipo = "sine", vol = 0.18) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + inicio);
  gain.gain.setValueAtTime(0, ctx.currentTime + inicio);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + inicio + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + inicio + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime + inicio);
  osc.stop(ctx.currentTime + inicio + dur + 0.02);
}
function sonidoAcierto() {
  // dos notas que suben = alegre
  tono(660, 0, 0.12, "triangle", 0.2);
  tono(990, 0.1, 0.18, "triangle", 0.2);
}
function sonidoError() {
  // nota grave corta = "buzz"
  tono(160, 0, 0.22, "sawtooth", 0.14);
}

/* ---------- Música de fondo (chiptune, en bucle) ---------- */
function tonoAbs(freq, startTime, dur, tipo = "square", vol = 0.05) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(startTime); osc.stop(startTime + dur + 0.02);
}
const TEMPO = 130;
const STEP = 60 / TEMPO / 2; // corchea
// progresión I–V–vi–IV (Do–Sol–Lam–Fa), 16 corcheas
const BASS = [65.41,null,null,null, 98.00,null,null,null, 110.00,null,null,null, 87.31,null,null,null];
const LEAD = [659.25,null,783.99,null, 880.00,null,659.25,null, 587.33,null,783.99,null, 523.25,null,659.25,783.99];
let _mTimer = null, _mStep = 0, _mNext = 0, _mOn = false;
function _planificar() {
  const ctx = getCtx();
  if (!ctx) return;
  while (_mNext < ctx.currentTime + 0.12) {
    const s = _mStep % 16;
    if (BASS[s]) tonoAbs(BASS[s], _mNext, STEP * 3.6, "triangle", 0.06);
    if (LEAD[s]) tonoAbs(LEAD[s], _mNext, STEP * 0.95, "square", 0.045);
    if (s % 2 === 1) tonoAbs(2300, _mNext, 0.03, "square", 0.012); // hi-hat
    _mNext += STEP; _mStep++;
  }
}
function iniciarMusica() {
  const ctx = getCtx();
  if (!ctx || _mOn) return;
  _mOn = true; _mStep = 0; _mNext = ctx.currentTime + 0.06;
  _mTimer = setInterval(_planificar, 25);
}
function detenerMusica() {
  _mOn = false;
  if (_mTimer) { clearInterval(_mTimer); _mTimer = null; }
}

/* ---------- Componente principal ---------- */
export default function QueNotaSoy({ onComplete }) {
  const [pantalla, setPantalla] = useState("inicio");
  const [instrumento, setInstrumento] = useState("acustica");
  const [nivel, setNivel] = useState(1);
  const [reto, setReto] = useState(null);
  const [tiempo, setTiempo] = useState(DURACION);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [rachaMax, setRachaMax] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [records, setRecords] = useState({});
  const [silencio, setSilencio] = useState(false);
  const finRef = useRef(false);
  const silencioRef = useRef(false);
  useEffect(() => { silencioRef.current = silencio; }, [silencio]);

  const claveRecord = `${instrumento}-${nivel}`;

  const iniciar = (inst, lvl) => {
    setInstrumento(inst); setNivel(lvl);
    setAciertos(0); setIntentos(0); setRacha(0); setRachaMax(0);
    setTiempo(DURACION); setFeedback(null); setBloqueado(false);
    finRef.current = false;
    setReto(generarReto(inst, lvl));
    setPantalla("jugando");
    if (!silencioRef.current) iniciarMusica();
  };

  // controlar música con el botón de silencio (sin arrancar sola al cargar)
  const montadoRef = useRef(false);
  useEffect(() => {
    if (!montadoRef.current) { montadoRef.current = true; return; }
    if (silencio) detenerMusica();
    else iniciarMusica();
  }, [silencio]);

  // detener la música al salir / desmontar
  useEffect(() => () => detenerMusica(), []);

  useEffect(() => {
    if (pantalla !== "jugando") return;
    const id = setInterval(() => setTiempo((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [pantalla]);

  useEffect(() => {
    if (pantalla === "jugando" && tiempo <= 0) setPantalla("fin");
  }, [tiempo, pantalla]);

  useEffect(() => {
    if (pantalla !== "fin" || finRef.current) return;
    finRef.current = true;
    setRecords((r) => {
      const prev = r[claveRecord] ?? 0;
      return aciertos > prev ? { ...r, [claveRecord]: aciertos } : r;
    });
    if (typeof onComplete === "function") {
      onComplete({
        instrumento, nivel, aciertos, intentos, rachaMax,
        precision: intentos ? Math.round((aciertos / intentos) * 100) : 0,
        fecha: new Date().toISOString(),
      });
    }
  }, [pantalla]); // eslint-disable-line

  const responder = useCallback((opcion) => {
    if (bloqueado || !reto) return;
    setBloqueado(true);
    setIntentos((n) => n + 1);
    const ok = opcion === reto.correcto;
    if (ok) {
      if (!silencioRef.current) sonidoAcierto();
      setAciertos((n) => n + 1);
      setRacha((r) => { const nr = r + 1; setRachaMax((m) => Math.max(m, nr)); return nr; });
      setFeedback("ok");
    } else {
      if (!silencioRef.current) sonidoError();
      setRacha(0); setFeedback("bad");
    }
    setTimeout(() => {
      setFeedback(null); setBloqueado(false);
      setReto(generarReto(instrumento, nivel));
    }, ok ? 380 : 760);
  }, [bloqueado, reto, instrumento, nivel]);

  const esTeclado = INSTRUMENTOS[instrumento].tipo === "teclado";
  const niveles = esTeclado ? [
    { id: 1, nombre: "Nota y cifrado", desc: "Do ↔ C en los dos sentidos" },
    { id: 2, nombre: "Teclas blancas", desc: "Mira la tecla, di su nota" },
    { id: 3, nombre: "Todas las teclas", desc: "Incluye negras (sostenidos)" },
  ] : [
    { id: 1, nombre: "Nota y cifrado", desc: "Do ↔ C en los dos sentidos" },
    { id: 2, nombre: "Cuerdas al aire", desc: "Mira la cuerda, di su nota" },
    { id: 3, nombre: "Notas del mástil", desc: "Traste + cuerda = ¿qué nota?" },
  ];

  return (
    <div className="qn-root">
      <a className="qn-brand" href="https://instagram.com/empiricamente_sm" target="_blank" rel="noopener"
        title="Empíricamente">
        <img src="/logo.png" alt="Empíricamente" className="qn-brand-img"
          onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <span className="qn-brand-txt">Empíricamente</span>
      </a>

      <div className="qn-wrap">
        {pantalla === "inicio" && (
          <div className="qn-card">
            <div className="qn-kicker">Empíricamente <b>//</b> Minijuego 01</div>
            <h1 className="qn-title">¿Qué nota<br />soy?</h1>
            <div className="qn-rule" />
            <p className="qn-sub">Reconoce las notas y aprende a moverte por tu mástil.</p>

            <div className="qn-label">Instrumento</div>
            <div className="qn-opts2">
              {Object.entries(INSTRUMENTOS).map(([key, v]) => (
                <button key={key} className={`qn-pick ${instrumento === key ? "on" : ""}`}
                  onClick={() => setInstrumento(key)}>
                  <span className="nm">{v.label}</span>
                  <span className="tag">{v.tipo === "teclado" ? "1 octava" : v.cuerdas.length + " cuerdas"}</span>
                </button>
              ))}
            </div>

            <div className="qn-label">Nivel</div>
            <div className="qn-opts3">
              {niveles.map((n) => (
                <button key={n.id} className={`qn-pick ${nivel === n.id ? "on" : ""}`}
                  onClick={() => setNivel(n.id)}>
                  <span className="lv">{n.id}</span>
                  <span className="nm" style={{ fontSize: 12.5 }}>{n.nombre}</span>
                  <span className="ds">{n.desc}</span>
                </button>
              ))}
            </div>

            {records[claveRecord] != null && (
              <div className="qn-rec">★ Tu récord aquí: {records[claveRecord]}</div>
            )}

            <button className="qn-play" onClick={() => iniciar(instrumento, nivel)}>► Jugar</button>
          </div>
        )}

        {pantalla === "jugando" && reto && (
          <div className="qn-card">
            <button className="qn-mute" onClick={() => setSilencio((s) => !s)}
              title={silencio ? "Activar sonido" : "Silenciar"}>
              {silencio ? "🔇" : "🔊"}
            </button>
            <div className="qn-hud">
              <div className="box qn-time"><div className="v">{tiempo}</div><div className="k">seg</div></div>
              <div className="box qn-score"><div className="v">{aciertos}</div><div className="k">aciertos</div></div>
              <div className="box qn-streak"><div className="v">{racha}</div><div className="k">racha</div></div>
            </div>
            <div className="qn-bar"><i style={{ width: `${(tiempo / DURACION) * 100}%` }} /></div>

            <div className={`qn-stage ${feedback || ""}`}>
              <div className="qn-q">{reto.pregunta}</div>
              {reto.display.tipo === "tile" ? (
                <div style={{ textAlign: "center" }}>
                  <div className="qn-tile">{reto.display.texto}</div>
                  <div className="qn-tile-sub">{reto.display.sub}</div>
                </div>
              ) : reto.display.tipo === "teclado" ? (
                <Teclado highlight={reto.display.highlight} octavas={reto.display.octavas || 1} />
              ) : (
                <Diapason instrumento={reto.display.instrumento} highlight={reto.display.highlight} />
              )}
            </div>
            <div className="qn-flame">{racha >= 3 ? `🔥 racha de ${racha}` : ""}</div>

            <div className="qn-answers">
              {reto.opciones.map((op) => {
                let cls = "qn-ans";
                if (feedback && op === reto.correcto) cls += " correct";
                return (
                  <button key={op} className={cls} disabled={bloqueado}
                    onClick={() => responder(op)}>{op}</button>
                );
              })}
            </div>
          </div>
        )}

        {pantalla === "fin" && (
          <div className="qn-card">
            <div className="qn-kicker">{INSTRUMENTOS[instrumento].label} <b>//</b> Nivel {nivel}</div>
            <div className="qn-end-num">{aciertos}</div>
            <div className="qn-end-lbl">aciertos en {DURACION}s</div>

            <div className="qn-end-stats">
              <div className="s"><div className="v" style={{ color: "var(--mag)" }}>{rachaMax}</div><div className="k">mejor racha</div></div>
              <div className="s"><div className="v" style={{ color: "var(--gold)" }}>
                {intentos ? Math.round((aciertos / intentos) * 100) : 0}%</div><div className="k">precisión</div></div>
            </div>

            <div className="qn-msg">
              {aciertos >= 25 ? "Nivel crack. Impresionante." : aciertos >= 15 ? "Muy bien — vas volando." :
                aciertos >= 8 ? "Buen comienzo, sigue así." : "Apenas arrancas. La próxima subes seguro."}
            </div>
            {records[claveRecord] != null && aciertos >= records[claveRecord] && intentos > 0 && (
              <div className="qn-newrec">★ nuevo récord</div>
            )}

            <button className="qn-play" onClick={() => iniciar(instrumento, nivel)}>► Jugar otra vez</button>
            <div className="qn-row">
              <button className="qn-ghost" onClick={() => setPantalla("inicio")}>Cambiar nivel</button>
              <button className="qn-ghost" onClick={() => setPantalla("inicio")}>Cambiar instrumento</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
