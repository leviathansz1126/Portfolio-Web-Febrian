import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

const planetTextures = {
  sun: "/textures/sun.jpg",
  mercury: "/textures/mercury.jpg",
  venus: "/textures/venus.jpg",
  earth: "/textures/earth.jpg",
  moon: "/textures/moon.jpg",
  mars: "/textures/mars.jpg",
  jupiter: "/textures/jupiter.jpg",
  saturn: "/textures/saturn.jpg",
  uranus: "/textures/uranus.jpg",
  neptune: "/textures/neptune.jpg",
   sunSprite: "/textures/sun_sprite.png",
};

function createSunCoronaTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  const gradient = ctx.createRadialGradient(cx, cy, 120, cx, cy, 510);
  gradient.addColorStop(0.0, "rgba(255, 245, 190, 0.88)");
  gradient.addColorStop(0.18, "rgba(255, 170, 25, 0.62)");
  gradient.addColorStop(0.38, "rgba(255, 85, 0, 0.28)");
  gradient.addColorStop(0.62, "rgba(255, 40, 0, 0.10)");
  gradient.addColorStop(1.0, "rgba(255, 40, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 120; i++) {
    const angle = Math.random() * Math.PI * 2;
    const inner = 260 + Math.random() * 35;
    const outer = 340 + Math.random() * 120;

    const x1 = cx + Math.cos(angle) * inner;
    const y1 = cy + Math.sin(angle) * inner;
    const x2 = cx + Math.cos(angle) * outer;
    const y2 = cy + Math.sin(angle) * outer;

    ctx.strokeStyle = `rgba(255, ${90 + Math.random() * 120}, 0, ${
      0.035 + Math.random() * 0.08
    })`;
    ctx.lineWidth = 1 + Math.random() * 3;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}
function createSaturnRingTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  const rings = [
    { from: 0.43, to: 0.47, color: "rgba(120, 104, 76, 0.24)" },
    { from: 0.48, to: 0.52, color: "rgba(210, 188, 130, 0.48)" },
    { from: 0.53, to: 0.56, color: "rgba(245, 225, 170, 0.66)" },
    { from: 0.57, to: 0.59, color: "rgba(60, 52, 42, 0.18)" },
    { from: 0.6, to: 0.65, color: "rgba(226, 200, 140, 0.55)" },
    { from: 0.66, to: 0.69, color: "rgba(120, 100, 72, 0.22)" },
    { from: 0.7, to: 0.76, color: "rgba(240, 220, 170, 0.46)" },
    { from: 0.77, to: 0.82, color: "rgba(150, 130, 90, 0.28)" },
    { from: 0.83, to: 0.88, color: "rgba(230, 210, 165, 0.26)" },
  ];

  rings.forEach((ring) => {
    ctx.beginPath();
    ctx.arc(cx, cy, size * ring.to * 0.5, 0, Math.PI * 2);
    ctx.arc(cx, cy, size * ring.from * 0.5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = ring.color;
    ctx.fill();
  });

  for (let i = 0; i < 70; i++) {
    const radius = size * (0.43 + Math.random() * 0.45) * 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 235, 190, ${0.04 + Math.random() * 0.08})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function RealisticSaturnRing({ radius }) {
  const ringRef = useRef(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.006;
    }
  });

  return (
    <group ref={ringRef} rotation={[Math.PI / 2.18, 0.04, -0.22]}>
      <mesh>
        <ringGeometry args={[radius * 1.42, radius * 2.55, 256]} />
        <meshBasicMaterial
          color="#c9b27c"
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[radius * 1.48, radius * 1.58, 256]} />
        <meshBasicMaterial
          color="#f3dfac"
          transparent
          opacity={0.58}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[radius * 1.62, radius * 1.72, 256]} />
        <meshBasicMaterial
          color="#8b7650"
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[radius * 1.78, radius * 1.9, 256]} />
        <meshBasicMaterial
          color="#e8c987"
          transparent
          opacity={0.48}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[radius * 2.0, radius * 2.16, 256]} />
        <meshBasicMaterial
          color="#d8c38a"
          transparent
          opacity={0.36}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[radius * 1.72, radius * 1.77, 256]} />
        <meshBasicMaterial
          color="#020617"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function RealPlanet({
  texture,
  radius = 1,
  rotationSpeed = 0.4,
  emissive = "#000000",
  emissiveIntensity = 0.03,
  ring = false,
  moon = false,
}) {
  const planetRef = useRef(null);
  const moonRef = useRef(null);
  const map = useTexture(texture);
  const moonMap = useTexture(planetTextures.moon);
  const [hovered, setHovered] = useState(false);

  map.colorSpace = THREE.SRGBColorSpace;
  moonMap.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed;
      planetRef.current.scale.setScalar(hovered ? 1.06 : 1);
    }

    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 1.4;
    }
  });

  return (
    <group>
      <mesh
        ref={planetRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial
          map={map}
          emissive={emissive}
          emissiveIntensity={hovered ? emissiveIntensity + 0.08 : emissiveIntensity}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>

      {ring && <RealisticSaturnRing radius={radius} />}

      {moon && (
        <group ref={moonRef}>
          <mesh position={[radius * 2.3, 0.1, 0]}>
            <sphereGeometry args={[radius * 0.25, 48, 48]} />
            <meshStandardMaterial map={moonMap} roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function OrbitPlanet({
  texture,
  distance,
  radius,
  speed,
  rotationSpeed,
  ring = false,
  moon = false,
}) {
  const orbitRef = useRef(null);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[distance, 0.003, 12, 260]} />
        <meshBasicMaterial color="#8fdfff" transparent opacity={0.14} />
      </mesh>

      <group ref={orbitRef}>
        <group position={[distance, 0, 0]}>
          <RealPlanet
            texture={texture}
            radius={radius}
            rotationSpeed={rotationSpeed}
            ring={ring}
            moon={moon}
          />
        </group>
      </group>
    </group>
  );
}

function RealSun() {
  const sunRef = useRef(null);
  const glowRef = useRef(null);
  const outerGlowRef = useRef(null);

  const sunMap = useTexture(planetTextures.sun);
  const glowTexture = useMemo(() => createSunCoronaTexture(), []);

  sunMap.colorSpace = THREE.SRGBColorSpace;

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.12;
      sunRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.01);
    }

    if (glowRef.current) {
      glowRef.current.rotation.z += delta * 0.015;
      const pulse = 1.7 + Math.sin(time * 1.4) * 0.04;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }

    if (outerGlowRef.current) {
      outerGlowRef.current.rotation.z -= delta * 0.01;
      const pulse = 2.45 + Math.sin(time * 1.1) * 0.06;
      outerGlowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      <sprite ref={outerGlowRef} position={[0, 0, -0.22]}>
        <spriteMaterial
          map={glowTexture}
          color="#ff3d00"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <sprite ref={glowRef} position={[0, 0, -0.16]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffb703"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <mesh ref={sunRef}>
        <sphereGeometry args={[0.46, 128, 128]} />
        <meshBasicMaterial map={sunMap} />
      </mesh>

      <pointLight color="#ffd166" intensity={7.5} distance={12} />
    </group>
  );
}

function RealSolarSystem() {
  return (
    <group scale={0.92} position={[0.7, 0, 0]} rotation={[0.28, 0, 0]}>
      <RealSun />

      <OrbitPlanet
        texture={planetTextures.mercury}
        distance={0.72}
        radius={0.055}
        speed={1.45}
        rotationSpeed={1.3}
      />

      <OrbitPlanet
        texture={planetTextures.venus}
        distance={0.98}
        radius={0.085}
        speed={1.08}
        rotationSpeed={0.8}
      />

      <OrbitPlanet
        texture={planetTextures.earth}
        distance={1.28}
        radius={0.102}
        speed={0.86}
        rotationSpeed={1.2}
        moon
      />

      <OrbitPlanet
        texture={planetTextures.mars}
        distance={1.62}
        radius={0.075}
        speed={0.68}
        rotationSpeed={1}
      />

      <OrbitPlanet
        texture={planetTextures.jupiter}
        distance={2.16}
        radius={0.24}
        speed={0.42}
        rotationSpeed={1.4}
      />

      <OrbitPlanet
        texture={planetTextures.saturn}
        distance={2.78}
        radius={0.145}
        speed={0.32}
        rotationSpeed={1}
        ring
      />

      <OrbitPlanet
        texture={planetTextures.uranus}
        distance={3.28}
        radius={0.135}
        speed={0.25}
        rotationSpeed={0.9}
      />

      <OrbitPlanet
        texture={planetTextures.neptune}
        distance={3.72}
        radius={0.135}
        speed={0.2}
        rotationSpeed={0.9}
      />
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.72} />
      <directionalLight position={[5, 5, 5]} intensity={1.7} />
      <pointLight position={[-4, -2, 4]} intensity={2.1} color="#a855f7" />
      <pointLight position={[4, 2, -4]} intensity={1.8} color="#22d3ee" />
    </>
  );
}

export function RealSolarSystemScene() {
  return (
<Canvas
  camera={{ position: [0, 3.6, 8.4], fov: 52 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneLights />

      <Stars
        radius={100}
        depth={50}
        count={4400}
        factor={4}
        saturation={0}
        fade
        speed={1.1}
      />

      <Suspense fallback={null}>
        <RealSolarSystem />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.42}
        rotateSpeed={0.75}
      />
    </Canvas>
  );
}

export function PlanetScene({ planet = "earth", ring = false, moon = false }) {
  const texture = planetTextures[planet];

  return (
    <Canvas
      camera={{ position: [0, 0, 3.8], fov: 43 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneLights />

      <Stars
        radius={60}
        depth={30}
        count={1600}
        factor={3}
        saturation={0}
        fade
        speed={0.9}
      />

      <Suspense fallback={null}>
        <group rotation={[0.15, -0.2, 0]}>
          <RealPlanet
            texture={texture}
            radius={ring ? 0.58 : 1.05}
            rotationSpeed={0.35}
            ring={ring}
            moon={moon}
          />
        </group>
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.75}
        rotateSpeed={0.75}
      />
    </Canvas>
  );
}