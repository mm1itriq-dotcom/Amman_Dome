import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Shared factory that builds the articulated Amman Dome 3D Robot character
 * so both the Hero and the scroll-driven Experiences section reuse the exact same character rig.
 */
export function createAmmanDomeRobot() {
  const pearlSuitMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#F5F3EE'),
    roughness: 0.18,
    metalness: 0.04,
    clearcoat: 0.92,
    clearcoatRoughness: 0.08,
    reflectivity: 0.9,
    sheen: 0.25,
    sheenColor: new THREE.Color('#EAE4D7'),
  });

  const titaniumJointMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1E2128'),
    roughness: 0.38,
    metalness: 0.65,
  });

  const brassTrimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C99A4E'),
    roughness: 0.26,
    metalness: 0.82,
  });

  const glossyBlackFaceMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#050608'),
    roughness: 0.04,
    metalness: 0.06,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 1.0,
  });

  const warmYellowOutlineMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F7C95C'),
    emissive: new THREE.Color('#E89E1E'),
    emissiveIntensity: 1.45,
    roughness: 0.18,
  });

  const expressiveEyeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFFDF7'),
    emissive: new THREE.Color('#F5B027'),
    emissiveIntensity: 1.85,
    roughness: 0.1,
  });

  const robotGroup = new THREE.Group();
  robotGroup.position.set(0, -0.05, 0.15);

  // --- A. HEAD & HELMET ---
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.92, 0);
  robotGroup.add(headGroup);

  const helmetGeo = new THREE.SphereGeometry(0.72, 64, 48);
  helmetGeo.scale(1.15, 0.93, 0.98);
  const helmetMesh = new THREE.Mesh(helmetGeo, pearlSuitMat);
  helmetMesh.castShadow = true;
  helmetMesh.receiveShadow = true;
  headGroup.add(helmetMesh);

  [-1, 1].forEach((side) => {
    const earCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.12, 32),
      pearlSuitMat
    );
    earCap.rotation.z = Math.PI / 2;
    earCap.position.set(side * 0.81, 0, 0);
    earCap.castShadow = true;
    headGroup.add(earCap);

    const earTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.165, 0.018, 16, 40),
      brassTrimMat
    );
    earTrim.rotation.y = Math.PI / 2;
    earTrim.position.set(side * 0.865, 0, 0);
    headGroup.add(earTrim);
  });

  const visorGeo = new THREE.SphereGeometry(
    0.698,
    64,
    48,
    -Math.PI * 0.34,
    Math.PI * 0.68,
    Math.PI * 0.24,
    Math.PI * 0.52
  );
  visorGeo.scale(1.14, 0.92, 1.01);
  const visorMesh = new THREE.Mesh(visorGeo, glossyBlackFaceMat);
  visorMesh.rotation.y = Math.PI * 0.5;
  visorMesh.position.set(0, 0, 0.028);
  headGroup.add(visorMesh);

  const outlinePoints = [];
  const segs = 96;
  for (let i = 0; i <= segs; i++) {
    const theta = (i / segs) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const squircleR =
      1 / Math.pow(Math.pow(Math.abs(cosT), 2.6) + Math.pow(Math.abs(sinT), 2.6), 1 / 2.6);
    const x = 0.535 * squircleR * cosT;
    const y = 0.335 * squircleR * sinT;
    const nx = x / (0.72 * 1.15);
    const ny = y / (0.72 * 0.93);
    const nz = Math.sqrt(Math.max(0.05, 1 - nx * nx - ny * ny));
    const z = nz * (0.72 * 0.99) + 0.014;
    outlinePoints.push(new THREE.Vector3(x, y, z));
  }
  const outlineCurve = new THREE.CatmullRomCurve3(outlinePoints, true);
  const outlineMesh = new THREE.Mesh(
    new THREE.TubeGeometry(outlineCurve, 120, 0.019, 16, true),
    warmYellowOutlineMat
  );
  headGroup.add(outlineMesh);

  const eyesContainer = new THREE.Group();
  eyesContainer.position.set(0, 0.015, 0.71);
  headGroup.add(eyesContainer);

  const createEye = (xOffset) => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(xOffset, 0, 0);

    const eyeBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.066, 0.088, 16, 24),
      expressiveEyeMat
    );
    eyeGroup.add(eyeBody);

    const catchlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.019, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    catchlight.position.set(0.022, 0.042, 0.062);
    eyeGroup.add(catchlight);

    return eyeGroup;
  };

  const leftEye = createEye(-0.205);
  const rightEye = createEye(0.205);
  eyesContainer.add(leftEye);
  eyesContainer.add(rightEye);

  // --- B. NECK JOINT & PEARL SPACESUIT TORSO ---
  const neckJoint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.26, 0.14, 32),
    titaniumJointMat
  );
  neckJoint.position.set(0, 0.32, 0);
  robotGroup.add(neckJoint);

  const collarRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.038, 16, 48),
    brassTrimMat
  );
  collarRing.rotation.x = Math.PI / 2;
  collarRing.position.set(0, 0.27, 0);
  robotGroup.add(collarRing);

  const torsoGeo = new THREE.CapsuleGeometry(0.48, 0.42, 32, 48);
  torsoGeo.scale(1.06, 1.0, 0.88);
  const torsoMesh = new THREE.Mesh(torsoGeo, pearlSuitMat);
  torsoMesh.position.set(0, -0.22, 0);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  robotGroup.add(torsoMesh);

  const chestRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.115, 0.014, 16, 40),
    brassTrimMat
  );
  chestRing.position.set(0, -0.12, 0.425);
  robotGroup.add(chestRing);

  const chestCenter = new THREE.Mesh(
    new THREE.CircleGeometry(0.1, 32),
    glossyBlackFaceMat
  );
  chestCenter.position.set(0, -0.12, 0.423);
  robotGroup.add(chestCenter);

  const backpack = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.28, 0.24, 16, 24),
    pearlSuitMat
  );
  backpack.scale.set(1.2, 1.0, 0.65);
  backpack.position.set(0, -0.18, -0.38);
  backpack.castShadow = true;
  robotGroup.add(backpack);

  const waistBelt = new THREE.Mesh(
    new THREE.TorusGeometry(0.43, 0.024, 16, 48),
    brassTrimMat
  );
  waistBelt.rotation.x = Math.PI / 2;
  waistBelt.position.set(0, -0.54, 0);
  robotGroup.add(waistBelt);

  // --- C. FULLY ARTICULATED 3-JOINT ARMS ---
  const createArticulatedArm = (side) => {
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(side * 0.58, 0.08, 0.02);

    const shoulderBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.125, 24, 24),
      titaniumJointMat
    );
    shoulderBall.castShadow = true;
    shoulderPivot.add(shoulderBall);

    const shoulderCuff = new THREE.Mesh(
      new THREE.TorusGeometry(0.115, 0.016, 12, 32),
      brassTrimMat
    );
    shoulderCuff.rotation.x = Math.PI / 2;
    shoulderCuff.position.set(0, -0.06, 0);
    shoulderPivot.add(shoulderCuff);

    const upperArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.11, 0.22, 16, 24),
      pearlSuitMat
    );
    upperArm.position.set(0, -0.2, 0);
    upperArm.castShadow = true;
    shoulderPivot.add(upperArm);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, -0.37, 0);
    shoulderPivot.add(elbowPivot);

    const elbowJoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.098, 20, 20),
      titaniumJointMat
    );
    elbowPivot.add(elbowJoint);

    const elbowBrassRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.102, 0.014, 12, 32),
      brassTrimMat
    );
    elbowBrassRing.rotation.x = Math.PI / 2;
    elbowPivot.add(elbowBrassRing);

    const forearm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.105, 0.2, 16, 24),
      pearlSuitMat
    );
    forearm.position.set(0, -0.17, 0);
    forearm.castShadow = true;
    elbowPivot.add(forearm);

    const wristPivot = new THREE.Group();
    wristPivot.position.set(0, -0.33, 0);
    elbowPivot.add(wristPivot);

    const wristCuff = new THREE.Mesh(
      new THREE.TorusGeometry(0.088, 0.012, 12, 28),
      brassTrimMat
    );
    wristCuff.rotation.x = Math.PI / 2;
    wristPivot.add(wristCuff);

    const palm = new THREE.Mesh(
      new THREE.SphereGeometry(0.125, 24, 24),
      pearlSuitMat
    );
    palm.scale.set(0.95, 1.12, 0.72);
    palm.position.set(0, -0.09, 0);
    palm.castShadow = true;
    wristPivot.add(palm);

    const thumb = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.038, 0.05, 12, 12),
      pearlSuitMat
    );
    thumb.position.set(-side * 0.095, -0.06, 0.035);
    thumb.rotation.z = side * 0.48;
    wristPivot.add(thumb);

    robotGroup.add(shoulderPivot);
    return { shoulderPivot, elbowPivot, wristPivot };
  };

  const rightArm = createArticulatedArm(-1);
  const leftArm = createArticulatedArm(1);

  // --- D. ARTICULATED LEGS ---
  [-0.22, 0.22].forEach((lx) => {
    const hipJoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16),
      titaniumJointMat
    );
    hipJoint.position.set(lx, -0.66, 0);
    robotGroup.add(hipJoint);

    const leg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.14, 0.24, 16, 24),
      pearlSuitMat
    );
    leg.position.set(lx, -0.86, 0);
    leg.castShadow = true;
    robotGroup.add(leg);

    const bootTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.135, 0.015, 12, 32),
      brassTrimMat
    );
    bootTrim.rotation.x = Math.PI / 2;
    bootTrim.position.set(lx, -0.95, 0);
    robotGroup.add(bootTrim);
  });

  return {
    robotGroup,
    headGroup,
    eyesContainer,
    leftEye,
    rightEye,
    rightArm,
    leftArm,
    materials: {
      pearlSuitMat,
      titaniumJointMat,
      brassTrimMat,
      glossyBlackFaceMat,
      warmYellowOutlineMat,
      expressiveEyeMat,
    },
  };
}

export default function DomeRobotCanvas({ greetingText, subText }) {
  const mountRef = useRef(null);
  const clockElapsedRef = useRef(0);
  const waveStartRef = useRef(0.35);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let frameId;
    let observer;
    let resizeObserver;
    let renderer;
    let pmremGenerator;
    let onPointerMove;
    let onScroll;
    let onResize;

    try {
      const initW = Math.max(280, container.clientWidth || 460);
      const initH = Math.max(260, container.clientHeight || 400);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(initW, initH);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;
      scene.environmentIntensity = 0.75;

      const camera = new THREE.PerspectiveCamera(
        34,
        initW / initH,
        0.1,
        50
      );
      camera.position.set(0, 0.12, 7.75);
      camera.lookAt(0, -0.08, 0);

    const ambientLight = new THREE.AmbientLight(0xf7f4eb, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e6, 2.1);
    keyLight.position.set(3.2, 5.8, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 15;
    const d = 2.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0008;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.85);
    fillLight.position.set(-3.8, 2.2, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf5d08a, 1.1);
    rimLight.position.set(0, 3.5, -4.2);
    scene.add(rimLight);

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

    const plinthStoneMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#14171D'),
      roughness: 0.45,
      metalness: 0.15,
    });

    const archRibMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1C2029'),
      roughness: 0.4,
      metalness: 0.45,
    });

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const plinthBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.48, 1.62, 0.18, 64),
      plinthStoneMat
    );
    plinthBase.position.set(0, -1.42, 0);
    plinthBase.receiveShadow = true;
    stageGroup.add(plinthBase);

    const plinthBrassRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.48, 0.016, 16, 96),
      materials.brassTrimMat
    );
    plinthBrassRim.rotation.x = Math.PI / 2;
    plinthBrassRim.position.set(0, -1.33, 0);
    stageGroup.add(plinthBrassRim);

    const plinthInnerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.92, 0.01, 12, 80),
      materials.brassTrimMat
    );
    plinthInnerRing.rotation.x = Math.PI / 2;
    plinthInnerRing.position.set(0, -1.325, 0);
    stageGroup.add(plinthInnerRing);

    [-0.35, 0.35].forEach((rotY, idx) => {
      const archRib = new THREE.Mesh(
        new THREE.TorusGeometry(2.55, 0.032, 16, 96, Math.PI),
        idx === 0 ? archRibMat : materials.brassTrimMat
      );
      archRib.position.set(0, -1.35, -0.95 - idx * 0.25);
      archRib.rotation.y = rotY;
      stageGroup.add(archRib);
    });

    stageGroup.add(robotGroup);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let targetScrollY = window.scrollY;
    let smoothScrollY = window.scrollY;
    let isVisible = true;

      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      onPointerMove = (e) => {
        if (!isVisible) return;
        const rect = container.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        pointer.targetX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
        pointer.targetY = Math.max(-1, Math.min(1, -(((clientY - rect.top) / rect.height) * 2 - 1)));
      };

      onScroll = () => {
        targetScrollY = window.scrollY;
      };

      window.addEventListener('mousemove', onPointerMove, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });

      onResize = () => {
        if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => onResize());
        resizeObserver.observe(container);
      }

      let nextBlinkTime = 2.0;
      const blinkDuration = 0.15;
      let isDoubleBlink = false;
      let nextAutoWaveTime = 9.5;
      const waveTotalDuration = 2.6;

      const clock = new THREE.Clock();

      const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();
      clockElapsedRef.current = t;

      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.08;

      const scrollFactor = Math.min(1, Math.max(0, smoothScrollY / (window.innerHeight * 0.9)));

      if (!prefersReducedMotion) {
        if (t > nextAutoWaveTime && waveStartRef.current === null) {
          waveStartRef.current = t;
          nextAutoWaveTime = t + 9.0 + Math.random() * 3.0;
        }

        let wEnv = 0;
        let waveElapsed = 0;
        if (waveStartRef.current !== null) {
          waveElapsed = t - waveStartRef.current;
          if (waveElapsed >= 0 && waveElapsed <= waveTotalDuration) {
            if (waveElapsed < 0.45) {
              const p = waveElapsed / 0.45;
              wEnv = p * p * (3 - 2 * p);
            } else if (waveElapsed < 2.05) {
              wEnv = 1;
            } else {
              const p = 1 - (waveElapsed - 2.05) / 0.55;
              wEnv = p * p * (3 - 2 * p);
            }
          } else if (waveElapsed > waveTotalDuration) {
            waveStartRef.current = null;
          }
        }

        const breathe = Math.sin(t * 1.85);
        robotGroup.position.y = -0.05 + breathe * 0.045;
        robotGroup.rotation.y =
          pointer.x * 0.18 + Math.sin(t * 0.75) * 0.05 + scrollFactor * 0.22;
        robotGroup.rotation.z = Math.sin(t * 0.9) * 0.015;

        headGroup.rotation.y =
          pointer.x * 0.26 + Math.sin(t * 1.1) * 0.045 - scrollFactor * 0.08;
        headGroup.rotation.x =
          -pointer.y * 0.16 + Math.cos(t * 1.4) * 0.03 + scrollFactor * 0.06;
        headGroup.rotation.z =
          THREE.MathUtils.lerp(Math.sin(t * 0.95) * 0.025, 0.085, wEnv);

        eyesContainer.position.x = pointer.x * 0.045;
        eyesContainer.position.y = 0.015 + pointer.y * 0.032;

        const idleShoulderZ = -0.24 + Math.sin(t * 1.85) * 0.035;
        const idleShoulderX = 0.08 + Math.cos(t * 1.4) * 0.03;
        const idleElbowZ = 0.14 + Math.sin(t * 1.85 - 0.6) * 0.03;
        const idleElbowX = -0.36;
        const idleWristZ = 0.06 + Math.sin(t * 1.85 - 1.1) * 0.04;

        const waveCycle = Math.sin(waveElapsed * 6.2);
        const wristFollowCycle = Math.sin(waveElapsed * 6.2 - 0.55);

        const waveShoulderZ = -1.32 + waveCycle * 0.06;
        const waveShoulderX = -0.38;
        const waveElbowZ = -1.18 + waveCycle * 0.34;
        const waveElbowX = -0.45;
        const waveWristZ = wristFollowCycle * 0.28;

        rightArm.shoulderPivot.rotation.z = THREE.MathUtils.lerp(
          idleShoulderZ,
          waveShoulderZ,
          wEnv
        );
        rightArm.shoulderPivot.rotation.x = THREE.MathUtils.lerp(
          idleShoulderX,
          waveShoulderX,
          wEnv
        );
        rightArm.elbowPivot.rotation.z = THREE.MathUtils.lerp(
          idleElbowZ,
          waveElbowZ,
          wEnv
        );
        rightArm.elbowPivot.rotation.x = THREE.MathUtils.lerp(
          idleElbowX,
          waveElbowX,
          wEnv
        );
        rightArm.wristPivot.rotation.z = THREE.MathUtils.lerp(
          idleWristZ,
          waveWristZ,
          wEnv
        );

        leftArm.shoulderPivot.rotation.z = 0.24 - Math.sin(t * 1.85 + 0.8) * 0.035;
        leftArm.shoulderPivot.rotation.x = 0.08 + Math.sin(t * 1.3) * 0.035;
        leftArm.elbowPivot.rotation.z = -0.14 - Math.sin(t * 1.85 + 0.2) * 0.03;
        leftArm.elbowPivot.rotation.x = -0.34;
        leftArm.wristPivot.rotation.z = -0.05 - Math.sin(t * 1.85 - 0.3) * 0.035;

        leftEye.rotation.z = THREE.MathUtils.lerp(0, -0.1, wEnv);
        rightEye.rotation.z = THREE.MathUtils.lerp(0, 0.1, wEnv);

        if (t > nextBlinkTime) {
          const elapsedBlink = t - nextBlinkTime;
          const totalDur = isDoubleBlink ? blinkDuration * 2.2 : blinkDuration;
          if (elapsedBlink < totalDur) {
            const phase = (elapsedBlink / blinkDuration) * Math.PI;
            const scaleY = Math.max(0.06, Math.abs(Math.cos(phase)));
            leftEye.scale.y = scaleY;
            rightEye.scale.y = scaleY;
          } else {
            leftEye.scale.y = 1;
            rightEye.scale.y = 1;
            nextBlinkTime = t + 2.8 + Math.random() * 2.4;
            isDoubleBlink = Math.random() < 0.28;
          }
        }

        stageGroup.rotation.y = scrollFactor * 0.14;
      }

      renderer.render(scene, camera);
    };

      animate();
    } catch (err) {
      console.error('Hero 3D Robot initialization warning:', err);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (observer) observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      if (onPointerMove) {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('touchmove', onPointerMove);
      }
      if (onScroll) window.removeEventListener('scroll', onScroll);
      if (onResize) window.removeEventListener('resize', onResize);
      if (pmremGenerator) pmremGenerator.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  const triggerGreetingWave = () => {
    if (waveStartRef.current === null) {
      waveStartRef.current = clockElapsedRef.current;
    }
  };

  return (
    <div
      onMouseEnter={triggerGreetingWave}
      onClick={triggerGreetingWave}
      className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px] flex flex-col items-center justify-between select-none cursor-pointer"
      role="img"
      aria-label="Interactive 3D Amman Dome Robot Guide"
    >
      <div ref={mountRef} className="w-full flex-1 min-h-0 relative z-10" />

      <div className="relative z-20 mt-2 qclay-glass rounded-full px-4 py-1.5 flex items-center gap-2.5 border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-brass" />
        <span className="font-mono text-[10px] tracking-[0.18em] text-brass uppercase font-medium">
          {greetingText}
        </span>
        <span className="hidden sm:inline text-[11px] text-stone-muted">
          • {subText}
        </span>
      </div>
    </div>
  );
}
