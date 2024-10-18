import { createResource, createSignal, onCleanup, Show } from 'solid-js'
import { createHighlighter, getHighlighter, bundledThemes, bundledLanguages } from 'shiki'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Slider,
  SliderFill,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from '~/components/ui/slider'
import clsx from 'clsx'
import { TbSettings } from 'solid-icons/tb'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'

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
  const [isResizing, setIsResizing] = createSignal(false)
  const [isLooping, setIsLooping] = createSignal(true)

  const [bgColor, setBgColor] = makePersisted(createSignal('#ffffff'), {
    name: 'bgColor',
  })
  const [xPadding, setXPadding] = makePersisted(createSignal(42), {
    name: 'xPadding',
  })
  const [yPadding, setYPadding] = makePersisted(createSignal(42), {
    name: 'yPadding',
  })
  const [shadowEnabled, setShadowEnabled] = makePersisted(createSignal(true), {
    name: 'shadowEnabled',
  })
  const [shadowOffsetY, setShadowOffsetY] = makePersisted(createSignal(10), {
    name: 'shadowOffsetY',
  })
  const [shadowBlur, setShadowBlur] = makePersisted(createSignal(10), {
    name: 'shadowBlur',
  })
  const [shadowColor, setShadowColor] = makePersisted(createSignal('#000000'), {
    name: 'shadowColor',
  })
  const [shadowOpacity, setShadowOpacity] = makePersisted(createSignal(0.6), {
    name: 'shadowOpacity',
  })
  const [snippetWidth, setSnippetWidth] = makePersisted(createSignal(450), {
    name: 'snippetWidth',
  })

  const [highlighter] = createResource(async () => {
    const newHighlighter = await createHighlighter({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages),
    })

    return newHighlighter
  })

  const intervalId = setInterval(() => {
    if (
      selectedTab() === 'output' &&
      startCode() !== '' &&
      endCode() !== '' &&
      !isResizing() &&
      isLooping()
    ) {
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

  document.body.addEventListener('mousemove', e => {
    if (isResizing()) {
      const deltaX = e.movementX
      // console.log(e.)
      setSnippetWidth(snippetWidth() + deltaX)
    }
  })

  document.body.addEventListener('mouseup', e => {
    if (isResizing()) {
      setIsResizing(false)
    }
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
          <div class="flex flex-row p-2 gap-2 bg-slate-500 rounded-t justify-between" id="toolbar">
            <div class="flex flex-row gap-2" id="toolbar-left">
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

              <DropdownMenu
                onOpenChange={open => {
                  setIsLooping(!open)
                }}
              >
                <DropdownMenuTrigger>
                  <Button class="flex flex-row items-center gap-2">
                    Settings
                    <TbSettings size={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent class="w-[160px]">
                    <DropdownMenuItem
                      class="flex flex-row items-center justify-between"
                      closeOnSelect={false}
                    >
                      <Label for="bg-color-input" class="font-normal">
                        BG Color
                      </Label>
                      <input
                        id="bg-color-input"
                        class="h-6 w-6 rounded"
                        type="color"
                        value={bgColor()}
                        onInput={e => setBgColor(e.target.value)}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Layout</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <Slider
                              value={[yPadding()]}
                              minValue={0}
                              maxValue={200}
                              onChange={e => {
                                setYPadding(e[0])
                              }}
                            >
                              <div class="flex w-full justify-between mb-2">
                                <SliderLabel>Padding (y)</SliderLabel>
                                <SliderValueLabel />
                              </div>
                              <SliderTrack>
                                <SliderFill />
                                <SliderThumb />
                              </SliderTrack>
                            </Slider>
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Slider
                              value={[xPadding()]}
                              minValue={0}
                              maxValue={200}
                              onChange={e => {
                                setXPadding(e[0])
                              }}
                            >
                              <div class="flex w-full justify-between mb-2">
                                <SliderLabel>Padding (x)</SliderLabel>
                                <SliderValueLabel />
                              </div>
                              <SliderTrack>
                                <SliderFill />
                                <SliderThumb />
                              </SliderTrack>
                            </Slider>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Shadow</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent class="w-[200px]">
                          <DropdownMenuItem
                            class="flex flex-row items-center justify-between"
                            closeOnSelect={false}
                            onSelect={() => {
                              setShadowEnabled(!shadowEnabled())
                            }}
                          >
                            <Label for="shadow-checkbox">Show Shadow</Label>
                            <Checkbox
                              id="shadow-checkbox"
                              checked={shadowEnabled()}
                              onChange={setShadowEnabled}
                            />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            class="flex flex-row items-center justify-between"
                            closeOnSelect={false}
                          >
                            <Label for="shadow-color-input" class="font-normal">
                              Color
                            </Label>

                            <input
                              id="shadow-color-input"
                              class="h-6 w-6 rounded"
                              type="color"
                              value={shadowColor()}
                              onInput={e => setShadowColor(e.target.value)}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="flex flex-row items-center justify-between"
                            closeOnSelect={false}
                          >
                            <Slider
                              value={[shadowOpacity()]}
                              step={0.01}
                              minValue={0}
                              maxValue={1}
                              onChange={e => {
                                setShadowOpacity(e[0])
                              }}
                            >
                              <div class="flex w-full justify-between mb-2">
                                <SliderLabel>Opacity</SliderLabel>
                                <SliderValueLabel />
                              </div>
                              <SliderTrack>
                                <SliderFill />
                                <SliderThumb />
                              </SliderTrack>
                            </Slider>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Slider
                              value={[shadowOffsetY()]}
                              minValue={0}
                              maxValue={yPadding()}
                              onChange={e => {
                                setShadowOffsetY(e[0])
                              }}
                            >
                              <div class="flex w-full justify-between mb-2">
                                <SliderLabel>Offset Y</SliderLabel>
                                <SliderValueLabel />
                              </div>
                              <SliderTrack>
                                <SliderFill />
                                <SliderThumb />
                              </SliderTrack>
                            </Slider>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Slider
                              value={[shadowBlur()]}
                              minValue={0}
                              maxValue={200}
                              onChange={e => {
                                setShadowBlur(e[0])
                              }}
                            >
                              <div class="flex w-full justify-between mb-2">
                                <SliderLabel>Blur</SliderLabel>
                                <SliderValueLabel />
                              </div>
                              <SliderTrack>
                                <SliderFill />
                                <SliderThumb />
                              </SliderTrack>
                            </Slider>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </div>
            <div class="flex flex-row gap-2" id="toolbar-right">
              <Button
                onClick={async () => {
                  // TEMP

                  const container = document.querySelector(
                    '.shiki-magic-move-container',
                  ) as HTMLPreElement

                  const canvasFrames: HTMLCanvasElement[] = []
                  const backgroundColor = container.style.backgroundColor

                  console.log('magic move elements', magicMoveElements())

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
                      {
                        layout: {
                          yPadding: yPadding(),
                          xPadding: xPadding(),
                        },
                        shadow: {
                          shadowEnabled: shadowEnabled(),
                          shadowOffsetY: shadowOffsetY(),
                          shadowBlur: shadowBlur(),
                          shadowColor: shadowColor(),
                          shadowOpacity: shadowOpacity(),
                        },
                        styling: {
                          fontSize,
                          fontFamily,
                          snippetBackgroundColor: backgroundColor,
                          backgroundColor: bgColor(),
                        },
                      },
                    )

                    canvasFrames.push(canvas)
                  }

                  const gif = await encode({
                    // workerUrl,
                    width: canvasFrames[0].width,
                    height: canvasFrames[0].height,
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
            id="preview-wrapper"
            class="bg-slate-400 p-2 rounded-b"
            style={{
              'min-height': `${(maxContainerDimensions()?.height || 100) + 40}px`,
            }}
          >
            <p>Preview</p>
            <div class="flex flex-row items-center justify-center">
              <div
                class="flex flex-row items-center justify-center overflow-hidden"
                style={{
                  background: bgColor(),
                  padding: `${yPadding()}px ${xPadding()}px`,
                }}
              >
                <div class="flex flex-row items-center justify-center relative margin-auto w-fit">
                  <Show when={highlighter()}>
                    {highlighter => (
                      <>
                        <div
                          class="rounded"
                          style={{
                            width: `${snippetWidth()}px`,
                            'overflow-x': 'hidden',
                            'box-shadow': shadowEnabled()
                              ? `0 ${shadowOffsetY()}px ${shadowBlur()}px ${shadowColor()}${(
                                  shadowOpacity() * 255
                                ).toString(16)}`
                              : 'none',
                          }}
                        >
                          <ShikiMagicMove
                            lang={language()}
                            theme={theme()}
                            class="p-4 shadow-xl rounded select-none overflow-hidden !text-pretty"
                            highlighter={highlighter()}
                            code={code()}
                            options={{
                              duration: 800,
                              stagger: 0,
                              lineNumbers: false,
                              onAnimationStart: async (elements, maxContainerDimensions) => {
                                if (elements.length === 0) {
                                  return
                                }

                                setMagicMoveElements(elements)
                                setMaxContainerDimensions(maxContainerDimensions)
                              },
                            }}
                          />
                        </div>
                        <div
                          class={clsx(
                            'w-[8px] bg-slate-400 opacity-10 hover:opacity-60 rounded-r h-full absolute top-0 left-[calc(100%-8px)] bottom-0 transition-opacity',
                            {
                              'opacity-60': isResizing(),
                            },
                          )}
                          style={{
                            cursor: isResizing() ? 'grabbing' : 'grab',
                          }}
                          onMouseDown={e => {
                            setIsResizing(true)
                          }}
                        ></div>
                      </>
                    )}
                  </Show>
                </div>
              </div>
            </div>
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

interface AnimationFrameLayout {
  yPadding: number
  xPadding: number
}

interface AnimationFrameShadow {
  shadowEnabled: boolean
  shadowOffsetY: number
  shadowBlur: number
  shadowColor: string
  shadowOpacity: number
}

interface AnimationFrameStyling {
  fontSize: string
  fontFamily: string
  snippetBackgroundColor: string
  backgroundColor: string
}

interface AnimationFrameConfig {
  layout: AnimationFrameLayout
  shadow: AnimationFrameShadow
  styling: AnimationFrameStyling
}

const snippetPadding = 16

async function createAnimationFrame(
  elements: MagicMoveElement[],
  frame: number,
  width: number = 100,
  height: number = 100,
  config: AnimationFrameConfig,
) {
  const { yPadding, xPadding } = config.layout
  const { shadowEnabled, shadowOffsetY, shadowBlur, shadowColor, shadowOpacity } = config.shadow
  const { fontSize, fontFamily, backgroundColor, snippetBackgroundColor } = config.styling

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: false })
  canvas.width = width + xPadding * 2
  canvas.height = height + yPadding * 2
  ctx!.fillStyle = backgroundColor
  ctx?.fillRect(0, 0, canvas.width, canvas.height)

  ctx!.fillStyle = snippetBackgroundColor
  if (shadowEnabled) {
    ctx!.shadowColor = `${shadowColor}${(shadowOpacity * 255).toString(16)}`
    ctx!.shadowBlur = shadowBlur
    ctx!.shadowOffsetX = 0
    ctx!.shadowOffsetY = shadowOffsetY
  }

  ctx!.beginPath()
  ctx!.roundRect(xPadding, yPadding, width, height, 4)
  ctx!.fill()

  ctx!.shadowColor = 'transparent'

  const xModifier = xPadding
  const yModifier = yPadding + snippetPadding

  const elementPromises = elements.map(async el => {
    const x = interpolate(
      frame,
      [0, animationFrames],
      [el.x.start + xModifier, el.x.end + xModifier],
      {
        easing: Easing.inOut(Easing.quad),
      },
    )
    const y = interpolate(
      frame,
      [0, animationFrames],
      [el.y.start + yModifier, el.y.end + yModifier],
      {
        easing: Easing.inOut(Easing.quad),
      },
    )
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
