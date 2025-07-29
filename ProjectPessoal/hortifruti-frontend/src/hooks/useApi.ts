// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

type ApiFunction<T> = (...args: any[]) => Promise<T>;

export function useApi<T>(apiFunc: ApiFunction<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na requisição.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, request };
}