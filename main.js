import * as THREE from 'three';

let alpha, beta, gamma = 0;

function oriantation () {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', (event) => {
            alpha = event.alpha;
            beta = event.beta;
            gamma = event.gamma;
          });
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('deviceorientation', (event) => {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
    });
  }
}

oriantation();

const degToRad = (deg) =>  deg * (Math.PI / 180);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial({
  color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {

  cube.rotation.z = degToRad(alpha) / 2;
  cube.rotation.x = degToRad(beta);
  cube.rotation.y = degToRad(gamma);

  renderer.render(scene, camera);
}
