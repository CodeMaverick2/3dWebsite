let scene, camera, renderer, controls;
let grass, flowers = [], trees = [], blocks = [];
let simplex = new SimplexNoise();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Sky blue

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x358f3b });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Grass
    const grassGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x5baa55, side: THREE.DoubleSide });
    grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0.05;
    scene.add(grass);

    // Flowers
    for (let i = 0; i < 100; i++) {
        const flowerGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
        const flowerMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(
            Math.random() * 80 - 40,
            0.15,
            Math.random() * 80 - 40
        );
        flowers.push(flower);
        scene.add(flower);
    }

    // Trees
    for (let i = 0; i < 20; i++) {
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

        const leavesGeometry = new THREE.SphereGeometry(1, 8, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 1.5;

        const tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leaves);
        tree.position.set(
            Math.random() * 80 - 40,
            1,
            Math.random() * 80 - 40
        );
        trees.push(tree);
        scene.add(tree);
    }

    // Animated blocks
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
        const block = new THREE.Mesh(geometry, material);
        block.position.set(
            Math.random() * 20 - 10,
            Math.random() * 5 + 1,
            Math.random() * 20 - 10
        );
        blocks.push(block);
        scene.add(block);
    }

    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Animate grass
    const vertices = grass.geometry.attributes.position.array;
    const time = Date.now() * 0.0005;
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = simplex.noise3D(vertices[i] / 5, vertices[i + 1] / 5, time) * 0.3;
    }
    grass.geometry.attributes.position.needsUpdate = true;

    // Animate flowers
    flowers.forEach((flower, index) => {
        flower.rotation.y = Math.sin(time + index) * 0.3;
    });

    // Animate trees
    trees.forEach((tree, index) => {
        tree.children[1].scale.y = 1 + Math.sin(time + index) * 0.05;
    });

    // Animate blocks
    blocks.forEach((block, index) => {
        block.rotation.x += 0.01;
        block.rotation.y += 0.01;
        block.position.y = Math.sin(time * 2 + index) + 3;
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();