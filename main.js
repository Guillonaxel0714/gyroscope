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
    const object = gltf.scene.children[0];

    // materials
    const color5 = new THREE.Color( 'skyblue' );
    object.material = new THREE.MeshStandardMaterial({
      color: color5
    });

    // Redimensionne l'objet
    object.scale.set(0.5, 0.5, 0.5); // Par exemple, divise la taille par 2

    // add object to the scene
    scene.add(object);

    window.addEventListener('devicemotion', function (event) {
      const acceleration = event.accelerationIncludingGravity;

      if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
        const randomColor = Math.floor(Math.random() * 16);
        object.material.color.set('#' + randomColor);
      }
    });
  }
);

function animate() {
  scene.rotation.z = degToRad(alpha) / 2;
  scene.rotation.x = degToRad(beta);
  scene.rotation.y = degToRad(gamma);

  renderer.render(scene, camera);
}

animate();