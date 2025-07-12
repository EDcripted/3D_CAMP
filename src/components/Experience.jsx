import {
  CameraControls,
  Text,
  Environment,
  MeshReflectorMaterial,
  RenderTexture,
  Html,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import { Camping } from "./Camping";

export const Experience = () => {
  const controls = useRef();
  const animatedCampingRef = useRef();
  const fireSoundRef = useRef(null);
  const [startIntro, setStartIntro] = useState(false);

  // 📦 Preload campfire sound on mount
  useEffect(() => {
    fireSoundRef.current = new Audio("/sounds/campfire.mp3");
    fireSoundRef.current.loop = true;
    fireSoundRef.current.volume = 0.6;
  }, []);

  // 🎥 Camera fly-in + play fire sound
  const intro = async () => {
    if (fireSoundRef.current) {
      fireSoundRef.current
        .play()
        .then(() => console.log("Fire sound playing 🔥"))
        .catch((err) => console.error("Audio failed to play:", err));
    }

    controls.current.dolly(-35);
    controls.current.smoothTime = 1.6;
    controls.current.dolly(35, true);
  };

  // Start intro when button is clicked
  useEffect(() => {
    if (startIntro) intro();
  }, [startIntro]);

  // 🔁 Animate the 3D model in the text
  useFrame((state) => {
    if (animatedCampingRef.current) {
      const time = state.clock.elapsedTime * 0.3;
      animatedCampingRef.current.position.x = Math.sin(time) * 0.8;
      animatedCampingRef.current.rotation.y = time;
    }
  });

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <CameraControls ref={controls} />

      {/* 🔘 Enter Button */}
      {!startIntro && (
        <Html>
          <div
            style={{
              position: "absolute",
              bottom: "150px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setStartIntro(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "orange",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              Enter
            </button>
          </div>
        </Html>
      )}

      {/* 🧶 3D Text with animated camping inside */}
      <Text
        font={"fonts/Poppins-Black.ttf"}
        position={[-1.3, -0.5, 1]}
        lineHeight={0.8}
        textAlign="center"
        rotation-y={degToRad(30)}
        anchorY={"bottom"}
      >
          TED'S MINI{"\n"}CAMPING
        <meshBasicMaterial color="white">
          <RenderTexture attach="map">
            <color attach="background" args={["#fff"]} />
            <Environment preset="sunset" />
            <Camping
              ref={animatedCampingRef}
              scale={1.6}
              rotation-x={degToRad(40)}
              position-y={-0.5}
            />
          </RenderTexture>
        </meshBasicMaterial>
      </Text>

      {/* 🏕️ Main Camping GLB model */}
      <group rotation-y={degToRad(-25)} position-x={3}>
        <Camping scale={0.6} />
      </group>

      {/* 🌫️ Reflective Ground Plane */}
      <mesh position-y={-0.48} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>

      <Environment preset="sunset" />
    </>
  );
};
