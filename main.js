import * as THREE from 'three';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

let alpha, beta, gamma = 0;

// On click on the button, we request the permission for the motion for ios devices
document.getElementById('btn').addEventListener('click', requestMotionPermission);

// Function to request the permission for the motion for ios devices
async function requestMotionPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // La fonction est prise en charge par le navigateur
    const permission = await DeviceOrientationEvent.requestPermission()
    window.addEventListener('deviceorientation', (event) => {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
    });
  } else {
    // La fonction n'est pas prise en charge par le navigateur
    window.addEventListener('deviceorientation', (event) => {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
    });
  }
}

requestMotionPermission();

const degToRad = (deg) => deg * (Math.PI / 180);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

camera.position.z = 100;
// Créer une lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Créer une lumière directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Charge le modèle GLTF en utilisant GLTFLoader
const loader = new GLTFLoader();
loader.load(
  'maze.gltf',
  function (gltf) {

    // Récupère l'objet principal de la scène du modèle GLTF
    const object = gltf.scene.children[0];

    // Récupère le matériau de l'objet
    object.material = new THREE.MeshStandardMaterial({
      color: 0xff0000 // Rouge
    });

    // Redimensionne l'objet
    object.scale.set(0.5, 0.5, 0.5); // Par exemple, divise la taille par 2

    // Ajoute l'objet à la scène
    scene.add(object);
  }
);

function animate() {

  scene.rotation.z = degToRad(alpha) / 2;
  scene.rotation.x = degToRad(beta);
  scene.rotation.y = degToRad(gamma);

  renderer.render(scene, camera);
}

animate();