import React from 'react';

interface ImageViewerProps {
    url: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ url }) => {
    return (
        <div>
            <img src={url} alt="Resume" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
    );
};

export default ImageViewer;
