import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface VisorTaza3DProps {
  imagenUrl: string;
  colorTaza?: string;
  escalaY?: number;     // Para ajustar altura del diseño (0.5 a 1)
  posicionY?: number;   // Para subir o bajar el diseño (-0.2 a 0.2)
}

function ModeloTaza({
  imagenUrl,
  colorTaza = '#ffffff',
  escalaY = 0.85,
  posicionY = 0,
}: VisorTaza3DProps) {
  const [textura, setTextura] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imagenUrl) return;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(imagenUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.needsUpdate = true;
      setTextura(tex);
    });
  }, [imagenUrl]);

  // Dimensiones reales proporcionales a una taza de 11oz
  const radio = 1.05;
  const altura = 2.3;

  // El asa está en +X (ángulo 0.5 * PI).
  // Empezamos en 0.65 * PI y recorremos 1.7 * PI para que el hueco blanco (0.3 * PI) quede justo en el asa.
  const anguloInicio = Math.PI * 0.65;
  const anguloArco = Math.PI * 1.7;

  return (
    <group position={[0, 0.1, 0]}>
      {/* 1. Cuerpo cerámico base de la taza */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radio, radio, altura, 64, 1, false]} />
        <meshStandardMaterial
          color={colorTaza}
          roughness={0.18}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Borde superior e interior de la taza */}
      <mesh position={[0, altura / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radio - 0.1, radio, 64]} />
        <meshStandardMaterial color={colorTaza} roughness={0.2} />
      </mesh>
      <mesh position={[0, altura / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radio - 0.1, 64]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.35} />
      </mesh>

      {/* 3. Capa del diseño sublimado envuelto alrededor de la taza */}
      {textura && (
        <mesh position={[0, posicionY, 0]}>
          <cylinderGeometry
            args={[
              radio + 0.004,
              radio + 0.004,
              altura * escalaY,
              64,
              1,
              true, // openEnded: solo la pared curva
              anguloInicio,
              anguloArco,
            ]}
          />
          <meshStandardMaterial
            map={textura}
            transparent
            roughness={0.15}
            metalness={0.02}
          />
        </mesh>
      )}

      {/* 4. Asa rotada -90° en Z para formar la "D" cerrada contra la pared */}
      <mesh position={[radio - 0.06, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.68, 0.13, 24, 48, Math.PI]} />
        <meshStandardMaterial color={colorTaza} roughness={0.18} />
      </mesh>
    </group>
  );
}

export default function VisorTaza3D(props: VisorTaza3DProps) {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-b from-ink-50 to-ink-100/70 shadow-inner">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 4.6], fov: 40 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />
        <directionalLight position={[-5, 3, -4]} intensity={0.4} />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ModeloTaza {...props} />
          <ContactShadows
            position={[0, -1.1, 0]}
            opacity={0.35}
            scale={6}
            blur={2.2}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={6.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3.5 py-1 text-xs font-medium text-ink-600 shadow-sm backdrop-blur">
        Arrastra para girar la taza 360° • Usa la rueda para acercar
      </div>
    </div>
  );
}