import OpenAI from 'openai'

export async function text(client: OpenAI, model: string, messages: string) {
    const res = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: messages }],
    })
    return res.choices[0].message.content
}
