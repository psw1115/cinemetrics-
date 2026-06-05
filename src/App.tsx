import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Film, Search, Flame, Sparkles, Clock, RefreshCw, Layers } from "lucide-react";
import { Movie } from "./types";
import DateSelector from "./components/DateSelector";
import MovieCard from "./components/MovieCard";
import MovieDetailModal from "./components/MovieDetailModal";

export default function App() {
  // Yesterday logic relative to 2026-06-05
  const baseDate = new Date("2026-06-05");
  const yesterday = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
  
  const formatYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(formatYMD(yesterday));
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<{ title: string; rank: number; movieCd?: string } | null>(null);

  // Fetch box office data
  useEffect(() => {
    let active = true;
    const fetchBoxOffice = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/boxoffice?date=${selectedDate}`);
        if (!response.ok) {
          throw new Error("데이터를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        if (active) {
          if (data && data.movies) {
            // Sort by rank ascending
            const sortedMovies = [...data.movies].sort((a, b) => a.rank - b.rank);
            setMovies(sortedMovies);
          } else {
            setMovies([]);
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Fetch box office error:", err);
        if (active) {
          setError(err.message || "오류가 발생했습니다.");
          setLoading(false);
        }
      }
    };

    fetchBoxOffice();
    return () => {
      active = false;
    };
  }, [selectedDate]);

  // Filter movies by search query
  const filteredMovies = useMemo(() => {
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (movie.genre && movie.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movies, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-slate-100 font-sans antialiased relative overflow-x-hidden selection:bg-red-600 selection:text-white pb-16">
      {/* Dynamic Animated Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft elegant red glowing atmospheric blob in the top-right corner as specified in the HTML style */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse duration-10000" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6 flex flex-col gap-6 md:gap-8">
        
        {/* Brand Header matching CineMetrics style */}
        <header className="min-h-20 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 bg-[#0D0D0F]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center font-bold text-xl italic tracking-tighter shadow-lg shadow-red-600/20">K</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase font-serif">
                CineMetrics <span className="text-red-500 font-normal">BoxOffice</span>
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">Powered by Gemini AI Insight</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
            {/* Live indicator & date display */}
            <div className="flex items-center gap-6 text-right self-end sm:self-auto">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Selected Date</span>
                <span className="text-lg font-mono text-zinc-200">{selectedDate.replace(/-/g, ".")}</span>
              </div>
            </div>

            {/* Premium Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="영화명, 감독, 장르 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#08080A] hover:bg-[#141418] focus:bg-[#141418] border border-white/10 focus:border-red-600/60 rounded-full py-2.5 pl-10 pr-4 text-xs font-medium text-slate-100 placeholder-zinc-500 focus:outline-none transition-all focus:ring-1 focus:ring-red-600/20"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[9px] text-zinc-500 hover:text-zinc-300 font-bold font-mono"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Selector Timeline component */}
        <section className="w-full">
          <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />
        </section>

        {/* Box Office Grid Section */}
        <main className="w-full flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-zinc-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" /> TOP RANKINGS
            </h3>
            {searchQuery ? (
              <span className="text-xs text-red-500 font-mono font-bold uppercase tracking-wider">
                RESULTS: {filteredMovies.length} MATCHES
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] rounded-full font-bold uppercase tracking-wider">
                Live Updates
              </span>
            )}
          </div>

          {loading ? (
            /* Super sleek Skeleton placeholders */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, index) => (
                <div 
                  key={index} 
                  className="w-full aspect-[2/3] md:aspect-[3/4.2] rounded-xl bg-[#08080A] border border-white/10 animate-pulse p-6 flex flex-col justify-between"
                >
                  <div className="w-10 h-10 bg-[#141418] rounded-lg" />
                  <div className="space-y-3">
                    <div className="h-4 bg-[#141418] rounded-md w-3/4" />
                    <div className="h-3 bg-[#141418] rounded-md w-1/2" />
                    <div className="h-2 bg-[#141418] rounded-md w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Beautiful Error Screen */
            <div className="w-full rounded-2xl bg-[#08080A] border border-white/10 p-12 text-center flex flex-col items-center justify-center gap-4">
              <Layers className="w-12 h-12 text-zinc-700" />
              <h4 className="text-lg font-bold text-zinc-300">랭킹 데이터를 가져오지 못했습니다.</h4>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">{error}</p>
              <button 
                onClick={() => setSelectedDate(selectedDate)}
                className="mt-2 flex items-center gap-2 bg-[#141418] hover:bg-[#1a1a22] text-zinc-200 text-xs font-semibold px-5 py-2.5 rounded-full border border-white/10 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 다시 시도하기
              </button>
            </div>
          ) : filteredMovies.length === 0 ? (
            /* Beautiful Empty Screen */
            <div className="w-full rounded-2xl bg-[#08080A] border border-white/5 p-12 text-center flex flex-col items-center justify-center gap-3">
              <Clock className="w-10 h-10 text-red-500/80" />
              <h4 className="text-lg font-bold text-zinc-300">표시할 영화 정보가 없습니다.</h4>
              <p className="text-sm text-zinc-500">선택하신 날짜 또는 검색어에 대한 박스오피스 상영 목록이 존재하지 않습니다.</p>
            </div>
          ) : (
            /* Bento Responsive Layout */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredMovies.map((movie) => (
                  <MovieCard 
                    key={movie.title}
                    movie={movie}
                    onClick={() => setSelectedMovie({ title: movie.title, rank: movie.rank, movieCd: movie.movieCd })}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>

        {/* Footer info branding */}
        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-[10px] font-mono gap-4 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>CineMetrics Platform & Gemini 3.5-flash AI Enrichment</span>
          </div>
          <div className="text-center md:text-right">
            <p>Korean Film Council Sync</p>
          </div>
        </footer>
      </div>

      {/* Movie Details Modal Overlay */}
      {selectedMovie && (
        <MovieDetailModal
          movieTitle={selectedMovie.title}
          rank={selectedMovie.rank}
          movieCd={selectedMovie.movieCd}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
