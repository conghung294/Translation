import { useEffect, useState } from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value]);

  return debounceValue;
};

export default useDebounce;
