import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// =============================================================================
// `cn` helper — clsx + tailwind-merge sandwich
// =============================================================================
// `clsx` koşullu sınıfları string'e çeviriyor ('foo', { bar: cond, baz: !cond })
// `tailwind-merge` aynı kategoriden çakışan tailwind class'larını çözüyor:
//    'p-2 p-4'   → 'p-4' (sonradan gelen kazanır)
//    'text-red text-blue' → 'text-blue'
//
// Component'lerde variant + custom className combine için standart pattern:
//   className={cn('base classes', variantClasses[variant], className)}
// =============================================================================
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
