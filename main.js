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
    // Function is supported
    const permission = await DeviceOrientationEvent.requestPermission()
    window.addEventListener('deviceorientation', (event) => {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
    });
  } else {
    // function isn't supported
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
// create ambiant light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// load GLTF model
const loader = new GLTFLoader();
loader.load(
  'maze.gltf',
  function (gltf) {
    const maze = gltf.scene.children[0];

    // materials
    const color = new THREE.Color( 'skyblue' );
    maze.material = new THREE.MeshStandardMaterial({
      color: color
    });

    // Redimensionne l'objet
    maze.scale.set(0.5, 0.5, 0.5); // Par exemple, divise la taille par 2

    // add maze to the scene
    scene.add(maze);

    window.addEventListener('devicemotion', function (event) {
      const acceleration = event.accelerationIncludingGravity;

      if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
        const randomColor = Math.floor(Math.random() * 16);
        maze.material.color.set('#' + randomColor);
      }
    });
  },

  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% chargé');
  },
);

function animate() {
  scene.rotation.z = degToRad(alpha) / 2;
  scene.rotation.x = degToRad(beta);
  scene.rotation.y = degToRad(gamma);

  renderer.render(scene, camera);
}

animate();