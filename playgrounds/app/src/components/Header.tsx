import { useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { OcMarkgithub2 } from 'solid-icons/oc'

export default function Nav() {
  return (
    <header class="flex flex-col">
      <nav class="flex flex-row gap-2 justify-end p-4">
        <a href="https://github.com/cmgriffing/lithium" target="_blank" rel="noreferrer">
          <OcMarkgithub2 size={32} />
        </a>
        {/* <Button>Login/Signup</Button> */}
      </nav>
      <div class="flex flex-col items-center justify-center p-4">
        <h1 class="text-6xl font-bold">Lithium</h1>
        <p>Create and share beautiful gifs of your source code diffs.</p>
      </div>
    </header>
  )
}
