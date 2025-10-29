const { useState, useEffect, useRef } = React;
const { Icon } = App;

App.ConversationModal = function ConversationModal({ conversation, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [matchCount, setMatchCount] = useState(0);
    const modalContentRef = useRef(null);
    const matchRefs = useRef([]);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (searchTerm && modalContentRef.current) {
            // Count matches
            const content = modalContentRef.current.textContent.toLowerCase();
            const term = searchTerm.toLowerCase();
            const matches = content.split(term).length - 1;
            setMatchCount(matches);
            setCurrentMatchIndex(matches > 0 ? 0 : -1);
        } else {
            setMatchCount(0);
            setCurrentMatchIndex(-1);
        }
    }, [searchTerm]);

    const highlightText = (text) => {
        if (!searchTerm || !text) return text;

        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) => {
            if (part.toLowerCase() === searchTerm.toLowerCase()) {
                return (
                    <mark
                        key={index}
                        className="highlight"
                        ref={el => {
                            if (el && matchRefs.current.indexOf(el) === -1) {
                                matchRefs.current.push(el);
                            }
                        }}
                    >
                        {part}
                    </mark>
                );
            }
            return part;
        });
    };

    const goToNextMatch = () => {
        if (matchCount === 0) return;
        const newIndex = (currentMatchIndex + 1) % matchCount;
        setCurrentMatchIndex(newIndex);
        scrollToMatch(newIndex);
    };

    const goToPrevMatch = () => {
        if (matchCount === 0) return;
        const newIndex = currentMatchIndex === 0 ? matchCount - 1 : currentMatchIndex - 1;
        setCurrentMatchIndex(newIndex);
        scrollToMatch(newIndex);
    };

    const scrollToMatch = (index) => {
        const elements = modalContentRef.current.querySelectorAll('mark.highlight');
        if (elements[index]) {
            elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            elements[index].classList.add('current-match');
            elements.forEach((el, i) => {
                if (i !== index) el.classList.remove('current-match');
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                goToPrevMatch();
            } else {
                goToNextMatch();
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">{conversation.name}</h2>
                        <div className="modal-meta">
                            <span>
                                <Icon name="Calendar" size={14} />
                                {formatDate(conversation.created_at)}
                            </span>
                            <span>
                                <Icon name="MessageCircle" size={14} />
                                {conversation.chat_messages.length} messages
                            </span>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <Icon name="X" size={24} />
                    </button>
                </div>

                <div className="modal-search">
                    <div className="modal-search-input-wrapper">
                        <Icon name="Search" size={18} />
                        <input
                            type="text"
                            placeholder="Search within conversation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="modal-search-input"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear search"
                            >
                                <Icon name="X" size={16} />
                            </button>
                        )}
                    </div>

                    {searchTerm && (
                        <div className="modal-search-controls">
                            <span className="match-counter">
                                {matchCount > 0 ? `${currentMatchIndex + 1} / ${matchCount}` : '0 matches'}
                            </span>
                            <button
                                className="nav-button"
                                onClick={goToPrevMatch}
                                disabled={matchCount === 0}
                                aria-label="Previous match"
                            >
                                <Icon name="ChevronUp" size={16} />
                            </button>
                            <button
                                className="nav-button"
                                onClick={goToNextMatch}
                                disabled={matchCount === 0}
                                aria-label="Next match"
                            >
                                <Icon name="ChevronDown" size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="modal-content" ref={modalContentRef}>
                    {conversation.summary && (
                        <div className="conversation-summary">
                            <div className="summary-header">
                                <Icon name="FileText" size={18} />
                                <h3>Conversation Summary</h3>
                            </div>
                            <div className="summary-text">
                                {highlightText(conversation.summary)}
                            </div>
                        </div>
                    )}

                    {conversation.chat_messages.map((message, index) => (
                        <div key={message.uuid} className={`message ${message.sender}`}>
                            <div className="message-header">
                                <div className="message-sender">
                                    <Icon
                                        name={message.sender === 'human' ? 'User' : 'Bot'}
                                        size={16}
                                    />
                                    <span>{message.sender === 'human' ? 'You' : 'Claude'}</span>
                                </div>
                                <div className="message-time">
                                    {formatDate(message.created_at)}
                                </div>
                            </div>
                            <div className="message-text">
                                {highlightText(message.text)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
