'use client';

import { useState } from 'react';
import { Platform } from '@/lib/types';

interface AddStreamerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (platform: Platform, channelId: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AddStreamerModal({ isOpen, onClose, onAdd }: AddStreamerModalProps) {
  const [platform, setPlatform] = useState<Platform>('chzzk');
  const [channelId, setChannelId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (channelId.trim()) {
      setIsAdding(true);
      setError(null);
      
      const result = await onAdd(platform, channelId.trim());
      
      if (result.success) {
        setChannelId('');
        onClose();
      } else {
        setError(result.error || '스트리머 추가에 실패했습니다.');
      }
      
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setChannelId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 백드롭 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* 모달 */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 className="text-lg font-bold text-zinc-100 mb-4">스트리머 추가</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 플랫폼 선택 */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              플랫폼
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPlatform('chzzk')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  platform === 'chzzk'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Chzzk
              </button>
              <button
                type="button"
                onClick={() => setPlatform('soop')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  platform === 'soop'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                SOOP
              </button>
            </div>
          </div>
          
          {/* 채널 ID 입력 */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              채널 ID
            </label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder={platform === 'chzzk' ? '치지직 채널 ID (32자리)' : 'SOOP 채널 ID'}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            
            {/* 에러 메시지 */}
            {error && (
              <div className="mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            {/* 도움말 */}
            <div className="mt-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              {platform === 'chzzk' ? (
                <div className="text-xs text-zinc-400 space-y-1">
                  <p className="font-medium text-zinc-300">채널 ID 찾는 방법:</p>
                  <p>1. 치지직에서 스트리머 채널 접속</p>
                  <p>2. URL에서 ID 복사</p>
                  <p className="text-zinc-500">예: chzzk.naver.com/live/<span className="text-emerald-400">bb382c2c0cc9fa7c...</span></p>
                </div>
              ) : (
                <div className="text-xs text-zinc-400 space-y-1">
                  <p className="font-medium text-zinc-300">채널 ID 찾는 방법:</p>
                  <p>1. SOOP에서 스트리머 채널 접속</p>
                  <p>2. URL에서 ID 복사</p>
                  <p className="text-zinc-500">예: sooplive.co.kr/<span className="text-blue-400">streamerid</span></p>
                </div>
              )}
            </div>
          </div>
          
          {/* 버튼들 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isAdding}
              className="flex-1 py-2 px-4 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!channelId.trim() || isAdding}
              className="flex-1 py-2 px-4 bg-zinc-100 text-zinc-900 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-400 border-t-zinc-900" />
                  추가 중...
                </>
              ) : (
                '추가'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
