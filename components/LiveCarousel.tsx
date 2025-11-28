'use client';

import { Streamer } from '@/lib/types';
import LiveCard from './LiveCard';

interface LiveCarouselProps {
  streamers: Streamer[];
}

export default function LiveCarousel({ streamers }: LiveCarouselProps) {
  if (streamers.length === 0) {
    return (
      <section className="py-6">
        <h2 className="text-xl font-bold text-zinc-100 mb-4 px-8">Live</h2>
        <div className="px-8 py-12 text-center text-zinc-500">
          현재 라이브 중인 스트리머가 없습니다
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <h2 className="text-xl font-bold text-zinc-100 mb-4 px-8">Live</h2>

      {/* 멀티 라인 그리드 레이아웃 */}
      <div className="px-8 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {streamers.map((streamer) => (
            <LiveCard key={streamer.id} streamer={streamer} />
          ))}
        </div>
      </div>
    </section>
  );
}
