'use client';

import { useEffect, useRef } from 'react';

/**
 * 일정 간격으로 콜백을 실행하는 커스텀 훅
 * @param callback 실행할 함수
 * @param delay 간격 (ms), null이면 비활성화
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // 최신 콜백 유지
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 인터벌 설정
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
