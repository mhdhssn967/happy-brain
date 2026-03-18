import { useState, useEffect } from "react";

export default function ParticleEffects() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Emit particles periodically for background ambiance
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        left: Math.random() * 100,
        top: -10,
        delay: 0,
        duration: 3 + Math.random() * 2,
      };
      
      setParticles(prev => [...prev, newParticle]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Clean up old particles
    const cleanup = setInterval(() => {
      setParticles(prev => 
        prev.filter(p => Date.now() - p.id < 5000)
      );
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-gradient-to-b from-blue-400 to-transparent rounded-full opacity-60"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `fall ${particle.duration}s linear forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) scaleX(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}