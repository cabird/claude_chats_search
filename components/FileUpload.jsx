const { useState, useCallback } = React;
const { Icon } = App;

App.FileUpload = function FileUpload({ onFileLoaded }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFile = useCallback(async (file) => {
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            setError('Please upload a JSON file');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const text = await file.text();
            const data = JSON.parse(text);

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
                        <h3>Drop your conversations.json file here</h3>
                        <p>or click to browse</p>
                        <input
                            type="file"
                            accept=".json"
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
                <p>Upload a conversations.json file exported from Claude to search through your conversation history</p>
            </div>
        </div>
    );
};
