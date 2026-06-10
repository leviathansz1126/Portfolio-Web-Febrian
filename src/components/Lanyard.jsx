/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

import cardGLB from "../assets/lanyard/card.glb";
import lanyard from "../assets/lanyard/lanyard.png";
import cardTextureImage from "../assets/lanyard/card-texture.png";

import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(max-width: 768px), (pointer: coarse)").matches
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{
          position: isMobile ? [0, 0, 18] : position,
          fov: isMobile ? 24 : fov,
        }}
        dpr={[1, isMobile ? 1.15 : 2]}
        gl={{
          alpha: transparent,
          antialias: !isMobile,
          powerPreference: isMobile ? "low-power" : "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
        }}
      >
        <ambientLight intensity={Math.PI} />

        {isMobile ? (
          <MobileBand />
        ) : (
          <Physics gravity={gravity} timeStep={1 / 60}>
            <DesktopBand />
          </Physics>
        )}

        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />

          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />

          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />

          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

/* ===========================
   MOBILE VERSION
   Stable, no physics, dragable.
   =========================== */
function MobileBand() {
  const band = useRef(null);
  const cardGroup = useRef(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const hook = useMemo(() => new THREE.Vector3(), []);
  const midA = useMemo(() => new THREE.Vector3(), []);
  const midB = useMemo(() => new THREE.Vector3(), []);

  const topPoint = useMemo(() => new THREE.Vector3(0, 3.45, 0), []);
  const cardPos = useRef(new THREE.Vector3(0, 0.55, 0));

  const [dragged, setDragged] = useState(false);

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);
  const cardTexture = useTexture(cardTextureImage);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    cardTexture.flipY = false;
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.wrapS = THREE.ClampToEdgeWrapping;
    cardTexture.wrapT = THREE.ClampToEdgeWrapping;
    cardTexture.needsUpdate = true;
  }, [texture, cardTexture]);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      cardPos.current.set(
        THREE.MathUtils.clamp(vec.x - dragged.x, -1.55, 1.55),
        THREE.MathUtils.clamp(vec.y - dragged.y, -1.05, 1.25),
        0
      );
    }

    if (cardGroup.current) {
      cardGroup.current.position.copy(cardPos.current);
    }

    if (band.current) {
      hook.copy(cardPos.current).add(new THREE.Vector3(0, 1.48, 0));

      midA.lerpVectors(hook, topPoint, 0.35);
      midB.lerpVectors(hook, topPoint, 0.7);

      curve.points[0].copy(hook);
      curve.points[1].copy(midA);
      curve.points[2].copy(midB);
      curve.points[3].copy(topPoint);

      band.current.geometry.setPoints(curve.getPoints(36));
    }
  });

  curve.curveType = "chordal";

  const startDrag = (event) => {
    event.stopPropagation();
    event.nativeEvent?.preventDefault?.();

    if (event.target?.setPointerCapture) {
      event.target.setPointerCapture(event.pointerId);
    }

    setDragged(
      new THREE.Vector3().copy(event.point).sub(cardPos.current.clone())
    );
  };

  const stopDrag = (event) => {
    event.stopPropagation();

    if (event.target?.releasePointerCapture) {
      event.target.releasePointerCapture(event.pointerId);
    }

    setDragged(false);
  };

  return (
    <>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[1000, 2000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>

      <group
        ref={cardGroup}
        position={[0, 0.55, 0]}
        scale={2.05}
        onPointerDown={startDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        {/* Hitbox besar biar Android gampang di-drag */}
        <mesh position={[0, -0.05, 0.1]}>
          <planeGeometry args={[2.6, 3.6]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group position={[0, -1.2, -0.05]}>
          <mesh geometry={nodes.card.geometry}>
            <meshPhysicalMaterial
              map={cardTexture || materials.base.map}
              map-anisotropy={16}
              clearcoat={0}
              clearcoatRoughness={0.15}
              roughness={0.9}
              metalness={0.8}
            />
          </mesh>

          <mesh
            geometry={nodes.clip.geometry}
            material={materials.metal}
            material-roughness={0.3}
          />

          <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
        </group>
      </group>
    </>
  );
}

/* ===========================
   DESKTOP VERSION
   Original physics version.
   =========================== */
function DesktopBand({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef(null);
  const fixed = useRef(null);
  const j1 = useRef(null);
  const j2 = useRef(null);
  const j3 = useRef(null);
  const card = useRef(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);
  const cardTexture = useTexture(cardTextureImage);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    cardTexture.flipY = false;
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.wrapS = THREE.ClampToEdgeWrapping;
    cardTexture.wrapT = THREE.ClampToEdgeWrapping;
    cardTexture.needsUpdate = true;
  }, [texture, cardTexture]);

  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);

  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);

  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);

  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => {
        ref.current?.wakeUp();
      });

      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        }

        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());

      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z,
      });
    }
  });

  curve.curveType = "chordal";

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(event) => {
              event.target.releasePointerCapture(event.pointerId);
              drag(false);
            }}
            onPointerDown={(event) => {
              event.target.setPointerCapture(event.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(event.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture || materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>

            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />

            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);