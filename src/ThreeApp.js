
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator';
//
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
//
import Lottie from 'lottie-web';



let ThreeApp =  {
 
    init(){
        var canvas = document.createElement("canvas");
		canvas.setAttribute("id", "three");
		
		document.body.appendChild(canvas);
		
        // console.log("1", document);
        // console.log("2", document.querySelector("#three"));
        // console.log("3", document.querySelector("#three").getContext("experimental-webgl"));
        // console.log("4", document.querySelector("#three").getContext("experimental-webgl").canvas);
        const context = canvas.getContext("experimental-webgl");
        // const canvas = context.canvas;
        let w = document.documentElement.clientWidth;
        let h = document.documentElement.clientHeight;
        canvas.width = w;
        canvas.height = h;
        
        const scene = new THREE.Scene(); 
        window.scene = scene;
        const renderer = new THREE.WebGLRenderer({canvas});
        renderer.setSize(w, h);
        const camera = new THREE.PerspectiveCamera(48, w / h , 1, 10000)
        camera.position.z = 300;
        scene.add(camera);
        
       
        function raf() {
            // console.log("render");
            requestAnimationFrame(raf);
            renderer.render(scene, camera);
            if(scene.obj){
                scene.obj.rotation.y= 2.2;
                scene.obj.rotation.x=-1.4;
            }
          }

        raf();
        this.initLoader(scene, renderer);

        gsap.registerPlugin(ScrollTrigger);
        this.initTL(); 
    },

    initLoader(scene, renderer) {

        // Load in 3D Model
        const loader = new GLTFLoader();
        
        
        loader.load( './component.glb', function ( gltf ) {
            scene.obj = gltf.scene;
            gltf.scene.scale.x=4;
            gltf.scene.scale.y=4;
            gltf.scene.scale.z=4;
            
            
            scene.add( scene.obj );
            
        }, undefined, function ( error ) {
	        console.error( error );
        } )

        // Load in HDR image to light the scene

        const rgbeLoader = new RGBELoader();
        rgbeLoader.setDataType( THREE.UnsignedByteType );
        const pmremGenerator = new PMREMGenerator(renderer);

        rgbeLoader.load( './clouds.hdr', function ( texture ) {
        
            
            renderer.toneMappingExposure = 3.36;
            const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            
                scene.environment = envMap;
				texture.dispose();
				pmremGenerator.dispose();
            
        }, undefined, function ( error ) {
	        console.error( error );
        } );

    },

    initTL(){
        // Create trigger for timeline control
        const tl = gsap.timeline();
       

        
        ScrollTrigger.create({
            animation:tl,
            trigger:'#sections',
            start: 'top top',
            end: 'bottom bottom',
            scrub:1.8,
            onUpdate: (self)=>{
                // console.log(self, self.progress);
                if(window.scene.obj){
                    window.scene.obj.rotation.z = 2*Math.PI* self.progress;
                    window.scene.obj.position.z = -1800*Math.sin(Math.PI*self.progress);
                }
            }

        })
        // Load in icon animation
        Lottie.loadAnimation({
            container: document.getElementById("down-arrow"),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path:"scrolldown.json"
          });
    }
    
    
}


  
  

export default ThreeApp;