# Claude Conversations Search

A Flask web application with React frontend to search through your Claude conversation history by keywords.

## Features

- **Fast keyword search** across conversation titles, summaries, and messages
- **Deep search mode** to search within detailed content blocks
- **Click-to-view modal** - Click any conversation card to view the full conversation
- **In-conversation search** - Search within a conversation and jump between matches with next/prev buttons
- **Beautiful UI** with gradient background and card-based results
- **Match highlighting** showing where keywords were found (title, summary, message, content)
- **Responsive design** works on desktop and mobile
- **Real-time search** as you type (press Enter)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Default port (5000):
```bash
python app.py
```

### Custom port:
```bash
python app.py -p 8080
```

### Custom host and port:
```bash
python app.py --host 0.0.0.0 -p 3000
```

Then open your browser to `http://localhost:5000` (or your custom port).

## Command Line Options

- `-p, --port` - Port to run the server on (default: 5000)
- `--host` - Host to bind to (default: 127.0.0.1)

## Project Structure

```
.
├── app.py                      # Flask backend with search API
├── conversations.json          # Your conversation data
├── index.html                  # Main HTML with React setup
├── components/
│   ├── Icon.js                 # Lucide icon wrapper
│   ├── SearchBox.jsx           # Search input component
│   ├── ConversationCard.jsx    # Result card component
│   ├── ConversationModal.jsx   # Full conversation modal with search
│   └── App.jsx                 # Main app component
├── requirements.txt            # Python dependencies
├── README.md                   # This file
└── SCHEMA.md                   # Data schema documentation
```

## How It Works

### Backend (Flask)
- Serves the React frontend
- Provides `/api/search` endpoint for keyword searches
- Searches across conversation names, summaries, and messages
- Supports deep search mode for content blocks

### Frontend (React)
- In-browser React with Babel Standalone (no build step needed)
- Uses Lucide icons for UI elements
- Responsive design with modern styling
- Real-time search with debouncing

## Search Tips

1. **Basic search**: Type keywords and press Enter to search titles, summaries, and messages
2. **Deep search**: Enable "Deep search" checkbox to also search within content blocks (slower but more thorough)
3. **Multiple results**: Each card shows where the keyword was found (badges: Title, Summary, Message, Content)
4. **View conversation**: Click any result card to open the full conversation in a modal
5. **Search within conversation**: Use the search box in the modal to find specific terms within that conversation
6. **Navigate matches**: Use the up/down arrow buttons or press Enter (next) / Shift+Enter (previous) to jump between matches

## API Endpoints

### GET `/api/search`
Search conversations by keyword.

**Query Parameters:**
- `q` (string, required) - Search keyword
- `deep` (boolean, optional) - Enable deep search (default: false)

**Response:**
```json
[
  {
    "uuid": "...",
    "name": "Conversation title",
    "summary": "Summary text...",
    "created_at": "2025-10-22T23:20:18.677259Z",
    "updated_at": "2025-10-22T23:21:40.240135Z",
    "message_count": 10,
    "match_locations": ["title", "summary"]
  }
]
```

### GET `/api/conversation/<uuid>`
Get full conversation details by UUID.

## Data Schema

See [SCHEMA.md](SCHEMA.md) for detailed information about the conversation data structure.

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: React 18 (in-browser with Babel Standalone)
- **Icons**: Lucide Icons
- **Styling**: Custom CSS with gradient backgrounds

## License

MIT
