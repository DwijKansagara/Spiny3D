import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Creates high-fidelity standard preset 3D models for the Quick Demo gallery.
 * All models are 100% volumetric, 360° rotatable solid geometries.
 */

export function createSneakerMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-sneaker';

  // Sole
  const soleGeo = new THREE.BoxGeometry(1.6, 0.35, 3.4);
  const soleMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.6,
    metalness: 0.1,
  });
  const sole = new THREE.Mesh(soleGeo, soleMat);
  sole.position.set(0, -0.7, 0);
  sole.castShadow = true;
  sole.receiveShadow = true;
  group.add(sole);

  // Upper Body
  const upperGeo = new THREE.BoxGeometry(1.5, 0.9, 2.8);
  const upperMat = new THREE.MeshStandardMaterial({
    color: '#10b981', // Brand emerald
    roughness: 0.4,
    metalness: 0.2,
  });
  const upper = new THREE.Mesh(upperGeo, upperMat);
  upper.position.set(0, -0.15, -0.1);
  upper.castShadow = true;
  group.add(upper);

  // Toe Cap
  const toeGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.2, 16);
  toeGeo.rotateX(Math.PI / 2);
  const toeMat = new THREE.MeshStandardMaterial({
    color: '#064e3b',
    roughness: 0.5,
  });
  const toe = new THREE.Mesh(toeGeo, toeMat);
  toe.position.set(0, -0.2, 1.2);
  toe.scale.set(0.9, 0.5, 0.8);
  toe.castShadow = true;
  group.add(toe);

  // Ankle Collar
  const collarGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.8, 16);
  const collarMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.7,
  });
  const collar = new THREE.Mesh(collarGeo, collarMat);
  collar.position.set(0, 0.6, -0.6);
  collar.castShadow = true;
  group.add(collar);

  // Laces detail (ribs)
  const laceMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
  for (let i = 0; i < 4; i++) {
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.15), laceMat);
    lace.position.set(0, 0.32 - i * 0.14, 0.15 + i * 0.3);
    group.add(lace);
  }

  // Brand Accent Stripe
  const stripeGeo = new THREE.BoxGeometry(1.54, 0.12, 1.8);
  const stripeMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.3 });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.set(0, -0.15, -0.2);
  group.add(stripe);

  return group;
}

export function createCeramicMugMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-ceramic-mug';

  // Mug Body
  const mugGeo = new THREE.CylinderGeometry(1.0, 0.9, 2.2, 32);
  const mugMat = new THREE.MeshStandardMaterial({
    color: '#0f766e', // Deep cyan-teal
    roughness: 0.2,
    metalness: 0.1,
  });
  const mug = new THREE.Mesh(mugGeo, mugMat);
  mug.castShadow = true;
  mug.receiveShadow = true;
  group.add(mug);

  // Handle (Torus)
  const handleGeo = new THREE.TorusGeometry(0.7, 0.16, 16, 32, Math.PI);
  const handleMat = new THREE.MeshStandardMaterial({
    color: '#0f766e',
    roughness: 0.2,
    metalness: 0.1,
  });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(1.1, 0, 0);
  handle.castShadow = true;
  group.add(handle);

  // Inner cavity / Liquid surface
  const liquidGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.05, 32);
  const liquidMat = new THREE.MeshStandardMaterial({
    color: '#451a03', // Rich coffee brown
    roughness: 0.1,
    metalness: 0.0,
  });
  const liquid = new THREE.Mesh(liquidGeo, liquidMat);
  liquid.position.set(0, 0.9, 0);
  group.add(liquid);

  return group;
}

export function createLowPolyDogMesh(texture?: THREE.Texture): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-low-poly-dog';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : '#059669', // Emerald base or textured
    map: texture || null,
    flatShading: true,
    roughness: 0.5,
    metalness: 0.1,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: '#064e3b',
    flatShading: true,
    roughness: 0.6,
  });

  // Torso / Body (Fully 360° rounded geometry)
  const bodyGeo = new THREE.CapsuleGeometry(0.65, 1.3, 16, 16);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Head
  const headGeo = new THREE.SphereGeometry(0.6, 16, 16);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.set(0.85, 0.75, 0);
  head.castShadow = true;
  group.add(head);

  // Snout
  const snoutGeo = new THREE.CylinderGeometry(0.22, 0.35, 0.5, 12);
  snoutGeo.rotateZ(-Math.PI / 2);
  const snout = new THREE.Mesh(snoutGeo, accentMat);
  snout.position.set(1.4, 0.65, 0);
  snout.castShadow = true;
  group.add(snout);

  // Ears
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 8), accentMat);
  earL.position.set(0.75, 1.3, 0.32);
  earL.rotation.z = -0.2;
  earL.castShadow = true;
  group.add(earL);

  const earR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 8), accentMat);
  earR.position.set(0.75, 1.3, -0.32);
  earR.rotation.z = -0.2;
  earR.castShadow = true;
  group.add(earR);

  // 4 Legs
  const legPositions = [
    [0.6, -0.75, 0.4],
    [0.6, -0.75, -0.4],
    [-0.6, -0.75, 0.4],
    [-0.6, -0.75, -0.4],
  ];
  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.9, 12), accentMat);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    group.add(leg);

    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), bodyMat);
    paw.position.set(pos[0] + 0.05, pos[1] - 0.4, pos[2]);
    paw.scale.set(1.2, 0.6, 1);
    paw.castShadow = true;
    group.add(paw);
  });

  // Tail
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.8, 8), accentMat);
  tail.position.set(-1.0, 0.4, 0);
  tail.rotation.z = Math.PI / 3;
  tail.castShadow = true;
  group.add(tail);

  return group;
}

export function createIndustrialRobotMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-industrial-robot';

  const metalMat = new THREE.MeshStandardMaterial({
    color: '#475569',
    metalness: 0.8,
    roughness: 0.3,
  });
  const cyanCoreMat = new THREE.MeshStandardMaterial({
    color: '#06b6d4',
    emissive: '#0891b2',
    emissiveIntensity: 0.6,
    roughness: 0.1,
  });

  // Base Gear/Pedestal
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.4, 16), metalMat);
  base.position.set(0, -1.1, 0);
  base.castShadow = true;
  group.add(base);

  // Torso / Gear Core
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.2, 1.0), metalMat);
  torso.position.set(0, -0.2, 0);
  torso.castShadow = true;
  group.add(torso);

  // Glowing Core Center
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), cyanCoreMat);
  core.position.set(0, -0.2, 0.52);
  group.add(core);

  // Head Sensor
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 12), metalMat);
  head.position.set(0, 0.75, 0);
  head.castShadow = true;
  group.add(head);

  // Visor
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.3), cyanCoreMat);
  visor.position.set(0, 0.75, 0.5);
  group.add(visor);

  return group;
}

/**
 * Loads a real, full 360° volumetric GLB file from a URL.
 * Optionally maps an uploaded image texture onto the model coordinates.
 */
export async function loadGLBModel(glbUrl: string, textureUrl?: string): Promise<THREE.Group> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      glbUrl,
      (gltf) => {
        const root = gltf.scene || new THREE.Group();

        if (textureUrl) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(
            textureUrl,
            (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.flipY = false;

              root.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  if (child.material) {
                    child.material = new THREE.MeshStandardMaterial({
                      map: tex,
                      roughness: 0.5,
                      metalness: 0.1,
                    });
                  }
                }
              });
              resolve(root);
            },
            undefined,
            () => {
              // If texture load fails, return root cleanly
              resolve(root);
            }
          );
        } else {
          root.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          resolve(root);
        }
      },
      undefined,
      (error) => {
        console.warn('GLTFLoader failed on url:', glbUrl, error);
        reject(error);
      }
    );
  });
}

/**
 * Local Mock Mode: Loads a full 360° volumetric 3D model positioned at [0, 0, 0].
 * Completely eliminates any flat 2.5D displacement/plane geometry.
 */
export async function createVolumetricModelFromImage(imageUrl: string): Promise<THREE.Group> {
  // First attempt: Load standard bundled full 360° animal GLB
  try {
    const glbModel = await loadGLBModel('/models/sample-animal.glb', imageUrl);
    return glbModel;
  } catch (err) {
    console.info('Falling back to procedural 360° volumetric companion mesh:', err);
    // Second attempt: Build a procedural 360° volumetric body with mapped texture
    return new Promise((resolve) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        imageUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve(createLowPolyDogMesh(texture));
        },
        undefined,
        () => {
          resolve(createLowPolyDogMesh());
        }
      );
    });
  }
}

/**
 * Calculates vertex and face count statistics for any Three.js 3D Object.
 */
export function calculateObjectStats(object: THREE.Object3D): { vertices: number; triangles: number } {
  let vertices = 0;
  let triangles = 0;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geo = child.geometry;
      if (geo.attributes.position) {
        vertices += geo.attributes.position.count;
      }
      if (geo.index) {
        triangles += geo.index.count / 3;
      } else if (geo.attributes.position) {
        triangles += geo.attributes.position.count / 3;
      }
    }
  });

  return {
    vertices: Math.round(vertices),
    triangles: Math.round(triangles),
  };
}
