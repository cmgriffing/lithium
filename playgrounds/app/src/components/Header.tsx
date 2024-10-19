import { useLocation } from '@solidjs/router'
import { Button } from './ui/button'
import { OcMarkgithub2 } from 'solid-icons/oc'
import { FaSolidSun, FaSolidMoon } from 'solid-icons/fa'
import { createThemeSwitcher } from '~/components/theme-switcher';

export default function Nav() {
    const [isDarkMode, toggleDarkMode] = createThemeSwitcher();
     
    const handleToggle = () => {
        toggleDarkMode();  // Call without arguments
    };
    
  return (
    <header class="flex flex-col">
      <nav class="flex flex-row gap-2 justify-end p-4">
      
      <div>
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
    </div>
      
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
