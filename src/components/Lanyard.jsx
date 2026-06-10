/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react";
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

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{
          position: isMobile ? [0, 0, 28] : position,
          fov: isMobile ? 22 : fov,
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

        <Physics
          gravity={isMobile ? [0, -82, 0] : gravity}
          timeStep={1 / 60}
        >
          <Band isMobile={isMobile} />
        </Physics>

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

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
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
    angularDamping: isMobile ? 1.35 : 4,
    linearDamping: isMobile ? 1.35 : 4,
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);
  const cardTexture = useTexture(cardTextureImage);

  /*
    Desktop tetap pakai bentuk lama.
    Mobile dibuat vertikal supaya tali nyambung dari atas frame,
    card kelihatan utuh, dan tidak slow.
  */
  const bandGroupY = isMobile ? 5.05 : 4;

  const ropeLength = isMobile ? 0.78 : 1;
  const cardAnchorY = 1.5;

  const j1Pos = isMobile ? [0.02, -0.58, 0] : [0.5, 0, 0];
  const j2Pos = isMobile ? [0.04, -1.16, 0] : [1, 0, 0];
  const j3Pos = isMobile ? [0.06, -1.74, 0] : [1.5, 0, 0];
  const cardPos = isMobile ? [0.08, -3.2, 0] : [2, 0, 0];

  const cardVisualY = -1.2;
  const cardScale = isMobile ? 1.96 : 2.25;

  const hitboxWidth = isMobile ? 2.45 : 2.1;
  const hitboxHeight = isMobile ? 3.45 : 3.1;

  const curveDetail = isMobile ? 30 : 32;
  const bandLineWidth = isMobile ? 0.88 : 1;

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
    ropeLength,
  ]);

  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    ropeLength,
  ]);

  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    ropeLength,
  ]);

  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, cardAnchorY, 0],
  ]);

  useEffect(() => {
    if (!hovered) return;

    document.body.style.cursor = dragged ? "grabbing" : "grab";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current ||
      !band.current
    ) {
      return;
    }

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => {
        ref.current?.wakeUp();
      });

      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

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

    band.current.geometry.setPoints(curve.getPoints(curveDetail));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());

    card.current.setAngvel({
      x: ang.x,
      y: ang.y - rot.y * 0.25,
      z: ang.z,
    });
  });

  curve.curveType = "chordal";

  const startDrag = (event) => {
    event.stopPropagation();
    event.nativeEvent?.preventDefault?.();

    if (event.target?.setPointerCapture) {
      event.target.setPointerCapture(event.pointerId);
    }

    [card, j1, j2, j3, fixed].forEach((ref) => {
      ref.current?.wakeUp();
    });

    drag(
      new THREE.Vector3()
        .copy(event.point)
        .sub(vec.copy(card.current.translation()))
    );
  };

  const stopDrag = (event) => {
    event.stopPropagation();

    if (event.target?.releasePointerCapture) {
      event.target.releasePointerCapture(event.pointerId);
    }

    drag(false);
  };

  return (
    <>
      <group position={[0, bandGroupY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody position={j1Pos} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={j2Pos} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={j3Pos} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={cardPos}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={cardScale}
            position={[0, cardVisualY, -0.05]}
            onPointerOver={(event) => {
              event.stopPropagation();
              hover(true);
            }}
            onPointerOut={(event) => {
              event.stopPropagation();
              hover(false);
            }}
            onPointerCancel={(event) => {
              event.stopPropagation();
              drag(false);
              hover(false);
            }}
            onPointerUp={stopDrag}
            onPointerDown={startDrag}
          >
            {/* Hitbox transparan: bikin Android gampang di-drag */}
            <mesh position={[0, 0.15, 0.08]}>
              <planeGeometry args={[hitboxWidth, hitboxHeight]} />
              <meshBasicMaterial
                transparent
                opacity={0}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture || materials.base.map}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
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
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={bandLineWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);