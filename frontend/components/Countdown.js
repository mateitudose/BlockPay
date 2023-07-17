import Badge from '@/components/LightBadge';

const Countdown = ({ timeLeft }) => {
    const formatTime = (seconds) => {
        if (seconds < 0) {
            return '00:00'
        };
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <Badge color="gray" text={formatTime(timeLeft)} />
        </div>
    );
};

export default Countdown;
