export interface User {
  id: string
  email: string
  githubId: string
  githubUsername: string
  githubAvatarUrl: string
}

export interface Snippet {
  id: string
  userId: string
  title: string
  codeLeft: string
  codeRight: string
  createdAt: number
  updatedAt: number
}
