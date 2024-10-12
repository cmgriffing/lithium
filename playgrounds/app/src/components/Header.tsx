import { useLocation } from '@solidjs/router'
import { Button } from './ui/button'

export default function Nav() {
  return (
    <header class="flex flex-col">
      <nav class="flex flex-row gap-2 justify-end p-4">
        <Button>Login/Signup</Button>
      </nav>
      <div class="flex flex-col items-center justify-center p-4">
        <h1 class="text-6xl font-bold">Lithium</h1>
        <p>Create and share beautiful gifs of your source code diffs.</p>
      </div>
    </header>
  )
}
