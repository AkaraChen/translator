import { UserPreferences } from './store'
import { OpenAI } from 'openai'
import { llm } from './llm'

export interface TranslateParams {
    text: string
    userPreferences: UserPreferences
    client: OpenAI
}

async function detectLanguage(opts: TranslateParams) {
    const { text, userPreferences, client } = opts
    return await llm(
        client,
        userPreferences.smallModel,
        `Detect the language of the following text: ${text}, 
        if the text is in ${userPreferences.primaryLanguage}, 
        return ${userPreferences.primaryLanguage}, 
        do not output any other text, for example: ${userPreferences.primaryLanguage}`,
    )
}

async function translateToTargetLanguage(
    text: string,
    sourceLang: string,
    targetLang: string,
    opts: TranslateParams,
) {
    const { client } = opts
    return await llm(
        client,
        opts.userPreferences.largeModel,
        `Translate the following ${sourceLang} text to ${targetLang}: ${text}, 
        only output the translated text, 
        do not output any other text, for example: ${text}`,
    )
}

export async function translate(
    opts: TranslateParams,
    targetLanguage?: string,
) {
    const { text, userPreferences } = opts
    const sourceLang = (await detectLanguage(opts)) || 'unknown'
    if (sourceLang === userPreferences.primaryLanguage) {
        console.log('is mother language')
        // is mother language, try to translate to target language
        return await translateToTargetLanguage(
            text,
            sourceLang,
            targetLanguage || userPreferences.targetLanguage,
            opts,
        )
    }
    console.log('is not mother language')
    // is not mother language, try to translate to mother language
    return await translateToTargetLanguage(
        text,
        sourceLang,
        targetLanguage || userPreferences.primaryLanguage,
        opts,
    )
}
