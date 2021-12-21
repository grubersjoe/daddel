import { useState } from 'react';
import { isSupported } from 'firebase/messaging';

export default function useMessagingSupported(): boolean {
  const [supported, setSupported] = useState<boolean>(false);
  isSupported().then(setSupported);

  return supported;
}
