import { isSupported } from 'firebase/messaging';
import { useState } from 'react';

export default function useMessagingSupported(): boolean {
  const [supported, setSupported] = useState<boolean>(false);
  isSupported().then(setSupported);

  return supported;
}
