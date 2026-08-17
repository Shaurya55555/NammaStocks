import { useState, useEffect } from 'react';
import { dashboardApi, NewsSentimentResponse, TopGainersLosers, CompanyOverview } from '../api/Dashboard';
import { ApiError } from '../api/http';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export const useNewsSentimentFinnhub = (ticker: string) => {
  const [state, setState] = useState<UseApiState<NewsSentimentResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const data = await dashboardApi.getNewsSentimentFinnhub(ticker);
        setState({ data, loading: false, error: null });
      } catch (err) {
        const error = err instanceof ApiError ? err : new ApiError(500, 'Unknown error');
        setState({ data: null, loading: false, error });
      }
    };

    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  return state;
};

export const useTopGainersLosers = () => {
  const [state, setState] = useState<UseApiState<TopGainersLosers>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const data = await dashboardApi.getTopGainersLosers();
        setState({ data, loading: false, error: null });
      } catch (err) {
        const error = err instanceof ApiError ? err : new ApiError(500, 'Unknown error');
        setState({ data: null, loading: false, error });
      }
    };

    fetchData();
  }, []);

  return state;
};

export const useCompanyOverview = (symbol: string) => {
  const [state, setState] = useState<UseApiState<CompanyOverview>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const data = await dashboardApi.getCompanyOverview(symbol);
        setState({ data, loading: false, error: null });
      } catch (err) {
        const error = err instanceof ApiError ? err : new ApiError(500, 'Unknown error');
        setState({ data: null, loading: false, error });
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  return state;
};

export const useNewsSentiment = (topics: string) => {
  const [state, setState] = useState<UseApiState<NewsSentimentResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState({ data: null, loading: true, error: null });
        const data = await dashboardApi.getNewsSentiment(topics);
        setState({ data, loading: false, error: null });
      } catch (err) {
        const error = err instanceof ApiError ? err : new ApiError(500, 'Unknown error');
        setState({ data: null, loading: false, error });
      }
    };

    if (topics) {
      fetchData();
    }
  }, [topics]);

  return state;
};
