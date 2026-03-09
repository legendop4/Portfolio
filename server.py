import http.server
import socketserver
import json
import os

PORT = 3000
DATA_FILE = 'data.json'

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve the API endpoint
        if self.path == '/api/data':
            if os.path.exists(DATA_FILE):
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                with open(DATA_FILE, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'{"error": "data.json not found"}')
            return
            
        # Add basic cache busting to see updates immediately
        if self.path.endswith('.json') or self.path.endswith('.html') or self.path.endswith('.css') or self.path.endswith('.js'):
            self.send_response(200)
            if self.path.endswith('.html'):
                self.send_header('Content-type', 'text/html')
            elif self.path.endswith('.css'):
                self.send_header('Content-type', 'text/css')
            elif self.path.endswith('.js'):
                self.send_header('Content-type', 'application/javascript')
            elif self.path.endswith('.json'):
                self.send_header('Content-type', 'application/json')
            
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            
            filepath = self.path.lstrip('/')
            if filepath == '' or filepath == '/':
                filepath = 'index.html'
            if '?' in filepath:
                filepath = filepath.split('?')[0]

            if os.path.exists(filepath):
                with open(filepath, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'Not Found')
            return

        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path == '/api/data':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                try:
                    # Validate valid JSON first
                    json_data = json.loads(post_data.decode('utf-8'))
                    
                    # Write to file
                    with open(DATA_FILE, 'w') as f:
                        json.dump(json_data, f, indent=2)
                        
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(b'{"success": true}')
                except Exception as e:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(bytes(f'{{"success": false, "error": "{str(e)}"}}', 'utf-8'))
            else:
                self.send_response(400)
                self.end_headers()
            return
            
        self.send_response(404)
        self.end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(("", PORT), PortfolioHandler) as httpd:
    print(f"Serving at port {PORT}. Go to http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
