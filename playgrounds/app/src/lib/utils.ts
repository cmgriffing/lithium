import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Contributor {
  username: string
  avatarUrl: string
}

export async function getGithubContributors(owner: string, repo: string): Promise<Contributor[]> {
  let contributors: Contributor[] = []
  let page = 1
  const perPage = 100 // Maximum allowed by GitHub API

  while (true) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Array<{ login: string; avatar_url: string }> = await response.json()

      if (data.length === 0) {
        break
      }

      contributors = contributors.concat(
        data.map(contributor => ({
          username: contributor.login,
          avatarUrl: contributor.avatar_url,
        })),
      )

      page++
    } catch (error) {
      console.error('Error fetching contributors:', error)
      break
    }
  }

  return contributors
}
