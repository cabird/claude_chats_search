const { useState, useCallback } = React;
const { SearchBox, ConversationCard, ConversationModal, Icon } = App;

App.App = function App() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isLoadingConversation, setIsLoadingConversation] = useState(false);

    const handleSearch = useCallback(async (query, deep) => {
        if (!query.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setHasSearched(true);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&deep=${deep}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCardClick = useCallback(async (uuid) => {
        setIsLoadingConversation(true);
        try {
            const response = await fetch(`/api/conversation/${uuid}`);
            const data = await response.json();
            setSelectedConversation(data);
        } catch (error) {
            console.error('Failed to load conversation:', error);
        } finally {
            setIsLoadingConversation(false);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedConversation(null);
    }, []);

    return (
        <div className="container">
            <header className="header">
                <h1>Claude Conversations Search</h1>
                <p>Search through your Claude conversation history</p>
            </header>

            <SearchBox
                onSearch={handleSearch}
                resultsCount={hasSearched ? results.length : null}
                isLoading={isLoading}
            />

            <div className="results-container">
                {isLoading && (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                )}

                {!isLoading && hasSearched && results.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="Search" size={48} />
                        </div>
                        <h3>No conversations found</h3>
                        <p>Try different keywords or enable deep search</p>
                    </div>
                )}

                {!isLoading && !hasSearched && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="MessageSquare" size={48} />
                        </div>
                        <h3>Start searching</h3>
                        <p>Enter keywords to search through 208 conversations</p>
                    </div>
                )}

                {!isLoading && results.length > 0 && results.map((conversation) => (
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

            {isLoadingConversation && (
                <div className="modal-overlay">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
