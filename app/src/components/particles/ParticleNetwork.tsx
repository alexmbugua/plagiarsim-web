import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function ParticleField({ count = 80, mousePosition }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.005
      ));
    }
    
    return { positions, velocities };
  }, [count]);

  // Line geometry is created inside useFrame for dynamic updates

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions based on velocity
      positions[i3] += particles.velocities[i].x;
      positions[i3 + 1] += particles.velocities[i].y;
      positions[i3 + 2] += particles.velocities[i].z;
      
      // Add subtle wave motion
      positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      
      // Boundary check - wrap around
      if (positions[i3] > 10) positions[i3] = -10;
      if (positions[i3] < -10) positions[i3] = 10;
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
      if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
      if (positions[i3 + 2] > 5) positions[i3 + 2] = -5;
      if (positions[i3 + 2] < -5) positions[i3 + 2] = 5;
      
      // Mouse repulsion
      const mouseX = (mousePosition.current.x / window.innerWidth) * 2 - 1;
      const mouseY = -(mousePosition.current.y / window.innerHeight) * 2 + 1;
      const dx = positions[i3] - mouseX * 10;
      const dy = positions[i3 + 1] - mouseY * 10;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3) {
        const force = (3 - dist) / 3 * 0.02;
        positions[i3] += dx * force;
        positions[i3 + 1] += dy * force;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update connections
    const linePositions: number[] = [];
    const maxDistance = 2.5;
    const maxConnections = 3;
    
    for (let i = 0; i < count; i++) {
      let connections = 0;
      for (let j = i + 1; j < count && connections < maxConnections; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < maxDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
          connections++;
        }
      }
    }
    
    if (linesRef.current) {
      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
    }
  });

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#3557e7"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#3557e7" transparent opacity={0.15} />
      </lineSegments>
    </>
  );
}

export default function ParticleNetwork() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField mousePosition={mousePosition} count={60} />
      </Canvas>
    </div>
  );
}
