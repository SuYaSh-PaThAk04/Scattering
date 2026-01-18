"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stats, Sphere } from "@react-three/drei";
import * as THREE from "three";

/**
 * Enhanced Target nucleus with premium glow effects
 */
function Nucleus({ position = [0, 0, 0], size = 0.4, color = "#06b6d4" }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const outerGlowRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (meshRef.current) {
      // Gentle breathing animation
      const scale = 1 + Math.sin(time * 0.8) * 0.08;
      meshRef.current.scale.setScalar(scale);
      
      // Rotate slowly for visual interest
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = time * 0.15;
    }
    
    if (glowRef.current) {
      const glowScale = 1 + Math.sin(time * 1.2) * 0.12;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.rotation.y = -time * 0.3;
    }
    
    if (outerGlowRef.current) {
      const outerScale = 1 + Math.sin(time * 0.6) * 0.15;
      outerGlowRef.current.scale.setScalar(outerScale);
      outerGlowRef.current.rotation.y = time * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Core nucleus */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Inner glow layer */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.4, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer glow layer */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[size * 2, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Point light at nucleus */}
      <pointLight color={color} intensity={2} distance={5} decay={2} />
    </group>
  );
}

/**
 * Enhanced particle trail with gradient and glow
 */
function ParticleTrail({ trajectory, color = "#8b5cf6", visible = true, active = false }) {
  const lineRef = useRef();
  const pointsRef = useRef(new THREE.BufferGeometry());
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!trajectory || trajectory.length === 0) {
      pointsRef.current.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([], 3)
      );
      setOpacity(0);
      return;
    }

    const validPoints = trajectory
      .filter((p) => {
        return (
          p &&
          typeof p.x === "number" &&
          typeof p.y === "number" &&
          !isNaN(p.x) &&
          !isNaN(p.y) &&
          isFinite(p.x) &&
          isFinite(p.y)
        );
      })
      .map((p) => {
        const x = p.x * 1e15;
        const y = p.y * 1e15;
        const clampedX = Math.max(-1000, Math.min(1000, x));
        const clampedY = Math.max(-1000, Math.min(1000, y));
        return new THREE.Vector3(clampedX, clampedY, 0);
      });

    if (validPoints.length >= 2) {
      try {
        pointsRef.current.setFromPoints(validPoints);
        pointsRef.current.computeBoundingSphere();
        setOpacity(active ? 0.8 : 0.4);
      } catch (error) {
        console.warn("Error setting trajectory points:", error);
        pointsRef.current.setAttribute(
          "position",
          new THREE.Float32BufferAttribute([], 3)
        );
        setOpacity(0);
      }
    } else {
      pointsRef.current.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([], 3)
      );
      setOpacity(0);
    }
  }, [trajectory, active]);

  useFrame(() => {
    if (lineRef.current && active) {
      lineRef.current.material.opacity = 0.6 + Math.sin(Date.now() * 0.003) * 0.2;
    }
  });

  if (!visible || !trajectory || trajectory.length < 2) {
    return null;
  }

  return (
    <group>
      {/* Main trail line */}
      <line ref={lineRef}>
        <primitive object={pointsRef.current} attach="geometry" />
        <lineBasicMaterial
          color={color}
          opacity={opacity}
          transparent
          linewidth={2}
          blending={THREE.AdditiveBlending}
        />
      </line>
    </group>
  );
}

/**
 * Animated particle with trail effect
 */
function AnimatedParticle({ position, color = "#8b5cf6", size = 0.08, active = false }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulseSpeed = active ? 8 : 4;
      const scale = 1 + Math.sin(clock.getElapsedTime() * pulseSpeed) * (active ? 0.4 : 0.2);
      meshRef.current.scale.setScalar(scale);
    }
    
    if (glowRef.current) {
      const glowPulse = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.3;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });

  if (!position) return null;

  if (
    typeof position.x !== "number" ||
    typeof position.y !== "number" ||
    isNaN(position.x) ||
    isNaN(position.y) ||
    !isFinite(position.x) ||
    !isFinite(position.y)
  ) {
    return null;
  }

  const x = Math.max(-1000, Math.min(1000, position.x * 1e15));
  const y = Math.max(-1000, Math.min(1000, position.y * 1e15));

  return (
    <group position={[x, y, 0]}>
      {/* Core particle */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 2 : 1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Particle glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.5 : 0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Point light for active particles */}
      {active && (
        <pointLight color={color} intensity={0.5} distance={2} decay={2} />
      )}
    </group>
  );
}

/**
 * Premium environment with lighting and effects
 */
function SceneEnvironment() {
  const starsRef = useRef();
  
  useEffect(() => {
    // Create starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    
    const starsVertices = [];
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    
    if (starsRef.current) {
      starsRef.current.geometry = starsGeometry;
      starsRef.current.material = starsMaterial;
    }
  }, []);
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
      starsRef.current.rotation.x += 0.00005;
    }
  });
  
  return (
    <group>
      {/* Stars background */}
      <points ref={starsRef} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Key lights */}
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, 10, -10]} intensity={0.4} color="#ec4899" />
      
      {/* Rim light */}
      <directionalLight position={[0, 0, 10]} intensity={0.3} color="#ffffff" />
      
      {/* Premium grid */}
      <gridHelper 
        args={[40, 40, "#8b5cf6", "#1a1a2e"]} 
        position={[0, -0.1, 0]}
      />
      
      {/* Circular energy rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[2, 2.05, 64]} />
        <meshBasicMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[4, 4.05, 64]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[6, 6.05, 64]} />
        <meshBasicMaterial 
          color="#ec4899" 
          transparent 
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/**
 * Main 3D scene component
 */
function Scene3D({ particles, showTrails = true, showPoints = true }) {
  return (
    <>
      <SceneEnvironment />
      
      {/* Target nucleus at center */}
      <Nucleus position={[0, 0, 0]} size={0.4} color="#06b6d4" />

      {/* Render all particles */}
      {particles &&
        particles.map((particle, index) => {
          const isActive = particle.active || false;
          const particleColor = particle.color || 
            (isActive ? "#a78bfa" : "#8b5cf6");
          
          return (
            <group key={particle.id || index}>
              {/* Trail */}
              {showTrails && (
                <ParticleTrail
                  trajectory={particle.trajectory}
                  color={particleColor}
                  visible={showTrails}
                  active={isActive}
                />
              )}
              
              {/* Current particle position - only show if active */}
              {showPoints && particle.currentPosition && particle.active && (
                <AnimatedParticle
                  position={particle.currentPosition}
                  color={particleColor}
                  size={0.08}
                  active={isActive}
                />
              )}
            </group>
          );
        })}
    </>
  );
}

/**
 * Post-processing effects component
 */
function Effects() {
  return null; // Can be extended with bloom, etc.
}

/**
 * Main 3D Simulation Component
 */
export default function Simulation3D({
  particles = [],
  showTrails = true,
  showPoints = true,
  cameraPosition = [0, 5, 20],
}) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-black via-purple-950/20 to-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 100]} />
        
        <PerspectiveCamera makeDefault position={cameraPosition} fov={60} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={60}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          autoRotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <Scene3D
          particles={particles}
          showTrails={showTrails}
          showPoints={showPoints}
        />
        
        <Effects />
        
        <Stats />
      </Canvas>
    </div>
  );
}