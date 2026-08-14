import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 라우트(pathname)가 바뀔 때마다 스크롤을 맨 위로 올려줍니다.
// React Router는 페이지 이동 시 스크롤 위치를 자동으로 초기화하지 않기 때문에,
// 내용이 긴 화면(예: 처방전 결과 확인)으로 이동하면 이전 화면의 스크롤 위치가
// 그대로 유지되어 상단이 잘려 보이는 문제가 생깁니다.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;