import React, { useRef, useMemo, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useMediaQuery } from '@mui/material';

const Node = forwardRef(({ position, size, speed, color }, ref) => {
  const initialPosition = useMemo(() => position, [position]);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.x = initialPosition[0] + Math.sin(t) * 0.5;
    ref.current.position.y = initialPosition[1] + Math.cos(t) * 0.5;
    ref.current.position.z = initialPosition[2] + Math.sin(t) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.4} />
    </mesh>
  );
});

const Edge = ({ start, end, color }) => {
  const ref = useRef();
  
  useFrame(() => {
    // Update line position
    const positions = ref.current.geometry.attributes.position.array;
    positions[0] = start.current.position.x;
    positions[1] = start.current.position.y;
    positions[2] = start.current.position.z;
    positions[3] = end.current.position.x;
    positions[4] = end.current.position.y;
    positions[5] = end.current.position.z;
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={2}
          array={new Float32Array(6)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.4} />
    </line>
  );
};

const AnimatedScene = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const node1 = useRef();
  const node2 = useRef();
  const node3 = useRef();
  const node4 = useRef();
  const node5 = useRef();
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Node 
        ref={node1}
        position={[-2, 1, 0]} 
        size={isMobile ? 0.18 : 0.3} 
        speed={0.5} 
        color="#2962FF" 
      />
      <Node 
        ref={node2}
        position={[2, -1, -1]} 
        size={isMobile ? 0.24 : 0.4} 
        speed={0.3} 
        color="#AB47BC" 
      />
      <Node 
        ref={node3}
        position={[0, 2, 1]} 
        size={isMobile ? 0.15 : 0.25} 
        speed={0.7} 
        color="#2575fc" 
      />
      <Node 
        ref={node4}
        position={[-1.5, -1.5, 0.5]} 
        size={isMobile ? 0.12 : 0.2} 
        speed={0.4} 
        color="#6a11cb" 
      />
      <Node 
        ref={node5}
        position={[1.5, 1.5, -0.5]} 
        size={isMobile ? 0.21 : 0.35} 
        speed={0.6} 
        color="#2962FF" 
      />
      
      <Edge start={node1} end={node2} color="#2962FF" />
      <Edge start={node2} end={node3} color="#AB47BC" />
      <Edge start={node3} end={node4} color="#2575fc" />
      <Edge start={node4} end={node5} color="#6a11cb" />
      <Edge start={node5} end={node1} color="#2962FF" />
    </>
  );
};

export default AnimatedScene; 