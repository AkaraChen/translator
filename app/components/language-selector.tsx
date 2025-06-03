import { SelectProps } from '@radix-ui/react-select'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { ControllerRenderProps } from 'react-hook-form'
import { langs } from '~/lib/lang'

interface LanguageSelectorProps extends SelectProps {
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: ControllerRenderProps<any, any>
    enableAuto?: boolean
}

export default function LanguageSelector(props: LanguageSelectorProps) {
    const { className, field, enableAuto, ...rest } = props
    return (
        <Select {...rest} {...field}>
            <SelectTrigger className={className}>
                <SelectValue placeholder='Select a language' />
            </SelectTrigger>
            <SelectContent>
                {enableAuto && (
                    <SelectItem key='auto' value='auto'>
                        Auto
                    </SelectItem>
                )}
                {langs.map(lang => (
                    <SelectItem key={lang} value={lang}>
                        {lang}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
