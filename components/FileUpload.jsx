const { useState, useCallback } = React;
const { Icon } = App;

App.FileUpload = function FileUpload({ onFileLoaded }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFile = useCallback(async (file) => {
        if (!file) return;

        const isZip = file.name.endsWith('.zip');
        const isJson = file.name.endsWith('.json');

        if (!isZip && !isJson) {
            setError('Please upload a ZIP file or JSON file');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let jsonText;

            if (isZip) {
                // Handle ZIP file
                if (!window.JSZip) {
                    throw new Error('JSZip library not loaded');
                }

                const arrayBuffer = await file.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);

                // Find conversations.json in the zip
                const conversationsFile = zip.file('conversations.json');
                if (!conversationsFile) {
                    throw new Error('conversations.json not found in ZIP file');
                }

                jsonText = await conversationsFile.async('string');
            } else {
                // Handle JSON file directly
                jsonText = await file.text();
            }

            const data = JSON.parse(jsonText);

            // Validate it looks like conversations data
            if (!Array.isArray(data)) {
                throw new Error('JSON file must contain an array of conversations');
            }

            if (data.length > 0 && !data[0].uuid) {
                throw new Error('Invalid conversation format');
            }

            onFileLoaded(data);
        } catch (err) {
            console.error('Error loading file:', err);
            setError(err.message || 'Failed to load file');
        } finally {
            setIsLoading(false);
        }
    }, [onFileLoaded]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileSelect = useCallback((e) => {
        const file = e.target.files[0];
        handleFile(file);
    }, [handleFile]);

    return (
        <div className="file-upload-container">
            <div
                className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {isLoading ? (
                    <div className="upload-content">
                        <div className="spinner"></div>
                        <p>Loading conversations...</p>
                    </div>
                ) : (
                    <div className="upload-content">
                        <Icon name="Upload" size={48} />
                        <h3>Drop your export file here</h3>
                        <p>Accepts .zip or conversations.json</p>
                        <input
                            type="file"
                            accept=".json,.zip"
                            onChange={handleFileSelect}
                            className="file-input"
                        />
                    </div>
                )}

                {error && (
                    <div className="upload-error">
                        <Icon name="AlertCircle" size={20} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            <div className="upload-help">
                <Icon name="Info" size={16} />
                <div>
                    <p style={{ marginBottom: '0.75rem', fontWeight: '600' }}>How to export your conversations from Claude:</p>
                    <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
                        <li>Click your <strong>initials</strong> (lower left corner)</li>
                        <li>Select <strong>Settings</strong></li>
                        <li>Go to <strong>Privacy</strong> section</li>
                        <li>Click <strong>Export data</strong></li>
                        <li>Drop the <strong>zip file</strong> here (or extract and upload conversations.json)</li>
                    </ol>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: '0.9' }}>Note: Export is only available on web or desktop app (not mobile)</p>
                </div>
            </div>
        </div>
    );
};
