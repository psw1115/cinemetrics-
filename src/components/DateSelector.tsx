import React, { useState } from "react";
// We build our own date helpers in vanilla JS to avoid adding extra npm dependencies! This is lighter and prevents any installation failures.
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onChange }: DateSelectorProps) {
  // Generate the last 10 days for fast tabs, centered around 2026-06-04 (yesterday)
  // We parse selectedDate in base date format
  const baseDate = new Date("2026-06-05"); // Today's date relative to metadata
  const yesterday = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);

  const formatToYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDayLabel = (d: Date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[d.getDay()];
  };

  // Generate rapid tabs (past 8 days from yesterday)
  const tabs: { dateStr: string; label: string; dayOfWeek: string; isYesterday: boolean }[] = [];
  for (let i = 0; i < 8; i++) {
    const d = new Date(yesterday.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = formatToYMD(d);
    const isYesterday = i === 0;
    tabs.push({
      dateStr,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      dayOfWeek: getDayLabel(d),
      isYesterday
    });
  }

  // Reverse tabs to show chronologically if desired, or keep as is. Let's show recent first
  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    const prev = new Date(current.getTime() - 24 * 60 * 60 * 1000);
    onChange(formatToYMD(prev));
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    // Let's cap at yesterday (2026-06-04)
    const next = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    if (next.getTime() <= yesterday.getTime()) {
      onChange(formatToYMD(next));
    }
  };

  const displayDateText = () => {
    const parts = selectedDate.split("-");
    if (parts.length !== 3) return selectedDate;
    return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Date Header & Quick Nav with Sophisticated border-white/10 */}
      <div className="flex items-center justify-between bg-[#08080A] border border-white/10 rounded-2xl p-5 md:px-7">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-red-500" />
          <div className="flex flex-col">
            <span className="font-mono text-zinc-500 text-[9px] tracking-[0.2em]">SELECTED INQUIRY DATE</span>
            <h2 className="text-base md:text-lg font-bold text-slate-100 mt-0.5">
              {displayDateText()}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom HTML date input with styled button wrapper */}
          <div className="relative group">
            <input
              type="date"
              value={selectedDate}
              max={formatToYMD(yesterday)}
              onChange={(e) => {
                if (e.target.value) onChange(e.target.value);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <button className="flex items-center gap-2 bg-[#141418] hover:bg-[#1a1a22] text-slate-300 font-medium text-xs px-4 py-2 border border-white/10 rounded-full transition-all cursor-pointer">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              날력선택
            </button>
          </div>

          <button
            onClick={handlePrevDay}
            className="p-2.5 bg-[#141418] hover:bg-[#1a1a22] border border-white/10 text-slate-300 rounded-full transition-all cursor-pointer"
            title="이전 날짜"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextDay}
            disabled={selectedDate === formatToYMD(yesterday)}
            className="p-2.5 bg-[#141418] hover:bg-[#1a1a22] border border-white/10 text-slate-300 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="다음 날짜"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Recent Dates Slider */}
      <div className="w-full">
        <p className="text-[10px] text-zinc-500 font-bold mb-3 uppercase tracking-[0.2em] pl-1">빠른 미디움 선택 (최근 일주일)</p>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x select-none">
          {tabs.map((tab) => {
            const isSelected = tab.dateStr === selectedDate;
            return (
              <button
                key={tab.dateStr}
                onClick={() => onChange(tab.dateStr)}
                className={`relative flex-shrink-0 snap-start flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-b from-red-600/15 to-red-950/5 border-red-600 text-red-500 shadow-xl shadow-red-950/30 scale-102 font-bold"
                    : "bg-[#08080A] hover:bg-[#141418] border-white/5 text-slate-400 hover:text-slate-100"
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                  {tab.dayOfWeek}
                </span>
                <span className="text-base font-extrabold mt-1 font-mono">
                  {tab.label.split("/")[1]}
                </span>
                <span className="text-[9px] font-mono opacity-80 mt-1 scale-90">
                  {tab.label.split("/")[0]}월
                </span>
                {tab.isYesterday && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-[8px] text-white font-extrabold px-1.5 py-0.5 rounded-full scale-75 uppercase tracking-tighter">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
