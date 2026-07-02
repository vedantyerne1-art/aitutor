import { NextResponse } from 'next/server';

const LEETCODE_USERNAME = 'Vedant_2409';

const LEETCODE_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      profile {
        ranking
        reputation
        solutionCount
      }
      submissionCalendar
    }
    allQuestionsCount {
      difficulty
      count
    }
    recentAcSubmissionList(username: $username, limit: 10) {
      id
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

export async function GET() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username: LEETCODE_USERNAME },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);

    const json = await res.json();
    const user = json.data?.matchedUser;
    const allQ = json.data?.allQuestionsCount;
    const recent = json.data?.recentAcSubmissionList || [];

    if (!user) throw new Error('User not found');

    const stats = user.submitStats.acSubmissionNum;
    const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
    const easySolved = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    const totalQ = allQ?.find((q: any) => q.difficulty === 'All')?.count || 0;
    const easyTotal = allQ?.find((q: any) => q.difficulty === 'Easy')?.count || 0;
    const mediumTotal = allQ?.find((q: any) => q.difficulty === 'Medium')?.count || 0;
    const hardTotal = allQ?.find((q: any) => q.difficulty === 'Hard')?.count || 0;

    const calendar = JSON.parse(user.submissionCalendar || '{}');

    return NextResponse.json({
      username: LEETCODE_USERNAME,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalQuestions: totalQ,
      easyTotal,
      mediumTotal,
      hardTotal,
      acceptanceRate: totalQ > 0 ? Math.round((totalSolved / totalQ) * 100) : 0,
      ranking: user.profile?.ranking || 0,
      contributionPoints: user.profile?.solutionCount || 0,
      reputation: user.profile?.reputation || 0,
      submissionCalendar: calendar,
      recentSubmissions: recent,
    });
  } catch (error) {
    console.error('LeetCode API error:', error);
    // Graceful fallback
    return NextResponse.json({
      username: LEETCODE_USERNAME,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalQuestions: 3371,
      easyTotal: 835,
      mediumTotal: 1761,
      hardTotal: 775,
      acceptanceRate: 0,
      ranking: 0,
      contributionPoints: 0,
      reputation: 0,
      submissionCalendar: {},
      recentSubmissions: [],
    });
  }
}
