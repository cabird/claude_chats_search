# conversations.json Schema Documentation

## Overview
- **Format**: JSON array of conversation objects
- **Total Conversations**: 208
- **File Size**: 13.4MB

## Data Structure

```
conversations.json (array)
└── conversation (object)
    ├── uuid (string)               - Unique conversation identifier
    ├── name (string)               - Conversation title [SEARCHABLE]
    ├── summary (string)            - AI-generated summary [SEARCHABLE]
    ├── created_at (string)         - ISO 8601 timestamp
    ├── updated_at (string)         - ISO 8601 timestamp
    ├── account (object)
    │   └── uuid (string)           - Account identifier
    └── chat_messages (array)
        └── message (object)
            ├── uuid (string)       - Message identifier
            ├── text (string)       - Main message text [SEARCHABLE]
            ├── sender (string)     - "human" or "assistant"
            ├── created_at (string) - ISO 8601 timestamp
            ├── updated_at (string) - ISO 8601 timestamp
            ├── attachments (array) - File attachments (if any)
            ├── files (array)       - Associated files (if any)
            └── content (array)     - Detailed message content
                └── content_block (object)
                    ├── type (string)           - "text", "thinking", "tool_use", "tool_result"
                    ├── text (string)           - Content text [SEARCHABLE]
                    ├── start_timestamp (string)
                    ├── stop_timestamp (string)
                    ├── flags (null|string)
                    └── citations (array)       - Citation references
```

## Searchable Fields for Keywords

### Primary Search Fields (Recommended)
1. **`conversation.name`** - Conversation titles
   - Short, descriptive titles
   - Best for quick topic identification

2. **`conversation.summary`** - AI-generated summaries
   - Comprehensive overview of conversation
   - Includes key topics and outcomes

3. **`chat_messages[].text`** - Main message text
   - Actual user and assistant messages
   - Primary conversational content

### Secondary Search Fields (Optional for Deep Search)
4. **`chat_messages[].content[].text`** - Detailed content blocks
   - May include "thinking" blocks (internal reasoning)
   - Tool usage details
   - More granular content

## Search Implementation Strategy

### Basic Keyword Search
```python
def search_conversations(data, keyword):
    results = []
    keyword_lower = keyword.lower()

    for conv in data:
        # Search in name
        if keyword_lower in conv['name'].lower():
            results.append(conv)
            continue

        # Search in summary
        if keyword_lower in conv['summary'].lower():
            results.append(conv)
            continue

        # Search in messages
        for msg in conv['chat_messages']:
            if keyword_lower in msg['text'].lower():
                results.append(conv)
                break

    return results
```

### Deep Search (Including Content Blocks)
```python
def deep_search_conversations(data, keyword):
    results = []
    keyword_lower = keyword.lower()

    for conv in data:
        found = False

        # Check name and summary
        if keyword_lower in conv['name'].lower() or \
           keyword_lower in conv['summary'].lower():
            found = True

        # Check messages and content blocks
        if not found:
            for msg in conv['chat_messages']:
                if keyword_lower in msg['text'].lower():
                    found = True
                    break

                # Deep search in content blocks
                for content in msg.get('content', []):
                    if content.get('text') and \
                       keyword_lower in content['text'].lower():
                        found = True
                        break

                if found:
                    break

        if found:
            results.append(conv)

    return results
```

## Additional Metadata

### Timestamps
All timestamps are in ISO 8601 format:
- `created_at`: "2025-10-22T23:20:18.677259Z"
- `updated_at`: "2025-10-22T23:21:40.240135Z"

### Message Sender Types
- `"human"` - User messages
- `"assistant"` - AI responses

### Content Block Types
- `"text"` - Standard text content
- `"thinking"` - Internal reasoning (extended thinking)
- `"tool_use"` - Tool invocation details
- `"tool_result"` - Results from tool execution

## Example Conversation Structure

```json
{
  "uuid": "9e8a5014-57e6-4353-9ecc-d565dad23d62",
  "name": "Simple file sharing service",
  "summary": "**Conversation Overview**\n\nThe user has an Azure subscription...",
  "created_at": "2025-10-22T23:20:18.677259Z",
  "updated_at": "2025-10-22T23:21:40.240135Z",
  "account": {
    "uuid": "c60062ce-07f9-4537-ba65-f89c044e04e7"
  },
  "chat_messages": [
    {
      "uuid": "3ca2ad7a-2700-4be5-8267-cdff4fec5c8c",
      "text": "I have an azure subscription...",
      "sender": "human",
      "created_at": "2025-10-22T23:20:19.816020Z",
      "updated_at": "2025-10-22T23:20:19.816020Z",
      "attachments": [],
      "files": [],
      "content": [
        {
          "type": "text",
          "text": "I have an azure subscription...",
          "start_timestamp": "2025-10-22T23:20:19.811677Z",
          "stop_timestamp": "2025-10-22T23:20:19.811677Z",
          "flags": null,
          "citations": []
        }
      ]
    }
  ]
}
```

## Indexing Recommendations

For efficient keyword searching on large datasets, consider:

1. **Full-text indexing** using SQLite FTS5 or Elasticsearch
2. **In-memory search** for small datasets (<100MB)
3. **Inverted index** for frequent searches
4. **Vector embeddings** for semantic search (using sentence transformers)

## File Statistics

- Total conversations: 208
- File size: 13.4MB
- Average conversation size: ~64KB
- Contains chat history with AI assistant
