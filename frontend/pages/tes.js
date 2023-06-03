import { useState } from "react";

export default function HoverPopover() {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="relative">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                Hover over me
            </button>

            {hovered && (
                <div
                    className="
            absolute 
            bg-white 
            shadow-lg 
            px-4 py-2 
            rounded 
            mt-2
            border 
            border-gray-200
            text-gray-700
            z-10
          "
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    This is the popover content.
                </div>
            )}
        </div>
    );
}
