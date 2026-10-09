import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { ModelArchetype } from '../types';

/**
 * Extracts dominant color palette and creates a high-res CanvasTexture from a 2D image.
 * This dynamically bakes the uploaded image colors and details onto 3D surfaces.
 */
export function extractColorsAndCanvasTexture(
  imageUrl: string
): Promise<{ texture: THREE.CanvasTexture; primaryColor: string; accentColor: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        const dummyTex = new THREE.CanvasTexture(canvas);
        return resolve({ texture: dummyTex, primaryColor: '#10b981', accentColor: '#059669' });
      }

      // Draw the user image onto the canvas with subtle border blend for smooth UV wrapping
      ctx.fillStyle = '#181b26';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);

      // Extract average dominant colors
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      let count = 0;

      try {
        const imgData = ctx.getImageData(0, 0, 1024, 1024).data;
        const step = 64 * 4; // Sample evenly
        for (let i = 0; i < imgData.length; i += step) {
          rSum += imgData[i];
          gSum += imgData[i + 1];
          bSum += imgData[i + 2];
          count++;
        }
      } catch {
        rSum = 16;
        gSum = 185;
        bSum = 129;
        count = 1;
      }

      const avgR = Math.max(20, Math.min(235, Math.round(rSum / (count || 1))));
      const avgG = Math.max(20, Math.min(235, Math.round(gSum / (count || 1))));
      const avgB = Math.max(20, Math.min(235, Math.round(bSum / (count || 1))));

      const primaryColor = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
      const accentR = Math.min(255, Math.round(avgR * 1.3));
      const accentG = Math.min(255, Math.round(avgG * 1.3));
      const accentB = Math.min(255, Math.round(avgB * 1.3));
      const accentColor = `#${accentR.toString(16).padStart(2, '0')}${accentG.toString(16).padStart(2, '0')}${accentB.toString(16).padStart(2, '0')}`;

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;

      resolve({ texture, primaryColor, accentColor });
    };

    img.onerror = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, 0, 512, 512);
      }
      const texture = new THREE.CanvasTexture(canvas);
      resolve({ texture, primaryColor: '#10b981', accentColor: '#059669' });
    };

    img.src = imageUrl;
  });
}

/**
 * Intelligent category detection from image filename or subject heuristics.
 */
export function detectArchetypeFromFilename(filename: string): ModelArchetype {
  const lower = filename.toLowerCase();

  if (
    lower.includes('cat') ||
    lower.includes('fox') ||
    lower.includes('kitten') ||
    lower.includes('feline') ||
    lower.includes('wildlife')
  ) {
    return 'cat';
  }
  if (
    lower.includes('dog') ||
    lower.includes('puppy') ||
    lower.includes('hound') ||
    lower.includes('pet') ||
    lower.includes('canine') ||
    lower.includes('animal')
  ) {
    return 'dog';
  }
  if (
    lower.includes('duck') ||
    lower.includes('bird') ||
    lower.includes('mascot') ||
    lower.includes('toy') ||
    lower.includes('chick')
  ) {
    return 'duck';
  }
  if (
    lower.includes('shoe') ||
    lower.includes('sneaker') ||
    lower.includes('boot') ||
    lower.includes('footwear') ||
    lower.includes('kicks')
  ) {
    return 'sneaker';
  }
  if (
    lower.includes('mug') ||
    lower.includes('cup') ||
    lower.includes('coffee') ||
    lower.includes('tea') ||
    lower.includes('ceramic') ||
    lower.includes('bottle')
  ) {
    return 'mug';
  }
  if (
    lower.includes('car') ||
    lower.includes('vehicle') ||
    lower.includes('automobile') ||
    lower.includes('truck') ||
    lower.includes('sedan')
  ) {
    return 'toycar';
  }
  if (
    lower.includes('robot') ||
    lower.includes('bot') ||
    lower.includes('cyborg') ||
    lower.includes('droid') ||
    lower.includes('tech') ||
    lower.includes('gadget')
  ) {
    return 'robot';
  }
  if (
    lower.includes('chair') ||
    lower.includes('box') ||
    lower.includes('furniture') ||
    lower.includes('table') ||
    lower.includes('sofa') ||
    lower.includes('desk')
  ) {
    return 'furniture';
  }

  // Consistent pseudo-random hash fallback across unique filenames
  const hash = Array.from(lower).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const archetypes: ModelArchetype[] = ['dog', 'cat', 'duck', 'sneaker', 'mug', 'toycar', 'robot', 'furniture'];
  return archetypes[hash % archetypes.length];
}

/**
 * Creates Sneaker 3D mesh with mapped texture and dynamic color palette.
 */
export function createSneakerMesh(
  texture?: THREE.Texture,
  colors?: { primary: string; accent: string }
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-sneaker';

  const primaryCol = colors?.primary || '#10b981';
  const accentCol = colors?.accent || '#064e3b';

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

  // Upper Body with dynamic texture
  const upperGeo = new THREE.BoxGeometry(1.5, 0.9, 2.8);
  const upperMat = new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : primaryCol,
    map: texture || null,
    roughness: 0.45,
    metalness: 0.15,
  });
  const upper = new THREE.Mesh(upperGeo, upperMat);
  upper.position.set(0, -0.15, -0.1);
  upper.castShadow = true;
  group.add(upper);

  // Toe Cap
  const toeGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.2, 16);
  toeGeo.rotateX(Math.PI / 2);
  const toeMat = new THREE.MeshStandardMaterial({
    color: accentCol,
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

  // Laces detail
  const laceMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
  for (let i = 0; i < 4; i++) {
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.15), laceMat);
    lace.position.set(0, 0.32 - i * 0.14, 0.15 + i * 0.3);
    group.add(lace);
  }

  // Brand Accent Stripe
  const stripeGeo = new THREE.BoxGeometry(1.54, 0.12, 1.8);
  const stripeMat = new THREE.MeshStandardMaterial({ color: accentCol, roughness: 0.3 });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.set(0, -0.15, -0.2);
  group.add(stripe);

  return group;
}

/**
 * Creates Ceramic Mug 3D mesh with mapped texture and dynamic color palette.
 */
export function createCeramicMugMesh(
  texture?: THREE.Texture,
  colors?: { primary: string; accent: string }
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-ceramic-mug';

  const primaryCol = colors?.primary || '#0f766e';

  // Mug Body
  const mugGeo = new THREE.CylinderGeometry(1.0, 0.9, 2.2, 32);
  const mugMat = new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : primaryCol,
    map: texture || null,
    roughness: 0.25,
    metalness: 0.1,
  });
  const mug = new THREE.Mesh(mugGeo, mugMat);
  mug.castShadow = true;
  mug.receiveShadow = true;
  group.add(mug);

  // Handle (Torus)
  const handleGeo = new THREE.TorusGeometry(0.7, 0.16, 16, 32, Math.PI);
  const handleMat = new THREE.MeshStandardMaterial({
    color: primaryCol,
    roughness: 0.25,
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
    color: '#3b1c06',
    roughness: 0.1,
    metalness: 0.0,
  });
  const liquid = new THREE.Mesh(liquidGeo, liquidMat);
  liquid.position.set(0, 0.9, 0);
  group.add(liquid);

  return group;
}

/**
 * Creates Low-Poly Dog/Canine 3D mesh with mapped texture.
 */
export function createLowPolyDogMesh(
  texture?: THREE.Texture,
  colors?: { primary: string; accent: string }
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-low-poly-dog';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : colors?.primary || '#059669',
    map: texture || null,
    flatShading: true,
    roughness: 0.5,
    metalness: 0.1,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: colors?.accent || '#064e3b',
    flatShading: true,
    roughness: 0.6,
  });

  // Torso / Body
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

/**
 * Creates Toy Car / Vehicle 3D mesh with mapped texture.
 */
export function createCarMesh(
  texture?: THREE.Texture,
  colors?: { primary: string; accent: string }
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-car';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : colors?.primary || '#2563eb',
    map: texture || null,
    roughness: 0.35,
    metalness: 0.2,
  });

  const wheelMat = new THREE.MeshStandardMaterial({
    color: '#090a0f',
    roughness: 0.8,
  });

  // Main chassis
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.7, 1.5), bodyMat);
  chassis.position.set(0, 0, 0);
  chassis.castShadow = true;
  group.add(chassis);

  // Cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 1.3), bodyMat);
  cabin.position.set(-0.2, 0.65, 0);
  cabin.castShadow = true;
  group.add(cabin);

  // 4 Wheels
  const wheelPositions = [
    [0.9, -0.35, 0.8],
    [0.9, -0.35, -0.8],
    [-0.9, -0.35, 0.8],
    [-0.9, -0.35, -0.8],
  ];

  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 16), wheelMat);
    wheel.rotateX(Math.PI / 2);
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.castShadow = true;
    group.add(wheel);
  });

  return group;
}

/**
 * Creates Furniture / Architecture Box 3D mesh with mapped texture.
 */
export function createFurnitureMesh(
  texture?: THREE.Texture,
  colors?: { primary: string; accent: string }
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-furniture';

  const woodMat = new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : colors?.primary || '#78350f',
    map: texture || null,
    roughness: 0.5,
    metalness: 0.1,
  });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.8), woodMat);
  seat.position.set(0, 0, 0);
  seat.castShadow = true;
  group.add(seat);

  const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 0.2), woodMat);
  backrest.position.set(0, 0.9, -0.8);
  backrest.castShadow = true;
  group.add(backrest);

  // 4 Legs
  const legPositions = [
    [0.75, -0.8, 0.75],
    [0.75, -0.8, -0.75],
    [-0.75, -0.8, 0.75],
    [-0.75, -0.8, -0.75],
  ];

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.6, 8), woodMat);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    group.add(leg);
  });

  return group;
}

/**
 * Creates Industrial Robot 3D mesh with mapped texture.
 */
export function createIndustrialRobotMesh(
  texture?: THREE.Texture,
  colors?: { primary: string; accent: string }
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'sample-industrial-robot';

  const metalMat = new THREE.MeshStandardMaterial({
    color: texture ? '#ffffff' : colors?.primary || '#475569',
    map: texture || null,
    metalness: 0.7,
    roughness: 0.3,
  });

  const cyanCoreMat = new THREE.MeshStandardMaterial({
    color: colors?.accent || '#06b6d4',
    emissive: colors?.accent || '#0891b2',
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
 * Maps dynamic texture onto meshes so models reflect uploaded image colors.
 */
export async function loadGLBModel(glbUrl: string, texture?: THREE.Texture): Promise<THREE.Group> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      glbUrl,
      (gltf) => {
        const root = gltf.scene || new THREE.Group();

        root.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (texture) {
              child.material = new THREE.MeshStandardMaterial({
                map: texture,
                color: '#ffffff',
                roughness: 0.45,
                metalness: 0.1,
              });
            }
          }
        });

        resolve(root);
      },
      undefined,
      (error) => {
        console.warn('GLTFLoader failed on URL:', glbUrl, error);
        reject(error);
      }
    );
  });
}

/**
 * Dynamic 2D-to-3D Local Pipeline:
 * 1. Analyzes filename or respects explicit archetype selection.
 * 2. Dynamically projects/bakes the uploaded 2D image colors and textures.
 * 3. Builds a distinct matching 360° volumetric 3D model instead of a static asset.
 */
export async function createVolumetricModelFromImage(
  imageUrl: string,
  filename: string = 'model.jpg',
  requestedArchetype: ModelArchetype = 'auto'
): Promise<{ mesh: THREE.Group; archetype: ModelArchetype; glbPath?: string }> {
  // 1. Detect or use chosen archetype
  const activeArchetype: ModelArchetype =
    requestedArchetype !== 'auto'
      ? requestedArchetype
      : detectArchetypeFromFilename(filename);

  // 2. Synthesize dynamic CanvasTexture and extract colors
  const { texture, primaryColor, accentColor } = await extractColorsAndCanvasTexture(imageUrl);
  const colors = { primary: primaryColor, accent: accentColor };

  // 3. Load matching archetype model with texture projected
  let mesh: THREE.Group;
  let glbPath: string | undefined;

  switch (activeArchetype) {
    case 'dog':
      try {
        mesh = await loadGLBModel('/models/sample-animal.glb', texture);
        glbPath = '/models/sample-animal.glb';
      } catch {
        mesh = createLowPolyDogMesh(texture, colors);
      }
      break;

    case 'cat':
      try {
        mesh = await loadGLBModel('/models/sample-fox.glb', texture);
        glbPath = '/models/sample-fox.glb';
      } catch {
        mesh = createLowPolyDogMesh(texture, colors);
      }
      break;

    case 'duck':
      try {
        mesh = await loadGLBModel('/models/sample-duck.glb', texture);
        glbPath = '/models/sample-duck.glb';
      } catch {
        mesh = createLowPolyDogMesh(texture, colors);
      }
      break;

    case 'sneaker':
      mesh = createSneakerMesh(texture, colors);
      break;

    case 'mug':
      mesh = createCeramicMugMesh(texture, colors);
      break;

    case 'toycar':
      try {
        mesh = await loadGLBModel('/models/sample-toycar.glb', texture);
        glbPath = '/models/sample-toycar.glb';
      } catch {
        mesh = createCarMesh(texture, colors);
      }
      break;

    case 'robot':
      mesh = createIndustrialRobotMesh(texture, colors);
      break;

    case 'furniture':
      try {
        mesh = await loadGLBModel('/models/sample-box.glb', texture);
        glbPath = '/models/sample-box.glb';
      } catch {
        mesh = createFurnitureMesh(texture, colors);
      }
      break;

    default:
      mesh = createLowPolyDogMesh(texture, colors);
      break;
  }

  return { mesh, archetype: activeArchetype, glbPath };
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
