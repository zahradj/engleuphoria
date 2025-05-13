
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<THREE.PlaneGeometry>(null!);
  
  useFrame(({ clock }) => {
    if (meshRef.current && geometryRef.current) {
      const time = clock.getElapsedTime() * 0.5;
      const geometry = geometryRef.current;
      const position = geometry.attributes.position;

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        
        // Create waves
        const waveX = Math.sin(x * 1.5 + time) * 0.1;
        const waveY = Math.sin(y * 2 + time) * 0.1;
        
        position.setZ(i, waveX + waveY);
      }
      
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry ref={geometryRef} args={[10, 10, 16, 16]} />
      <meshStandardMaterial 
        color="#E5DEFF" 
        wireframe 
        transparent 
        opacity={0.3}
      />
    </mesh>
  );
}

export function WavingBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute w-full h-full top-0 left-0 -z-10 opacity-20 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <WaveMesh />
      </Canvas>
    </div>
  );
}
