import { useEffect } from 'react';

function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | JobPortal` : 'JobPortal';
  }, [title]);
}

export default usePageTitle;
