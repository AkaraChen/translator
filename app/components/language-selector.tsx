import { SelectProps } from '@radix-ui/react-select'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

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

interface LanguageSelectorProps extends SelectProps {}

export default function LanguageSelector(props: LanguageSelectorProps) {
    return (
        <Select {...props}>
            <SelectTrigger>
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
