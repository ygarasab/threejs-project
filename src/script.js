import './style.css'
import * as THREE from 'three'
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from 'dat.gui'
import RainDrop from './rain-drop.js'


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
        scene.add( root );
    },
    xhr =>  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ),
    error => console.log( 'An error happened' )
);

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.x = 20
pointLight.position.y = 50
pointLight.position.z = 20
pointLight.castShadow = true
pointLight.shadow.bias = -0.0004
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight,.1)
scene.add(pointLightHelper)
gui.add(pointLight.position, 'x').min(-30).max(30).step(0.05)
gui.add(pointLight.position, 'y').min(0).max(50).step(0.05)
gui.add(pointLight.position, 'z').min(-30).max(30).step(0.05)
gui.add(pointLight, 'intensity').min(0).max(10).step(0.1)

const alight = new THREE.AmbientLight( 0x505050 )
scene.add( alight )
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

let rds = []

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 6
camera.position.z = 13
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor( 0xaddaff, 1);

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true;


const clock = new THREE.Clock()
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

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
