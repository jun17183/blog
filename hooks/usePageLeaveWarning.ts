import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UsePageLeaveWarningProps {
  isDirty: boolean;
  message?: string;
}

/**
 * 페이지 이탈 시 경고를 표시하는 훅
 * - 브라우저 닫기/새로고침: beforeunload 이벤트
 * - Next.js 라우터 이동: router 이벤트
 */
export function usePageLeaveWarning({ 
  isDirty, 
  message = '작성 중인 내용이 있습니다. 정말 나가시겠습니까?' 
}: UsePageLeaveWarningProps) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  // 브라우저 닫기/새로고침 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);

  // Next.js 라우터 이동 시 경고
  useEffect(() => {
    // const handleRouteChangeStart = () => {
    //   if (isDirty && !isNavigatingRef.current) {
    //     const shouldLeave = window.confirm(message);
    //     if (!shouldLeave) {
    //       // 라우터 이벤트를 취소하는 방법이 없으므로
    //       // 현재 페이지에 머물도록 처리
    //       router.push(window.location.pathname);
    //       throw new Error('Route change cancelled');
    //     }
    //     isNavigatingRef.current = true;
    //   }
    // };

    // Next.js 13+ App Router에서는 router 이벤트가 제한적이므로
    // 대신 컴포넌트 레벨에서 처리
    return () => {
      isNavigatingRef.current = false;
    };
  }, [isDirty, message, router]);

  // 수동으로 페이지 이탈 확인
  const confirmLeave = (callback: () => void) => {
    if (isDirty) {
      const shouldLeave = window.confirm(message);
      if (shouldLeave) {
        isNavigatingRef.current = true;
        callback();
      }
    } else {
      callback();
    }
  };

  return {
    confirmLeave,
    isNavigating: isNavigatingRef.current,
  };
}
