import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with Tailwind CSS conflict resolution.
 * @param {...any} inputs - Class names to merge.
 * @returns {string} - Merged class names.
 */
export function cn(...inputs) {
    return twMerge(clsx(...inputs))
}
