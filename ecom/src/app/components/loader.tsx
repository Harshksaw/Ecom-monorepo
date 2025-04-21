'use client';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
      <div className="relative">
        {/* Diamond/Gem Shape */}
        <div className="w-16 h-16 bg-pink-100 rotate-45 rounded-lg shadow-lg relative overflow-hidden">
          {/* Sparkling effect */}
          <div className="absolute w-4 h-4 bg-white rounded-full top-2 left-2 opacity-80 animate-pulse" />
          <div className="absolute w-2 h-2 bg-white rounded-full bottom-4 right-4 opacity-60 animate-ping" />
          <div className="absolute w-3 h-3 bg-white rounded-full top-6 right-2 opacity-70 animate-pulse" style={{ animationDelay: "0.5s" }} />
          
          {/* Color gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-pink-400 to-pink-600 opacity-80 animate-pulse" />
          
          {/* Shine line animation */}
          <div className="absolute h-1 w-16 bg-white rotate-45 -top-4 -left-4 animate-[shine_2s_ease-in-out_infinite]" />
        </div>
        
        {/* Optional outer glow */}
        <div className="absolute inset-0 -m-1 bg-pink-300 rotate-45 rounded-lg opacity-30 animate-ping" style={{ animationDuration: "3s" }} />
      </div>
      
      {/* Add CSS for custom animation */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateY(0) translateX(0) rotate(45deg);
          }
          100% {
            transform: translateY(200%) translateX(200%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}