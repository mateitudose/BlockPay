import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
} from "recharts";

export default function Chart({ data, n }) {
    let color = "";
    if (n > 0)
        color = "#22C55E";
    else if (n < 0)
        color = "#EF4444";
    else
        color = "#EAB308";

    // const data = [];
    // for (let num = 30; num >= 0; num--) {
    //     data.push({
    //         value: 1 + Math.random(),
    //     });
    // }

    return (
        <ResponsiveContainer width={200} height={100}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    fill="url(#color)"
                    type="monotoneX"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}