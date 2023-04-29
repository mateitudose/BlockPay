import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';


const QRCodeGenerator = ({ value, imageSrc }) => {
    const canvasRef = useRef();

    useEffect(() => {
        QRCode.toCanvas(canvasRef.current, value, {
            errorCorrectionLevel: 'H',
            margin: 2,
            quality: 1,
            width: 256,
            height: 256,
        }, (error) => {
            if (error) {
                console.error(error);
            }
        });
    }, [value]);

    return (
        <div>
            <canvas className='shadow-lg rounded-md' ref={canvasRef} />
        </div>
    );
};

export default QRCodeGenerator;
