import { SelectProps } from '@radix-ui/react-select'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { ControllerRenderProps } from 'react-hook-form'

const langs = [
    'Chinese',
    'English',
    'French',
    'German',
    'Italian',
    'Japanese',
    'Korean',
    'Portuguese',
    'Russian',
    'Spanish',
    'Vietnamese',
]

interface LanguageSelectorProps extends SelectProps {
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field?: ControllerRenderProps<any, any>
}

export default function LanguageSelector(props: LanguageSelectorProps) {
    const { className, field, ...rest } = props
    return (
        <Select {...rest} {...field}>
            <SelectTrigger className={className}>
                <SelectValue placeholder='Select a language' />
            </SelectTrigger>
            <SelectContent>
                {langs.map(lang => (
                    <SelectItem key={lang} value={lang}>
                        {lang}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
