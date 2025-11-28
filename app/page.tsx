'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LiveCarousel from '@/components/LiveCarousel';
import FollowsCarousel from '@/components/FollowsCarousel';
import AddStreamerModal from '@/components/AddStreamerModal';
import { useStreamers } from '@/hooks/useStreamers';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    liveStreamers, 
    allStreamers, 
    isLoading, 
    lastUpdated,
    addStreamer, 
    removeStreamer,
    refresh,
  } = useStreamers();

  return (
    <main className="min-h-screen">
      <Header 
        lastUpdated={lastUpdated} 
        isLoading={isLoading} 
        onRefresh={refresh} 
      />
      
      <div className="max-w-7xl mx-auto">
        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-zinc-800/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-zinc-700">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-500 border-t-zinc-200" />
              <span className="text-sm text-zinc-300">업데이트 중...</span>
            </div>
          </div>
        )}
        
        {/* 라이브 섹션 */}
        <LiveCarousel streamers={liveStreamers} />
        
        {/* 구분선 */}
        <div className="mx-8 border-t border-zinc-800" />
        
        {/* 팔로우 섹션 (라이브 + 오프라인) */}
        <FollowsCarousel 
          streamers={allStreamers}
          onAddClick={() => setIsModalOpen(true)}
          onRemove={removeStreamer}
        />
      </div>
      
      {/* 스트리머 추가 모달 */}
      <AddStreamerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addStreamer}
      />
    </main>
  );
}
