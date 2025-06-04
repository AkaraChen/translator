import { auto, Lang } from '~/lib/lang'
import { useQuery } from '@tanstack/react-query'
import useStore from '~/lib/store'
import { detectLanguage, translate } from '~/lib/translate'
import { useOpenAI } from './openai'

export const useDetectLang = (sourceText: string) => {
    const store = useStore()
    const client = useOpenAI()
    return useQuery({
        queryKey: ['detectLang', sourceText, store.userPreferences],
        queryFn: () =>
            detectLanguage({
                text: sourceText,
                userPreferences: store.userPreferences,
                client,
            }),
        enabled: !!sourceText,
    })
}

export const useTranslate = (
    sourceText: string,
    detectLang: Lang,
    targetLanguage: Lang,
) => {
    const store = useStore()
    const client = useOpenAI()
    return useQuery({
        queryKey: [
            'translate',
            sourceText,
            detectLang,
            store.userPreferences,
            targetLanguage === auto ? undefined : targetLanguage,
        ],
        queryFn: () =>
            translate(
                {
                    text: sourceText,
                    userPreferences: store.userPreferences,
                    client,
                },
                detectLang as string,
                targetLanguage === auto ? undefined : targetLanguage,
            ),
        enabled: !!detectLang && !!sourceText,
    })
}
