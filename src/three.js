import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const cl = console.log.bind();

window.onload = () => {

  // Audio
  
  // const audio = document.querySelector('audio')
  // cl(audio.play())
  // document.addEventListener('mousemove', () => audio.play())
  
  // Canvas
  
  const canvas = document.querySelector(".webgl");

  // Scene

  const scene = new THREE.Scene();

  // Fog

  const fog = new THREE.Fog("#262837", 0, 15);
  scene.fog = fog;

  // Textures

  const textureLoader = new THREE.TextureLoader();

  const doorColorTexture = textureLoader.load(
    "./static/textures/door/color.jpg"
  );
  const doorAlphaTexture = textureLoader.load(
    "./static/textures/door/alpha.jpg"
  );
  const doorAmbientOcclusionTexture = textureLoader.load(
    "./static/textures/door/ambientOcclusion.jpg"
  );
  const doorHeightTexture = textureLoader.load(
    "./static/textures/door/height.jpg"
  );
  const doorNormalTexture = textureLoader.load(
    "./static/textures/door/normal.jpg"
  );
  const doorMetalnessTexture = textureLoader.load(
    "./static/textures/door/metalness.jpg"
  );
  const doorRoughnessTexture = textureLoader.load(
    "./static/textures/door/roughness.jpg"
  );

  // Bricks

  const bricksColorTexture = textureLoader.load("./static/textures/bricks/color.jpg");
  const bricksAmbientOcclusionTexture = textureLoader.load("./static/textures/bricks/ambientOcclusion.jpg");
  const bricksNormalTexture = textureLoader.load("./static/textures/bricks/normal.jpg");
  const bricksRoughnessTexture = textureLoader.load(
    "./static/textures/bricks/roughness.jpg"
  );

  // Grass
  
  const grassColorTexture = textureLoader.load("./static/textures/grass/color.jpg");
  const grassAmbientOcclusionTexture = textureLoader.load("./static/textures/grass/ambientOcclusion.jpg");
  const grassNormalTexture = textureLoader.load("./static/textures/grass/normal.jpg");
  const grassRoughnessTexture = textureLoader.load(
    "./static/textures/grass/roughness.jpg"
  );

  grassColorTexture.repeat.set(8, 8)
  grassAmbientOcclusionTexture.repeat.set(8, 8)
  grassNormalTexture.repeat.set(8, 8)
  grassRoughnessTexture.repeat.set(8, 8)

  grassColorTexture.wrapS = THREE.RepeatWrapping
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
  grassNormalTexture.wrapS = THREE.RepeatWrapping
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping

  grassColorTexture.wrapT = THREE.RepeatWrapping
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
  grassNormalTexture.wrapT = THREE.RepeatWrapping
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping

  // Geometry

  const plane = new THREE.PlaneGeometry(18.5, 18.5);

  // Material

  const material = new THREE.MeshStandardMaterial({ color: "green" });

  // House

  const house = new THREE.Group();
  scene.add(house);

  // Walls

  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ 
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
     })
  );

  walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );

  walls.position.set(0, 2.5 / 2, 0);
  house.add(walls);

  // Roof

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "red" })
  );
  roof.position.y = 2.5 + 0.5;
  roof.rotation.y = (Math.PI * 0.5) / 2;
  house.add(roof);

  // Door

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );

  door.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
  );

  door.position.set(0, 1, 2 + 0.01);
  house.add(door);

  // Bushes

  const bush1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({ color: "green" })
  );
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({ color: "green" })
  );
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({ color: "green" })
  );
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({ color: "green" })
  );
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  house.add(bush1, bush2, bush3, bush4);

  // Graves

  const graves = new THREE.Group();
  scene.add(graves);

  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new THREE.MeshStandardMaterial({ color: "grey" });
  let flag = true;
  for (let i = 0; i < 50; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    grave.position.set(x, 0.3, z);
    grave.rotation.y = (Math.random() - 0.5) * 1;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true
    graves.add(grave);
  }

  // Floor

  const floor = new THREE.Mesh(plane, new THREE.MeshStandardMaterial({ 
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture
 }));

 floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
  );
 
  floor.rotation.x = -(Math.PI * 0.5);
  floor.receiveShadow = true
  scene.add(floor);

  // Lights

  const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
  moonLight.position.set(4, 5, -2);
  scene.add(moonLight);

  const doorLight = new THREE.PointLight("#ff7d46", 2, 7);
  doorLight.position.set(0, 2.2, 2.7);
  scene.add(doorLight);

  // Ghosts

  const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
  scene.add(ghost1)

  const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
  scene.add(ghost2)
  
  const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
  scene.add(ghost3)

  // Camera

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );
  camera.position.set(30, 4, 30);
  scene.add(camera);

  
  // Renderer
  
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("#262837");
  document.body.appendChild(renderer.domElement)

  // OrbitControls

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  
  // Shadows

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  moonLight.castShadow = true
  doorLight.castShadow = true
  ghost1.castShadow = true
  ghost2.castShadow = true
  ghost3.castShadow = true

  walls.castShadow = true
  bush1.castShadow = true
  bush2.castShadow = true
  bush3.castShadow = true
  bush4.castShadow = true

  doorLight.shadow.mapSize.width = 256
  doorLight.shadow.mapSize.height = 256
  doorLight.shadow.camera.far = 7

  ghost1.shadow.mapSize.width = 256
  ghost1.shadow.mapSize.height = 256
  ghost1.shadow.camera.far = 7
  
  ghost2.shadow.mapSize.width = 256
  ghost2.shadow.mapSize.height = 256
  ghost2.shadow.camera.far = 7
  
  ghost3.shadow.mapSize.width = 256
  ghost3.shadow.mapSize.height = 256
  ghost3.shadow.camera.far = 7

  // Animate Function

  const clock = new THREE.Clock()
  let zForward = 30
  function animate() {
      
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 3)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 5)

    // if(camera.position.z > 6) {
    //   // camera.position.x = (10 - elapsedTime) * 3
    //   camera.position.z = (22 - elapsedTime) * 3
    // }

    if(elapsedTime < 9.6) {
      if(camera.position.z >= 6) {
        camera.position.z = 30 - (elapsedTime * 8)
        camera.position.x = 30 - (elapsedTime * 8)
      } else {
        camera.position.x = (Math.sin(elapsedTime - 7) * 9)
        camera.position.z = -(Math.cos(elapsedTime - 7) * 7)
      }
    }
    
    // cl(camera.position.x)

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
};