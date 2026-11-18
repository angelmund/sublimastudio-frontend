import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

export type TipoProducto3D = 'taza' | 'termo' | 'placa';
export type TamanoPlaca = '20x30' | '40x60';
export type OrientacionPlaca = 'vertical' | 'horizontal';

export interface ConfigColor {
  nombre: string;
  exterior: string;
  interior: string;
  asa: string;
  esInteriorColor?: boolean;
}

interface VisorProducto3DProps {
  tipoProducto: TipoProducto3D;
  imagenUrl: string;
  colorConfig: ConfigColor;
  escalaY?: number;
  posicionY?: number;
  tamanoPlaca?: TamanoPlaca;
  orientacionPlaca?: OrientacionPlaca;
}

function useTexturaSublimacion(imagenUrl: string) {
  const [textura, setTextura] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imagenUrl) return;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(imagenUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      setTextura(tex);
    });
  }, [imagenUrl]);

  return textura;
}

/* 1. TAZA 11 OZ */
function ModeloTaza({
  textura,
  colorConfig,
  escalaY = 1.0,
  posicionY = 0,
}: {
  textura: THREE.Texture | null;
  colorConfig: ConfigColor;
  escalaY: number;
  posicionY: number;
}) {
  const radioExt = 1.05;
  const radioInt = 0.94;
  const altura = 2.3;
  const anguloInicio = Math.PI * 0.58;
  const anguloArco = Math.PI * 1.85;

  return (
    <group position={[0, 0.1, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radioExt, radioExt, altura, 64, 1, false]} />
        <meshStandardMaterial color={colorConfig.exterior} roughness={0.18} metalness={0.05} />
      </mesh>

      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[radioInt, radioInt, altura - 0.06, 64, 1, true]} />
        <meshStandardMaterial color={colorConfig.interior} side={THREE.BackSide} roughness={0.22} />
      </mesh>

      <mesh position={[0, -altura / 2 + 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radioInt, 64]} />
        <meshStandardMaterial color={colorConfig.interior} roughness={0.25} />
      </mesh>

      <mesh position={[0, altura / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[(radioExt + radioInt) / 2, (radioExt - radioInt) / 2, 16, 64]} />
        <meshStandardMaterial color={colorConfig.interior} roughness={0.18} />
      </mesh>

      {textura && (
        <mesh position={[0, posicionY, 0]}>
          <cylinderGeometry
            args={[
              radioExt + 0.004,
              radioExt + 0.004,
              altura * escalaY,
              64,
              1,
              true,
              anguloInicio,
              anguloArco,
            ]}
          />
          <meshStandardMaterial map={textura} transparent roughness={0.15} metalness={0.02} />
        </mesh>
      )}

      <mesh position={[radioExt - 0.06, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <torusGeometry args={[0.68, 0.13, 24, 48, Math.PI]} />
        <meshStandardMaterial color={colorConfig.asa} roughness={0.18} />
      </mesh>
    </group>
  );
}

/* 2. TERMO SKINNY 20 OZ (Blanco liso, sin asa) */
function ModeloTermo20({
  textura,
  escalaY = 1.0,
  posicionY = 0,
}: {
  textura: THREE.Texture | null;
  escalaY: number;
  posicionY: number;
}) {
  const radio = 0.72;
  const altura = 2.65;

  return (
    <group position={[0, -0.05, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radio, radio, altura, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.08} />
      </mesh>

      <mesh position={[0, -altura / 2 + 0.02, 0]}>
        <cylinderGeometry args={[radio + 0.003, radio - 0.01, 0.05, 64]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.25} metalness={0.6} />
      </mesh>

      <mesh position={[0, altura / 2 + 0.07, 0]}>
        <cylinderGeometry args={[radio + 0.015, radio + 0.015, 0.14, 64]} />
        <meshStandardMaterial color="#f8fafc" transparent opacity={0.8} roughness={0.1} />
      </mesh>

      <mesh position={[0.15, altura / 2 + 0.45, 0]}>
        <cylinderGeometry args={[0.048, 0.048, 0.85, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {textura && (
        <mesh position={[0, posicionY * 0.7, 0]}>
          <cylinderGeometry
            args={[radio + 0.005, radio + 0.005, altura * escalaY, 64, 1, true, 0, Math.PI * 2]}
          />
          <meshStandardMaterial map={textura} transparent roughness={0.14} metalness={0.03} />
        </mesh>
      )}
    </group>
  );
}

/* 3. PLACAS DE ALUMINIO (20x30 y 40x60 cm) */
function ModeloPlaca({
  textura,
  escalaY = 1.0,
  posicionY = 0,
  tamanoPlaca = '20x30',
  orientacionPlaca = 'vertical',
}: {
  textura: THREE.Texture | null;
  escalaY: number;
  posicionY: number;
  tamanoPlaca: TamanoPlaca;
  orientacionPlaca: OrientacionPlaca;
}) {
  const factorTamano = tamanoPlaca === '40x60' ? 1.18 : 0.92;
  const baseCorto = 1.55 * factorTamano;
  const baseLargo = 2.325 * factorTamano;

  const ancho = orientacionPlaca === 'vertical' ? baseCorto : baseLargo;
  const alto = orientacionPlaca === 'vertical' ? baseLargo : baseCorto;

  return (
    <group position={[0, 0.05, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[ancho, alto, 0.04]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.18} metalness={0.45} />
      </mesh>

      <mesh position={[0, 0, -0.021]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ancho, alto]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.35} metalness={0.85} />
      </mesh>

      {textura && (
        <mesh position={[0, posicionY * 0.35, 0.022]}>
          <planeGeometry args={[ancho * 0.99, alto * escalaY]} />
          <meshStandardMaterial map={textura} roughness={0.1} metalness={0.12} />
        </mesh>
      )}
    </group>
  );
}

const ETIQUETAS_AYUDA: Record<TipoProducto3D, string> = {
  taza: 'Arrastra para girar la taza 360° • Usa la rueda para acercar',
  termo: 'Arrastra para girar el termo 20 oz 360° • Usa la rueda para acercar',
  placa: 'Arrastra para girar la placa de aluminio • Usa la rueda para acercar',
};

export default function VisorProducto3D({
  tipoProducto,
  imagenUrl,
  colorConfig,
  escalaY = 1.0,
  posicionY = 0,
  tamanoPlaca = '20x30',
  orientacionPlaca = 'vertical',
}: VisorProducto3DProps) {
  const textura = useTexturaSublimacion(imagenUrl);

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-b from-ink-50 to-ink-100/70 shadow-inner">
      <Canvas
        shadows
        camera={{ position: [0, 0.9, 4.7], fov: 40 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.68} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow />
        <directionalLight position={[-5, 3, -4]} intensity={0.4} />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          {tipoProducto === 'taza' && (
            <ModeloTaza
              textura={textura}
              colorConfig={colorConfig}
              escalaY={escalaY}
              posicionY={posicionY}
            />
          )}
          {tipoProducto === 'termo' && (
            <ModeloTermo20
              textura={textura}
              escalaY={escalaY}
              posicionY={posicionY}
            />
          )}
          {tipoProducto === 'placa' && (
            <ModeloPlaca
              textura={textura}
              escalaY={escalaY}
              posicionY={posicionY}
              tamanoPlaca={tamanoPlaca}
              orientacionPlaca={orientacionPlaca}
            />
          )}

          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={6}
            blur={2.2}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={6.8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3.5 py-1 text-xs font-medium text-ink-600 shadow-sm backdrop-blur">
        {ETIQUETAS_AYUDA[tipoProducto]}
      </div>
    </div>
  );
}