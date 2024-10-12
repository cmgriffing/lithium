import { A } from '@solidjs/router'
import { createEffect, createMemo, createResource, createSignal, onCleanup, Show } from 'solid-js'
import {
  type HighlighterCore,
  createHighlighter,
  getHighlighter,
  bundledThemes,
  bundledLanguages,
} from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/solid'
import { makePersisted } from '@solid-primitives/storage'
import { interpolate, interpolateColors, Easing } from 'remotion'
import { encode } from 'modern-gif'
import workerUrl from 'modern-gif/worker?url'
import 'shiki-magic-move/dist/style.css'
import {
  ComboboxItem,
  ComboboxItemLabel,
  ComboboxItemIndicator,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  Combobox,
} from '~/components/ui/combobox'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { TextField, TextFieldLabel, TextFieldTextArea } from '~/components/ui/text-field'
import { MagicMoveElement } from 'shiki-magic-move/types'

const animationSeconds = 1
const animationFPS = 10
const animationFrames = animationSeconds * animationFPS

const left = `<script setup>
import { ref, computed } from 'vue'

const count = ref(1)
const double = computed(() => count.value * 2)
</script>

<template>
  <p class="greeting">{{ count }} = {{ doubled / 2 }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>`
const right = `<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    count: 1
  }),
  computed: {
    double() {
      return this.count * 2
    }
  },
})
</script>

<template>
  <p class="greeting">{{ count }} * 2 = {{ doubled }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>`

export default function Home() {
  const [selectedTab, setSelectedTab] = createSignal<'snippets' | 'output'>('snippets')
  const [toggled, setToggled] = createSignal(false)
  const [theme, setTheme] = makePersisted(createSignal('nord'), { name: 'theme' })
  const [language, setLanguage] = makePersisted(createSignal('typescript'), {
    name: 'language',
  })
  const [startCode, setStartCode] = makePersisted(createSignal(left), {
    name: 'startCode',
  })
  const [endCode, setEndCode] = makePersisted(createSignal(right), {
    name: 'endCode',
  })
  const [magicMoveElements, setMagicMoveElements] = createSignal<MagicMoveElement[]>([])
  const [maxContainerDimensions, setMaxContainerDimensions] = createSignal<{
    width: number
    height: number
  }>()
  const [code, setCode] = createSignal(startCode())

  const [highlighter] = createResource(async () => {
    const newHighlighter = await createHighlighter({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages),
    })

    return newHighlighter
  })

  const intervalId = setInterval(() => {
    if (selectedTab() === 'output' && startCode() !== '' && endCode() !== '') {
      if (toggled()) {
        setCode(startCode())
      } else {
        setCode(endCode())
      }
      setToggled(!toggled())
    }
  }, 3000)

  onCleanup(() => {
    clearInterval(intervalId)
  })

  return (
    <main class="mx-auto text-gray-700 p-4">
      <Tabs defaultValue="snippets" class="w-full" value={selectedTab()} onChange={setSelectedTab}>
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="snippets">Step 1: Snippets</TabsTrigger>
          <TabsTrigger value="output">Step 2: Output</TabsTrigger>
        </TabsList>
        <TabsContent value="snippets">
          <div class="flex flex-row p-2 gap-2 bg-slate-500 rounded-t justify-between">
            <div class="flex flex-row gap-2 items-center">
              <div class="rounded bg-white p-2">Enter the code snippets you would like to diff</div>
            </div>
            <div class="flex flex-row gap-2">
              <Button
                onClick={() => {
                  setSelectedTab('output')
                }}
                disabled={startCode() === '' || endCode() === ''}
              >
                Next
              </Button>
            </div>
          </div>

          <div class="bg-slate-400 p-2 rounded-b flex flex-row gap-2">
            <TextField class="w-1/2" value={startCode()} onChange={setStartCode}>
              <TextFieldLabel>Start Code</TextFieldLabel>
              <TextFieldTextArea class="h-[400px]" placeholder="Type your message here." />
            </TextField>

            <TextField class="w-1/2" value={endCode()} onChange={setEndCode}>
              <TextFieldLabel>End Code</TextFieldLabel>
              <TextFieldTextArea class="h-[400px]" placeholder="Type your message here." />
            </TextField>
          </div>
        </TabsContent>
        <TabsContent value="output">
          <div class="flex flex-row p-2 gap-2 bg-slate-500 rounded-t justify-between">
            <div class="flex flex-row gap-2">
              <Combobox
                value={theme()}
                options={Object.keys(bundledThemes)}
                onChange={setTheme}
                placeholder="Search a theme..."
                itemComponent={props => (
                  <ComboboxItem item={props.item}>
                    <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                )}
              >
                <ComboboxControl aria-label="Theme" class="bg-white">
                  <ComboboxInput />
                  <ComboboxTrigger />
                </ComboboxControl>
                <ComboboxContent style={{ 'max-height': '200px', overflow: 'auto' }} />
              </Combobox>

              <Combobox
                value={language()}
                options={Object.keys(bundledLanguages)}
                onChange={setLanguage}
                placeholder="Search a Language..."
                itemComponent={props => (
                  <ComboboxItem item={props.item}>
                    <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                )}
              >
                <ComboboxControl aria-label="Language" class="bg-white">
                  <ComboboxInput />
                  <ComboboxTrigger />
                </ComboboxControl>
                <ComboboxContent style={{ 'max-height': '200px', overflow: 'auto' }} />
              </Combobox>
            </div>
            <div class="flex flex-row gap-2">
              <Button
                onClick={async () => {
                  // TEMP

                  const container = document.querySelector(
                    '.shiki-magic-move-container',
                  ) as HTMLPreElement

                  const canvasFrames: HTMLCanvasElement[] = []
                  const backgroundColor = container.style.backgroundColor

                  let fontSize = ''
                  let fontFamily = ''

                  magicMoveElements().some(el => {
                    const computedStyle = window.getComputedStyle(el.el)
                    fontSize = computedStyle.getPropertyValue('font-size')
                    fontFamily = computedStyle.getPropertyValue('font-family')

                    return fontSize && fontFamily
                  })

                  const loopedFrames = []
                  const middleFrames = []

                  for (let i = 0; i < animationFrames; i++) {
                    middleFrames.push(i)
                  }

                  const pauseFrameLength = 15
                  const firstFrames = new Array(pauseFrameLength).fill(0)
                  const lastFrames = new Array(pauseFrameLength).fill(animationFrames)

                  loopedFrames.push(
                    ...firstFrames,
                    ...middleFrames,
                    ...lastFrames,
                    ...middleFrames.toReversed(),
                  )

                  for (let frame = 0; frame < loopedFrames.length; frame++) {
                    const actualFrame = loopedFrames[frame]

                    const canvas = await createAnimationFrame(
                      magicMoveElements(),
                      actualFrame,
                      maxContainerDimensions()?.width || 100,
                      maxContainerDimensions()?.height || 100,
                      backgroundColor,
                      fontSize,
                      fontFamily,
                    )

                    canvasFrames.push(canvas)
                  }

                  const gif = await encode({
                    // workerUrl,
                    width: canvasFrames[0].width,
                    height: canvasFrames[0].height,
                    // frames: canvasFrames.map((canvas) => {
                    //   // const frame = new Frame(canvas)
                    //   const ctx = canvas.getContext("2d");
                    //   return {
                    //     data: ctx!.getImageData(
                    //       0,
                    //       0,
                    //       canvas.width,
                    //       canvas.height
                    //     ),
                    //     delay: 1000 / animationFPS,
                    //   };
                    // }),
                    frames: canvasFrames.map((canvas, i) => {
                      return { data: canvas }
                    }),
                  })

                  const blob = new Blob([gif], { type: 'image/gif' })
                  // window.open(URL.createObjectURL(blob))

                  const dataUrl = await blobToDataURL(blob)
                  console.log(dataUrl)
                  const finalGif = document.createElement('img')
                  finalGif.src = dataUrl?.toString() || ''

                  document.body.appendChild(finalGif)
                }}
              >
                Copy
              </Button>
              <Button onClick={() => {}}>Download</Button>
            </div>
          </div>

          <div
            class="bg-slate-400 p-2 rounded-b"
            style={{
              'min-height': `${(maxContainerDimensions()?.height || 100) + 40}px`,
            }}
          >
            <p>Preview</p>
            <Show when={highlighter()}>
              {highlighter => (
                <ShikiMagicMove
                  lang={language()}
                  theme={theme()}
                  class="p-4 shadow-xl rounded"
                  highlighter={highlighter()}
                  code={code()}
                  options={{
                    duration: 800,
                    stagger: 0,
                    lineNumbers: true,
                    onAnimationStart: async (elements, maxContainerDimensions) => {
                      if (elements.length === 0) {
                        return
                      }

                      // console.log({ elements });

                      setMagicMoveElements(elements)
                      setMaxContainerDimensions(maxContainerDimensions)
                    },
                  }}
                />
              )}
            </Show>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function blobToDataURL(blob: Blob): Promise<string | ArrayBuffer | null | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      resolve(e.target?.result)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function htmlDecode(str: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

async function createAnimationFrame(
  elements: MagicMoveElement[],
  frame: number,
  width: number = 100,
  height: number = 100,
  backgroundColor: string,
  fontSize: string,
  fontFamily: string,
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: false })
  canvas.width = width
  canvas.height = height
  ctx!.fillStyle = backgroundColor
  ctx?.fillRect(0, 0, canvas.width, canvas.height)

  const elementPromises = elements.map(async el => {
    const x = interpolate(frame, [0, animationFrames], [el.x.start, el.x.end], {
      easing: Easing.inOut(Easing.quad),
    })
    const y = interpolate(frame, [0, animationFrames], [el.y.start, el.y.end], {
      easing: Easing.inOut(Easing.quad),
    })
    const opacity = interpolate(frame, [0, animationFrames], [el.opacity.start, el.opacity.end], {
      easing: Easing.inOut(Easing.quad),
    })
    const color = interpolateColors(
      frame,
      [0, animationFrames],
      [el.color.start || 'rgba(0,0,0,0)', el.color.end || 'rgba(0,0,0,0)'],
    )

    ctx!.font = `${fontSize} ${fontFamily}`
    ctx!.fillStyle = color
    ctx!.globalAlpha = opacity
    ctx!.fillText(htmlDecode(el.el.innerHTML), x, y)
  })
  await Promise.all(elementPromises)

  return canvas
}
