import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { useStore as useZustand } from 'zustand'

export interface UserPreferences {
    primaryLanguage: string
    targetLanguage: string
    alternativeLanguages: string[]
    openaiBase: string
    openaiKey: string
    smallModel: string
    largeModel: string
}

export interface Store {
    userPreferences: UserPreferences
    setUserPreferences: (userPreferences: UserPreferences) => void
}

const store = createStore(
    persist<Store>(
        set => ({
            userPreferences: {
                primaryLanguage: 'Chinese',
                targetLanguage: 'English',
                alternativeLanguages: ['French', 'Japanese'],
                openaiBase: 'https://api.openai.com/v1',
                openaiKey: '',
                smallModel: 'gpt-3.5-turbo',
                largeModel: 'gpt-4o',
            },
            setUserPreferences: (userPreferences: UserPreferences) => {
                set({ userPreferences })
            },
        }),
        {
            name: 'user-preferences',
        },
    ),
)

const useStore = () => useZustand(store)

export default useStore
