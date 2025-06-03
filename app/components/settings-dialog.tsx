import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '~/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import useStore from '~/lib/store'
import ModelSelector from './model-selector'

// Define the form schema with Zod
const formSchema = z.object({
    primaryLanguage: z.string().min(2, {
        message: 'Primary language must be at least 2 characters.',
    }),
    targetLanguage: z.string().min(2, {
        message: 'Target language must be at least 2 characters.',
    }),
    openaiBase: z.string().url({
        message: 'Please enter a valid URL.',
    }),
    openaiKey: z.string().min(1, {
        message: 'API key is required.',
    }),
    smallModel: z.string().min(1, {
        message: 'Small model is required.',
    }),
    largeModel: z.string().min(1, {
        message: 'Large model is required.',
    }),
    alternativeLanguages: z.array(z.string()).min(1, {
        message: 'At least one alternative language is required.',
    }),
})

// Define the type for our form values
type FormValues = z.infer<typeof formSchema>

// Default values for the form
const defaultValues: Partial<FormValues> = {
    primaryLanguage: 'Chinese',
    targetLanguage: 'English',
    alternativeLanguages: ['French', 'Japanese'],
    openaiBase: 'https://api.openai.com/v1',
    openaiKey: '',
    smallModel: 'gpt-3.5-turbo',
    largeModel: 'gpt-4o',
}

// This component is used to open the settings dialog from any parent component
export function SettingsButton({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Configure your translation preferences and API settings.
                    </DialogDescription>
                </DialogHeader>
                <SettingsForm onClose={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}

// Extract the form into a separate component for reuse
function SettingsForm({ onClose }: { onClose: () => void }) {
    const store = useStore()

    const initialValues = {
        primaryLanguage:
            store.userPreferences.primaryLanguage ||
            defaultValues.primaryLanguage,
        targetLanguage:
            store.userPreferences.targetLanguage ||
            defaultValues.targetLanguage,
        openaiBase:
            store.userPreferences.openaiBase || defaultValues.openaiBase,
        openaiKey: store.userPreferences.openaiKey || defaultValues.openaiKey,
        smallModel:
            store.userPreferences.smallModel || defaultValues.smallModel,
        largeModel:
            store.userPreferences.largeModel || defaultValues.largeModel,
        alternativeLanguages:
            store.userPreferences.alternativeLanguages ||
            defaultValues.alternativeLanguages,
    }

    // Initialize the form with saved values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    })

    // Handle form submission
    function onSubmit(data: FormValues) {
        store.setUserPreferences(data)
        onClose()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 py-4'
            >
                <FormField
                    control={form.control}
                    name='primaryLanguage'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Primary Language</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g., Chinese' {...field} />
                            </FormControl>
                            <FormDescription>
                                Your main language for source text.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='targetLanguage'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Translation Preference</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g., English' {...field} />
                            </FormControl>
                            <FormDescription>
                                Your preferred language for translations.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='openaiBase'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>OpenAI Base URL</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='https://api.openai.com/v1'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The base URL for OpenAI API requests.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='openaiKey'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>OpenAI API Key</FormLabel>
                            <FormControl>
                                <Input
                                    type='password'
                                    placeholder='Your API key'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Your OpenAI API key for translation services.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='smallModel'
                    render={({ field }) => (
                        <ModelSelector
                            field={field}
                            label='Small Model'
                            description='The small model for translation.'
                            defaultValue={field.value}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name='largeModel'
                    render={({ field }) => (
                        <ModelSelector
                            field={field}
                            label='Large Model'
                            description='The large model for translation.'
                            defaultValue={field.value}
                        />
                    )}
                />
                <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
