import * as THREE from 'three'
class RainDrop
{
    constructor()
    {
        this.geometry = new THREE.CylinderGeometry( .07, .07, .1, 20 );
        this.material = new THREE.MeshBasicMaterial( {color: 0x0000ee} );
        this.obj = new THREE.Mesh( this.geometry, this.material );
        this.obj.position.set(-(Math.random() * 4 + 7),20,-(Math.random() * 4 + 28))
        this.obj.castShadow = true
        this.speed = 0
    }

    nextFrame()
    {
        this.speed += .0098
        this.obj.translateY(-this.speed)
    }       
}

export default RainDrop;
