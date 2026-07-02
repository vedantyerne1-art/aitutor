import useSWR from 'swr';

export interface GitHubStats {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  repos: GitHubRepo[];
  languages: Record<string, number>;
  totalStars: number;
  totalForks: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  homepage: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useGitHub() {
  const { data, error, isLoading, mutate } = useSWR<GitHubStats>(
    '/api/github',
    fetcher,
    {
      refreshInterval: 60000, // auto-refresh every 60s
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
