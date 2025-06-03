import { UserPreferences } from './store'
import { OpenAI } from 'openai'
import * as llm from './llm'

export interface TranslateParams {
    text: string
    userPreferences: UserPreferences
    client: OpenAI
}

export async function detectLanguage(opts: TranslateParams) {
    const { text, userPreferences, client } = opts
    const preferences = [
        userPreferences.primaryLanguage,
        userPreferences.targetLanguage,
    ]
    return await llm.text(
        client,
        userPreferences.smallModel,
        `Detect the language of the following text: ${text}, 
        if the text is in ${userPreferences.primaryLanguage}, 
        return ${userPreferences.primaryLanguage}.
        Only return the language name,
        if the language is in [${preferences.join(', ')}], just return the specified language name. 
        if not in the list, return the language name in English,
        if you are not sure, return unknown.
        for example: ${userPreferences.primaryLanguage}`,
    )
}

async function translateToTargetLanguage(
    text: string,
    sourceLang: string,
    targetLang: string,
    opts: TranslateParams,
) {
    const { client } = opts
    return await llm.text(
        client,
        opts.userPreferences.largeModel,
        `Translate the following ${sourceLang} text to ${targetLang}: ${text}, 
        only output the translated text, 
        do not output any other text, for example: ${text}`,
    )
}

export async function translate(
    opts: TranslateParams,
    sourceLanguage: string,
    targetLanguage?: string,
) {
    const { text, userPreferences } = opts
    if (targetLanguage) {
        return await translateToTargetLanguage(
            text,
            sourceLanguage,
            targetLanguage,
            opts,
        )
    }
    if (sourceLanguage === userPreferences.primaryLanguage) {
        // is mother language, try to translate to target language
        return await translateToTargetLanguage(
            text,
            sourceLanguage,
            userPreferences.targetLanguage,
            opts,
        )
    }
    // is not mother language, try to translate to mother language
    return await translateToTargetLanguage(
        text,
        sourceLanguage,
        userPreferences.primaryLanguage,
        opts,
    )
}
