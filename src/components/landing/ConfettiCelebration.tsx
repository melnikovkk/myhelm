import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const COLORS = [
  'hsl(192 91% 54%)', // primary
  'hsl(38 92% 50%)',  // accent  
  'hsl(142 71% 45%)', // success
  'hsl(210 100% 60%)',// blue
  'hsl(280 90% 60%)', // purple
];

const ConfettiCelebration = ({ trigger }: { trigger: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // Create particles
    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50,
      size: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      speedX: (Math.random() - 0.5) * 15,
      speedY: -Math.random() * 15 - 5,
      opacity: 1,
    }));

    setParticles(newParticles);

    // Animate particles
    let frame = 0;
    const animate = () => {
      frame++;
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.speedX * 0.5,
          y: p.y + p.speedY * 0.5 + frame * 0.15, // gravity
          rotation: p.rotation + p.speedX * 2,
          opacity: Math.max(0, p.opacity - 0.015),
        })).filter(p => p.opacity > 0)
      );

      if (frame < 120) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiCelebration;
