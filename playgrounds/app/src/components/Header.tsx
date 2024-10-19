import { A, useLocation, useMatch } from '@solidjs/router'
import { Button } from './ui/button'
import { OcMarkgithub2 } from 'solid-icons/oc'
import { FaSolidSun, FaSolidMoon } from 'solid-icons/fa'
import { createThemeSwitcher } from '~/components/theme-switcher'
import { linkStyles } from '~/lib/styles'

export default function Nav() {
  const [isDarkMode, toggleDarkMode] = createThemeSwitcher()

  const handleToggle = () => {
    toggleDarkMode() // Call without arguments
  }

  return (
    <header class="flex flex-col">
      <nav class="flex flex-row gap-2 justify-end p-4">
        <div class="flex flex-row items-center gap-2">
          <button
            onClick={handleToggle}
            class="flex items-center justify-center cursor-pointer w-8 h-8 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-600 dark:hover:bg-neutral-600/80 rounded-full transition"
            aria-label="Toggle dark mode"
          >
            {isDarkMode() ? (
              <FaSolidMoon class="w-4 h-4 text-neutral-200" />
            ) : (
              <FaSolidSun class="w-4 h-4 text-neutral-500" />
            )}
          </button>
          {/* <Button>Login/Signup</Button> */}
        </div>
      </nav>
      <div class="flex flex-col items-center justify-center p-4">
        <a href="/">
          <h1 class="text-6xl font-title text-sky-500">Lithium</h1>
        </a>
      </div>
    </header>
  )
}
