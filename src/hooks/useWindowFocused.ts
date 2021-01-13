import { useState, useEffect } from 'react';

export default function useWindowFocused() {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    // SSR friendly
    setFocused(document.hasFocus());

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return focused;
}
