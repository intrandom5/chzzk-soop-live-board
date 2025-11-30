import { Platform, Streamer, StreamerInput } from './types';

export interface StreamerApiResponse {
  platform: Platform;
  channelId: string;
  name: string;
  profileImage: string;
  isLive: boolean;
  title: string | null;
  thumbnail: string | null;
  broadNo: number | null;
  viewerCount: number;
  category: string | null;
}

export async function fetchStreamerInfo(
  platform: Platform,
  channelId: string
): Promise<StreamerApiResponse | null> {
  try {
    // 캐시 방지를 위해 타임스탬프 쿼리 파라미터 추가
    const timestamp = Date.now();
    const res = await fetch(`/api/${platform}/${channelId}?t=${timestamp}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch ${platform}/${channelId}: ${res.status}`);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${platform}/${channelId}:`, error);
    return null;
  }
}

export async function fetchAllStreamers(
  inputs: StreamerInput[]
): Promise<Streamer[]> {
  const results = await Promise.all(
    inputs.map(async (input) => {
      const data = await fetchStreamerInfo(input.platform, input.channelId);
      
      if (!data) {
        // API 실패 시 기본 정보 반환
        return {
          id: `${input.platform}-${input.channelId}`,
          platform: input.platform,
          channelId: input.channelId,
          name: `${input.channelId}`,
          profileImage: `https://via.placeholder.com/100x100/${input.platform === 'chzzk' ? '00C853' : '2196F3'}/ffffff?text=?`,
          isLive: false,
        } as Streamer;
      }
      
      return {
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
      } as Streamer;
    })
  );
  
  return results;
}
