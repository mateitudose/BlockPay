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
                data: [65, 59, 80, 81, 56, 55],
                fill: true, // Enable filling the area under the line
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Set the background color
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.5,
                pointRadius: 0,
            }
        ]

    };

    const options = {
        responsive: true,
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
        scales: {
            x: {
                display: false,
                title: {
                    display: false,
                    text: 'Months'
                },
                grid: {
                    display: false
                }
            },
            y: {
                display: false,
                title: {
                    display: false,
                    text: 'Value'
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
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
        <div className="w-[400px] h-[400px]">
            <canvas ref={canvasRef} />
        </div>
    );
}