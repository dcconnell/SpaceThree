import * as THREE from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from './PlanetImages/stars.jpg';
import sunTexture from './PlanetImages/sun.jpg';
import mercuryTexture from './PlanetImages/mercury.jpg';
import venusTexture from './PlanetImages/venus.jpg';
import earthTexture from './PlanetImages/earth.jpg';
import marsTexture from './PlanetImages/mars.jpg';
import jupiterTexture from './PlanetImages/jupiter.jpg';
import saturnTexture from './PlanetImages/saturn.jpg';
import saturnRingTexture from './PlanetImages/saturn ring.png';
import uranusTexture from './PlanetImages/uranus.jpg';
import uranusRingTexture from './PlanetImages/uranus ring.png';
import neptuneTexture from './PlanetImages/neptune.jpg';
import plutoTexture from './PlanetImages/pluto.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const orbit = new OrbitControls( camera, renderer.domElement)

camera.position.set(-90, 140, 140)
orbit.update()

const ambientLight = new THREE.AmbientLight(0x222222)
scene.add(ambientLight)

const cubeTextureLoad = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoad.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
])

const textureLoader = new THREE.TextureLoader()

const sunGeometry = new THREE.SphereGeometry(30, 100, 100)
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

function addPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}

const mercury = addPlanet(3.2, mercuryTexture, 40);
const venus = addPlanet(5.8, venusTexture, 75);
const earth = addPlanet(6, earthTexture, 128);
const mars = addPlanet(4, marsTexture, 204);
const jupiter = addPlanet(12, jupiterTexture, 366);
const saturn = addPlanet(10, saturnTexture, 488, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
const uranus = addPlanet(7, uranusTexture, 611, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
const neptune = addPlanet(7, neptuneTexture, 884);
const pluto = addPlanet(2.8, plutoTexture, 1201);

const pointLight = new THREE.PointLight(0xFFFFFF, 60000, 1300);
scene.add(pointLight);

function animate() {
    //Self-rotation
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});