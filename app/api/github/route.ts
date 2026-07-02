import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'vedantyerne1-art';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

if (GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
}

async function fetchGitHub(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [user, repos] = await Promise.all([
      fetchGitHub(`/users/${GITHUB_USERNAME}`),
      fetchGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
    ]);

    // Aggregate language stats
    const languageCounts: Record<string, number> = {};
    let totalStars = 0;
    let totalForks = 0;

    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    }

    // Sort repos by stars then updated
    const sortedRepos = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 12);

    return NextResponse.json({
      login: user.login,
      name: user.name,
      bio: user.bio,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      avatar_url: user.avatar_url,
      repos: sortedRepos,
      languages: languageCounts,
      totalStars,
      totalForks,
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      {
        login: 'vedantyerne1-art',
        name: 'Vedant Yerne',
        bio: 'Software Developer | AI/ML Engineer | Full Stack Developer | IoT Engineer',
        public_repos: 12,
        followers: 0,
        following: 0,
        avatar_url: '',
        repos: [],
        languages: { Python: 5, JavaScript: 3, Java: 2, TypeScript: 2 },
        totalStars: 0,
        totalForks: 0,
      },
      { status: 200 }
    );
  }
}
