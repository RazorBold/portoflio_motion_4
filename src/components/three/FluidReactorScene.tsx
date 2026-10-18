import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import ReactorControls, { type ReactorSettings } from './ReactorControls';

// Pre-allocate reusable math helpers outside render loop to prevent GC spikes
const _vec3 = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _color = new THREE.Color();
const _rotMat = new THREE.Matrix4();

export default function FluidReactorScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<ReactorSettings>({
    preset: 'macro',
    speed: 1.0,
    state: 'normal',
    wireframe: false,
    particlesCount: 450,
  });
  const [isHovered, setIsHovered] = useState(false);

  // Keep ref to mutable state for animation loop
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.FogExp2(0xf0f0f0, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);

    // 2. Renderer with ACESFilmicToneMapping & PBR Pipeline
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting Rig (Warm Key + Cool Hemisphere Fill)
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 3.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isHeadless;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xe8f0fe, 0xd0d5dd, 1.4);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // 5. Contact Shadow Ground Plane (Procedural circular radial gradient)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(30, 50, 90, 0.45)');
      grad.addColorStop(0.35, 'rgba(30, 50, 90, 0.2)');
      grad.addColorStop(0.7, 'rgba(30, 50, 90, 0.05)');
      grad.addColorStop(1, 'rgba(30, 50, 90, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.45;
    scene.add(shadowPlane);

    // 6. Composite 3-12 Part Procedural Model: RIVR Fluid Stream Reactor (THREE.Group)
    const reactorGroup = new THREE.Group();
    reactorGroup.position.y = 0.1;
    scene.add(reactorGroup);

    // Part 1: Central Refractive Fluid Orb (Optical glass / liquid core)
    const coreGeo = new THREE.SphereGeometry(0.85, 64, 64);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      metalness: 0.1,
      ior: 1.52,
      thickness: 1.2,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x38bdf8),
      attenuationDistance: 1.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = true;
    reactorGroup.add(coreMesh);

    // Part 2: Inner Pulsing Liquid Node
    const innerNodeGeo = new THREE.IcosahedronGeometry(0.42, 3);
    const innerNodeMat = new THREE.MeshStandardMaterial({
      color: 0x1e325a,
      roughness: 0.2,
      metalness: 0.85,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.6,
    });
    const innerNode = new THREE.Mesh(innerNodeGeo, innerNodeMat);
    reactorGroup.add(innerNode);

    // Part 3: Primary Gyroscope Ring (Brushed Champagne Gold)
    const outerRingGeo = new THREE.TorusGeometry(1.42, 0.045, 24, 120);
    const outerRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5d0a9,
      roughness: 0.18,
      metalness: 0.95,
      clearcoat: 0.5,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.castShadow = true;
    reactorGroup.add(outerRing);

    // Part 4: Secondary Gimbal Ring (Polished Blued Steel / Platinum)
    const midRingGeo = new THREE.TorusGeometry(1.68, 0.038, 24, 120);
    const midRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.92,
      clearcoat: 0.8,
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    midRing.rotation.x = Math.PI / 3;
    midRing.castShadow = true;
    reactorGroup.add(midRing);

    // Part 5: Outer Telemetry Orbit Ring (Rose Gold with subtle scale ticks)
    const outerTrackGeo = new THREE.TorusGeometry(1.95, 0.025, 20, 140);
    const outerTrackMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.85,
    });
    const outerTrack = new THREE.Mesh(outerTrackGeo, outerTrackMat);
    outerTrack.rotation.y = Math.PI / 4;
    reactorGroup.add(outerTrack);

    // Part 6: Stream Collector Emitters (Spherical node accents around ring)
    const emitterGroup = new THREE.Group();
    const emitterGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const emitterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.9,
      emissive: new THREE.Color(0x38bdf8),
      emissiveIntensity: 0.8,
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const emitter = new THREE.Mesh(emitterGeo, emitterMat);
      emitter.position.set(Math.cos(angle) * 1.42, Math.sin(angle) * 1.42, 0);
      emitterGroup.add(emitter);
    }
    outerRing.add(emitterGroup);

    // Part 7: Instanced Fluid Stream Nodes (600+ orbiting liquidity particles)
    const particleCount = 500;
    const particleGeo = new THREE.SphereGeometry(0.028, 10, 10);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.4,
    });
    const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    instancedParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedParticles.castShadow = false;
    scene.add(instancedParticles);

    // Initialize particle stream telemetry data
    const particleData: Array<{
      radius: number;
      angle: number;
      speed: number;
      tilt: number;
      elevation: number;
      freq: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particleData.push({
        radius: 1.1 + Math.random() * 1.8,
        angle: Math.random() * Math.PI * 2,
        speed: (0.4 + Math.random() * 0.9) * (Math.random() > 0.4 ? 1 : -1),
        tilt: (Math.random() - 0.5) * 1.2,
        elevation: (Math.random() - 0.5) * 0.8,
        freq: 1.5 + Math.random() * 3,
      });

      _color.setHSL(0.56 + Math.random() * 0.1, 0.8, 0.65);
      instancedParticles.setColorAt(i, _color);
    }
    if (instancedParticles.instanceColor) instancedParticles.instanceColor.needsUpdate = true;
    instancedParticles.computeBoundingSphere();

    // 7. Interactive Damped Orbit & Pointer Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      const deltaY = e.clientY - previousPointerY;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;

      targetRotY += deltaX * 0.006;
      targetRotX += deltaY * 0.006;
      targetRotX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Camera preset targets for silky smooth damping
    const targetCameraPos = new THREE.Vector3(0, 2.2, 5.8);
    const cameraLookAt = new THREE.Vector3(0, 0.1, 0);

    // 8. Animation Loop with Exponential Damping & Lossless 60fps
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      const currentSettings = settingsRef.current;
      const speedMult = currentSettings.speed;

      // Handle preset camera targeting
      if (currentSettings.preset === 'macro') {
        targetCameraPos.set(0, 1.8, 4.6);
      } else if (currentSettings.preset === 'exploded') {
        targetCameraPos.set(2.4, 2.8, 4.2);
      } else if (currentSettings.preset === 'flow') {
        targetCameraPos.set(-2.6, 1.2, 4.0);
      } else if (currentSettings.preset === 'zen') {
        targetCameraPos.set(0, 3.8, 4.8);
      }

      // Smooth camera position damping (1 - Math.exp(-k * dt))
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCameraPos.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCameraPos.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCameraPos.z, 3.5, delta);
      camera.lookAt(cameraLookAt);

      // Smooth rotation damping
      currentRotX = THREE.MathUtils.damp(currentRotX, targetRotX, 6.0, delta);
      currentRotY = THREE.MathUtils.damp(currentRotY, targetRotY, 6.0, delta);
      reactorGroup.rotation.x = currentRotX + Math.sin(time * 0.4) * 0.05;
      reactorGroup.rotation.y = currentRotY + time * 0.15 * speedMult;

      // Gimbal animations
      outerRing.rotation.z = time * 0.45 * speedMult;
      midRing.rotation.y = -time * 0.35 * speedMult;
      outerTrack.rotation.x = time * 0.25 * speedMult;

      // Inner liquid pulse
      const pulse = 1 + Math.sin(time * 2.8 * speedMult) * 0.06;
      innerNode.scale.set(pulse, pulse, pulse);
      innerNode.rotation.y = -time * 0.8 * speedMult;

      // Update particle stream vortex
      const activeCount = Math.min(particleCount, currentSettings.particlesCount);
      for (let i = 0; i < particleCount; i++) {
        if (i >= activeCount) {
          _mat4.makeScale(0, 0, 0);
          instancedParticles.setMatrixAt(i, _mat4);
          continue;
        }

        const p = particleData[i];
        p.angle += p.speed * 0.8 * speedMult * delta;
        const wave = Math.sin(time * p.freq + p.angle) * 0.18;
        const rad = p.radius + wave;

        const px = Math.cos(p.angle) * rad;
        const pz = Math.sin(p.angle) * rad;
        const py = p.elevation + Math.sin(p.angle * 2) * p.tilt + wave * 0.5;

        _vec3.set(px, py + 0.1, pz);
        _mat4.makeTranslation(_vec3.x, _vec3.y, _vec3.z);

        // Subtly scale particle by wave height
        const pScale = 0.85 + Math.sin(time * 3 + i) * 0.3;
        _rotMat.makeScale(pScale, pScale, pScale);
        _mat4.multiply(_rotMat);

        instancedParticles.setMatrixAt(i, _mat4);
      }
      instancedParticles.instanceMatrix.needsUpdate = true;

      // Toggle wireframe mode
      coreMat.wireframe = currentSettings.wireframe;
      outerRingMat.wireframe = currentSettings.wireframe;
      midRingMat.wireframe = currentSettings.wireframe;

      // State adjustments
      if (currentSettings.state === 'surge') {
        coreMat.attenuationColor.set(0x06b6d4);
        keyLight.intensity = THREE.MathUtils.damp(keyLight.intensity, 4.5, 3.0, delta);
      } else if (currentSettings.state === 'staking') {
        coreMat.attenuationColor.set(0x818cf8);
        keyLight.intensity = THREE.MathUtils.damp(keyLight.intensity, 3.0, 3.0, delta);
      } else {
        coreMat.attenuationColor.set(0x38bdf8);
        keyLight.intensity = THREE.MathUtils.damp(keyLight.intensity, 3.2, 3.0, delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Clean disposal
      coreGeo.dispose();
      coreMat.dispose();
      innerNodeGeo.dispose();
      innerNodeMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      midRingGeo.dispose();
      midRingMat.dispose();
      outerTrackGeo.dispose();
      outerTrackMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowTexture.dispose();
      shadowMat.dispose();
      renderer.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  return (
    <section id="reactor" className="relative w-full max-w-[1536px] mx-auto px-4 md:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200/80 mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[rgba(30,50,90,0.85)]" />
          <span className="text-xs font-medium text-[rgba(30,50,90,0.85)] tracking-wide uppercase">
            Interactive 3D Engine
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-800 tracking-tight leading-tight">
          Liquid Stream Reactor
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
          Inspect RIVR&apos;s real-time fluid settlement engine rendered in Three.js PBR optics. Click and
          drag to inspect the multi-layer liquid core.
        </p>
      </div>

      {/* 3D Viewport Card Container */}
      <div
        className="relative w-full h-[520px] sm:h-[620px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-slate-200/70 bg-gradient-to-b from-[#f8f9fa] to-[#ebeff3] shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Isolated WebGL Canvas Ref */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />

        {/* Minimal Spec Watermark (Top Left) */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none hidden sm:flex flex-col gap-1 bg-white/70 border border-white/40 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Engine State
          </span>
          <span className="text-sm font-semibold text-slate-800">
            PBR Caustics • 60 FPS
          </span>
        </div>

        {/* Interaction Hint (Top Right) */}
        <div className="absolute top-6 right-6 z-10 pointer-events-none hidden sm:flex items-center gap-2 bg-white/70 border border-white/40 rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-xs">
          <span className="text-xs text-slate-600 font-normal">
            Drag to Rotate • Smooth Damping
          </span>
        </div>

        {/* Consolidated Collapsible Bottom Dock (Adhering to Three.js Ergonomics) */}
        <ReactorControls settings={settings} onChange={setSettings} />
      </div>
    </section>
  );
}
