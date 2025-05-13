
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Animation for spinning objects
function AnimatedShape({ position, color, shape }: { position: [number, number, number], color: string, shape: 'cube' | 'sphere' | 'torus' }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Create the appropriate geometry based on the shape parameter
  const renderGeometry = () => {
    switch (shape) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.8, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.7, 0.2, 16, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function ThreeDShapes({ className = "" }: { className?: string }) {
  return (
    <div className={`h-64 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <AnimatedShape position={[-2, 0, 0]} color="#9B87F5" shape="cube" />
        <AnimatedShape position={[0, 0, 0]} color="#14B8A6" shape="sphere" />
        <AnimatedShape position={[2, 0, 0]} color="#F97316" shape="torus" />
        
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
