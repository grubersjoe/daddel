import { isSupported } from 'firebase/messaging';
import { useState } from 'react';

export default function useMessagingSupported(): boolean {
  const [supported, setSupported] = useState<boolean>(false);

  isSupported()
    .then(setSupported)
    .catch(() => {
      setSupported(false);
    });

  return supported;
}
