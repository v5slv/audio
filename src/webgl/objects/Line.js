import * as THREE from "three";
import AudioController from "../../utils/AudioController";

export default class Line {
    constructor() {
        this.colors = [
            0x0fa3b1, 0xb5e2fa, 0xf9f7f3, 0xfeeafa, 0xf9d5e5, 0xfcafca,
            0xf7ce3e, 0x9ddcdc, 0x8fcb9b, 0x6ebf9b,
        ];
        this.group = new THREE.Group();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshNormalMaterial();
        this.materials = [];

        this.colors.forEach((color) => {
            const material = new THREE.MeshBasicMaterial({ color: color });
            this.materials.push(material);
        });

        // on arrondit à l'entier le + proche
        const MODULO = Math.round(256 / this.colors.length);
        this.SPACING = 3;

        let n = -1;

        for (let i = 0; i < 256; i++) {
            if (i % MODULO === 0) {
                n++;
            }
            const mesh = new THREE.Mesh(this.geometry, this.materials[n]);

            mesh.position.x = i * this.SPACING;
            this.group.add(mesh);
        }

        this.group.position.set((-256 * this.SPACING) / 2, 0, 0);
    }

    tick(deltaTime) {
        // this.group.rotation.z += 0.001 * deltaTime;
        // this.group.rotation.x += 0.001 * deltaTime;

        for (let i = 0; i < this.group.children.length; i++) {
            this.group.children[i].scale.y = AudioController.fdata[i];
        }
    }
}
