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
})

// Define the type for our form values
type FormValues = z.infer<typeof formSchema>

// Default values for the form
const defaultValues: Partial<FormValues> = {
  primaryLanguage: 'Chinese',
  targetLanguage: 'English',
  openaiBase: 'https://api.openai.com/v1',
  openaiKey: '',
}

export function SettingsDialog() {
  const [open, setOpen] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Handle form submission
  function onSubmit(data: FormValues) {
    // Save settings to localStorage or state management
    localStorage.setItem('translatorSettings', JSON.stringify(data))
    console.log('Settings saved:', data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* The trigger button will be passed as a child from the parent component */}
        <span />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your translation preferences and API settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="primaryLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Language</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chinese" {...field} />
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
              name="targetLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation Preference</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., English" {...field} />
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
              name="openaiBase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI Base URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.openai.com/v1" {...field} />
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
              name="openaiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your OpenAI API key for translation services.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// This component is used to open the settings dialog from any parent component
export function SettingsButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
  // Load saved settings from localStorage if available
  const savedSettings = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('translatorSettings') || '{}') 
    : {};
  
  const initialValues = {
    primaryLanguage: savedSettings.primaryLanguage || defaultValues.primaryLanguage,
    targetLanguage: savedSettings.targetLanguage || defaultValues.targetLanguage,
    openaiBase: savedSettings.openaiBase || defaultValues.openaiBase,
    openaiKey: savedSettings.openaiKey || defaultValues.openaiKey,
  };

  // Initialize the form with saved values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Handle form submission
  function onSubmit(data: FormValues) {
    // Save settings to localStorage
    localStorage.setItem('translatorSettings', JSON.stringify(data));
    console.log('Settings saved:', data);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="primaryLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Language</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Chinese" {...field} />
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
          name="targetLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Translation Preference</FormLabel>
              <FormControl>
                <Input placeholder="e.g., English" {...field} />
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
          name="openaiBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI Base URL</FormLabel>
              <FormControl>
                <Input placeholder="https://api.openai.com/v1" {...field} />
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
          name="openaiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your API key" {...field} />
              </FormControl>
              <FormDescription>
                Your OpenAI API key for translation services.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
