# Claude Conversations Search (Static Version)

A **fully client-side** web application to search through your Claude conversation history. No backend required - just drop your conversations.json file and start searching!

## Features

- **📤 Drag & Drop** - Simply drop your conversations.json file to load it
- **🔍 Fast keyword search** across conversation titles, summaries, and messages
- **🔎 Deep search mode** to search within detailed content blocks
- **💬 Click-to-view modal** - Click any conversation card to view the full conversation
- **🔦 In-conversation search** - Search within a conversation and jump between matches with next/prev buttons
- **✨ Beautiful UI** with gradient background and card-based results
- **🏷️ Match highlighting** showing where keywords were found (title, summary, message, content)
- **📱 Responsive design** works on desktop and mobile
- **🚀 No backend needed** - runs entirely in your browser

## Quick Start

### Option 1: Open Directly (Simplest)

1. Download `index_static.html` and the `components/` folder
2. Open `index_static.html` in your web browser
3. Drag and drop your `conversations.json` file
4. Start searching!

### Option 2: Serve with Python (Better for JSX files)

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/index_static.html`

### Option 3: Host on GitHub Pages

1. Create a new GitHub repository
2. Upload `index_static.html` and the `components/` folder
3. Enable GitHub Pages in repository settings
4. Visit your GitHub Pages URL
5. Drop your conversations.json file

## How to Get Your Conversations

1. Go to [claude.ai](https://claude.ai)
2. Export your conversations (if the feature is available)
3. Download the `conversations.json` file
4. Drop it into this app!

## Usage

### 1. Load Your Data
- Drag and drop your `conversations.json` file onto the upload zone
- Or click to browse and select the file

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

## Technical Details

### File Structure
```
.
├── index_static.html           # Main HTML file (all-in-one)
└── components/
    ├── Icon.js                 # Lucide icon wrapper
    ├── FileUpload.jsx          # Drag-and-drop file upload
    ├── SearchBox.jsx           # Search input component
    ├── ConversationCard.jsx    # Result card component
    ├── ConversationModal.jsx   # Full conversation modal with search
    └── AppStatic.jsx           # Main app component (client-side)
```

### Technologies Used
- **Frontend**: React 18 (in-browser with Babel Standalone)
- **Icons**: Lucide Icons
- **Styling**: Custom CSS with gradient backgrounds
- **File Handling**: JavaScript FileReader API

### How It Works

1. **File Upload**: Uses the FileReader API to read the JSON file in the browser
2. **Data Storage**: Keeps conversations in React state (memory)
3. **Search**: Pure JavaScript search across all conversation fields
4. **No Backend**: Everything happens in your browser - no server needed!

## Performance Notes

- Initial page load: ~1-2 seconds (loading React, Lucide from CDN)
- File upload: Depends on file size (13MB ~1-2 seconds)
- Search: Very fast (< 100ms for most searches)
- Deep search: Slower for large files (may take 1-2 seconds)

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## Limitations

- File size: Tested with up to 20MB conversation files
- Search is case-insensitive only
- No regex search (yet)
- No export/save functionality

## Hosting Options

### GitHub Pages (Free)
1. Create repository
2. Upload `index_static.html` and `components/`
3. Enable GitHub Pages
4. Share the URL

### Netlify (Free)
1. Drag and drop the folder onto [Netlify](https://app.netlify.com/drop)
2. Get instant URL

### Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the folder
3. Deploy instantly

### Your Own Server
Just upload the files to any web server - it's all static HTML/JS!

## FAQ

**Q: Is my data safe?**
A: Yes! Everything runs in your browser. Your conversations.json never leaves your computer.

**Q: Do I need an internet connection?**
A: Only for the initial load (to fetch React and Lucide from CDN). After that, it works offline.

**Q: Can I search multiple conversation files?**
A: Not yet, but you can load different files one at a time using the "Load Different File" button.

**Q: What's the difference from the Flask version?**
A: The Flask version requires running a Python server. This static version runs entirely in your browser with no backend needed!

**Q: Can I customize the styling?**
A: Yes! All CSS is in the `<style>` section of `index_static.html`. Feel free to modify it!

## Contributing

This is a simple, self-contained project. Feel free to fork and customize!

## License

MIT
