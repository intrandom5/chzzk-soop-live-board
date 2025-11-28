import { NextRequest, NextResponse } from 'next/server';

interface SoopStationInfo {
  profile_image?: string;
  station: {
    user_id: string;
    user_nick: string;
    station_name: string;
    station_title: string;
    profile_image?: string;
  };
  broad: {
    broad_no: number;
    broad_title: string;
    current_sum_viewer: number;
    broad_grade: number;
    is_password: boolean;
  } | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  
  try {
    // 1. 스테이션(채널) 정보 가져오기
    const stationRes = await fetch(
      `https://chapi.sooplive.co.kr/api/${channelId}/station`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://www.sooplive.co.kr/',
        },
        cache: 'no-store',
      }
    );
    
    if (!stationRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch station info' },
        { status: stationRes.status }
      );
    }
    
    const stationData: SoopStationInfo = await stationRes.json();
    
    if (!stationData.station) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }
    
    const isLive = stationData.broad !== null;
    let viewerCount = 0;
    let thumbnail = null;
    
    // 2. 라이브 중인 경우 추가 정보 가져오기
    if (isLive && stationData.broad) {
      viewerCount = stationData.broad.current_sum_viewer || 0;
      
      // 썸네일 URL 구성
      const broadNo = stationData.broad.broad_no;
      thumbnail = `https://liveimg.sooplive.co.kr/m/${broadNo}`;
    }
    
    // 3. 프로필 이미지 URL 구성
    let profileImageUrl = `https://res.sooplive.co.kr/images/afmain/img_thumb_profile.gif`; // 기본 이미지
    
    if (stationData.profile_image) {
      profileImageUrl = `https:${stationData.profile_image}`;
    }
    
    // 4. 응답 데이터 구성
    const response = {
      platform: 'soop',
      channelId: stationData.station.user_id,
      name: stationData.station.user_nick,
      profileImage: profileImageUrl,
      isLive,
      title: stationData.broad?.broad_title || null,
      thumbnail,
      viewerCount,
      broadNo: stationData.broad?.broad_no || null,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('SOOP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
