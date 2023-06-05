export default function PrimaryButton({ content, onClick, disabled, href, classNames }) {
    return (
        <button
            type="button"
            className={`flex w-full justify-center border rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${classNames}`}
            onClick={onClick}
            disabled={disabled}
            href={href}
        >
            {content}
        </button>
    )
}