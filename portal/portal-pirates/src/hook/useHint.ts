/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAsync } from 'react-use';
import { useAuth } from '../Components/AuthContext';

const hintPromiseCache = new Map<string, Promise<string | undefined>>();

const useHint = (merchant?: string, amount?: string, time?: string) => {
  const { token } = useAuth();

  const state = useAsync(async () => {
    if (!merchant || !amount || !time || !token) {
      return;
    }

    const cacheKey = `${merchant}|${amount}|${time}`;

    if (hintPromiseCache.has(cacheKey)) {
      return hintPromiseCache.get(cacheKey);
    }

    const backendUrl = (window as any).BACKEND_URL;
    const finalBackendUrl = (!backendUrl || backendUrl === "__BACKEND_URL_PLACEHOLDER__") 
      ? 'http://localhost:3001' 
      : backendUrl;

    const hintPromise = fetch(`${finalBackendUrl}/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        merchant,
        amount,
        time,
      }),
    }).then(async (response) => {
      if (!response.ok) {
        hintPromiseCache.delete(cacheKey);
        throw new Error(`Error fetching hint: ${response.statusText}`);
      }
      const data = await response.json();
      return data.hint;
    });

    hintPromiseCache.set(cacheKey, hintPromise);

    return hintPromise;
  }, [merchant, amount, time, token]);

  return state;
};

export default useHint;