import React from 'react';
import ImageViewer from './ImageViewer';
import { Worker, Viewer, SpecialZoomLevel, PageLayout } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface ResumeViewerProps {
    url: string;
    format: string;
    pageLayout?: PageLayout; 
    workerUrl?: string; 
    styles?: React.CSSProperties;
    onDocumentLoad?: (pageCount: number) => void;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ url, format, pageLayout, workerUrl, styles, onDocumentLoad }) => {
    const isImage = ['jpg', 'jpeg', 'png'].includes(format);

    if (isImage) {
        return <ImageViewer url={url} />;
    }

    return (
        <div style={{ border: '1px solid #e3e6f0', padding: '15px', backgroundColor: '#ffffff' }}>
            <Worker workerUrl={workerUrl || "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"}>
                <Viewer
                    fileUrl={url}
                    defaultScale={SpecialZoomLevel.PageWidth}
                    pageLayout={pageLayout}
                    onDocumentLoad={(e) => onDocumentLoad?.(e.doc.numPages)}
                />
            </Worker>
        </div>
    );
};

export default ResumeViewer;
