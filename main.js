import * as THREE from 'three';
import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

let alpha, beta, gamma = 0;

if (typeof DeviceMotionEvent.requestPermission === 'function') {
  // La fonction est prise en charge par le navigateur
  DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        // L'autorisation a été accordée
        // Vous pouvez maintenant écouter les événements DeviceMotion
        window.addEventListener('devicemotion', handleMotionEvent);
      }
    })
    .catch(console.error);
} else {
  // La fonction n'est pas prise en charge par le navigateur
  console.error('DeviceMotionEvent.requestPermission n\'est pas prise en charge.');
}

// Fonction de gestion de l'événement de mouvement
function handleMotionEvent(event) {
  // Faites quelque chose avec les données de mouvement ici
  alert('Mouvement détecté');
}

const degToRad = (deg) => deg * (Math.PI / 280);

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

    // Incliner légèrement le mesh vers l'arrière
    object.rotation.x = -0.99;
    object.rotation.y = 0.5;

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