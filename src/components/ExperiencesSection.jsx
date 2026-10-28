import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Compass, Sparkles, ChevronRight } from 'lucide-react';
import { createAmmanDomeRobot } from './DomeRobotCanvas';

/**
 * ExperiencesSection
 * Scroll-driven continuous journey through Amman Dome's three proposed experience zones:
 *   01 // VR World (VR Car Racing, VR Gaming, VR Paragliding, VR Surfing)
 *   02 // Gaming & Esports (Video Game Hall, Digital Competition Arena)
 *   03 // Immersive Attractions (Immersive Science Room, IMAX Cinema Inside the Main Dome, Hologram Rooms)
 *
 * Architecture:
 * - Left / Start 6 Columns (Desktop Sticky Stage): Fits cleanly inside the viewport (`lg:sticky lg:top-24`),
 *   housing the pre-mounted 9-image Conceptual Visualization crossfade viewport, the real-time Three.js
 *   3D Robot Spatial Guide (`createAmmanDomeRobot`), and the Architectural Dome Locator.
 * - Right / End 6 Columns (Progressive Scroll Spine): Renders all 3 zones and all 9 experience cards
 *   in natural vertical scroll flow so cards appear progressively and remain visible and readable
 *   at all times while scrolling both down and up.
 */
export default function ExperiencesSection({ lang, copy }) {
  const isRtl = lang === 'ar';
  const expCopy = copy.experiences;
  const zones = expCopy.zones;

  const sectionRef = useRef(null);
  const canvasMountRef = useRef(null);
  const progressBarRef = useRef(null);
  const cardRefs = useRef([]);

  // Continuous normalized scroll progress [0..1] across the 9 cards
  const scrollProgressRef = useRef(0);
  const activeFlatIdxRef = useRef(0);
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const [activeAttractionIdx, setActiveAttractionIdx] = useState(0);
  const [layerPair, setLayerPair] = useState({ currentIdx: 0, prevIdx: 0 });

  // Build flat checkpoint list across all 9 attractions
  const checkpoints = useMemo(() => {
    const list = [];
    zones.forEach((zone, zIdx) => {
      zone.attractions.forEach((attr, aIdx) => {
        list.push({
          flatIdx: list.length,
          zoneIdx: zIdx,
          attractionIdx: aIdx,
          zoneId: zone.id,
          code: attr.code,
          title: attr.title,
          image: attr.image,
          conceptTag: attr.conceptTag,
        });
      });
    });
    return list;
  }, [zones]);

  // Eagerly preload and decode all 9 attraction images into GPU-ready bitmaps
  // so the left 16:9 visual panel never flashes blank or decodes late during scroll
  useEffect(() => {
    checkpoints.forEach((cp) => {
      if (!cp.image) return;
      const img = new Image();
      img.decoding = 'sync';
      img.src = cp.image;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, [checkpoints]);

  // Helper to commit a new active flat checkpoint index and maintain the 2-layer opaque stack
  const commitActiveFlatIndex = useCallback(
    (nextFlatIdx) => {
      const clampedIdx = Math.max(
        0,
        Math.min(checkpoints.length - 1, nextFlatIdx)
      );
      if (activeFlatIdxRef.current !== clampedIdx) {
        activeFlatIdxRef.current = clampedIdx;
        setLayerPair((prev) =>
          prev.currentIdx === clampedIdx
            ? prev
            : { currentIdx: clampedIdx, prevIdx: prev.currentIdx }
        );
      }
      const activeItem = checkpoints[clampedIdx];
      if (activeItem) {
        setActiveZoneIdx((prev) =>
          prev !== activeItem.zoneIdx ? activeItem.zoneIdx : prev
        );
        setActiveAttractionIdx((prev) =>
          prev !== activeItem.attractionIdx ? activeItem.attractionIdx : prev
        );
      }
    },
    [checkpoints]
  );

  // Real-time bidirectional scroll tracking across all 9 experience cards
  // Uses a single continuous card-index coordinate [0.0 .. 8.0] so the Left 16:9 Image,
  // 3D Robot Guide, 3-Zone Progress Bar, and Right Experience Cards are 100% synchronized.
  const updateScrollState = useCallback(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const viewportH = window.innerHeight || 800;
    const sectionRect = sectionEl.getBoundingClientRect();

    // Smoothly shift the reading focal line from 36% of viewport height (at section top,
    // aligned with the sticky 16:9 stage center) down to 64% (near section bottom, where
    // the sticky stage docks beside the final cards IA-02 and IA-03).
    const rawSectionRatio = Math.max(
      0,
      Math.min(
        1,
        (viewportH * 0.35 - sectionRect.top) /
          Math.max(1, sectionRect.height - viewportH * 0.75)
      )
    );
    const focalLineY = viewportH * (0.36 + rawSectionRatio * 0.28);

    const centers = [];
    cardRefs.current.forEach((cardEl, fIdx) => {
      if (!cardEl) return;
      const r = cardEl.getBoundingClientRect();
      // Bias the first card of Zone 02 (fIdx === 4) and Zone 03 (fIdx === 6) slightly upward
      // to account for their Zone Narrative Header directly above them, making zone transitions seamless.
      const zoneHeaderLead = fIdx === 4 || fIdx === 6 ? -36 : 0;
      centers[fIdx] = r.top + r.height * 0.5 + zoneHeaderLead;
    });

    if (centers.length === 0) return;

    // Compute continuous card index [0.0 .. 8.0] from piecewise linear interpolation
    // between adjacent card centers relative to focalLineY
    const lastIdx = centers.length - 1;
    let continuousIdx = 0;

    if (focalLineY <= centers[0]) {
      continuousIdx = 0;
    } else if (focalLineY >= centers[lastIdx]) {
      continuousIdx = lastIdx;
    } else {
      for (let i = 0; i < lastIdx; i++) {
        const c0 = centers[i];
        const c1 = centers[i + 1];
        if (focalLineY >= c0 && focalLineY <= c1) {
          const span = Math.max(1, c1 - c0);
          continuousIdx = i + (focalLineY - c0) / span;
          break;
        }
      }
    }

    // Apply subtle hysteresis (0.05) around midpoint boundaries so stopping on a seam never flickers
    const currentFlat = activeFlatIdxRef.current;
    let bestFlatIdx = Math.round(continuousIdx);
    if (
      bestFlatIdx !== currentFlat &&
      Math.abs(continuousIdx - currentFlat) < 0.55
    ) {
      bestFlatIdx = currentFlat;
    }

    const normalizedProgress = Math.max(
      0,
      Math.min(1, continuousIdx / Math.max(1, lastIdx))
    );
    scrollProgressRef.current = normalizedProgress;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.max(
        8,
        normalizedProgress * 100
      ).toFixed(1)}%`;
    }

    commitActiveFlatIndex(bestFlatIdx);
  }, [commitActiveFlatIndex]);

  useEffect(() => {
    let rafTicking = false;
    const onScrollOrResize = () => {
      if (!rafTicking) {
        rafTicking = true;
        window.requestAnimationFrame(() => {
          updateScrollState();
          rafTicking = false;
        });
      }
    };

    updateScrollState();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [updateScrollState]);

  // Smoothly scroll to a specific Zone or Attraction card when clicked
  const scrollToCheckpoint = (targetZoneIdx, targetAttractionIdx = 0) => {
    const flatIdx = checkpoints.findIndex(
      (c) => c.zoneIdx === targetZoneIdx && c.attractionIdx === targetAttractionIdx
    );
    if (flatIdx === -1) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    commitActiveFlatIndex(flatIdx);
    const ratio = flatIdx / Math.max(1, checkpoints.length - 1);
    scrollProgressRef.current = ratio;
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.max(8, ratio * 100).toFixed(
        1
      )}%`;
    }

    const targetCardEl = cardRefs.current[flatIdx];
    if (targetCardEl) {
      const rect = targetCardEl.getBoundingClientRect();
      const focalOffset = window.innerHeight * (0.36 + ratio * 0.24);
      const targetY =
        window.scrollY + rect.top + rect.height * 0.5 - focalOffset;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  // Three.js 3D Robot Guide & Morphing Zone Environments
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let frameId;
    let resizeObserver;
    let renderer;
    let pmremGenerator;
    let onResize;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      const initW = Math.max(300, container.clientWidth || 380);
      const initH = Math.max(200, container.clientHeight || 225);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(initW, initH);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      scene.environmentIntensity = 0.78;

      const camera = new THREE.PerspectiveCamera(
        33,
        initW / initH,
        0.1,
        60
      );
      camera.position.set(0, 0.15, 6.35);
      camera.lookAt(0, -0.05, 0);

      // Studio & Architectural Zone Lighting
      const ambientLight = new THREE.AmbientLight(0xf7f4eb, 0.52);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfff6e6, 2.05);
      keyLight.position.set(3.4, 5.8, 4.8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 16;
      const d = 2.8;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0008;
      scene.add(keyLight);

      const zoneFillLight = new THREE.DirectionalLight(0xd4a359, 1.15);
      zoneFillLight.position.set(-3.6, 2.4, 3.0);
      scene.add(zoneFillLight);

      const rimLight = new THREE.DirectionalLight(0xf5d08a, 1.1);
      rimLight.position.set(0, 3.8, -4.4);
      scene.add(rimLight);

      // Instantiate the shared Amman Dome 3D Robot
      const {
        robotGroup,
        headGroup,
        eyesContainer,
        leftEye,
        rightEye,
        rightArm,
        leftArm,
        materials,
      } = createAmmanDomeRobot();

      const stageGroup = new THREE.Group();
      scene.add(stageGroup);
      stageGroup.add(robotGroup);

      // Base Architectural Plinth
      const plinthStoneMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#13161C'),
        roughness: 0.42,
        metalness: 0.18,
      });

      const plinthBase = new THREE.Mesh(
        new THREE.CylinderGeometry(1.52, 1.68, 0.18, 64),
        plinthStoneMat
      );
      plinthBase.position.set(0, -1.42, 0);
      plinthBase.receiveShadow = true;
      stageGroup.add(plinthBase);

      const plinthBrassRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.52, 0.016, 16, 96),
        materials.brassTrimMat
      );
      plinthBrassRim.rotation.x = Math.PI / 2;
      plinthBrassRim.position.set(0, -1.33, 0);
      stageGroup.add(plinthBrassRim);

      // =========================================================================
      // ZONE 01 ENVIRONMENT: VR WORLD (Kinetic Gyroscopic Telemetry Rings)
      // =========================================================================
      const vrZoneGroup = new THREE.Group();
      stageGroup.add(vrZoneGroup);

      const vrRingMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4A359'),
        emissive: new THREE.Color('#C88A2E'),
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.85,
        transparent: true,
        opacity: 0.9,
      });

      const vrSecondaryMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F7F5F0'),
        roughness: 0.3,
        metalness: 0.6,
        transparent: true,
        opacity: 0.45,
      });

      const gyroOuterRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.15, 0.022, 16, 96),
        vrRingMat
      );
      gyroOuterRing.rotation.set(0.45, 0.3, 0.15);
      vrZoneGroup.add(gyroOuterRing);

      const gyroMidRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.82, 0.015, 16, 84),
        vrSecondaryMat
      );
      gyroMidRing.rotation.set(-0.55, -0.25, 0.4);
      vrZoneGroup.add(gyroMidRing);

      const windStreamArc = new THREE.Mesh(
        new THREE.TorusGeometry(2.42, 0.012, 12, 80, Math.PI * 1.15),
        vrRingMat
      );
      windStreamArc.position.set(0, -0.15, -0.3);
      windStreamArc.rotation.set(1.2, 0.1, -0.4);
      vrZoneGroup.add(windStreamArc);

      // =========================================================================
      // ZONE 02 ENVIRONMENT: GAMING & ESPORTS (Tiered Colosseum & Broadcast Halo)
      // =========================================================================
      const esportsZoneGroup = new THREE.Group();
      stageGroup.add(esportsZoneGroup);

      const arenaAccentMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#5AB0E2'),
        emissive: new THREE.Color('#2577A8'),
        emissiveIntensity: 0.55,
        roughness: 0.22,
        metalness: 0.75,
        transparent: true,
        opacity: 0,
      });

      const arenaGoldMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D4A359'),
        emissive: new THREE.Color('#9A6B26'),
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.85,
        transparent: true,
        opacity: 0,
      });

      [1.85, 2.22, 2.58].forEach((radius, idx) => {
        const tierRing = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.024, 16, 96, Math.PI * 1.35),
          idx % 2 === 0 ? arenaAccentMat : arenaGoldMat
        );
        tierRing.rotation.x = Math.PI / 2;
        tierRing.rotation.z = -Math.PI * 0.175;
        tierRing.position.set(0, -1.15 + idx * 0.28, -0.25);
        esportsZoneGroup.add(tierRing);
      });

      const broadcastHalo = new THREE.Mesh(
        new THREE.CylinderGeometry(1.75, 1.75, 0.16, 64, 1, true),
        arenaAccentMat
      );
      broadcastHalo.position.set(0, 1.85, -0.2);
      esportsZoneGroup.add(broadcastHalo);

      const broadcastHaloRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.76, 0.018, 16, 84),
        arenaGoldMat
      );
      broadcastHaloRim.rotation.x = Math.PI / 2;
      broadcastHaloRim.position.set(0, 1.77, -0.2);
      esportsZoneGroup.add(broadcastHaloRim);

      // =========================================================================
      // ZONE 03 ENVIRONMENT: IMMERSIVE ATTRACTIONS (IMAX Geodesic Canopy & Holograms)
      // =========================================================================
      const immersiveZoneGroup = new THREE.Group();
      stageGroup.add(immersiveZoneGroup);

      const holoEmeraldMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#45B28B'),
        emissive: new THREE.Color('#1E7E5C'),
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.7,
        transparent: true,
        opacity: 0,
      });

      const domeCanopyWireMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#D4A359'),
        wireframe: true,
        transparent: true,
        opacity: 0,
      });

      const geodesicCanopy = new THREE.Mesh(
        new THREE.SphereGeometry(2.75, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
        domeCanopyWireMat
      );
      geodesicCanopy.position.set(0, -0.45, -0.4);
      immersiveZoneGroup.add(geodesicCanopy);

      const holoSphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.42, 1),
        holoEmeraldMat
      );
      holoSphere.material.wireframe = true;
      holoSphere.position.set(1.38, 0.45, 0.35);
      immersiveZoneGroup.add(holoSphere);

      const holoProjectionRing1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.58, 0.012, 12, 64),
        holoEmeraldMat
      );
      holoProjectionRing1.rotation.x = Math.PI / 2;
      holoProjectionRing1.position.set(1.38, 0.02, 0.35);
      immersiveZoneGroup.add(holoProjectionRing1);

      const holoProjectionRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.01, 12, 48),
        holoEmeraldMat
      );
      holoProjectionRing2.rotation.x = Math.PI / 2;
      holoProjectionRing2.position.set(1.38, -0.22, 0.35);
      immersiveZoneGroup.add(holoProjectionRing2);

      onResize = () => {
        if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.render(scene, camera);
      };
      window.addEventListener('resize', onResize);
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => onResize());
        resizeObserver.observe(container);
      }

      // Animation state variables
      let smoothProgress = scrollProgressRef.current;
      let nextBlinkTime = 1.8;
      const blinkDuration = 0.15;
      let initialFrames = 0;

      const colorVr = new THREE.Color('#D4A359');
      const colorEsports = new THREE.Color('#5AB0E2');
      const colorImmersive = new THREE.Color('#45B28B');
      const currentLightColor = new THREE.Color('#D4A359');

      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const secEl = sectionRef.current;
        if (secEl && initialFrames > 20) {
          const r = secEl.getBoundingClientRect();
          if (r.bottom < -1800 || r.top > window.innerHeight + 1800) return;
        }
        initialFrames++;

        const t = clock.getElapsedTime();
        const targetP = scrollProgressRef.current;
        smoothProgress += (targetP - smoothProgress) * (prefersReducedMotion ? 0.35 : 0.11);

        // Smooth zone blend weights synchronized with exact card boundaries:
        // Zone 01 (cards 0..3) -> Zone 02 (cards 4..5) crosses at 3.5/8 = 0.4375 (window 0.36..0.51)
        // Zone 02 (cards 4..5) -> Zone 03 (cards 6..8) crosses at 5.5/8 = 0.6875 (window 0.61..0.76)
        const w0 = 1 - THREE.MathUtils.smoothstep(smoothProgress, 0.36, 0.51);
        const w1 =
          THREE.MathUtils.smoothstep(smoothProgress, 0.36, 0.51) *
          (1 - THREE.MathUtils.smoothstep(smoothProgress, 0.61, 0.76));
        const w2 = THREE.MathUtils.smoothstep(smoothProgress, 0.61, 0.76);

        // 1. Transition Zone Environment visibility & transforms
        vrRingMat.opacity = w0 * 0.88;
        vrSecondaryMat.opacity = w0 * 0.45;
        vrZoneGroup.scale.setScalar(0.88 + w0 * 0.12);
        vrZoneGroup.visible = w0 > 0.01;

        arenaAccentMat.opacity = w1 * 0.78;
        arenaGoldMat.opacity = w1 * 0.85;
        esportsZoneGroup.scale.setScalar(0.88 + w1 * 0.12);
        esportsZoneGroup.visible = w1 > 0.01;

        holoEmeraldMat.opacity = w2 * 0.82;
        domeCanopyWireMat.opacity = w2 * 0.24;
        immersiveZoneGroup.scale.setScalar(0.9 + w2 * 0.1);
        immersiveZoneGroup.visible = w2 > 0.01;

        // 2. Smoothly blend Zone Fill Light color
        currentLightColor
          .copy(colorVr)
          .multiplyScalar(w0)
          .addScaledVector(colorEsports, w1)
          .addScaledVector(colorImmersive, w2);
        zoneFillLight.color.copy(currentLightColor);

        // 3. Cinematic Camera Movement across the 3 zones (reverses cleanly on scroll up)
        const camX = -0.28 * w0 + 0.0 * w1 + 0.34 * w2;
        const camY = 0.14 * w0 + -0.04 * w1 + 0.22 * w2;
        const camZ = 6.35 * w0 + 6.15 * w1 + 6.55 * w2;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0.08 * w2, 0.05 * w2 - 0.08, 0);

        // 4. Robot Guide Pose & Environment Motion
        const breathe = prefersReducedMotion ? 0 : Math.sin(t * 1.9);
        robotGroup.position.y = -0.05 + breathe * 0.04;

        const targetBodyRotY = -0.24 * w0 + 0.06 * w1 + 0.32 * w2;
        const targetBodyRotZ = 0.03 * w0 + 0.0 * w1 - 0.02 * w2;
        robotGroup.rotation.y =
          targetBodyRotY + (prefersReducedMotion ? 0 : Math.sin(t * 0.8) * 0.04);
        robotGroup.rotation.z = targetBodyRotZ;

        const targetHeadRotY = -0.18 * w0 + 0.0 * w1 + 0.28 * w2;
        const targetHeadRotX = 0.04 * w0 - 0.02 * w1 - 0.18 * w2;
        headGroup.rotation.y =
          targetHeadRotY + (prefersReducedMotion ? 0 : Math.sin(t * 1.15) * 0.04);
        headGroup.rotation.x =
          targetHeadRotX + (prefersReducedMotion ? 0 : Math.cos(t * 1.4) * 0.025);

        eyesContainer.position.x = 0.04 * w2 - 0.03 * w0;
        eyesContainer.position.y = 0.015 + 0.035 * w2;

        const gestureOsc = prefersReducedMotion ? 0 : Math.sin(t * 2.6);
        rightArm.shoulderPivot.rotation.z =
          -0.88 * w0 + (-1.15 + gestureOsc * 0.08) * w1 + -0.32 * w2;
        rightArm.shoulderPivot.rotation.x =
          -0.32 * w0 + -0.36 * w1 + 0.08 * w2;
        rightArm.elbowPivot.rotation.z =
          (-0.65 + gestureOsc * 0.12) * w0 + (-0.92 + gestureOsc * 0.18) * w1 + 0.14 * w2;
        rightArm.elbowPivot.rotation.x = -0.42;
        rightArm.wristPivot.rotation.z = gestureOsc * 0.12;

        leftArm.shoulderPivot.rotation.z =
          0.26 * w0 + (0.95 - gestureOsc * 0.07) * w1 + (1.18 + gestureOsc * 0.06) * w2;
        leftArm.shoulderPivot.rotation.x =
          0.08 * w0 + -0.28 * w1 + -0.42 * w2;
        leftArm.elbowPivot.rotation.z =
          -0.16 * w0 + 0.62 * w1 + (0.82 + gestureOsc * 0.12) * w2;
        leftArm.elbowPivot.rotation.x = -0.36;
        leftArm.wristPivot.rotation.z = -gestureOsc * 0.1;

        if (!prefersReducedMotion) {
          gyroOuterRing.rotation.z = t * 0.32;
          gyroOuterRing.rotation.x = 0.45 + Math.sin(t * 0.7) * 0.12;
          gyroMidRing.rotation.y = -t * 0.45;
          windStreamArc.rotation.z = -t * 0.55;

          broadcastHalo.rotation.y = t * 0.25;
          broadcastHaloRim.rotation.z = -t * 0.2;

          geodesicCanopy.rotation.y = t * 0.08;
          holoSphere.rotation.y = t * 0.65;
          holoSphere.rotation.x = t * 0.35;
          holoSphere.position.y = 0.45 + Math.sin(t * 2.1) * 0.06;
          holoProjectionRing1.scale.setScalar(1 + Math.sin(t * 2.5) * 0.06);

          if (t > nextBlinkTime) {
            const elapsedBlink = t - nextBlinkTime;
            if (elapsedBlink < blinkDuration) {
              const phase = (elapsedBlink / blinkDuration) * Math.PI;
              const scaleY = Math.max(0.06, Math.abs(Math.cos(phase)));
              leftEye.scale.y = scaleY;
              rightEye.scale.y = scaleY;
            } else {
              leftEye.scale.y = 1;
              rightEye.scale.y = 1;
              nextBlinkTime = t + 2.8 + Math.random() * 2.2;
            }
          }
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (err) {
      console.error('Experiences 3D Robot initialization warning:', err);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (onResize) window.removeEventListener('resize', onResize);
      if (pmremGenerator) pmremGenerator.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  const currentZone = zones[activeZoneIdx] || zones[0];
  const currentAttraction =
    currentZone.attractions[activeAttractionIdx] || currentZone.attractions[0];

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="relative bg-obsidian text-stone-alabaster border-t arch-hairline py-16 sm:py-24 px-3 sm:px-6 lg:px-10"
      aria-label={expCopy.index}
    >
      {/* Subtle Zone-Reactive Radial Backdrop Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
        style={{
          background:
            activeZoneIdx === 0
              ? 'radial-gradient(circle at 28% 52%, rgba(212, 163, 89, 0.08), transparent 60%)'
              : activeZoneIdx === 1
              ? 'radial-gradient(circle at 32% 50%, rgba(90, 176, 226, 0.08), transparent 60%)'
              : 'radial-gradient(circle at 35% 45%, rgba(69, 178, 139, 0.08), transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[1480px] w-full mx-auto">
        {/* =================================================================
            1. SECTION INTRO HEADER & STICKY 3-ZONE PROGRESS BAR
        ================================================================= */}
        <div className="rounded-[24px] sm:rounded-[32px] border border-white/[0.12] bg-obsidian-surface shadow-[0_30px_100px_rgba(0,0,0,0.85)] p-5 sm:p-8 lg:p-10">
          {/* Top Eyebrow & Disclaimer Pill */}
          <div className="flex flex-col gap-4 pb-6 border-b arch-hairline">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brass" />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-brass uppercase">
                  {expCopy.index}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass/10 border border-brass/30">
                <Sparkles className="w-3 h-3 text-brass shrink-0" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.16em] text-brass uppercase">
                  {expCopy.conceptBadge}
                </span>
              </div>
            </div>

            {/* Section Headline & Subtitle */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end pt-1">
              <div className="lg:col-span-7">
                <h2
                  className={`font-display font-normal text-stone-alabaster tracking-tight ${
                    isRtl
                      ? 'text-2xl sm:text-4xl lg:text-[2.65rem] leading-[1.2]'
                      : 'text-2xl sm:text-4xl lg:text-[2.75rem] leading-[1.08]'
                  }`}
                >
                  <span>{expCopy.headingRegular} </span>
                  <span
                    className={
                      isRtl
                        ? 'text-brass font-semibold'
                        : 'font-serif italic text-brass font-normal text-[1.06em]'
                    }
                  >
                    {expCopy.headingItalic}
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-xs sm:text-sm text-stone-muted leading-relaxed">
                  {expCopy.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================================
              2. MAIN 12-COLUMN SPLIT: STICKY VISUAL STAGE + PROGRESSIVE CARDS
          ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-6 sm:pt-8">
            {/* START 6 COLUMNS: STICKY VISUALIZATION + 3D ROBOT GUIDE + LOCATOR */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 self-start flex flex-col gap-3.5">
              {/* Compact Sticky 3-Zone Switcher & Scroll Progress Bar */}
              <div className="rounded-xl border border-white/[0.09] bg-obsidian/85 p-2 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {zones.map((z, idx) => {
                    const isActive = idx === activeZoneIdx;
                    return (
                      <button
                        key={`sticky-${z.id}`}
                        type="button"
                        onClick={() => scrollToCheckpoint(idx, 0)}
                        className={`text-start px-2.5 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-brass/15 border-brass/60 text-brass shadow-[0_0_16px_rgba(212,163,89,0.16)]'
                            : 'bg-white/[0.02] border-white/[0.06] text-stone-muted hover:text-stone-alabaster'
                        }`}
                      >
                        <span className="font-mono text-[9px] tracking-[0.14em] uppercase block truncate">
                          {z.num} // {z.navLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="w-full h-[2px] bg-white/[0.07] rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-brass transition-[width] duration-150 ease-out"
                    style={{ width: '8%' }}
                  />
                </div>
              </div>

              {/* Pre-Mounted 9-Attraction Conceptual Visualization Viewport (Zero-Black-Dip Opaque Layer Stack) */}
              <div className="relative w-full aspect-[16/9] rounded-2xl border border-white/[0.14] bg-obsidian-surface overflow-hidden shadow-2xl">
                {/* Permanent 100%-Opaque Base Layer so the viewport can never expose a black background */}
                <img
                  src={
                    checkpoints[layerPair.prevIdx]?.image ||
                    currentAttraction.image
                  }
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  decoding="sync"
                  className="absolute inset-0 w-full h-full object-cover object-center block opacity-100 z-[1] pointer-events-none select-none"
                />

                {checkpoints.map((cp) => {
                  const isCurrent = cp.flatIdx === layerPair.currentIdx;
                  const isPrev =
                    cp.flatIdx === layerPair.prevIdx &&
                    layerPair.prevIdx !== layerPair.currentIdx;

                  let layerClasses =
                    'opacity-0 scale-[1.015] z-0 pointer-events-none transition-none';
                  if (isCurrent) {
                    layerClasses =
                      'opacity-100 scale-100 z-20 transition-all duration-500 ease-out';
                  } else if (isPrev) {
                    // Hold previous image at 100% opacity directly underneath the incoming image
                    // so composite opacity stays 1.000 at every frame of any slow or rapid transition
                    layerClasses =
                      'opacity-100 scale-100 z-10 pointer-events-none transition-none';
                  }

                  return (
                    <img
                      key={cp.code}
                      src={cp.image}
                      alt={`${cp.title} — ${expCopy.visualBadge}`}
                      loading="eager"
                      decoding="sync"
                      className={`absolute inset-0 w-full h-full object-cover object-center block ${layerClasses}`}
                    />
                  );
                })}

                {/* Subtle Atmospheric Vignette */}
                <div className="absolute inset-0 z-30 bg-gradient-to-t from-obsidian/85 via-transparent to-obsidian/30 pointer-events-none" />

                {/* Top Conceptual Visualization Pill */}
                <div className="absolute top-3 inset-x-3 z-40 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="qclay-glass rounded-full px-3 py-1 font-mono text-[9px] tracking-[0.16em] text-brass uppercase border border-brass/30">
                    {expCopy.visualBadge}
                  </span>
                  <span className="qclay-glass rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.15em] text-stone-alabaster uppercase border border-white/10">
                    {currentAttraction.code}
                  </span>
                </div>

                {/* Bottom Active Attraction Title Caption */}
                <div className="absolute bottom-3 inset-x-3.5 z-40 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="font-display text-xs sm:text-sm font-medium text-stone-alabaster truncate">
                    {currentAttraction.title}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.14em] text-brass uppercase shrink-0">
                    {currentAttraction.conceptTag}
                  </span>
                </div>
              </div>

              {/* 3D Robot Spatial Guide Canvas + Architectural Dome Locator */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
                {/* 3D Robot Spatial Guide Canvas */}
                <div className="sm:col-span-7 h-[215px] sm:h-[230px] relative rounded-2xl border border-white/[0.12] bg-[radial-gradient(circle_at_50%_42%,rgba(212,163,89,0.14),rgba(11,12,14,0.96)_74%)] overflow-hidden">
                  <div
                    ref={canvasMountRef}
                    className="absolute inset-0 w-full h-full z-10"
                  />

                  <div className="absolute top-2.5 start-2.5 z-20 pointer-events-none">
                    <div className="qclay-glass rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
                      <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-stone-alabaster uppercase">
                        {expCopy.robotGuidePrefix} {currentZone.robotStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Architectural Dome Locator */}
                <div className="flex sm:col-span-5 flex-col justify-between p-3 rounded-2xl border border-white/[0.10] bg-obsidian/75">
                  <div className="relative w-full rounded-xl overflow-hidden border border-white/15 bg-obsidian">
                    <img
                      src="./assets/architecture/amman-dome-desktop.jpg?v=2"
                      alt="Amman Dome Architectural Zone Locator"
                      loading="eager"
                      decoding="sync"
                      className="w-full h-auto block opacity-90"
                    />
                    <span
                      className="absolute w-3 h-3 -ms-1.5 -mt-1.5 rounded-full bg-brass border-2 border-obsidian shadow-[0_0_12px_rgba(212,163,89,0.95)] transition-all duration-500 ease-out"
                      style={{
                        left: `${currentZone.locatorCoords.x}%`,
                        top: `${currentZone.locatorCoords.y}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-0.5 text-start min-w-0 pt-2">
                    <div className="flex items-center gap-1.5 text-brass">
                      <Compass className="w-3 h-3 shrink-0" />
                      <span className="font-mono text-[9px] tracking-[0.15em] uppercase truncate">
                        {expCopy.locatorTitle}
                      </span>
                    </div>
                    <p className="text-[11px] font-display font-medium text-stone-alabaster truncate">
                      {currentZone.code}
                    </p>
                    <p className="text-[10px] text-stone-muted truncate">
                      {currentZone.domeSector}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* END 6 COLUMNS: PROGRESSIVE SCROLLABLE EXPERIENCE ZONES & ATTRACTION CARDS */}
            <div className="lg:col-span-6 text-start">
              {zones.map((zone, zIdx) => {
                const isZoneActive = zIdx === activeZoneIdx;
                return (
                  <React.Fragment key={zone.id}>
                    {zIdx > 0 && (
                      <div
                        className="flex flex-col items-center py-2.5 select-none pointer-events-none"
                        aria-hidden="true"
                      >
                        <div className="w-px h-5 bg-gradient-to-b from-brass/45 to-brass/20" />
                        <div
                          className={`w-2 h-2 rotate-45 border transition-colors duration-500 ${
                            activeZoneIdx >= zIdx
                              ? 'border-brass bg-brass/30 shadow-[0_0_10px_rgba(212,163,89,0.5)]'
                              : 'border-white/20 bg-obsidian'
                          }`}
                        />
                        <div className="w-px h-5 bg-gradient-to-b from-brass/20 to-white/10" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl border p-4 sm:p-6 transition-all duration-500 ease-out ${
                        isZoneActive
                          ? 'border-brass/45 bg-white/[0.03] shadow-[0_18px_48px_rgba(0,0,0,0.45)]'
                          : 'border-white/[0.08] bg-white/[0.01]'
                      }`}
                    >
                    {/* Zone Narrative Header */}
                    <div className="space-y-2 pb-4 border-b arch-hairline">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-brass uppercase">
                          {zone.code}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.14em] text-stone-muted uppercase">
                          {zone.domeSector}
                        </span>
                      </div>

                      <h3
                        className={`font-display font-normal text-stone-alabaster tracking-tight ${
                          isRtl
                            ? 'text-xl sm:text-2xl lg:text-3xl leading-[1.2]'
                            : 'text-xl sm:text-2xl lg:text-3xl leading-[1.1]'
                        }`}
                      >
                        <span>{zone.titleRegular} </span>
                        <span
                          className={
                            isRtl
                              ? 'text-brass font-semibold'
                              : 'font-serif italic text-brass font-normal text-[1.06em]'
                          }
                        >
                          {zone.titleItalic}
                        </span>
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-alabaster/75 leading-relaxed">
                        {zone.summary}
                      </p>
                    </div>

                    {/* All Attraction Cards in This Zone — Always Visible & Progressively Highlighted on Scroll */}
                    <div className="space-y-3 pt-4">
                      {zone.attractions.map((attr, aIdx) => {
                        const flatIdx = checkpoints.findIndex(
                          (c) => c.zoneIdx === zIdx && c.attractionIdx === aIdx
                        );
                        const isFocused =
                          zIdx === activeZoneIdx && aIdx === activeAttractionIdx;

                        return (
                          <article
                            key={attr.code}
                            ref={(el) => {
                              if (flatIdx !== -1) {
                                cardRefs.current[flatIdx] = el;
                              }
                            }}
                            onClick={() => scrollToCheckpoint(zIdx, aIdx)}
                            className={`group cursor-pointer rounded-xl border p-3.5 sm:p-4 transition-colors duration-200 ${
                              isFocused
                                ? 'bg-white/[0.06] border-brass/70 shadow-[0_12px_32px_rgba(0,0,0,0.45)]'
                                : 'bg-obsidian/55 border-white/[0.09] hover:border-white/25 hover:bg-white/[0.03]'
                            }`}
                          >
                            {/* Mobile / Tablet Inline Widescreen Image (Always Visible While Scrolling on <lg) */}
                            {attr.image && (
                              <div className="lg:hidden relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-white/10 mb-3 bg-obsidian-surface">
                                <img
                                  src={attr.image}
                                  alt={attr.title}
                                  loading="eager"
                                  decoding="sync"
                                  className="w-full h-full object-cover block"
                                />
                              </div>
                            )}

                            <div className="flex items-start gap-3.5">
                              {/* Desktop Thumbnail Preview */}
                              {attr.image && (
                                <img
                                  src={attr.image}
                                  alt={attr.title}
                                  loading="eager"
                                  decoding="sync"
                                  className={`hidden lg:block w-24 h-16 rounded-lg object-cover shrink-0 border transition-all duration-300 ${
                                    isFocused
                                      ? 'border-brass/80 opacity-100 scale-[1.03]'
                                      : 'border-white/15 opacity-75 group-hover:opacity-100'
                                  }`}
                                />
                              )}

                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span
                                      className={`font-mono text-[10px] sm:text-xs tracking-[0.16em] shrink-0 ${
                                        isFocused
                                          ? 'text-brass font-semibold'
                                          : 'text-stone-muted'
                                      }`}
                                    >
                                      {attr.code}
                                    </span>
                                    <h4
                                      className={`font-display text-sm sm:text-base lg:text-lg font-medium truncate transition-colors ${
                                        isFocused
                                          ? 'text-stone-alabaster'
                                          : 'text-stone-alabaster/85 group-hover:text-stone-alabaster'
                                      }`}
                                    >
                                      {attr.title}
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`font-mono text-[9px] tracking-[0.14em] px-2.5 py-0.5 rounded-full border uppercase ${
                                        isFocused
                                          ? 'border-brass/50 bg-brass/15 text-brass'
                                          : 'border-white/10 text-stone-muted'
                                      }`}
                                    >
                                      {attr.conceptTag}
                                    </span>
                                    <ChevronRight
                                      className={`w-4 h-4 transition-transform duration-300 ${
                                        isFocused
                                          ? 'text-brass rotate-90'
                                          : isRtl
                                          ? 'text-stone-muted rotate-180'
                                          : 'text-stone-muted'
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Description — Always Visible and Readable During Scroll */}
                                <p
                                  className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                                    isFocused
                                      ? 'text-stone-alabaster/85'
                                      : 'text-stone-muted'
                                  }`}
                                >
                                  {attr.description}
                                </p>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* =================================================================
              3. BOTTOM FOOTER BAR: SCROLL HINT & CHECKPOINT COUNTER
          ================================================================= */}
          <div className="mt-8 pt-4 border-t arch-hairline flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono tracking-[0.18em] text-stone-muted uppercase">
            <span>{expCopy.scrollHint}</span>
            <span className="text-brass">
              {currentZone.code} • {activeAttractionIdx + 1} /{' '}
              {currentZone.attractions.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
