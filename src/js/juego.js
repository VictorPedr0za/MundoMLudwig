// src/js/juego.js (ESM con import map en juego.html)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ========= 1) Canción por query ========= */
const params = new URLSearchParams(location.search);
const songId = params.get('song') || '1';
const SONGS = window.CANCIONES || {};
const SONG = SONGS[songId];

if (!SONG) {
  alert('Canción no encontrada. Regresando al menú.');
  location.href = 'menu.html';
  throw new Error('Canción no encontrada');
}

const AUDIO_SRC = encodeURI(SONG.audio);
const audio = new Audio(AUDIO_SRC);
audio.preload = 'auto';
audio.addEventListener('error', () => {
  console.error('No se pudo cargar el audio:', audio.src);
  alert('No se pudo cargar el audio:\n' + audio.src);
});

/* ======== 2) Control de interacción presionar/mover ======== */
let audioUnlocked = false;         // se activa al primer gesto de usuario
let isPressed = false;             // botón/ dedo presionado
let lastX = 0, lastY = 0;          // última posición del puntero
let lastMoveTs = 0;                // último movimiento significativo

const MIN_DIST = 3;                // píxeles para considerar que "se movió"
const IDLE_MS  = 160;              // si no se mueve en este tiempo, pausamos

function unlockAudioOnce() {
  if (audioUnlocked) return;
  audio.play().then(() => {
    audio.pause();
    audioUnlocked = true;
  }).catch(() => { /* segundo intento ocurrirá en onPressStart */ });
}

// Backup: intento de desbloqueo en el primer pointerdown global (sin preventDefault)
window.addEventListener('pointerdown', unlockAudioOnce, { once: true, passive: true });

/* ========= 3) Escena Three.js ========= */
let scene, camera, renderer;
const canvas = document.getElementById('gameCanvas');

// === Referencias del violín y arco ===
let violin = null;
let violinBox = null;
let violinCenter = new THREE.Vector3();

// Plano donde se moverá el arco (frente a las cuerdas)
const bowPlaneNormal = new THREE.Vector3(0, 0, 1);  // mirando a la cámara
let bowPlane = null;      // se creará después de saber dónde está el violín

let bow = null;           // el arco
let bowOffsetZ = 0.2;    // separación en Z frente a las cuerdas (ajusta a ojo)
let bowSmooth = 0.22;     // suavizado de movimiento [0..1], mayor= más lento

// Raycaster para convertir puntero → mundo
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector3();

// Límites de movimiento del arco (se calculan con la caja del violín)
let bowMinX = -0.35, bowMaxX = 0.35;
let bowMinY = 0.15,  bowMaxY = 1.65;

// Posición objetivo del arco (interpolación)
const bowTarget = new THREE.Vector3();

initScene();
loadViolin();
animate();

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2E515C);

  camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.01, 1000);
  camera.position.set(0, 1.6, 3);       // cámara fija (sin controles)
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));

  // Luces
  const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 1.0);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(2, 3, 4);
  scene.add(dir);

  // Bloquear zoom con rueda y gestos en móviles dentro del canvas
  const opt = { passive: false };
  canvas.addEventListener('wheel', (e) => e.preventDefault(), opt);
  canvas.addEventListener('gesturestart',  (e) => e.preventDefault(), opt);
  canvas.addEventListener('gesturechange', (e) => e.preventDefault(), opt);
  canvas.addEventListener('gestureend',    (e) => e.preventDefault(), opt);

  // Eventos de puntero sólo para la mecánica del audio y el arco (no mueven la cámara)
  canvas.addEventListener('pointerdown',   onPressStart, opt);
  canvas.addEventListener('pointermove',   onPointerMove, opt);
  canvas.addEventListener('pointerup',     onPressEnd,   opt);
  canvas.addEventListener('pointercancel', onPressEnd,   opt);
  canvas.addEventListener('pointerleave',  onPressEnd,   opt);
  window.addEventListener('pointerup',     onPressEnd,   opt);

  addEventListener('resize', onResize);
}

/**
 * Encadrar un objeto en la cámara con un margen y ajuste de altura
 * @param {THREE.Object3D} object3D
 * @param {Object} options
 *   - margin: aire alrededor (1.0 = sin margen, 1.15 = 15% extra)
 *   - alignY: desplazar la mirada vertical (0 = centro, +0.1 un poco arriba)
 */
function frameToObject(object3D, { margin = 1.15, alignY = 0 } = {}) {
  const box = new THREE.Box3().setFromObject(object3D);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const fov = THREE.MathUtils.degToRad(camera.fov);
  const fitHeightDistance = (size.y * margin) / (2 * Math.tan(fov / 2));
  const fitWidthDistance  = (size.x * margin) / (2 * Math.tan(fov / 2)) * (camera.aspect);
  const distance = Math.max(fitHeightDistance, fitWidthDistance);

  camera.position.set(center.x, center.y + alignY * size.y, center.z + distance);
  camera.lookAt(center.x, center.y + alignY * size.y, center.z);
  camera.updateProjectionMatrix();
}

function loadViolin() {
  const loader = new GLTFLoader();
  loader.load(
    './src/3Dmodels/Violin/violin.glb',
    (gltf) => {
      violin = gltf.scene;

      // 1) Centra el pivote en el origen para un encuadre fiable
      const box = new THREE.Box3().setFromObject(violin);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      violin.position.sub(center);   // traslada el centro a (0,0,0)

      // 2) Orientación: vertical y cuerdas mirando al frente
      //    Si vieras la espalda, usa violin.rotation.set(0, Math.PI, 0);
      violin.rotation.set(0, 0, 0);

      // 3) Escala según altura objetivo
      const targetHeight = 1.8;                              // ajusta a gusto
      const currentHeight = Math.max(0.0001, size.y);
      const scl = targetHeight / currentHeight;
      violin.scale.setScalar(scl);

      // 4) Opcional: apoyar la base en y≈0 (recalcular tras escala/rotación)
      const box2 = new THREE.Box3().setFromObject(violin);
      const minY = box2.min.y;
      violin.position.y -= minY;     // base en y=0
      violin.position.y -= 0.2;      // un toque más abajo para dejar aire arriba

      scene.add(violin);

      // Recalcular caja y centro definitivos
      violinBox = new THREE.Box3().setFromObject(violin);
      violinBox.getCenter(violinCenter);

      // 5) Crear el plano del arco: paralelo a la pantalla,
      //    ubicado "delante" del violín en +Z
      const planePoint = violinCenter.clone();
      planePoint.z += bowOffsetZ;
      bowPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(bowPlaneNormal, planePoint);

      // 6) Límites de movimiento del arco basados en la caja del violín
      const marginX = (violinBox.max.x - violinBox.min.x) * 0.10;  // 10% de margen
      bowMinX = violinBox.min.x + marginX;
      bowMaxX = violinBox.max.x - marginX;

      const marginY = (violinBox.max.y - violinBox.min.y) * 0.10;  // 10% de margen
      bowMinY = violinBox.min.y + marginY;
      bowMaxY = violinBox.max.y - marginY;

      // 7) Cargar el arco ahora que sabemos la posición del violín
      loadBow();

      // 8) Encadrar el violín (la cámara queda fija)
      frameToObject(violin, { margin: 1.15, alignY: 0.01 });
    },
    undefined,
    (err) => console.error('Error cargando violín:', err)
  );
}

function loadBow() {
  const loader = new GLTFLoader();
  loader.load(
    './src/3Dmodels/Violin/violinBow.glb',   // <-- ajusta ruta si difiere
    (gltf) => {
      bow = gltf.scene;

      // Orientación del arco (ajusta si tu GLB viene rotado)
      bow.rotation.set(0, 0, 0);

      // Tamaño relativo al violín
      bow.scale.setScalar(violin.scale.x * 0.9);

      // Posición inicial: centro del violín, un poco arriba, y adelantado en Z
      bow.position.copy(violinCenter);
      bow.position.y = (bowMinY + bowMaxY) * 0.55;
      bow.position.z = violinCenter.z + bowOffsetZ;

      // Objetivo inicial = posición actual
      bowTarget.copy(bow.position);

      scene.add(bow);
    },
    undefined,
    (err) => console.error('Error cargando arco:', err)
  );
}

/* ======== 4) Handlers de interacción ======== */
function getPointerXY(e) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

// Proyecta el puntero sobre el plano del arco y limita a la zona del violín
function updateBowFromPointer(clientX, clientY) {
  if (!bow || !bowPlane) return;

  const rect = canvas.getBoundingClientRect();
  const xNDC = ((clientX - rect.left) / rect.width) * 2 - 1;
  const yNDC = -((clientY - rect.top) / rect.height) * 2 + 1;

  pointerNDC.set(xNDC, yNDC, 0.5);
  raycaster.setFromCamera(pointerNDC, camera);

  const hit = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(bowPlane, hit)) {
    // Limitar a la zona del violín
    hit.x = Math.min(Math.max(hit.x, bowMinX), bowMaxX);
    hit.y = Math.min(Math.max(hit.y, bowMinY), bowMaxY);
    hit.z = violinCenter.z + bowOffsetZ;

    bowTarget.copy(hit);
  }
}

function onPressStart(e) {
  isPressed = true;
  const p = getPointerXY(e);
  lastX = p.x; lastY = p.y;
  lastMoveTs = performance.now();

  unlockAudioOnce(); // intento de desbloqueo

  if (audioUnlocked && audio.paused) {
    audio.currentTime = 0;
    audio.play().catch(()=>{});
  }

  // Colocar el arco inmediatamente donde presiona
  updateBowFromPointer(e.clientX, e.clientY);
  if (bow) bow.position.copy(bowTarget);

  if (e && e.cancelable) e.preventDefault();
}

function onPointerMove(e) {
  if (!isPressed) return;

  const p = getPointerXY(e);
  const dx = p.x - lastX;
  const dy = p.y - lastY;
  const dist = Math.hypot(dx, dy);
  lastX = p.x; lastY = p.y;

  if (dist >= MIN_DIST) {
    lastMoveTs = performance.now();
    if (audioUnlocked && audio.paused) {
      audio.play().catch(()=>{});
    }
    // Mover arco hacia el puntero
    updateBowFromPointer(e.clientX, e.clientY);
  }
  if (e && e.cancelable) e.preventDefault();
}

function onPressEnd(e) {
  isPressed = false;
  if (!audio.paused) audio.pause();
  if (e && e.cancelable) e.preventDefault();
}

/* ======== 5) Resize & loop ======== */
function onResize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);

  // pausa por inactividad
  if (isPressed && audioUnlocked) {
    const dt = performance.now() - lastMoveTs;
    if (dt > IDLE_MS && !audio.paused) {
      audio.pause();
    }
  }

  // Interpolación suave del arco hacia el objetivo
  if (bow) {
    bow.position.lerp(bowTarget, bowSmooth);
  }

  renderer.render(scene, camera);
}