'use client';

interface HeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function Header({ lastUpdated, isLoading, onRefresh }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header className="w-full py-6 px-8 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-emerald-400">Chzzk</span>
          <span className="text-zinc-400 mx-2">+</span>
          <span className="text-blue-400">Soop</span>
          <span className="text-zinc-100 ml-3">Live Board</span>
        </h1>
        
        <div className="flex items-center gap-4">
          {/* 마지막 업데이트 시간 */}
          {lastUpdated && (
            <span className="text-xs text-zinc-500">
              마지막 업데이트: {formatTime(lastUpdated)}
            </span>
          )}
          
          {/* 새로고침 버튼 */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all disabled:opacity-50"
            title="새로고침"
          >
            <svg 
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
