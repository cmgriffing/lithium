import { createResource } from 'solid-js'
import { authFetch } from '~/lib/utils'
import { Snippet } from '~/types'

export default function ViewSnippet({ params }: { params: { snippetId: string } }) {
  const [snippet] = createResource<Snippet>(async () => {
    const response = await authFetch(`/api/snippets/${params.snippetId}`)
    if (!response.ok) {
      return undefined
    }
    const data = await response.json()
    return data
  })

  return (
    <main class="text-center mx-auto text-gray-700  dark:text-gray-100 p-4 max-w-[480px] flex flex-col justify-center gap-16">
      Snippet ID: {snippet()?.id}
    </main>
  )
}
