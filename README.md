# Claude Conversations Search

A web application to search through your Claude conversation history. Runs entirely in your browser - no backend required!

## 🚀 Try It Now

**[https://cabird.github.io/claude_chats_search](https://cabird.github.io/claude_chats_search)**

Just drag and drop your `conversations.json` file to start searching!

## How to Export Your Conversations from Claude

Before you can use this tool, you need to export your conversation data from Claude:

1. Click on your **initials** in the lower left corner of your Claude account
2. Select **"Settings"** from the menu
3. Navigate to the **Privacy** section
4. Click the **"Export data"** button
5. Download the **zip file**
6. Drop the zip file directly on the app (it will automatically extract `conversations.json`)

**Note:** Data exports are available from the Claude web app or Claude Desktop. You can't export from the iOS or Android apps.

## Features

- **📤 Drag & Drop** - Drop the zip file or conversations.json directly (auto-extracts from zip)
- **💾 Automatic Storage** - Uploaded data saved to browser storage, persists between sessions
- **🔍 Fast keyword search** across conversation titles, summaries, and messages
- **🔎 Deep search mode** to search within detailed content blocks
- **💬 Click-to-view modal** - Click any conversation card to view the full conversation
- **🔦 In-conversation search** - Search within a conversation and jump between matches with next/prev buttons
- **✨ Beautiful UI** with gradient background and card-based results
- **🏷️ Match highlighting** showing where keywords were found (title, summary, message, content)
- **📱 Responsive design** works on desktop and mobile
- **🚀 100% client-side** - Your data never leaves your computer

## Usage

### 1. Load Your Data
Visit [https://cabird.github.io/claude_chats_search](https://cabird.github.io/claude_chats_search) and drag-and-drop your `conversations.json` file onto the upload zone, or click to browse and select the file.

### 2. Search
- Type keywords in the search box and press Enter
- Enable "Deep search" checkbox to search within content blocks (slower but more thorough)
- Each result shows badges indicating where the match was found

### 3. View Conversations
- Click any result card to open the full conversation in a modal
- The conversation summary (if available) appears at the top in a golden box
- Messages are color-coded: blue for you, green for Claude

### 4. Search Within Conversations
- Use the search box in the modal to find specific terms
- Click the up/down buttons or use keyboard shortcuts:
  - `Enter` - Jump to next match
  - `Shift+Enter` - Jump to previous match
- Current match is highlighted with yellow background

### 5. Load Different File
- Click the "Load Different File" button to upload a new conversations.json

## Privacy & Security

- ✅ **100% client-side** - Your data never leaves your computer
- ✅ **No server uploads** - The file is read directly in your browser
- ✅ **No tracking** - No analytics or external requests (except CDN for React/Lucide)
- ✅ **Works offline** - After loading the page once, it works without internet (except for CDN resources)
- ✅ **Browser storage** - Your uploaded conversations are automatically saved to your browser's IndexedDB for convenience
  - Data persists between sessions so you don't need to re-upload
  - Uploading a new file replaces the stored data (doesn't add to it)
  - You can delete stored data at any time with the "Delete Stored Data" button
  - Storage is local to your browser - data never syncs or uploads anywhere

## Running Locally

If you want to host this yourself or run it locally:

### Option 1: Simple HTTP Server
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`

### Option 2: Flask Backend (Advanced)
For the Flask version with pre-loaded data and server-side search:

```bash
# Install dependencies
pip install -r requirements.txt

# Place your conversations.json in the project directory

# Run the server
python app.py -p 5000
```

Then open `http://localhost:5000` (serves `index_flask.html`)

**Command line options:**
- `-p, --port` - Port to run the server on (default: 5000)
- `--host` - Host to bind to (default: 127.0.0.1)

## Project Structure

```
.
├── index.html                  # Static version (drag-and-drop) - DEFAULT
├── index_flask.html            # Flask version HTML
├── app.py                      # Flask backend with search API
├── components/
│   ├── Icon.js                 # Lucide icon wrapper
│   ├── FileUpload.jsx          # Drag-and-drop file upload
│   ├── SearchBox.jsx           # Search input component
│   ├── ConversationCard.jsx    # Result card component
│   ├── ConversationModal.jsx   # Full conversation modal with search
│   ├── AppStatic.jsx           # Static app component (client-side)
│   └── App.jsx                 # Flask app component
├── requirements.txt            # Python dependencies
├── SCHEMA.md                   # Data schema documentation
└── COMPARISON.md               # Flask vs Static comparison
```

## Technologies Used

- **Frontend**: React 18 (in-browser with Babel Standalone - no build step!)
- **Icons**: Lucide Icons
- **Styling**: Custom CSS with gradient backgrounds
- **Backend (optional)**: Flask (Python) for server-side search

## Performance

- Initial page load: ~1-2 seconds (loading React, Lucide from CDN)
- File upload: Depends on file size (13MB ~1-2 seconds)
- Search: Very fast (< 100ms for most searches)
- Deep search: Slower for large files (may take 1-2 seconds)

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## Hosting Options

### GitHub Pages (Free) - Recommended
Already hosted at [https://cabird.github.io/claude_chats_search](https://cabird.github.io/claude_chats_search)

To deploy your own:
1. Fork this repository
2. Enable GitHub Pages in Settings → Pages
3. Select `main` branch and `/` root
4. Visit your GitHub Pages URL

### Netlify (Free)
1. Drag and drop the folder onto [Netlify Drop](https://app.netlify.com/drop)
2. Get instant URL

### Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the folder
3. Deploy instantly

### Your Own Server
Just upload the files to any web server - it's all static HTML/JS!

## FAQ

**Q: Is my data safe?**
A: Yes! Everything runs in your browser. Your conversations.json never leaves your computer. Data is stored locally in your browser's IndexedDB for convenience, but it never syncs or uploads anywhere.

**Q: Do I need an internet connection?**
A: Only for the initial load (to fetch React and Lucide from CDN). After that, it works offline. Your uploaded data is stored in your browser for future sessions.

**Q: Can I search multiple conversation files?**
A: Not yet, but you can load different files one at a time using the "Load Different File" button. Each upload replaces the previously stored data.

**Q: How do I delete my stored data?**
A: Click the "Delete Stored Data" button in the header after loading your conversations. This will remove all stored conversation data from your browser.

**Q: What's the difference between the static and Flask versions?**
A: See [COMPARISON.md](COMPARISON.md). TL;DR: Static version (default) runs in your browser with drag-and-drop. Flask version requires Python and pre-loads data on the server.

**Q: Can I customize the styling?**
A: Yes! All CSS is in the `<style>` section of `index.html`. Feel free to modify it!

**Q: How do I get my conversations.json file?**
A: See the "How to Export Your Conversations from Claude" section above.

## Data Schema

See [SCHEMA.md](SCHEMA.md) for detailed information about the conversation data structure.

## Contributing

This is a simple, self-contained project. Feel free to fork and customize!

## License

MIT
