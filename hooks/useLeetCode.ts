import useSWR from 'swr';

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: RecentSubmission[];
}

export interface RecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useLeetCode() {
  const { data, error, isLoading, mutate } = useSWR<LeetCodeStats>(
    '/api/leetcode',
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  return {
    stats: data,
    error,
    isLoading,
    refresh: mutate,
  };
}
