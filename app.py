import mimetypes
import json
import argparse
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

# Configure MIME type for .jsx BEFORE creating Flask app
mimetypes.add_type('application/javascript', '.jsx')

app = Flask(__name__, static_folder='.')
CORS(app)

# Load conversations data
with open('conversations.json', 'r') as f:
    conversations = json.load(f)

@app.route('/')
def index():
    """Serve the Flask version HTML file"""
    return send_from_directory('.', 'index_flask.html')

@app.route('/components/<path:filename>')
def serve_components(filename):
    """Serve component files from the components/ subdirectory"""
    return send_from_directory('components', filename)

@app.route('/api/search', methods=['GET'])
def search_conversations():
    """Search conversations by keyword"""
    from flask import request

    keyword = request.args.get('q', '').strip()
    deep = request.args.get('deep', 'false').lower() == 'true'

    if not keyword:
        return jsonify([])

    keyword_lower = keyword.lower()
    results = []

    for conv in conversations:
        found = False
        match_locations = []

        # Search in name
        if keyword_lower in conv['name'].lower():
            found = True
            match_locations.append('title')

        # Search in summary
        if keyword_lower in conv['summary'].lower():
            found = True
            match_locations.append('summary')

        # Search in messages
        if not found or deep:
            for msg in conv['chat_messages']:
                if keyword_lower in msg['text'].lower():
                    found = True
                    match_locations.append('message')
                    break

                # Deep search in content blocks
                if deep:
                    for content in msg.get('content', []):
                        if content.get('text') and keyword_lower in content['text'].lower():
                            found = True
                            match_locations.append('content')
                            break

                    if found and not deep:
                        break

        if found:
            # Create a result object with limited data
            result = {
                'uuid': conv['uuid'],
                'name': conv['name'],
                'summary': conv['summary'][:300] + '...' if len(conv['summary']) > 300 else conv['summary'],
                'created_at': conv['created_at'],
                'updated_at': conv['updated_at'],
                'message_count': len(conv['chat_messages']),
                'match_locations': list(set(match_locations))
            }
            results.append(result)

    return jsonify(results)

@app.route('/api/conversation/<uuid>')
def get_conversation(uuid):
    """Get a specific conversation by UUID"""
    for conv in conversations:
        if conv['uuid'] == uuid:
            return jsonify(conv)
    return jsonify({'error': 'Conversation not found'}), 404

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Claude Conversations Search Server')
    parser.add_argument('-p', '--port', type=int, default=5000,
                        help='Port to run the server on (default: 5000)')
    parser.add_argument('--host', type=str, default='127.0.0.1',
                        help='Host to bind to (default: 127.0.0.1)')
    args = parser.parse_args()

    print(f"Starting server on http://{args.host}:{args.port}")
    app.run(debug=True, host=args.host, port=args.port)
