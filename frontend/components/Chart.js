import {
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

export default function Chart({ data, n }) {
    let color = "";
    if (n > 0)
        color = "#22C55E";
    else if (n < 0)
        color = "#EF4444";
    else
        color = "#EAB308";

    return (
        <ResponsiveContainer width={150} height={75}>
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