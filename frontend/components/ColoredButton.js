export default function ColoredButton({ content, href }) {
    return (
        <a
            className="text-sm h-10 pl-4 pr-4 rounded-md gap-1 font-semibold bg-white text-black hover:bg-white/90 focus:ring-2 focus:ring-white/20 focus:outline-none focus:bg-white/90 disabled:hover:bg-white items-center border justify-center select-none hidden sm:inline-flex"
            href={href}
            style={{
                boxShadow: 'rgba(53,247,143,0.3) -8px 0px 20px, rgba(235,56,54,0.3) 8px 0px 20px',
            }}
        >
            {content}
        </a>
    )
}