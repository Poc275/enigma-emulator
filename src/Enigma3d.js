import './Enigma3d.css';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as dat from 'dat.gui';
import EnigmaSetup from './EnigmaSetup';

function Enigma3d() {
    // keyClickEvent handler which is setup as part of model initialisation in the useEffect hook 
    // but we need a reference to it so we can only attach it when the setup is complete
    let keyClickEvent = null;

    // state
    const [enigmaSetup, setEngimaSetup] = useState(false);
    const [keyPress, setKeyPress] = useState(null);

    // callback passed to EnigmaSetup that is called when setup is complete
    // and we're ready to start a message
    const enigmaSetupComplete = () => {
        setEngimaSetup(true);
        // attach the listener now the machine is setup
        window.addEventListener('click', keyClickEvent);
    };

    useEffect(() => {
        // Debug UI
        const gui = new dat.GUI();

        // object to hold custom properties that we want to tweak
        const parameters = {
            pointLightColour: 0xffffff
        };

        // Loaders
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        // Note we can run Draco decoding in a worker to improve performance significantly
        // This uses Web Assembly, the code to do this is available in /node_modules/three/examples/js/libs/draco
        // Copy this folder into static to make it available
        // Note later versions of Three.js may make this available as an import
        dracoLoader.setDecoderPath('/draco/');
        gltfLoader.setDRACOLoader(dracoLoader);

        // Canvas
        const canvas = document.querySelector('canvas.webgl');

        // Scene
        const scene = new THREE.Scene();

        // Sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // even though we've filled the entire viewport, changing the 
        // window size doesn't update the canvas size
        window.addEventListener('resize', () => {
            // update the sizes (this won't update anything yet!)
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            // update camera aspect ratio
            camera.aspect = sizes.width / sizes.height;

            // we must now tell Three.js to update the camera view
            camera.updateProjectionMatrix();

            // we must then update the size of the renderer (which makes the canvas fit the screen)
            renderer.setSize(sizes.width, sizes.height);
            // also update the pixel ratio just in case people move the window to another screen with a different pixel ratio
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // add an axes helper to help position objects
        // red is x-axis, green is y-axis and blue is z-axis
        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

        /**
         * Lights
         */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(20, 25, 20);
        scene.add(directionalLight);

        // directional light tweaks
        const directionalLightTweaks = gui.addFolder('Directional Light');
        directionalLightTweaks.add(directionalLight, 'intensity').min(0).max(5).step(0.01).name('lightIntensity');
        directionalLightTweaks.add(directionalLight.position, 'x').min(-50).max(50).step(1).name('lightXPos');
        directionalLightTweaks.add(directionalLight.position, 'y').min(-50).max(50).step(1).name('lightYPos');
        directionalLightTweaks.add(directionalLight.position, 'z').min(-50).max(50).step(1).name('lightZPos');

        // light helper
        // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
        // scene.add(directionalLightHelper);

        const pointLight = new THREE.PointLight(parameters.pointLightColour, 1.5, 30, 0);
        scene.add(pointLight);
        pointLight.position.set(-15, 10, 25);
        pointLight.lookAt(new THREE.Vector3(0, 0, 0));
        
        // point light tweaks
        const pointLightTweaks = gui.addFolder('Point Light');
        pointLightTweaks.add(pointLight, 'intensity').min(0).max(5).step(0.01).name('lightIntensity');
        pointLightTweaks.add(pointLight.position, 'x').min(-50).max(50).step(0.1).name('lightXPos');
        pointLightTweaks.add(pointLight.position, 'y').min(-50).max(50).step(0.1).name('lightYPos');
        pointLightTweaks.add(pointLight.position, 'z').min(-50).max(50).step(0.1).name('lightZPos');
        pointLightTweaks.addColor(parameters, 'pointLightColour').onChange(() => {
            pointLight.color.set(parameters.pointLightColour);
        });

        // light helper
        // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
        // scene.add(pointLightHelper);

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(-20, 20, 35);
        scene.add(camera);

        // collection of interactive objects
        let keyObjects = [];

        // Load model
        gltfLoader.load(
            '/enigma_separated.glb',
            (gltf) => {
                // remove progress bar
                document.getElementById("progress").remove();

                // console.log(gltf.scene.children[0]);
                const model = gltf.scene.children[0];
                scene.add(model);

                // get keyboard meshes for interaction
                scene.traverse((child) => {
                    if(child.name.startsWith("key_")) {
                        keyObjects.push(child);
                    }
                });
            },
            // progress handler
            (progress) => {
                const modelSize = 20707000;
                const percentage = progress.loaded / modelSize * 100;
                document.getElementById("progress").innerHTML = `Loading model: ${percentage.toFixed(0)}%`;
                console.log("Loading model", progress);
            },
            // error handler
            (error) => {
                console.log("Error loading model", error);
            }
        );

        /**
         * Raycaster
         */
        const raycaster = new THREE.Raycaster();

        /**
         * Mouse
         */
        // Get the mouse cursor position for ray casting hovering
        // Only needs a Vector2 as the mouse can only move in x and y
        const mouse = new THREE.Vector2();
        window.addEventListener('mousemove', (event) => {
            // normalise mouse position to desired screen coords, not in pixels
            // so -1 to +1 in x and y
            mouse.x = event.clientX / sizes.width * 2 - 1;
            // invert result as +1 y needs to be the top of the screen and -1 y at the bottom
            mouse.y = -(event.clientY / sizes.height) * 2 + 1;

            // DON'T FIRE RAYS IN MOUSEMOVE AS IT DOESN'T MATCH THE FRAME RATE
            // DO THIS IN tick()
        });

        // We can now assign the key click event handler logic
        keyClickEvent = () => {
            if(currentIntersect) {
                // key objects are named key_X so split to get the character
                const keyClicked = currentIntersect.object.name.split('_')[1];
                console.log(keyClicked);
                setKeyPress(keyClicked);
                // reset key press to null otherwise the same letter repeated will not get caught
                setKeyPress(null);
            }
        };

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.target.set(0, 0.75, 0)
        controls.enableDamping = true

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.render(scene, camera);

        /**
         * Animate
         */
        const clock = new THREE.Clock();
        let previousTime = 0;
        // placeholder variable for intersecting objects
        // we use this to mimic mouseenter and mouseleave events which aren't supported in Three.js
        let currentIntersect = null;

        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;

            // Use the mouse with ray casting to highlight objects on mouse hover
            // We need to cast a ray from the camera in the mouse's direction, luckily Three.js 
            // has a setFromCamera() method to do the heavy lifting for us
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(keyObjects);

            // Three.js doesn't natively support mousemove, mouseenter or mouseleave
            // so use a placeholder variable, if it is null, then we have a mouseenter 
            // if it isn't we have a mouseleave
            if(intersects.length) {
                // something is being hovered
                if(currentIntersect === null) {
                    // nothing was hovered before so this is a mouseenter event

                }

                currentIntersect = intersects[0]

            } else {
                // nothing is being hovered
                if(currentIntersect) {
                    // something was hovered before so this is a mouseleave event

                }

                currentIntersect = null
            }

            // Update controls
            controls.update();

            // Render
            renderer.render(scene, camera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        }

        tick();

    }, []);

    return (
        <>
            <canvas className="webgl"></canvas>
            <p id="progress"></p>
            <EnigmaSetup setupCallback={enigmaSetupComplete} keyPress={keyPress} />
        </>
    )
}

export default Enigma3d;