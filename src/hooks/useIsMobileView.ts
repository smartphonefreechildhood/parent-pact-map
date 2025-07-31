import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768; // You can customize this

function useIsMobileView() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    }

    window.addEventListener('resize', handleResize);

    // Call handler initially in case component mounts after a resize
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default useIsMobileView;
