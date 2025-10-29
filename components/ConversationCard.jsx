const { Icon } = App;

App.ConversationCard = function ConversationCard({ conversation, onClick }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getBadgeIcon = (matchType) => {
        switch(matchType) {
            case 'title': return 'Heading';
            case 'summary': return 'FileText';
            case 'message': return 'MessageSquare';
            case 'content': return 'Code';
            default: return 'Check';
        }
    };

    const getBadgeLabel = (matchType) => {
        switch(matchType) {
            case 'title': return 'Title';
            case 'summary': return 'Summary';
            case 'message': return 'Message';
            case 'content': return 'Content';
            default: return matchType;
        }
    };

    return (
        <div className="conversation-card" onClick={onClick}>
            <div className="card-header">
                <h3 className="card-title">{conversation.name}</h3>
                <div className="card-badges">
                    {conversation.match_locations && conversation.match_locations.map((location) => (
                        <span key={location} className={`badge match-${location}`}>
                            <Icon name={getBadgeIcon(location)} size={12} />
                            {getBadgeLabel(location)}
                        </span>
                    ))}
                </div>
            </div>

            <p className="card-summary">{conversation.summary}</p>

            <div className="card-meta">
                <div className="meta-item">
                    <Icon name="Calendar" size={14} />
                    <span>{formatDate(conversation.created_at)}</span>
                </div>
                <div className="meta-item">
                    <Icon name="MessageCircle" size={14} />
                    <span>{conversation.message_count} messages</span>
                </div>
                <div className="meta-item">
                    <Icon name="Clock" size={14} />
                    <span>Updated {formatDate(conversation.updated_at)}</span>
                </div>
            </div>
        </div>
    );
};
