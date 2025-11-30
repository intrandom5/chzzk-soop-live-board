'use client';

import { Streamer } from '@/lib/types';
import { useMemo } from 'react';

interface LiveCardProps {
  streamer: Streamer;
  refreshKey?: number; // 새로고침 시 변경되는 키
}

export default function LiveCard({ streamer, refreshKey }: LiveCardProps) {
  const platformColor = streamer.platform === 'chzzk' ? 'bg-emerald-500' : 'bg-blue-500';
  
  // 썸네일 URL에 타임스탬프 추가하여 브라우저 캐시 우회
  const thumbnailUrl = useMemo(() => {
    if (!streamer.thumbnail) return null;
    const separator = streamer.thumbnail.includes('?') ? '&' : '?';
    return `${streamer.thumbnail}${separator}t=${refreshKey || Date.now()}`;
  }, [streamer.thumbnail, refreshKey]);
  
  const formatViewerCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}만`;
    }
    return count.toLocaleString();
  };

  const handleClick = () => {
    const url = streamer.platform === 'chzzk'
      ? `https://chzzk.naver.com/live/${streamer.channelId}`
      : `https://play.sooplive.co.kr/${streamer.channelId}/${streamer.broadNo}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="w-full cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative rounded-xl overflow-hidden border-2 border-zinc-700 group-hover:border-zinc-500 transition-all duration-200">
        {/* 썸네일 */}
        <div className="relative aspect-video bg-zinc-800">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={streamer.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              No Thumbnail
            </div>
          )}
          
          {/* 시청자 수 뱃지 */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
            <span className="text-red-400">●</span>
            <span className="text-zinc-100 ml-1">
              {formatViewerCount(streamer.viewerCount || 0)}
            </span>
          </div>
          
          {/* 플랫폼 뱃지 */}
          <div className={`absolute top-2 left-2 ${platformColor} px-2 py-0.5 rounded text-xs font-bold text-white`}>
            {streamer.platform === 'chzzk' ? 'CHZZK' : 'SOOP'}
          </div>
          
          {/* 라이브 인디케이터 */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-xs font-bold text-white">
            <span className="animate-pulse">●</span> LIVE
          </div>
        </div>
      </div>

      {/* 스트리머 정보 + 프로필 아이콘 */}
      <div className="mt-2 px-1 flex gap-3 items-start">
        {/* 프로필 아이콘 */}
        {streamer.profileImage && (
          <div className="flex-shrink-0">
            <img
              src={streamer.profileImage}
              alt={streamer.name}
              className="w-10 h-10 rounded-full border border-zinc-600 object-cover"
            />
          </div>
        )}

        {/* 텍스트 정보들 */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-100 truncate">
            {streamer.name}
          </p>
          
          {/* 제목 + hover 툴팁 */}
          <div className="relative group/title w-full">
            <p className="text-sm text-white-400 truncate">
              {streamer.title ?? '방송 제목 없음'}
            </p>
            {/* 툴팁: hover 시 전체 제목 표시 */}
            {streamer.title && (
              <div className="pointer-events-none absolute left-0 z-20 mt-1 hidden max-w-xs rounded-md bg-black/90 px-3 py-2 text-xs text-zinc-100 shadow-lg ring-1 ring-zinc-700 group-hover/title:block">
                {streamer.title}
              </div>
            )}
          </div>
          
          {/* 카테고리 - 둥근 네모 배지 */}
          {streamer.category && (
            <div className="mt-1">
              <span className="inline-flex max-w-full items-center rounded-full bg-zinc-800/80 px-2 py-0.5 text-[11px] text-zinc-300 border border-zinc-700">
                <span className="truncate">{streamer.category}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
