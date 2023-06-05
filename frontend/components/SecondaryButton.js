export default function SecondaryButton({ content, href, classNames }) {
    return (
        <a href={href} className={`opacity-80 inline-flex items-center justify-center py-2 px-4 text-sm font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md hover:opacity-100 focus:ring-2 focus:ring-zinc-700 focus:outline-none ${classNames}`}>
            {content}
        </a>
    )
}