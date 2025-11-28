import { NextRequest, NextResponse } from 'next/server';

interface ChzzkLiveStatus {
  code: number;
  message: string | null;
  content: {
    liveTitle: string;
    status: string;
    concurrentUserCount: number;
    accumulateCount: number;
    openDate: string;
    closeDate: string | null;
    adult: boolean;
    chatChannelId: string;
    categoryType: string;
    liveCategory: string;
    liveCategoryValue: string;
    liveImageUrl: string;
    defaultThumbnailImageUrl: string | null;
    faultStatus: string | null;
  } | null;
}

interface ChzzkChannelInfo {
  code: number;
  message: string | null;
  content: {
    channelId: string;
    channelName: string;
    channelImageUrl: string;
    verifiedMark: boolean;
    channelDescription: string;
    followerCount: number;
    openLive: boolean;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  
  try {
    // 1. 채널 기본 정보 가져오기
    const channelRes = await fetch(
      `https://api.chzzk.naver.com/service/v1/channels/${channelId}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://chzzk.naver.com/',
          'Accept': 'application/json, text/plain, */*',
        },
        cache: 'no-store',
      }
    );
    
    if (!channelRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch channel info' },
        { status: channelRes.status }
      );
    }
    
    const channelData: ChzzkChannelInfo = await channelRes.json();
    
    if (!channelData.content) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }
    
    // 2. 라이브 상태인 경우 라이브 정보 가져오기
    let liveData: ChzzkLiveStatus | null = null;
    
    if (channelData.content.openLive) {
      // 먼저 v3 live-detail API 시도 (썸네일 포함)
      const liveDetailRes = await fetch(
        `https://api.chzzk.naver.com/service/v3/channels/${channelId}/live-detail`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://chzzk.naver.com/',
            'Accept': 'application/json, text/plain, */*',
          },
          cache: 'no-store',
        }
      );
      
      if (liveDetailRes.ok) {
        liveData = await liveDetailRes.json();
      } else {
        // v3 실패 시 v2 polling API 사용 (썸네일 없음)
        const liveRes = await fetch(
          `https://api.chzzk.naver.com/polling/v2/channels/${channelId}/live-status`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Referer': 'https://chzzk.naver.com/',
              'Accept': 'application/json, text/plain, */*',
            },
            cache: 'no-store',
          }
        );
        
        if (liveRes.ok) {
          liveData = await liveRes.json();
        } else {
          console.error(`Failed to fetch Chzzk live status: ${liveRes.status}`);
        }
      }
    }
    
    // 3. 응답 데이터 구성
    const response = {
      platform: 'chzzk',
      channelId: channelData.content.channelId,
      name: channelData.content.channelName,
      profileImage: channelData.content.channelImageUrl,
      isLive: channelData.content.openLive,
      title: liveData?.content?.liveTitle || null,
      thumbnail: liveData?.content?.liveImageUrl?.replace('{type}', '480') || null,
      viewerCount: liveData?.content?.concurrentUserCount || 0,
      category: liveData?.content?.liveCategoryValue || null,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chzzk API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
