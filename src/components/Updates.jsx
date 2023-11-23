import React, { useState, useEffect } from 'react';

const Updates = () => {
    const [nextUpdate, setNextUpdate] = useState(null);

    const schedule = [
        { place: 'CLT', arrival: null, departure: '2023-12-06T17:10:00' },
        { place: 'Mumbai', arrival: '2023-12-07T17:05:00', departure: '2023-12-07T23:25:00' },
        { place: 'Udaipur', arrival: '2023-12-08T14:40:00', departure: '2023-12-10T06:00:00' },
        { place: 'Ajmer', arrival: '2023-12-10T23:10:00', departure: '2023-12-11T12:20:00' },
        { place: 'Jaisalmer', arrival: '2023-12-10T22:30:00', departure: '2023-12-13T23:15:00' },
        { place: 'Jaipur', arrival: '2023-12-14T10:15:00', departure: '2023-12-15T17:35:00' },
        { place: 'Delhi', arrival: '2023-12-15T22:30:00', departure: '2023-12-16T05:40:00' },
        { place: 'CLT', arrival: '2023-12-18T03:32:00', departure: null },
    ];

    useEffect(() => {
        const findNextDeparture = () => {
            const now = new Date();

            const upcomingArrival = schedule.find(
                (event, index) => event.arrival && new Date(event.arrival) > now && new Date(schedule[index - 1].departure) < now
            );
            const upcomingDeparture = schedule.find(
                (event) => event.departure && new Date(event.departure) > now
            );

            if (upcomingDeparture) {
                const timeDifference = upcomingArrival ? new Date(upcomingArrival.arrival) - now : new Date(upcomingDeparture.departure) - now;
                setNextUpdate({
                    place: upcomingArrival ? upcomingArrival.place : upcomingDeparture.place,
                    arrival: upcomingArrival?.arrival,
                    timer: timeDifference,
                    inTrain: !!upcomingArrival,
                });
            } else {
                setNextUpdate(null);
            }
        };

        findNextDeparture();
        const timerId = setInterval(findNextDeparture, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);

        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    };

    return (
        <div className="card p-3 text-center shadow">
            {nextUpdate ? (
                <p className="fade-in">
                    {nextUpdate.inTrain ? `Will reach ${nextUpdate.place} within ${formatTime(nextUpdate.timer)}`:`Next train from ${nextUpdate.place} within ${formatTime(nextUpdate.timer)}`}
                </p>
            ) : (
                <p>No upcoming updates</p>
            )}
        </div>
    );
};

export default Updates;
