import { UserPreferences } from './store'
import { OpenAI } from 'openai'

export interface TranslateParams {
    text: string
    userPreferences: UserPreferences
    client: OpenAI
}

async function detectLanguage(opts: TranslateParams) {
    const { text, userPreferences, client } = opts
    const res = await client.responses.create({
        input: `Detect the language of the following text: ${text}, 
        if the text is in ${userPreferences.primaryLanguage}, 
        return ${userPreferences.primaryLanguage}, 
        do not output any other text`,
        model: userPreferences.smallModel,
    })
    return res.output_text
}

async function translateToTargetLanguage(
    text: string,
    sourceLang: string,
    targetLang: string,
    opts: TranslateParams,
) {
    const { client } = opts
    const res = await client.responses.create({
        input: `Translate the following ${sourceLang} text to ${targetLang}: ${text}, 
        only output the translated text, 
        do not output any other text`,
        model: opts.userPreferences.largeModel,
    })
    return res.output_text
}

export async function translate(
    opts: TranslateParams,
    targetLanguage?: string,
) {
    const { text, userPreferences } = opts
    const targetLang = targetLanguage || userPreferences.targetLanguage
    const sourceLang = await detectLanguage(opts)
    if (sourceLang === userPreferences.primaryLanguage) {
        // is mother language, try to translate to target language
        return await translateToTargetLanguage(
            text,
            sourceLang,
            targetLang,
            opts,
        )
    }
    // is not mother language, try to translate to mother language
    return await translateToTargetLanguage(text, sourceLang, targetLang, opts)
}
