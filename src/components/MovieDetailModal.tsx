import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MovieDetail, CastMember, Recommendation } from "../types";
import { X, Play, Sparkles, Star, Users, Film, Compass, Bookmark, ExternalLink } from "lucide-react";

interface MovieDetailModalProps {
  movieTitle: string;
  rank: number;
  onClose: () => void;
}

export default function MovieDetailModal({ movieTitle, rank, onClose }: MovieDetailModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/movie/detail?title=${encodeURIComponent(movieTitle)}`);
        if (!response.ok) {
          throw new Error("상세 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        if (active) {
          setDetail(data);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching detail:", err);
        if (active) {
          setError(err.message || "오류가 발생했습니다.");
          setLoading(false);
        }
      }
    };

    fetchMovieDetail();
    return () => {
      active = false;
    };
  }, [movieTitle]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Handle click on external YouTube Trailer Link
  const handleWatchTrailer = () => {
    if (!detail) return;
    const searchQuery = encodeURIComponent(detail.trailerQuery);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank", "noopener,noreferrer");
  };

  const getActorInitials = (name: string) => {
    if (!name) return "";
    return name.slice(0, 2);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-zoom-out"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          className="relative w-full max-w-4xl bg-[#0D0D10] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/80 overflow-hidden z-10 max-h-[90vh] md:max-h-[85vh] flex flex-col"
        >
          {loading ? (
            /* Sleek skeleton loading design matching the theme */
            <div className="p-8 md:p-12 flex flex-col gap-6 w-full animate-pulse h-[400px] justify-center items-center">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="w-10 h-10 text-red-500 animate-spin" />
                <p className="font-mono text-xs text-red-500 tracking-widest mt-2 uppercase">GENI-AI ENRICHING DATA...</p>
                <h3 className="text-xl font-bold font-sans text-slate-100 tracking-tight text-center">{movieTitle} 영화 상세 분석 중...</h3>
              </div>
              <div className="w-48 h-2 px-1 bg-[#141418] rounded-full overflow-hidden mt-4">
                <div className="w-2/3 h-full bg-red-650 rounded-full" />
              </div>
            </div>
          ) : error || !detail ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-4 h-[350px]">
              <Film className="w-12 h-12 text-zinc-600" />
              <p className="text-zinc-400 font-medium">상세 정보를 불러오지 못했습니다.</p>
              <button 
                onClick={onClose} 
                className="bg-red-600 hover:bg-red-705 text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/10 transition-all font-sans cursor-pointer"
              >
                닫기
              </button>
            </div>
          ) : (
            <>
              {/* Top Banner Cover themed around the movie's primary style */}
              <div 
                className="relative h-44 md:h-56 p-6 md:p-8 flex flex-col justify-end overflow-hidden border-b border-white/10"
                style={{
                  background: `linear-gradient(to top, rgba(9, 9, 11, 1) 0%, rgba(9, 9, 11, 0.4) 60%), linear-gradient(135deg, ${detail.visualTheme.primaryColor || "#fc1e26"}40 0%, #09090b 100%)`
                }}
              >
                {/* Floating ambient light globes */}
                <div 
                  className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] opacity-40 mix-blend-color-dodge transition-all"
                  style={{ backgroundColor: detail.visualTheme.primaryColor }}
                />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full border border-white/5 backdrop-blur-md transition-all cursor-pointer"
                  title="닫기"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                {/* Header Information */}
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-red-650 text-white font-black text-[10px] px-3 py-1 rounded shadow-lg shadow-red-950/40 tracking-wider">
                      BOX OFFICE {rank}위
                    </span>
                    <span className="bg-[#141418] border border-white/10 text-slate-300 font-bold text-[10px] px-2.5 py-1 rounded tracking-wide uppercase">
                      {detail.visualTheme.mood}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {detail.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-400 font-sans text-xs md:text-sm">
                    {detail.directors?.length > 0 && (
                      <p>
                        <span className="text-zinc-500 font-medium">감독</span>{" "}
                        <span className="text-zinc-200 font-semibold">{detail.directors.join(", ")}</span>
                      </p>
                    )}
                    <span className="text-zinc-700 select-none hidden md:inline">|</span>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-amber-400 font-extrabold font-mono text-sm">{detail.rating}</span>
                      <span className="text-zinc-500 text-xs">/10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto min-h-0 bg-[#0D0D10]">
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  
                  {/* Left Column (2-cols on desktop) – Plot, Highlights, Trivia */}
                  <div className="md:col-span-2 flex flex-col gap-6">
                    
                    {/* Synopsis */}
                    <div className="bg-[#08080A] border border-white/10 rounded-2xl p-6">
                      <h2 className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase flex items-center gap-1.5 mb-4">
                        <Film className="w-3.5 h-3.5" /> Movie Synopsis & Plot
                      </h2>
                      <p className="text-slate-300 leading-relaxed text-sm md:text-base font-sans font-normal">
                        {detail.sysnopsis}
                      </p>
                    </div>

                    {/* Movie Highlights Grid */}
                    <div>
                      <h2 className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase flex items-center gap-1.5 mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Key Focus & Highlights
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {detail.highlights?.map((highlight, idx) => (
                          <div 
                            key={idx} 
                            className="bg-gradient-to-br from-[#08080A] to-[#141418]/20 border border-white/10 rounded-xl p-4 flex flex-col justify-between"
                            style={{ borderLeft: `3px solid ${detail.visualTheme.primaryColor || "#e11d48"}` }}
                          >
                            <span className="text-[10px] font-mono font-bold text-zinc-500">POINT 0{idx + 1}</span>
                            <p className="text-xs font-sans font-semibold text-slate-300 tracking-tight mt-2 leading-snug">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Behind the scenes Fun Facts */}
                    {detail.funFacts && detail.funFacts.length > 0 && (
                      <div className="border border-white/5 bg-[#08080A]/80 rounded-xl p-5">
                        <span className="text-amber-500 font-bold text-xs tracking-[0.15em] uppercase font-mono flex items-center gap-1">
                          🎬 Behind the Scenes / 비하인드 스토리
                        </span>
                        <ul className="list-disc list-inside text-slate-400 font-sans text-xs md:text-sm mt-3 flex flex-col gap-2.5">
                          {detail.funFacts.map((fact, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {fact}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column – Cast Profiles, Actions & Recommendations */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Action Button: Trailer */}
                    <button
                      onClick={handleWatchTrailer}
                      className="w-full bg-red-650 hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-lg border border-white/10 shadow-lg shadow-red-950/20 flex items-center justify-center gap-3 transition-all hover:scale-102 cursor-pointer uppercase tracking-widest text-xs"
                    >
                      <Play className="w-4 h-4 fill-current animate-pulse" />
                      <span>Watch Official Trailer</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    {/* Cast List */}
                    <div className="bg-[#08080A] border border-white/10 rounded-2xl p-5">
                      <h2 className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase flex items-center gap-1.5 mb-4 border-b border-white/5 pb-2">
                        <Users className="w-3.5 h-3.5" /> Starring Cast
                      </h2>
                      <div className="flex flex-col gap-3">
                        {detail.cast?.map((actor, idx) => (
                          <div key={idx} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                            {/* Profile Placeholder Avatar */}
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase"
                              style={{
                                background: `linear-gradient(135deg, ${detail.visualTheme.primaryColor || "#334155"}cc 0%, #1c1c24 100%)`,
                                border: "1px solid rgba(255, 255, 255, 0.1)"
                              }}
                            >
                              <span className="text-slate-300 font-bold">{getActorInitials(actor.actor)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-200 truncate">{actor.actor}</p>
                              <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">역: {actor.character}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Movie Recommendations */}
                    {detail.recommendations && detail.recommendations.length > 0 && (
                      <div className="bg-[#08080A]/60 border border-white/10 rounded-2xl p-5">
                        <h2 className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase flex items-center gap-1.5 mb-3 border-b border-white/5 pb-2">
                          <Compass className="w-3.5 h-3.5" /> Movie Recommendations
                        </h2>
                        <div className="flex flex-col gap-3">
                          {detail.recommendations.map((rec, idx) => (
                            <div key={idx} className="bg-[#141418] p-3 rounded-lg border border-white/5">
                              <p className="text-[11px] font-bold text-slate-200 uppercase">{rec.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-1 leading-normal">
                                {rec.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Modal visual footer branding */}
              <div className="bg-[#08080A] p-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-zinc-600 tracking-wider">
                <span>GEMINI AI ENRICHMENT INTERFACE v2.0</span>
                <span>KOREAN FILMS CORNER</span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
