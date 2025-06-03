import { useQuery } from '@tanstack/react-query'
import OpenAI from 'openai'
import useStore from '~/lib/store'

export const useModels = () => {
    const store = useStore()
    return useQuery({
        queryKey: [
            'models',
            store.userPreferences.openaiBase,
            store.userPreferences.openaiKey,
        ],
        queryFn: async () => {
            const client = new OpenAI({
                baseURL: store.userPreferences.openaiBase,
                apiKey: store.userPreferences.openaiKey,
                dangerouslyAllowBrowser: true,
            })
            const list = await client.models.list()
            return list.data.map(model => model.id)
        },
    })
}
