import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { ProjectItem, DominoEntry } from "./types";
import { createNoiseTexture, createCardTexture } from "./textures";

const FAKE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

function getVideoSrc(project: ProjectItem, index: number): string {
  const src = project.videoSrc;
  if (src && !src.includes("smoke") && !src.includes("hero")) return src;
  return FAKE_VIDEOS[index % FAKE_VIDEOS.length];
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const nearestAngle = (target: number, reference: number): number => {
  const tau = Math.PI * 2;
  const delta = ((((target - reference) % tau) + Math.PI * 3) % tau) - Math.PI;
  return reference + delta;
};

export interface Section06InitOptions {
  root: HTMLElement;
  projects: ProjectItem[];
  onRefreshMeta: (index: number) => void;
  onOpenPreview: (index: number) => void;
  onClosePreview: () => void;
}

export function initSection06Projects(options: Section06InitOptions): void {
  const { root, projects, onRefreshMeta, onOpenPreview, onClosePreview } =
    options;

  const stage = root.querySelector<HTMLElement>("[data-projects-stage]");
  const canvas = root.querySelector<HTMLCanvasElement>("[data-projects-canvas]");
  const metaName = root.querySelector<HTMLElement>("[data-meta-name]");
  const metaServices = root.querySelector<HTMLElement>("[data-meta-services]");

  if (!stage || !canvas || projects.length === 0) return;

  const refreshMeta = (index: number) => {
    const project = projects[index];
    if (!project || !metaName || !metaServices) return;
    metaName.textContent = project.name;
    metaServices.textContent = project.services.join(". ");
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const supportsWebGL = (() => {
    try {
      const probe = document.createElement("canvas");
      return Boolean(
        window.WebGLRenderingContext &&
          (probe.getContext("webgl2") || probe.getContext("webgl")),
      );
    } catch {
      return false;
    }
  })();

  if (!supportsWebGL || reducedMotion.matches) {
    root.setAttribute("data-enhanced", "false");
    refreshMeta(0);
    return;
  }

  root.setAttribute("data-enhanced", "true");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.91;
  renderer.setClearAlpha(0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d1030, 11, 24);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0.42, 10.8);
  camera.lookAt(0, 0.05, 0);

  scene.add(new THREE.AmbientLight(0x9ca7ff, 0.3));

  const keyLight = new THREE.DirectionalLight(0xf4f5ff, 0.72);
  keyLight.position.set(9.6, 5.6, 1.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.bias = -0.00015;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x8f76ff, 1.24);
  rimLight.position.set(-9.4, 4.6, -7.6);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x306dff, 0.46, 44);
  fillLight.position.set(-10.2, -1.6, 5.4);
  scene.add(fillLight);

  const sideAccentLight = new THREE.PointLight(0x7458ff, 0.72, 36);
  sideAccentLight.position.set(8.8, 1.2, -5.8);
  scene.add(sideAccentLight);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
  scene.environment = envRenderTarget.texture;
  pmremGenerator.dispose();

  const orbitGroup = new THREE.Group();
  orbitGroup.rotation.z = THREE.MathUtils.degToRad(-6.5);
  scene.add(orbitGroup);

  const groundGlow = new THREE.Mesh(
    new THREE.CircleGeometry(7.2, 64),
    new THREE.MeshBasicMaterial({
      color: 0x18254f,
      transparent: true,
      opacity: 0.12,
    }),
  );
  groundGlow.rotation.x = -Math.PI / 2;
  groundGlow.position.set(0, -2.62, -1.2);
  scene.add(groundGlow);

  const CARD_WIDTH = 2.22;
  const CARD_HEIGHT = 3.72;
  const CARD_DEPTH = 0.78;
  const CORNER_RADIUS = 0.17;

  const geometry = new RoundedBoxGeometry(
    CARD_WIDTH,
    CARD_HEIGHT,
    CARD_DEPTH,
    8,
    CORNER_RADIUS,
  );

  const maxAnisotropy = Math.min(
    renderer.capabilities.getMaxAnisotropy(),
    16,
  );

  const roughnessMap = createNoiseTexture(256, 152, 34, 2.2, 3.1, maxAnisotropy);
  const bumpMap = createNoiseTexture(256, 126, 54, 2.9, 4.2, maxAnisotropy);

  const dominoes: DominoEntry[] = projects.map((project, index) => {
    const frontTexture = createCardTexture(project, index, "front", maxAnisotropy);
    const backTexture = createCardTexture(project, index, "back", maxAnisotropy);

    const sideA = new THREE.MeshPhysicalMaterial({
      color: 0x262a4b,
      roughness: 0.58,
      metalness: 0.12,
      clearcoat: 0.14,
      clearcoatRoughness: 0.52,
      envMapIntensity: 0.86,
      roughnessMap,
      bumpMap,
      bumpScale: 0.014,
    });

    const sideB = new THREE.MeshPhysicalMaterial({
      color: 0x313464,
      roughness: 0.55,
      metalness: 0.11,
      clearcoat: 0.12,
      clearcoatRoughness: 0.56,
      envMapIntensity: 0.9,
      roughnessMap,
      bumpMap,
      bumpScale: 0.013,
    });

    const front = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.58,
      metalness: 0.08,
      clearcoat: 0.12,
      clearcoatRoughness: 0.46,
      envMapIntensity: 0.62,
      roughnessMap,
      bumpMap,
      bumpScale: 0.014,
      emissive: 0x090d1f,
      emissiveIntensity: 0.03,
    });

    const back = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.46,
      metalness: 0.14,
      clearcoat: 0.28,
      clearcoatRoughness: 0.32,
      envMapIntensity: 0.95,
      roughnessMap,
      bumpMap,
      bumpScale: 0.016,
    });

    const materials: THREE.MeshPhysicalMaterial[] = [
      sideA,
      sideB,
      sideA.clone(),
      sideB.clone(),
      front,
      back,
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.projectIndex = index;
    orbitGroup.add(mesh);

    return { mesh, materials, frontTexture, backTexture };
  });

  const step = (Math.PI * 2) / dominoes.length;
  const normalizeIndex = (index: number): number =>
    ((index % projects.length) + projects.length) % projects.length;
  const rotationForIndex = (index: number): number =>
    -(normalizeIndex(index) * step);

  const resolveNearestIndex = (rotation: number): number => {
    let bestIndex = 0;
    let bestDelta = Number.POSITIVE_INFINITY;
    for (let i = 0; i < projects.length; i += 1) {
      const candidate = nearestAngle(rotationForIndex(i), rotation);
      const delta = Math.abs(candidate - rotation);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIndex = i;
      }
    }
    return bestIndex;
  };

  let currentRotation = -0.34;
  let targetRotation = -0.34;
  let forcedRotation: number | null = null;
  let springVelocity = 0;
  let manualVelocity = 0;
  let targetIndex = resolveNearestIndex(currentRotation);
  let centerIndex = targetIndex;
  let activeIndex = -1;
  let flipRotationY = 0;
  let flipTargetY = 0;
  let flipVelocity = 0;
  let hasTriggeredPreviewOpen = false;
  let rafId = 0;
  let previousTime = 0;
  let scrollLockActive = false;
  const scrollRotationSpeed = 0.00035;

  const setMeshOpacity = (entry: DominoEntry, opacity: number) => {
    entry.materials.forEach((material) => {
      material.transparent = opacity < 0.995;
      material.opacity = opacity;
      material.depthWrite = opacity >= 0.995;
    });
  };

  const centerOnIndex = (
    index: number,
    options: { kick?: boolean } = {},
  ): void => {
    const { kick = true } = options;
    targetIndex = normalizeIndex(index);
    forcedRotation = nearestAngle(
      rotationForIndex(targetIndex),
      currentRotation,
    );
    manualVelocity = 0;
    if (kick) {
      springVelocity +=
        Math.sign(
          nearestAngle(forcedRotation, currentRotation) - currentRotation,
        ) * 0.032;
    }
    refreshMeta(targetIndex);
  };

  const syncTargetIndexFromCurrent = () => {
    targetIndex = resolveNearestIndex(currentRotation);
  };

  const spinByStep = (direction: number) => {
    if (activeIndex >= 0) return;
    if (forcedRotation === null) syncTargetIndexFromCurrent();
    centerOnIndex(targetIndex + direction);
  };

  const openPreviewForIndex = (index: number) => {
    const project = projects[index];
    if (!project) return;
    activeIndex = index;
    hasTriggeredPreviewOpen = false;
    centerOnIndex(index, { kick: false });
    springVelocity *= 0.4;
    flipTargetY = Math.PI;
    flipVelocity = 0.055;
  };

  const closePreview = () => {
    onClosePreview();
    flipTargetY = 0;
    flipVelocity = -0.055;
  };

  const finishClosePreview = () => {
    activeIndex = -1;
    flipRotationY = 0;
    refreshMeta(centerIndex);
  };

  const getOrbitMetrics = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const aspect = width / Math.max(height, 1);
    const compact = width < 760;

    return {
      radiusX: clamp(aspect * (compact ? 3.15 : 3.5), 2.95, 5.85),
      radiusZ: clamp(aspect * (compact ? 2.28 : 2.56), 2.15, 4.25),
      axisTilt: THREE.MathUtils.degToRad(compact ? -9 : -13),
      verticalRadius: compact ? 0.16 : 0.27,
    };
  };

  const inScrollLockZone = () => {
    const rect = root.getBoundingClientRect();
    return (
      rect.top < window.innerHeight * 0.63 &&
      rect.bottom > window.innerHeight * 0.37
    );
  };

  const updateScrollLockState = () => {
    if (activeIndex >= 0) {
      scrollLockActive = false;
      return;
    }

    if (inScrollLockZone()) {
      if (!scrollLockActive) scrollLockActive = true;
    } else {
      scrollLockActive = false;
    }
  };

  const renderOrbit = () => {
    const { radiusX, radiusZ, axisTilt, verticalRadius } = getOrbitMetrics();
    let frontIndex = 0;
    let frontDepth = -Infinity;

    dominoes.forEach((entry, index) => {
      const angle = currentRotation + index * step;
      const xBase = Math.sin(angle) * radiusX;
      const yBase = Math.cos(angle) * verticalRadius;
      const x = xBase * Math.cos(axisTilt) - yBase * Math.sin(axisTilt);
      const y =
        xBase * Math.sin(axisTilt) +
        yBase * Math.cos(axisTilt) +
        Math.sin(angle * 1.6 + currentRotation * 0.5) * 0.07;
      const z = Math.cos(angle) * radiusZ;

      const depthNorm = (z + radiusZ) / (2 * radiusZ);
      const scale = 0.79 + depthNorm * 0.3;

      entry.mesh.position.set(x, y, z);
      entry.mesh.scale.setScalar(scale);
      entry.mesh.rotation.set(0, 0, 0);
      entry.mesh.lookAt(0, y * 0.14, 0);
      entry.mesh.rotateY(Math.PI);

      if (activeIndex === index) {
        entry.mesh.rotateY(flipRotationY);
      }

      entry.mesh.rotateZ(Math.sin(angle) * 0.043);
      entry.mesh.rotateX(Math.cos(angle) * 0.024);

      if (activeIndex === -1) {
        // Keep cards opaque during orbit to avoid transparency sorting artifacts.
        setMeshOpacity(entry, 1);
      } else {
        setMeshOpacity(entry, activeIndex === index ? 0.98 : 0.12);
      }

      const frontMaterial = entry.materials[4];
      // Keep face readable when card points toward camera:
      // reduce clearcoat/env highlights as depthNorm approaches front.
      frontMaterial.emissiveIntensity =
        activeIndex === index ? 0.05 : 0.06 - depthNorm * 0.03;
      frontMaterial.clearcoat =
        activeIndex === index ? 0.16 : 0.17 - depthNorm * 0.06;
      frontMaterial.envMapIntensity =
        activeIndex === index ? 0.7 : 0.7 - depthNorm * 0.16;

      if (z > frontDepth) {
        frontDepth = z;
        frontIndex = index;
      }
    });

    if (activeIndex === -1) {
      centerIndex = forcedRotation === null ? frontIndex : targetIndex;
      refreshMeta(centerIndex);
    } else {
      centerIndex = activeIndex;
    }
  };

  const resize = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderOrbit();
    renderer.render(scene, camera);
  };

  const raycaster = new THREE.Raycaster();
  const rayPointer = new THREE.Vector2();

  let pointerActive = false;
  let pointerMoved = false;
  let pointerCaptured = false;
  let pointerX = 0;
  let pointerY = 0;

  const isInteractiveTarget = (target: EventTarget | null): boolean =>
    target instanceof Element &&
    Boolean(
      target.closest(
        "[data-spin-left], [data-spin-right], [data-preview-close], [data-preview-link], a, button",
      ),
    );

  const pointerDown = (event: PointerEvent) => {
    if (activeIndex >= 0) return;
    if (isInteractiveTarget(event.target)) return;

    pointerActive = true;
    pointerMoved = false;
    pointerCaptured = false;
    pointerX = event.clientX;
    pointerY = event.clientY;
  };

  const pointerMove = (event: PointerEvent) => {
    if (!pointerActive || activeIndex >= 0) return;

    const dx = event.clientX - pointerX;
    const dy = event.clientY - pointerY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      pointerMoved = true;
    }

    if (!pointerCaptured && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
      stage.setPointerCapture?.(event.pointerId);
      pointerCaptured = true;
    }

    if (pointerCaptured) {
      forcedRotation = null;
      manualVelocity += (dx / Math.max(stage.clientWidth, 1)) * 0.48;
      pointerX = event.clientX;
      pointerY = event.clientY;
      event.preventDefault();
    }
  };

  const pointerUp = (event: PointerEvent) => {
    if (!pointerActive) return;

    if (!pointerMoved && activeIndex < 0) {
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      rayPointer.set(x, y);
      raycaster.setFromCamera(rayPointer, camera);

      const hit = raycaster.intersectObjects(
        dominoes.map((e) => e.mesh),
        false,
      )[0];

      if (hit?.object) {
        const hitIndex = Number(hit.object.userData.projectIndex);
        if (Number.isFinite(hitIndex)) {
          refreshMeta(hitIndex);
          openPreviewForIndex(hitIndex);
        }
      }
    }

    pointerActive = false;
    pointerMoved = false;
    if (pointerCaptured) {
      stage.releasePointerCapture?.(event.pointerId);
    }
    pointerCaptured = false;
  };

  const wheelHandler = (event: WheelEvent) => {
    if (activeIndex >= 0) return;

    const dx = event.deltaX;
    const dy = event.deltaY;
    const horizontalIntent =
      event.shiftKey || Math.abs(dx) > Math.abs(dy) * 0.85;

    if (horizontalIntent) {
      event.preventDefault();
      forcedRotation = null;
      manualVelocity += (dx + dy * 0.35) * 0.00052;
    }
  };

  const scrollWheelHandler = (event: WheelEvent) => {
    if (activeIndex >= 0) return;

    updateScrollLockState();
    if (!scrollLockActive) return;

    const mostlyVertical =
      Math.abs(event.deltaY) > Math.abs(event.deltaX) * 1.05;
    if (!mostlyVertical || Math.abs(event.deltaY) < 0.25) return;

    const scrollRotation = event.deltaY * scrollRotationSpeed;
    currentRotation += scrollRotation;
    forcedRotation = null;
    manualVelocity = 0;
    springVelocity = 0;
  };

  const spinLeftButton = root.querySelector<HTMLButtonElement>("[data-spin-left]");
  const spinRightButton = root.querySelector<HTMLButtonElement>("[data-spin-right]");

  spinLeftButton?.addEventListener("click", () => spinByStep(-1));
  spinRightButton?.addEventListener("click", () => spinByStep(1));

  stage.addEventListener("pointerdown", pointerDown);
  stage.addEventListener("pointermove", pointerMove);
  stage.addEventListener("pointerup", pointerUp);
  stage.addEventListener("pointercancel", pointerUp);
  stage.addEventListener("wheel", wheelHandler, { passive: false });

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateScrollLockState, { passive: true });
  window.addEventListener("wheel", scrollWheelHandler, { passive: true });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") spinByStep(-1);
    if (event.key === "ArrowRight") spinByStep(1);
    if (event.key === "Escape" && activeIndex >= 0) closePreview();
  });

  root.addEventListener("section06-close-preview", () => {
    closePreview();
  });

  const animate = (time: number) => {
    const delta = previousTime
      ? clamp((time - previousTime) / 16.6667, 0.55, 2.2)
      : 1;
    previousTime = time;

    if (flipTargetY !== flipRotationY) {
      const diff = flipTargetY - flipRotationY;
      flipVelocity += diff * 0.035 * delta;
      flipVelocity *= 0.88;
      flipRotationY += flipVelocity * delta;

      if (
        !hasTriggeredPreviewOpen &&
        activeIndex >= 0 &&
        flipTargetY > 0 &&
        flipRotationY >= Math.PI * 0.78
      ) {
        hasTriggeredPreviewOpen = true;
        onOpenPreview(activeIndex);
      }

      if (Math.abs(diff) < 0.01 && Math.abs(flipVelocity) < 0.01) {
        flipRotationY = flipTargetY;
        flipVelocity = 0;
        if (flipTargetY === 0) {
          finishClosePreview();
        }
      }
    }

    if (forcedRotation === null) {
      currentRotation += manualVelocity * delta;
      manualVelocity *= Math.pow(0.86, delta);
      if (Math.abs(manualVelocity) < 0.00005) manualVelocity = 0;
      targetRotation = currentRotation;
      springVelocity *= Math.pow(0.75, delta);
      if (Math.abs(springVelocity) < 0.00003) springVelocity = 0;
    } else {
      const target = nearestAngle(forcedRotation, currentRotation);
      const rotationDelta = target - currentRotation;
      springVelocity += rotationDelta * (0.092 * delta);
      springVelocity *= Math.pow(0.64, delta);
      currentRotation += springVelocity * delta;
      if (
        Math.abs(rotationDelta) < 0.00012 &&
        Math.abs(springVelocity) < 0.00012
      ) {
        currentRotation = target;
        springVelocity = 0;
      }
    }

    renderOrbit();
    renderer.render(scene, camera);
    rafId = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (rafId) return;
    previousTime = 0;
    rafId = window.requestAnimationFrame(animate);
  };

  const stop = () => {
    if (!rafId) return;
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  };

  centerOnIndex(targetIndex, { kick: false });
  resize();
  updateScrollLockState();
  renderOrbit();
  refreshMeta(targetIndex);
  start();

  window.addEventListener("beforeunload", () => {
    stop();
    geometry.dispose();
    roughnessMap.dispose();
    bumpMap.dispose();
    envRenderTarget.texture.dispose();
    envRenderTarget.dispose();
    dominoes.forEach((entry) => {
      entry.frontTexture.dispose();
      entry.backTexture.dispose();
      entry.materials.forEach((material) => material.dispose());
    });
    renderer.dispose();
  });
}

export { getVideoSrc };
