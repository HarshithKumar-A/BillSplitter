import React, { useState, useEffect } from 'react';
import { getUserName } from '../API/localStorage';
import { fetchData } from '../API/api';

const Updates = () => {
    const [nextUpdate, setNextUpdate] = useState(null);
    const [update, setUpdate] = useState(null);

    const schedule = [
        { place: 'Mangalore', arrival: null, departure: '2024-12-30T12:05:00' },
        { place: 'Madgon', arrival: '2024-12-30T17:00:00', departure: '2024-12-30T17:10:00' },
        { place: 'Madgon', arrival: null, departure: '2025-01-02T01:05:00' },
        { place: 'Mangalore', arrival: '2025-01-02T07:40:00', departure: null },
    ];

    useEffect(() => {
        fetchData('getUpdate', false)
            .then((data) => {
                setUpdate(data?.result?.message)
            })
            .catch((error) => {
                console.error('Error fetching expense history:', error);
            });
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
            <div>Hi <b className='bold'>{getUserName()}</b>,</div>
            {nextUpdate ? (
                <p className="fade-in">
                    {nextUpdate.inTrain ? `Will reach ${nextUpdate.place} within ${formatTime(nextUpdate.timer)}` : `Next train from ${nextUpdate.place} within ${formatTime(nextUpdate.timer)}`}
                </p>
            ) : (
                <p>No upcoming updates</p>
            )}
            {update && <p style={{ fontSize: "14px" }} className='card p-1' dangerouslySetInnerHTML={{ __html: update }}></p>}
        </div>
    );
};

export default Updates;
