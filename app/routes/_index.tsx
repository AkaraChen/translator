import { TextareaHTMLAttributes, useState } from 'react'
import type { MetaFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Lock, LockOpen, Settings } from 'lucide-react'
import { SettingsButton } from '~/components/settings-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { detectLanguage, translate } from '~/lib/translate'
import useStore from '~/lib/store'
import { toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks'
import { useCompositionInput } from 'foxact/use-composition-input'
import { useClipboard } from 'foxact/use-clipboard'
import { useOpenAI } from '~/requests/openai'
import LanguageSelector from '~/components/language-selector'

export const meta: MetaFunction = () => {
    return [
        { title: 'Translator' },
        { name: 'description', content: 'A simple translation tool' },
    ]
}

export default function Index() {
    const [_sourceText, setSourceText] = useState('')
    const sourceTextAreaProps = useCompositionInput(v => setSourceText(v))
    const sourceText = useDebounce(_sourceText, 500)
    const { copy } = useClipboard({
        onCopyError(error) {
            toast.error(`Failed to copy text, ${error.message}`)
        },
    })
    const store = useStore()
    const client = useOpenAI()
    const [targetLanguage, setTargetLanguage] = useState(
        store.userPreferences.targetLanguage,
    )
    const [lockTargetLanguage, setLockTargetLanguage] = useState(false)

    const detectLang = useQuery({
        queryKey: ['detectLang', sourceText, store.userPreferences],
        queryFn: () =>
            detectLanguage({
                text: sourceText,
                userPreferences: store.userPreferences,
                client,
            }),
        enabled: !!sourceText,
    })

    const handleTranslate = useQuery({
        queryKey: [
            'translate',
            sourceText,
            detectLang.data,
            store.userPreferences,
            targetLanguage,
        ],
        queryFn: async () =>
            translate(
                {
                    text: sourceText,
                    userPreferences: store.userPreferences,
                    client,
                },
                detectLang.data!,
                targetLanguage,
            ).finally(() => {
                if (!lockTargetLanguage) {
                    setTargetLanguage(store.userPreferences.targetLanguage)
                }
            }),
        enabled: !!detectLang.data && !!sourceText,
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

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col space-y-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-baseline gap-2 font-serif'>
                        <h1 className='text-center text-3xl font-semibold'>
                            Translator
                        </h1>
                        <p className='hidden text-center text-muted-foreground md:block'>
                            A simple translation tool.
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
                    <div className='w-full space-y-4 md:w-1/2'>
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
                                {...(sourceTextAreaProps as unknown as Partial<
                                    TextareaHTMLAttributes<HTMLTextAreaElement>
                                >)}
                                defaultValue={sourceText}
                            />
                        </div>
                        <div className='space-x-3'>
                            <Button
                                disabled={!handleTranslate.data}
                                onClick={() => copy(handleTranslate.data!)}
                            >
                                Copy
                            </Button>
                            <Button
                                variant='outline'
                                onClick={() => handlePaste.mutate()}
                            >
                                Paste
                            </Button>
                        </div>
                    </div>

                    {/* Target text area - right side */}
                    <div className='w-full space-y-4 md:w-1/2'>
                        <div className='flex flex-col space-y-2'>
                            <label
                                htmlFor='target'
                                className='text-sm font-medium'
                            >
                                Translated Text
                            </label>
                            <Textarea
                                id='target'
                                placeholder={
                                    detectLang.isLoading
                                        ? 'Detecting language...'
                                        : handleTranslate.isLoading
                                          ? 'Translating...'
                                          : 'Translation will appear here...'
                                }
                                className='min-h-[300px] resize-none'
                                value={handleTranslate.data || ''}
                                readOnly
                            />
                        </div>
                        <div className='flex items-center space-x-3'>
                            <LanguageSelector
                                value={targetLanguage}
                                onValueChange={setTargetLanguage}
                            />
                            <Button
                                size='icon'
                                variant='outline'
                                className='!w-9'
                                onClick={() =>
                                    setLockTargetLanguage(!lockTargetLanguage)
                                }
                            >
                                {lockTargetLanguage ? <Lock /> : <LockOpen />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
