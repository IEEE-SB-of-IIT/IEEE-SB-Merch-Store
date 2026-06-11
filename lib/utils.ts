/** Join class names, skipping falsy values (dependency-free shadcn-style cn). */
export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
