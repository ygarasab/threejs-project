import './style.css'
import * as THREE from 'three'
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from 'dat.gui'
import RainDrop from './rain-drop.js'

let cloud
let cloud2
//Loading

const textureLoader = new THREE.TextureLoader()


const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const loader = new GLTFLoader();
loader.load(
    'Cotoon_land.gltf',
     gltf => {

        const root = gltf.scene
         root.traverse(model => {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = true;
            }
        })
        const scale = 50
        root.scale.set(scale, scale , scale)
        scene.add( root );
    },
    xhr => console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ),
    error => console.log( 'An error happened' )
);

loader.load(
    'scene_cloud.gltf',
    gltf => {
        const root = gltf.scene
        root.traverse(model => {
            if(model.isMesh){
                model.castShadow = true;
                model.receiveShadow = true;
            }
        })
        root.position.set(-9,20,-30)
        const scale = 0.01
        root.rotateY(1.5708)
        root.scale.set(scale, scale , scale)
        cloud = root
        scene.add( root );
    },
    xhr =>  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ),
    error => console.log( 'An error happened' )
);

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

let rds = []

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
    
    let rd = new RainDrop()
    rds.push(rd)
    scene.add(rd.obj)

    for(let drop of rds)
    {
        drop.nextFrame()
        if(drop.obj.position.y < 0)
        {
            scene.remove(drop.obj)
            rds.shift()
        }
    }

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
