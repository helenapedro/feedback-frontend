import React from 'react';
import ImageViewer from '../../utils/ImageViewer';
import { Worker, Viewer, SpecialZoomLevel, PageLayout } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

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
    const isPDF = format === 'pdf';

    const zoomPluginInstance = zoomPlugin();
    const toolbarPluginInstance = toolbarPlugin();

    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
    const { Toolbar } = toolbarPluginInstance;

    if (isImage) {
        return <ImageViewer url={url} />;
    }

    if (isPDF) {
        return (
            <div style={{ border: '1px solid #e3e6f0', padding: '15px', backgroundColor: '#ffffff' }}>
                <Worker workerUrl={workerUrl || "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"}>
                    <Toolbar>
                        {(props: ToolbarSlot) => (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ZoomOutButton />
                                <ZoomPopover />
                                <ZoomInButton />
                            </div>
                        )}
                    </Toolbar>
                    <Viewer
                        fileUrl={url}
                        defaultScale={SpecialZoomLevel.ActualSize}
                        pageLayout={pageLayout}
                        onDocumentLoad={(e) => onDocumentLoad?.(e.doc.numPages)}
                        plugins={[zoomPluginInstance, toolbarPluginInstance]}
                    />
                </Worker>
            </div>
        );
    }

    return <div>Unsupported file format</div>;
};

export default ResumeViewer;
