'use client';

import { Streamer } from '@/lib/types';
import FollowCard from './FollowCard';

interface FollowsCarouselProps {
  streamers: Streamer[];
  onAddClick: () => void;
  onRemove: (id: string) => void;
}

export default function FollowsCarousel({ streamers, onAddClick, onRemove }: FollowsCarouselProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-8 mb-4">
        <h2 className="text-xl font-bold text-zinc-100">Follows</h2>
        
        {/* 추가 버튼 */}
        <button
          onClick={onAddClick}
          className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-600 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* 여러 줄로 감기는 팔로우 리스트 */}
      <div className="px-8 pb-2">
        {streamers.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 w-full">
            팔로우한 스트리머가 없습니다
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {streamers.map((streamer) => (
              <FollowCard 
                key={streamer.id} 
                streamer={streamer} 
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
