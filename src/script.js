import './style.css'
import * as THREE from 'three'
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from 'dat.gui'

let cloud
let cloud2
//Loading

const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load('/textures/NormalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const loader = new GLTFLoader();
loader.load(
    // resource URL
    'Cotoon_land.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        const root = gltf.scene
        root.traverse(function(model) {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = true;
            }
        })
        const scale =50
        root.scale.set(scale, scale , scale)
        scene.add( root );

        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);

//Nuvens
loader.load(
    // resource URL
    'scene_cloud.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        const root = gltf.scene
        root.traverse(function(model) {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = true;
            }
        })

        //console.log(cloud)
        root.position.set(-8,20,-30)
        const scale = 0.01
        root.rotateY(1.5708)
        root.scale.set(scale, scale , scale)
        cloud = root
        scene.add( root );
        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);
// const geometry = new THREE.SphereGeometry(.5, 64, 64)
// //Materials
//
// const material = new THREE.MeshPhongMaterial()
//
// material.color = new THREE.Color(0xff0000)
//
// //Mesh
// const sphere = new THREE.Mesh(geometry,material)
// sphere.castShadow = true;
// sphere.receiveShadow = true;
// scene.add(sphere)

// Lights
// const light = new THREE.DirectionalLight(0xfffff, 1)
// light.position.set(0,12,0)
// light.casShadow = true
// scene.add(light)
// const lightHelper = new THREE.PointLightHelper(light,.1)
// scene.add(lightHelper)
// gui.add(light.position, 'x').min(-6).max(6).step(0.01)
// gui.add(light.position, 'y').min(0).max(24).step(0.01)
// gui.add(light.position, 'z').min(-3).max(3).step(0.01)
// gui.add(light, 'intensity').min(0).max(10).step(0.1)

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.x = 20
pointLight.position.y = 50
pointLight.position.z = 20
pointLight.castShadow = true;
pointLight.shadow.bias = -0.0004
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight,.1)
scene.add(pointLightHelper)
gui.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
gui.add(pointLight.position, 'y').min(0).max(30).step(0.01)
gui.add(pointLight.position, 'z').min(-3).max(3).step(0.01)
gui.add(pointLight, 'intensity').min(0).max(10).step(0.1)

const alight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( alight );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

class RainDrop()
{
    contructor()
    {
        this.geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        this.material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.cylinder = new THREE.Mesh( this.geometry, this.material );
        scene.add( cylinder );
    }
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 6
camera.position.z = 13
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// const controls = new FlyControls(camera, canvas)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor( 0xaddaff, 1);

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true;


/**
 * Animate
 */

const clock = new THREE.Clock()
let movespeed = 0.01
let movespeed2 = -0.01
const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.position.set(0, 3, 0)

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
