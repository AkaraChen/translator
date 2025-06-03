import { useQuery } from '@tanstack/react-query'
import OpenAI from 'openai'
import { useMemo } from 'react'
import useStore from '~/lib/store'

export interface Credentials {
    base: string
    apiKey: string
}

export const useOpenAI = (credentials?: Credentials) => {
    const store = useStore()
    return useMemo(
        () =>
            new OpenAI({
                baseURL: credentials?.base ?? store.userPreferences.openaiBase,
                apiKey: credentials?.apiKey ?? store.userPreferences.openaiKey,
                dangerouslyAllowBrowser: true,
            }),
        [
            credentials?.apiKey,
            credentials?.base,
            store.userPreferences.openaiBase,
            store.userPreferences.openaiKey,
        ],
    )
}

export const useModels = (credentials?: Credentials) => {
    const store = useStore()
    const client = useOpenAI(credentials)
    return useQuery({
        queryKey: [
            'models',
            credentials?.base ?? store.userPreferences.openaiBase,
            credentials?.apiKey ?? store.userPreferences.openaiKey,
        ],
        queryFn: async () => {
            const list = await client.models.list()
            return list.data.map(model => model.id)
        },
    })
}
