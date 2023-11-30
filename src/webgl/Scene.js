import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import Cube from "./objects/Cube.js";
import Line from "./objects/Line.js";
import pane from "../utils/Pane.js";
import IUT from "./objects/IUT.js";
import Board from "./objects/Board.js";
import Cover from "./objects/Cover.js";

class SCENE {
    setup(canvas) {
        this.canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.setupScene();

        this.setupCamera();
        this.setUpControls();
        this.setupRenderer();
        this.setupStats();
        this.setupPostProcessing();
        this.setupTextureLoader();

        this.addObjects();
        this.addEvents();

        // this.renderer.render(this.scene, this.camera);
    }

    setupTextureLoader() {
        this.textureLoader = new THREE.TextureLoader();
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            25,
            this.width / this.height,
            0.1,
            10000
        );
        this.camera.position.z = 300;
    }

    setUpControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            alpha: false, //transparent
            powerPreference: "high-performance",
            stencil: false,
            depth: false,
        });

        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    setupPostProcessing() {
        this.BLOOM_PARAMS = {
            strength: 0.5,
            radius: 0,
            threshold: 0,
        };
        // replaces the renderer
        this.composer = new EffectComposer(this.renderer);

        // passes = layers on scene
        this.scenePass = new RenderPass(this.scene, this.camera);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.width, this.height),
            this.BLOOM_PARAMS.strength,
            this.BLOOM_PARAMS.radius,
            this.BLOOM_PARAMS.threshold
        );

        // add passes to the composer
        this.composer.addPass(this.scenePass);
        this.composer.addPass(this.bloomPass);

        this.postProcessFolder = pane.addFolder({
            title: "Post process",
            expanded: true,
        });

        this.postProcessFolder
            .addBinding(this.BLOOM_PARAMS, "strength", {
                min: 0,
                max: 10,
                step: 0.01,
                label: "Strength",
            })
            .on("change", (e) => {
                this.bloomPass.strength = e.value;
            });

        this.postProcessFolder
            .addBinding(this.BLOOM_PARAMS, "radius", {
                min: 0,
                max: 10,
                step: 0.01,
                label: "Radius",
            })
            .on("change", (e) => {
                this.bloomPass.radius = e.value;
            });

        this.postProcessFolder
            .addBinding(this.BLOOM_PARAMS, "threshold", {
                min: 0,
                max: 1,
                step: 0.1,
                label: "Threshold",
            })
            .on("change", (e) => {
                this.bloomPass.threshold = e.value;
            });
    }

    addObjects() {
        this.cube = new Cube();
        this.line = new Line();
        this.iut = new IUT();
        this.board = new Board();
        this.cover = new Cover();

        this.selectedObject = this.cover;
        this.scene.add(this.selectedObject.group);
    }

    addEvents() {
        gsap.ticker.add(this.tick);
        window.addEventListener("resize", () => this.resize());
    }

    changeVisualizer(index) {
        this.scene.remove(this.selectedObject.group);
        switch (index) {
            case 0:
                this.selectedObject = this.cube;
                this.camera.position.z = 15;
                this.bloomPass.strength = 0.25;
                this.bloomPass.radius = 2.37;
                this.bloomPass.threshold = 0.1;
                break;
            case 1:
                this.selectedObject = this.line;
                this.camera.position.z = 1000;
                this.bloomPass.strength = 1;
                this.bloomPass.radius = 0;
                this.bloomPass.threshold = 0;
                break;
            case 2:
                this.selectedObject = this.iut;
                this.camera.position.z = 20;
                this.bloomPass.strength = 0.5;
                this.bloomPass.radius = 0;
                this.bloomPass.threshold = 0;
                break;
            case 3:
                this.selectedObject = this.board;
                this.camera.position.z = 50;
                this.bloomPass.strength = 0.35;
                this.bloomPass.radius = 0;
                this.bloomPass.threshold = 0;
                break;
            case 4:
                this.selectedObject = this.cover;
                this.camera.position.z = 300;
                this.bloomPass.strength = 0.2;
                this.bloomPass.radius = 0;
                this.bloomPass.threshold = 0;
                break;
            default:
                break;
        }
        this.scene.add(this.selectedObject.group);
        this.controls.update();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    tick = (time, deltaTime, frame) => {
        this.stats.begin();
        this.selectedObject.tick(deltaTime);
        this.composer.render();
        this.stats.end();
    };
}

const Scene = new SCENE();

export default Scene;
