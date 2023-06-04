import { useState } from 'react';

const Tooltip = ({ children, content }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="">
            <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {children}
            </div>
            {showTooltip && (
                <div
                    className="absolute mt-3 px-2 py-1 text-sm text-white/90 bg-black border border-gray-400/20 rounded-md shadow-lg"
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
