const Badge = ({ color, text, icon }) => {
    const colorClasses = {
        gray: {
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            ring: 'ring-gray-500/10',
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-700',
            ring: 'ring-red-600/10',
        },
        yellow: {
            bg: 'bg-yellow-500/20',
            text: 'text-yellow-500',
            ring: 'ring-yellow-300/20',
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-700',
            ring: 'ring-green-600/20',
        },
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            ring: 'ring-blue-700/10',
        },
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-700',
            ring: 'ring-indigo-700/10',
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-700',
            ring: 'ring-purple-700/10',
        },
        pink: {
            bg: 'bg-pink-50',
            text: 'text-pink-700',
            ring: 'ring-pink-700/10',
        },
    };

    const classes = colorClasses[color];

    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 font-medium ${classes.bg} ${classes.text} ring-1 ring-inset ${classes.ring}`}
        >
            {text} 
            {icon && (
                <span className="ml-1">
                    {icon}
                </span>
            )}
        </span>
    );
};

export default Badge;