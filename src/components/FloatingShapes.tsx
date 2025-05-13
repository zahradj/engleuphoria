
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function Shape({ position, color, scale, shape }: { 
  position: [number, number, number], 
  color: string, 
  scale: number,
  shape: 'cube' | 'sphere' | 'cone' | 'torus'
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Create the appropriate geometry based on the shape parameter
  const renderGeometry = () => {
    switch (shape) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.8, 16, 16]} />;
      case 'cone':
        return <coneGeometry args={[0.7, 1.5, 16]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.2, 16, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={2}
    >
      <mesh 
        ref={meshRef} 
        position={position}
        scale={scale}
      >
        {renderGeometry()}
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  );
}

export function FloatingShapes({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <Shape position={[-3, 1, 0]} color="#9B87F5" scale={0.4} shape="cube" />
        <Shape position={[-1.5, -1, -1]} color="#14B8A6" scale={0.3} shape="sphere" />
        <Shape position={[1, 1.5, -2]} color="#F97316" scale={0.5} shape="torus" />
        <Shape position={[2, -1, -1]} color="#FACC15" scale={0.35} shape="cone" />
        <Shape position={[3.5, 0.5, -2]} color="#9B87F5" scale={0.25} shape="cube" />
      </Canvas>
    </div>
  );
}
