import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LineController,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { useEffect, useRef } from 'react';

ChartJS.register(
    LineElement,
    PointElement,
    LineController,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
);

export default function Chart() {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55],
                fill: true, // Enable filling the area under the line
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Set the background color
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        legend: {
            display: false,
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Months'
                },
                grid: {
                    display: false
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Value'
                },
                grid: {
                    display: false
                }
            }
        }
    };


    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            chartRef.current = new ChartJS(ctx, {
                type: 'line',
                data,
                options
            });
        }
    }, []);

    return (
        <div className="w-full h-full">
            <canvas ref={canvasRef} />
        </div>
    );
}