const { useState, useCallback } = React;
const { Icon } = App;

App.SearchBox = function SearchBox({ onSearch, resultsCount, isLoading }) {
    const [query, setQuery] = useState('');
    const [deepSearch, setDeepSearch] = useState(false);

    const handleSearch = useCallback(() => {
        onSearch(query, deepSearch);
    }, [query, deepSearch, onSearch]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-box">
            <div className="search-input-wrapper">
                <Icon name="Search" size={20} className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search conversations..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                />
            </div>

            <div className="search-options">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={deepSearch}
                        onChange={(e) => setDeepSearch(e.target.checked)}
                    />
                    Deep search (includes content blocks)
                </label>

                {resultsCount !== null && (
                    <div className="stats">
                        {isLoading ? 'Searching...' : `${resultsCount} result${resultsCount !== 1 ? 's' : ''}`}
                    </div>
                )}
            </div>
        </div>
    );
};
