import { ComponentProps } from 'react'

export interface BadgeProps extends ComponentProps<'span'> {}

export function Badge(props: BadgeProps) {
    const { className, children, ...rest } = props
    return (
        <span
            {...rest}
            className={`inline-flex items-center rounded bg-muted px-1 py-0.5 text-xs font-medium text-muted-foreground ${className}`}
        >
            {children}
        </span>
    )
}
