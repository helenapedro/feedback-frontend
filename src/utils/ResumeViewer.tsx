// ResumeViewer.tsx
import React from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import ImageViewer from './ImageViewer';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface ResumeViewerProps {
    url: string;
    format: string;
    //onDocumentLoad?: (pageCount: number) => void;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ url, format }) => {
    const isImage = ['jpg', 'jpeg', 'png'].includes(format);

    if (isImage) {
        return <ImageViewer url={url} />;
    }

    return (
        <div style={{ border: '1px solid #e3e6f0', padding: '15px', backgroundColor: '#ffffff' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={url}
                    defaultScale={SpecialZoomLevel.PageWidth}
                    //onDocumentLoad={(e) => onDocumentLoad?.(e.doc.numPages)}
                />
            </Worker>
        </div>
    );
};

export default ResumeViewer;
