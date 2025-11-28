'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Streamer, Platform, StreamerInput } from '@/lib/types';
import { getStoredStreamers, saveStreamers } from '@/lib/storage';
import { fetchAllStreamers, fetchStreamerInfo } from '@/lib/api';
import { useInterval } from './useInterval';

const REFRESH_INTERVAL = 30000; // 30초

export function useStreamers() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [streamerInputs, setStreamerInputs] = useState<StreamerInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 스트리머 데이터 로드
  const loadStreamers = useCallback(async (inputs: StreamerInput[]) => {
    if (inputs.length === 0) {
      setStreamers([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchAllStreamers(inputs);
      setStreamers(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load streamers:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    const stored = getStoredStreamers();
    setStreamerInputs(stored);
    loadStreamers(stored);
  }, [loadStreamers]);

  // 자동 갱신 (useInterval 훅 사용)
  useInterval(
    () => loadStreamers(streamerInputs),
    streamerInputs.length > 0 ? REFRESH_INTERVAL : null
  );

  // 스트리머 추가 - 성공 시 true, 실패 시 false 반환
  const addStreamer = useCallback(async (platform: Platform, channelId: string): Promise<{ success: boolean; error?: string }> => {
    // 중복 체크
    const exists = streamerInputs.some(
      s => s.platform === platform && s.channelId === channelId
    );
    if (exists) {
      return { success: false, error: '이미 추가된 스트리머입니다.' };
    }

    setIsLoading(true);

    // 먼저 API로 스트리머 정보 가져오기
    const data = await fetchStreamerInfo(platform, channelId);
    
    if (data) {
      const newStreamer: Streamer = {
        id: `${data.platform}-${data.channelId}`,
        platform: data.platform,
        channelId: data.channelId,
        name: data.name,
        profileImage: data.profileImage,
        isLive: data.isLive,
        title: data.title || undefined,
        thumbnail: data.thumbnail || undefined,
        viewerCount: data.viewerCount,
        category: data.category || undefined,
        broadNo: data.broadNo || undefined,
      };
      
      setStreamers(prev => [...prev, newStreamer]);
      
      // 로컬 스토리지에 저장
      const newInputs = [...streamerInputs, { platform, channelId }];
      setStreamerInputs(newInputs);
      saveStreamers(newInputs);
      setIsLoading(false);
      
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, error: '스트리머를 찾을 수 없습니다. 채널 ID를 확인해주세요.' };
    }
  }, [streamerInputs]);

  // 스트리머 삭제
  const removeStreamer = useCallback((id: string) => {
    const streamer = streamers.find(s => s.id === id);
    if (!streamer) return;

    setStreamers(prev => prev.filter(s => s.id !== id));
    
    const newInputs = streamerInputs.filter(
      s => !(s.platform === streamer.platform && s.channelId === streamer.channelId)
    );
    setStreamerInputs(newInputs);
    saveStreamers(newInputs);
  }, [streamers, streamerInputs]);

  // 수동 새로고침
  const refresh = useCallback(() => {
    setIsLoading(true);
    loadStreamers(streamerInputs);
  }, [streamerInputs, loadStreamers]);

  // 라이브 중인 스트리머 (시청자 수 내림차순 정렬)
  const liveStreamers = useMemo(
    () => streamers
      .filter(s => s.isLive)
      .sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0)),
    [streamers]
  );
  
  // 오프라인 스트리머
  const offlineStreamers = useMemo(
    () => streamers.filter(s => !s.isLive),
    [streamers]
  );

  // 모든 스트리머 (라이브 우선, 그 다음 오프라인)
  const allStreamers = useMemo(
    () => [...liveStreamers, ...offlineStreamers],
    [liveStreamers, offlineStreamers]
  );

  return {
    streamers,
    liveStreamers,
    offlineStreamers,
    allStreamers,
    isLoading,
    lastUpdated,
    addStreamer,
    removeStreamer,
    refresh,
  };
}
