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
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        gui.add(directionalLight, 'intensity').min(0).max(5).step(0.01).name('lightIntensity');
        gui.add(directionalLight.position, 'x').min(-50).max(50).step(1).name('lightXPos');
        gui.add(directionalLight.position, 'y').min(-50).max(50).step(1).name('lightYPos');
        gui.add(directionalLight.position, 'z').min(-50).max(50).step(1).name('lightZPos');

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
                // console.log(gltf.scene.children[0]);
                const model = gltf.scene.children[0];
                scene.add(model);

                // get keyboard meshes for interaction
                scene.traverse((child) => {
                    if(child.name.startsWith("key_")) {
                        keyObjects.push(child);
                    }
                });

                // console.log(keyObjects);

                // add position tweaks
                // gui.add(model.position, 'x').min(-50).max(50).step(1).name('xPos');
                // gui.add(model.position, 'y').min(-50).max(50).step(1).name('yPos');
                // gui.add(model.position, 'z').min(-50).max(50).step(1).name('zPos');
            },
            // progress handler
            (progress) => {
                console.log("Loading model", progress);
            },
            // error handler
            (error) => {
                console.log("Error loading model", error);
            }
        );

        // keyboard model test
        // gltfLoader.load(
        //     '/test_keyboard/keyboard.glb',
        //     (gltf) => {
        //         console.log(gltf);
        //         scene.add(gltf.scene);

        //         // collect key objects for interaction later
        //         const children = [...gltf.scene.children];
        //         for(const child of children) {
        //              keyObjects.push(child);
        //         }

        //         console.log(keyObjects);
        //     },
        //     // progress handler
        //     (progress) => {
        //         console.log("Loading model", progress);
        //     },
        //     // error handler
        //     (error) => {
        //         console.log("Error loading model", error);
        //     }
        // );

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
        // window.addEventListener('click', (event) => {
        //     if(currentIntersect) {
        //         // key objects are named key_X so split to get the character
        //         const keyClicked = currentIntersect.object.name.split('_')[1];
        //         console.log(keyClicked);
        //     }
        // });

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
            <EnigmaSetup setupCallback={enigmaSetupComplete} keyPress={keyPress} />
        </>
    )
}

export default Enigma3d;