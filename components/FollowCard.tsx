'use client';

import { Streamer } from '@/lib/types';

interface FollowCardProps {
  streamer: Streamer;
  onRemove?: (id: string) => void;
}

export default function FollowCard({ streamer, onRemove }: FollowCardProps) {
  const platformBorderColor = streamer.platform === 'chzzk' 
    ? 'border-emerald-500/50 hover:border-emerald-400' 
    : 'border-blue-500/50 hover:border-blue-400';

  // 라이브 상태일 때 테두리 색상
  const liveBorderColor = 'border-red-500 hover:border-red-400';

  const handleClick = () => {
    const url = streamer.platform === 'chzzk'
      ? `https://chzzk.naver.com/${streamer.channelId}`
      : `https://sooplive.co.kr/${streamer.channelId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-2 group mt-1">
      {/* 원형 프로필 이미지 컨테이너 */}
      <div className="relative">
        {/* 라이브 링 애니메이션 */}
        {streamer.isLive && (
          <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />
        )}
        
        <div 
          className={`relative w-20 h-20 rounded-full border-2 ${streamer.isLive ? liveBorderColor : platformBorderColor} overflow-hidden cursor-pointer transition-all duration-200 group-hover:scale-105`}
          onClick={handleClick}
        >
          <img
            src={streamer.profileImage}
            alt={streamer.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 삭제 버튼 (원 위 우측 상단 작은 버튼, 원 바깥에 배치) */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(streamer.id);
            }}
            className="absolute -top-0 -right-3 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-700 z-20"
          >
            <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* 라이브 배지 - 원 바깥에 배치 */}
        {streamer.isLive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
            LIVE
          </div>
        )}
      </div>
      
      {/* 스트리머 이름 */}
      <span className="text-sm text-zinc-300 text-center max-w-[80px] truncate">
        {streamer.name}
      </span>
    </div>
  );
}
