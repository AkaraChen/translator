import { useQuery } from '@tanstack/react-query'
import OpenAI from 'openai'
import { useMemo } from 'react'
import useStore from '~/lib/store'

export const useOpenAI = () => {
    const store = useStore()
    return useMemo(
        () =>
            new OpenAI({
                baseURL: store.userPreferences.openaiBase,
                apiKey: store.userPreferences.openaiKey,
                dangerouslyAllowBrowser: true,
            }),
        [store.userPreferences.openaiBase, store.userPreferences.openaiKey],
    )
}

export const useModels = () => {
    const store = useStore()
    const client = useOpenAI()
    return useQuery({
        queryKey: [
            'models',
            store.userPreferences.openaiBase,
            store.userPreferences.openaiKey,
        ],
        queryFn: async () => {
            const list = await client.models.list()
            return list.data.map(model => model.id)
        },
    })
}
