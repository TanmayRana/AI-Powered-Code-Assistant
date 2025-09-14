"use client";
import ReactCardFlip from "react-card-flip";
import { Card } from "@/components/ui/card";

const FlashcardItem = ({ isFlipped, handleClick, data }: any) => {
  return (
    <div className="flex items-center justify-center p-4">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        {/* Front of card */}
        <Card
          className="relative group cursor-pointer h-[280px] w-[220px] md:h-[380px] md:w-[320px] 
          bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 
          dark:from-blue-500 dark:via-blue-600 dark:to-blue-700
          text-white shadow-2xl hover:shadow-3xl 
          dark:shadow-blue-900/50 dark:hover:shadow-blue-800/60
          transition-all duration-300 ease-out
          hover:scale-105 hover:-translate-y-2
          border-0 overflow-hidden"
          onClick={handleClick}
        >
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20 dark:bg-white/30"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-white/15 dark:bg-white/25"></div>
            <div className="absolute top-1/2 left-4 w-4 h-4 rounded-full bg-white/10 dark:bg-white/20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/20 dark:bg-white/30 flex items-center justify-center">
                <span className="text-xl">🤔</span>
              </div>
            </div>
            <h2 className="text-lg md:text-xl font-semibold leading-relaxed">
              {data.front}
            </h2>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="text-xs opacity-75 flex items-center gap-1">
                <span>Click to reveal</span>
                <span className="animate-bounce">👆</span>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/20 to-blue-400/0 
          dark:from-blue-300/0 dark:via-blue-200/30 dark:to-blue-300/0
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </Card>

        {/* Back of card */}
        <Card
          className="relative group cursor-pointer h-[280px] w-[220px] md:h-[380px] md:w-[320px]
          bg-gradient-to-br from-emerald-50 via-white to-emerald-50
          dark:from-emerald-900/30 dark:via-slate-800 dark:to-emerald-900/30
          text-emerald-800 dark:text-emerald-100 shadow-2xl hover:shadow-3xl
          dark:shadow-emerald-900/50 dark:hover:shadow-emerald-800/60
          transition-all duration-300 ease-out
          hover:scale-105 hover:-translate-y-2
          border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden"
          onClick={handleClick}
        >
          <div className="absolute inset-0 opacity-5 dark:opacity-15">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-emerald-400 dark:bg-emerald-300"></div>
            <div className="absolute top-1/2 left-4 w-4 h-4 rounded-full bg-emerald-300 dark:bg-emerald-200"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
            </div>
            <h2 className="text-lg md:text-xl font-semibold leading-relaxed text-balance">
              {data.back}
            </h2>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="text-xs opacity-75 flex items-center gap-1">
                <span>Click to flip back</span>
                <span className="animate-pulse">🔄</span>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-r from-emerald-200/0 via-emerald-100/30 to-emerald-200/0 
          dark:from-emerald-600/0 dark:via-emerald-500/20 dark:to-emerald-600/0
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </Card>
      </ReactCardFlip>
    </div>
  );
};

export default FlashcardItem;
