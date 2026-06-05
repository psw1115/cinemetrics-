import React from "react";
import { motion } from "motion/react";
import { Movie } from "../types";
import { Film, Users, Award, Play } from "lucide-react";

interface MovieCardProps {
  key?: React.Key;
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  // Let's generate a beautiful deterministic gradient based on the movie title
  const getGradientColors = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash % 360);
    // Focus on deeper cinematic shadows and red overlays
    return {
      gradient: `linear-gradient(135deg, hsl(${hue1}, 50%, 12%) 0%, #08080A 100%)`,
      glow: `rgba(220, 38, 38, 0.08)`,
      border: `rgba(225, 29, 72, 0.2)`
    };
  };

  const colors = getGradientColors(movie.title);

  return (
    <motion.div
      layoutId={`card-container-${movie.title}`}
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group cursor-pointer w-full aspect-[2/3] md:aspect-[3/4.2] rounded-2xl overflow-hidden border border-white/10 bg-[#08080A] flex flex-col justify-between p-5 shadow-2xl transition-all"
      style={{
        boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px ${colors.glow}`
      }}
    >
      {/* Background Poster Abstract Mesh */}
      <div 
        className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: colors.gradient }}
      />
      
      {/* Absolute Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/80" />

      {/* Decorative Film Grain Overlay and Ambient Circle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] mix-blend-overlay opacity-30" />

      {/* Huge Translucent Rank Overlay in Background */}
      <div className="absolute -top-6 -right-6 font-sans text-[11rem] md:text-[13rem] font-bold tracking-tighter select-none leading-none opacity-5 group-hover:opacity-10 transition-all text-white font-stretch-125 select-none pointer-events-none">
        {movie.rank < 10 ? `0${movie.rank}` : movie.rank}
      </div>

      {/* Top Section */}
      <div className="relative z-10 flex justify-between items-start">
        {/* Rank Badge - styled matching top rankings in sidebar */}
        <div className="flex items-center justify-center bg-red-600/90 shadow-md shadow-red-950/40 px-3 py-1.5 rounded-lg border border-red-500/30">
          <span className="text-xs font-black text-white italic tracking-tighter font-mono">{movie.rank < 10 ? `0${movie.rank}` : movie.rank}</span>
        </div>

        {/* Action Button Indicator (Reveals on Hover) */}
        <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 bg-white/15 backdrop-blur-md hover:bg-red-600 border border-white/20 p-2.5 rounded-full transition-all duration-300">
          <Play className="w-3.5 h-3.5 text-white fill-current" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 flex flex-col gap-1.5 mt-auto">
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1.5">
          {movie.genre && (
            <span className="text-[9px] bg-white/10 text-slate-300 border border-white/5 font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
              {movie.genre}
            </span>
          )}
          {movie.releaseDate && (
            <span className="text-[9px] bg-red-600/10 text-red-400 border border-red-500/20 font-semibold px-2 py-0.5 rounded-md font-mono">
              {movie.releaseDate.split("-")[0]}
            </span>
          )}
        </div>

        {/* Movie Title */}
        <h3 className="text-base md:text-lg font-bold text-slate-100 tracking-tight leading-tight group-hover:text-red-500 transition-colors duration-300">
          {movie.title}
        </h3>

        {/* Metadata Details */}
        <div className="flex flex-col gap-1 text-slate-400 text-xs border-t border-white/5 pt-2 mt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Director</span>
            <span className="text-slate-200 font-medium truncate max-w-[120px]">{movie.director}</span>
          </div>
          {movie.audienceCount && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Audience</span>
              <span className="text-red-400/90 font-mono font-medium text-[11px] truncate">{movie.audienceCount.replace("일일 ", "")}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
