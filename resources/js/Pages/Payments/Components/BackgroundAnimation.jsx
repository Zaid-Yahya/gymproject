import React from 'react';

export default function BackgroundAnimation() {
    return (
        <div
            className="simple-background"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                overflow: 'hidden'
            }}
        />
    );
} 