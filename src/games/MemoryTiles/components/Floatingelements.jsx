import { useState, useEffect } from "react";

export default function FloatingElements() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate floating decorative elements on mount
    const floatingElements = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10,
      delay: i * 0.5,
      duration: 8 + Math.random() * 4,
      size: Math.random() * 20 + 10,
      emoji: ["⭐", "✨", "🎯", "🧠", "⚡"][Math.floor(Math.random() * 5)],
    }));

    setElements(floatingElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map(el => (
        <div
          key={el.id}
          className="absolute text-3xl opacity-20 hover:opacity-40 transition-opacity"
          style={{
            left: `${el.left}%`,
            top: `${el.size * 2}px`,
            animation: `float ${el.duration}s ease-in-out infinite`,
            animationDelay: `${el.delay}s`,
            fontSize: `${el.size}px`,
          }}
        >
          {el.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-40px) rotate(10deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-80px) rotate(0deg);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-40px) rotate(-10deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}