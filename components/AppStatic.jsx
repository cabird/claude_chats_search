const { useState, useCallback, useEffect } = React;
const { FileUpload, SearchBox, ConversationCard, ConversationModal, Icon, StorageUtils } = App;

App.AppStatic = function AppStatic() {
    const [conversations, setConversations] = useState(null);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [dataSource, setDataSource] = useState(null); // 'storage' or 'upload'
    const [isLoadingStorage, setIsLoadingStorage] = useState(true);

    // Check for stored data on mount
    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const hasData = await StorageUtils.hasStoredData();
                if (hasData) {
                    const storedConversations = await StorageUtils.loadConversations();
                    setConversations(storedConversations);
                    setDataSource('storage');
                }
            } catch (error) {
                console.error('Error loading stored data:', error);
            } finally {
                setIsLoadingStorage(false);
            }
        };

        loadStoredData();
    }, []);

    const handleFileLoaded = useCallback(async (data) => {
        try {
            // Save to IndexedDB
            await StorageUtils.saveConversations(data);
            setConversations(data);
            setResults([]);
            setHasSearched(false);
            setDataSource('upload');
        } catch (error) {
            console.error('Error saving conversations to storage:', error);
            // Still set the conversations even if storage fails
            setConversations(data);
            setResults([]);
            setHasSearched(false);
            setDataSource('upload');
        }
    }, []);

    const handleClearStorage = useCallback(async () => {
        if (!confirm('Are you sure you want to delete all stored conversation data? This cannot be undone.')) {
            return;
        }

        try {
            await StorageUtils.clearAllData();
            setConversations(null);
            setResults([]);
            setHasSearched(false);
            setDataSource(null);
        } catch (error) {
            console.error('Error clearing storage:', error);
            alert('Failed to clear storage. Please try again.');
        }
    }, []);

    const searchConversations = useCallback((keyword, deep) => {
        if (!keyword.trim() || !conversations) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        // Use setTimeout to not block UI
        setTimeout(() => {
            const keywordLower = keyword.toLowerCase();
            const searchResults = [];

            for (const conv of conversations) {
                let found = false;
                const matchLocations = [];

                // Search in name
                if (conv.name && conv.name.toLowerCase().includes(keywordLower)) {
                    found = true;
                    matchLocations.push('title');
                }

                // Search in summary
                if (conv.summary && conv.summary.toLowerCase().includes(keywordLower)) {
                    found = true;
                    matchLocations.push('summary');
                }

                // Search in messages
                if (!found || deep) {
                    for (const msg of conv.chat_messages || []) {
                        if (msg.text && msg.text.toLowerCase().includes(keywordLower)) {
                            found = true;
                            matchLocations.push('message');
                            break;
                        }

                        // Deep search in content blocks
                        if (deep) {
                            for (const content of msg.content || []) {
                                if (content.text && content.text.toLowerCase().includes(keywordLower)) {
                                    found = true;
                                    matchLocations.push('content');
                                    break;
                                }
                            }

                            if (found && !deep) break;
                        }
                    }
                }

                if (found) {
                    const result = {
                        uuid: conv.uuid,
                        name: conv.name,
                        summary: conv.summary && conv.summary.length > 300
                            ? conv.summary.substring(0, 300) + '...'
                            : conv.summary || '',
                        created_at: conv.created_at,
                        updated_at: conv.updated_at,
                        message_count: (conv.chat_messages || []).length,
                        match_locations: [...new Set(matchLocations)]
                    };
                    searchResults.push(result);
                }
            }

            setResults(searchResults);
            setIsSearching(false);
        }, 10);
    }, [conversations]);

    const handleCardClick = useCallback((uuid) => {
        if (!conversations) return;

        const conversation = conversations.find(conv => conv.uuid === uuid);
        if (conversation) {
            setSelectedConversation(conversation);
        }
    }, [conversations]);

    const handleCloseModal = useCallback(() => {
        setSelectedConversation(null);
    }, []);

    if (isLoadingStorage) {
        return (
            <div className="container">
                <header className="header">
                    <h1>Claude Conversations Search</h1>
                    <p>Loading stored data...</p>
                </header>
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!conversations) {
        return (
            <div className="container">
                <header className="header">
                    <h1>Claude Conversations Search</h1>
                    <p>Search through your Claude conversation history</p>
                </header>

                <FileUpload onFileLoaded={handleFileLoaded} />
            </div>
        );
    }

    return (
        <div className="container">
            <header className="header">
                <h1>Claude Conversations Search</h1>
                <p>Searching {conversations.length} conversations</p>
                <div className="header-actions">
                    {dataSource === 'storage' && (
                        <div className="data-source-badge">
                            <Icon name="Database" size={14} />
                            Loaded from browser storage
                        </div>
                    )}
                    {dataSource === 'upload' && (
                        <div className="data-source-badge upload">
                            <Icon name="Upload" size={14} />
                            Newly uploaded (saved to storage)
                        </div>
                    )}
                    <button
                        className="reload-button"
                        onClick={() => setConversations(null)}
                    >
                        <Icon name="RotateCcw" size={16} />
                        Load Different File
                    </button>
                    <button
                        className="delete-button"
                        onClick={handleClearStorage}
                        title="Delete stored conversation data"
                    >
                        <Icon name="Trash2" size={16} />
                        Delete Stored Data
                    </button>
                </div>
            </header>

            <SearchBox
                onSearch={searchConversations}
                resultsCount={hasSearched ? results.length : null}
                isLoading={isSearching}
            />

            <div className="results-container">
                {isSearching && (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                )}

                {!isSearching && hasSearched && results.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="Search" size={48} />
                        </div>
                        <h3>No conversations found</h3>
                        <p>Try different keywords or enable deep search</p>
                    </div>
                )}

                {!isSearching && !hasSearched && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="MessageSquare" size={48} />
                        </div>
                        <h3>Start searching</h3>
                        <p>Enter keywords to search through {conversations.length} conversations</p>
                    </div>
                )}

                {!isSearching && results.length > 0 && results.map((conversation) => (
                    <ConversationCard
                        key={conversation.uuid}
                        conversation={conversation}
                        onClick={() => handleCardClick(conversation.uuid)}
                    />
                ))}
            </div>

            {selectedConversation && (
                <ConversationModal
                    conversation={selectedConversation}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};
