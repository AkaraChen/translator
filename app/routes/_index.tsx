import { useMemo, useState } from 'react'
import type { MetaFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Settings } from 'lucide-react'
import { SettingsButton } from '~/components/settings-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { detectLanguage, translate } from '~/lib/translate'
import useStore from '~/lib/store'
import OpenAI from 'openai'
import { toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks'

export const meta: MetaFunction = () => {
    return [
        { title: 'Translator - Translation Tool' },
        { name: 'description', content: 'A simple translation tool' },
    ]
}

export default function Index() {
    const [sourceText, setSourceText] = useState('')
    const debouncedSourceText = useDebounce(sourceText, 500)
    const [targetText, setTargetText] = useState('')

    const store = useStore()
    const client = useMemo(
        () =>
            new OpenAI({
                baseURL: store.userPreferences.openaiBase,
                apiKey: store.userPreferences.openaiKey,
                dangerouslyAllowBrowser: true,
            }),
        [store.userPreferences.openaiBase, store.userPreferences.openaiKey],
    )

    const detectLang = useQuery({
        queryKey: ['detectLang', debouncedSourceText],
        queryFn: () =>
            detectLanguage({
                text: debouncedSourceText,
                userPreferences: store.userPreferences,
                client,
            }),
        enabled: !!sourceText,
    })

    const handleTranslate = useMutation({
        mutationFn: async () =>
            translate(
                {
                    text: debouncedSourceText,
                    userPreferences: store.userPreferences,
                    client,
                },
                detectLang.data!,
            ),
        onSuccess: data => {
            setTargetText(data || 'unknown error')
        },
        onError: err => {
            toast.error(`Failed to translate text, ${err.message}`)
        },
    })

    const handlePaste = useMutation({
        mutationFn: () => navigator.clipboard.readText(),
        onSuccess: data => {
            setSourceText(data)
        },
        onError: err => {
            toast.error(`Failed to read clipboard contents, ${err.message}`)
        },
    })

    const handleClear = () => {
        setSourceText('')
        setTargetText('')
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col space-y-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-baseline gap-2 font-serif'>
                        <h1 className='text-center text-3xl font-semibold'>
                            Translator
                        </h1>
                        <p className='hidden text-center text-muted-foreground md:block'>
                            A simple translation tool
                        </p>
                    </div>
                    <SettingsButton>
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Settings'
                        >
                            <Settings className='!size-5' />
                        </Button>
                    </SettingsButton>
                </div>

                <div className='flex flex-col gap-4 md:flex-row'>
                    {/* Source text area - left side */}
                    <div className='w-full md:w-1/2'>
                        <div className='flex flex-col space-y-2'>
                            <label
                                htmlFor='source'
                                className='text-sm font-medium'
                            >
                                Source Text
                            </label>
                            <Textarea
                                id='source'
                                placeholder='Enter text to translate...'
                                className='min-h-[300px] resize-none'
                                value={sourceText}
                                onChange={e => setSourceText(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Target text area - right side */}
                    <div className='w-full md:w-1/2'>
                        <div className='flex flex-col space-y-2'>
                            <label
                                htmlFor='target'
                                className='text-sm font-medium'
                            >
                                Translated Text
                            </label>
                            <Textarea
                                id='target'
                                placeholder='Translation will appear here...'
                                className='min-h-[300px] resize-none'
                                value={targetText}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons row */}
                <div className='space-x-3'>
                    <Button
                        onClick={() => handleTranslate.mutate()}
                        disabled={!detectLang.data || handleTranslate.isPending}
                    >
                        Translate
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => handlePaste.mutate()}
                    >
                        Paste
                    </Button>
                    <Button variant='secondary' onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    )
}
