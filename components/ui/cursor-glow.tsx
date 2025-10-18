"use client";

import { useEffect, useState, useRef } from "react";

interface FlowParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  angle: number;
}

export function CursorGlow() {
  const [particles, setParticles] = useState<FlowParticle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const particleId = useRef(0);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      
      // Calculate mouse velocity for wind effect
      const velocityX = newX - lastMousePosition.current.x;
      const velocityY = newY - lastMousePosition.current.y;
      
      lastMousePosition.current = { x: newX, y: newY };
      setMousePosition({ x: newX, y: newY });

      // Create flow particles based on mouse movement
      if (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5) {
        createFlowParticles(newX, newY, velocityX, velocityY);
      }
    };

    const createFlowParticles = (x: number, y: number, vx: number, vy: number) => {
      const newParticles: FlowParticle[] = [];
      const speed = Math.sqrt(vx ** 2 + vy ** 2);
      const particleCount = Math.min(3, Math.floor(speed / 2) + 1);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 0.5;
        const force = Math.random() * speed * 0.3 + 0.2;
        
        newParticles.push({
          id: particleId.current++,
          x: x + (Math.random() - 0.5) * 100,
          y: y + (Math.random() - 0.5) * 100,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          life: 120,
          maxLife: 120,
          size: Math.random() * 3 + 1,
          angle: angle
        });
      }
      
      setParticles(prev => [...prev, ...newParticles]);
    };

    // Flow field animation
    const animate = () => {
      setParticles(prev => {
        return prev
          .map(particle => {
            // Apply wind forces
            const windX = Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.1;
            const windY = Math.cos(Date.now() * 0.001 + particle.y * 0.01) * 0.1;
            
            // Update velocity with wind
            particle.vx += windX;
            particle.vy += windY;
            
            // Apply friction
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update angle based on velocity
            particle.angle = Math.atan2(particle.vy, particle.vx);
            
            // Decrease life
            particle.life -= 1;
            
            return particle;
          })
          .filter(particle => particle.life > 0);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', updateMousePosition);
    animate();

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute opacity-60"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size * 8,
            height: particle.size,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(100, 100, 100, ${particle.life / particle.maxLife}) 20%, 
              rgba(100, 100, 100, ${particle.life / particle.maxLife}) 80%, 
              transparent 100%
            )`,
            transform: `rotate(${particle.angle}rad)`,
            transformOrigin: 'center',
            opacity: (particle.life / particle.maxLife) * 0.6,
          }}
        />
      ))}
    </div>
  );
}


