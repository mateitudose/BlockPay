import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';


const QRCodeGenerator = ({ value }) => {
    const canvasRef = useRef();
    const [size, setSize] = useState(256);

    useEffect(() => {
        const updateQRCode = (width, height) => {
            QRCode.toCanvas(
                canvasRef.current,
                value,
                {
                    errorCorrectionLevel: 'H',
                    margin: 2,
                    quality: 1,
                    width,
                    height,
                },
                (error) => {
                    if (error) {
                        console.error(error);
                    }
                }
            );
        };

        updateQRCode(size, size);

        // Set a timer to update the size after 3 seconds (3000 milliseconds)
        const timer = setTimeout(() => {
            setSize(1024);
        }, 500);

        // Clean up the timer when the component is unmounted or the value changes
        return () => clearTimeout(timer);
    }, [value, size]);

    return (
        <div>
            <canvas className='shadow-lg rounded-md max-w-[16rem] max-h-[16rem]' ref={canvasRef} />
        </div>
    );
};

export default QRCodeGenerator;
