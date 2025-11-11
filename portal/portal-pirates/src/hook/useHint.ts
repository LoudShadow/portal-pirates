import { useAsync } from 'react-use';

const hintPromiseCache = new Map<string, Promise<string | undefined>>();

const useHint = (merchant?: string, amount?: string, time?: string) => {
  const state = useAsync(async () => {
    if (!merchant || !amount || !time) {
      return;
    }

    const cacheKey = `${merchant}|${amount}|${time}`;

    if (hintPromiseCache.has(cacheKey)) {
      return hintPromiseCache.get(cacheKey);
    }

    const hintPromise = fetch('http://localhost:3001/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  }, [merchant, amount, time]);

  return state;
};

export default useHint;