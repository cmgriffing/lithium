import { createResource, Show } from 'solid-js'
import { authFetch } from '~/lib/utils'
import { Snippet } from '~/types'

export default function Snippets() {
  const [snippets] = createResource<Snippet[]>(async () => {
    const response = await authFetch('/api/snippets')
    if (!response.ok) {
      return []
    }
    const data = await response.json()
    return data
  })

  return (
    <main class="text-center mx-auto text-gray-700  dark:text-gray-100 p-4 max-w-[480px] flex flex-col justify-center gap-16">
      <h2 class="text-4xl">Snippets</h2>
      <Show when={snippets.loading}>Loading...</Show>
      <Show when={snippets.error}>Error: {snippets.error.message}</Show>
      <Show when={Boolean(snippets.latest?.length)}>
        {snippets.latest?.map(snippet => (
          <div>{snippet.title}</div>
        ))}
      </Show>
      <Show when={!snippets.loading && !Boolean(snippets.latest?.length)}>
        <p>No snippets found</p>
      </Show>
    </main>
  )
}
