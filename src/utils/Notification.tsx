import React from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => (
    <div className={`alert alert-${type === 'success' ? 'success' : 'danger'}`}>
        {message}
    </div>
);

export default Notification;
