import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '~/components/ui/select'
import {
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from './ui/form'
import { ControllerRenderProps } from 'react-hook-form'
import { forwardRef, ReactNode } from 'react'
import { useModels, Credentials } from '~/requests/openai'

interface ModelSelectorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: ControllerRenderProps<any, any>
    label: ReactNode
    description: ReactNode
    defaultValue?: string
    credentials?: Credentials
}

const ModelSelector = forwardRef<HTMLSelectElement, ModelSelectorProps>(
    function (props, ref) {
        const { field, label, description, defaultValue, credentials } = props
        const models = useModels(credentials)
        return (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                    // @ts-expect-error fuck
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ref={ref as any}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder='Select a model' />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {models.data
                            ? models.data.map(model => (
                                  <SelectItem key={model} value={model}>
                                      {model}
                                  </SelectItem>
                              ))
                            : Boolean(defaultValue) && (
                                  <SelectItem value={defaultValue!}>
                                      {defaultValue}
                                  </SelectItem>
                              )}
                    </SelectContent>
                </Select>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
            </FormItem>
        )
    },
)

ModelSelector.displayName = 'ModelSelector'

export default ModelSelector
