import "./style.css";

import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

//前進か後進か変数宣言
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

//移動速度と移動方向の定義
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const color = new THREE.Color();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0xffffff, 0, 750);

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
light.position.set(0.5, 1, 0.75);
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//ポインタールック
const controls = new PointerLockControls(camera, renderer.domElement);
window.addEventListener("click", function () {
  controls.lock();
});

const planeGeometry = new THREE.PlaneGeometry(400, 400, 100, 100);
const material = new THREE.MeshBasicMaterial({
  color: "orange",
  wireframe: true,
});
const plane = new THREE.Mesh(planeGeometry, material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

/**
 * オブジェクト
 **/
const boxGeometry = new THREE.BoxGeometry(20, 20, 20);

let position = boxGeometry.attributes.position;
const colorsBox = [];

for (let i = 0, l = position.count; i < l; i++) {
  color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
  colorsBox.push(color.r, color.g, color.b);
}

boxGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colorsBox, 3)
);

for (let i = 0; i < 200; i++) {
  const boxMaterial = new THREE.MeshPhongMaterial({
    specular: 0xffffff,
    flatShading: true,
    vertexColors: true,
  });
  boxMaterial.color.setHSL(
    Math.random() * 0.2 + 0.5,
    0.75,
    Math.random() * 0.25 + 0.75
  );

  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
  box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
  box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

  scene.add(box);
}

/**
 * キーボード操作
 **/
const onKeyDown = (e) => {
  switch (e.code) {
    case "KeyW":
      moveForward = true;
      break;
    case "KeyA":
      moveLeft = true;
      break;
    case "KeyS":
      moveBackward = true;
      break;
    case "KeyD":
      moveRight = true;
      break;
  }
};
const onKeyUp = function (event) {
  switch (event.code) {
    case "KeyW":
      moveForward = false;
      break;
    case "KeyA":
      moveLeft = false;
      break;
    case "KeyS":
      moveBackward = false;
      break;
    case "KeyD":
      moveRight = false;
      break;
  }
};
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

let prevTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  // console.log(time)

  /**
   * 前進後進判定
   **/
  direction.z = Number(moveForward) - Number(moveBackward); //1,-1(単位ベクトル)を変えることができる。
  direction.x = Number(moveRight) - Number(moveLeft);

  //ポインターがONになったら
  if (controls.isLocked) {
    const delta = (time - prevTime) / 1000;

    velocity.z -= velocity.z * 5.0 * delta; //w押すとマイdナス。s押すとプラス。
    velocity.x -= velocity.x * 5.0 * delta; //減衰のため。
    console.log(velocity.x);

    if (moveForward || moveBackward) {
      velocity.z -= direction.z * 200.0 * delta;
    }

    if (moveRight || moveLeft) {
      velocity.x -= direction.x * 200.0 * delta;
    }

    controls.moveForward(-velocity.z * delta);
    controls.moveRight(-velocity.x * delta);
  }

  prevTime = time;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
