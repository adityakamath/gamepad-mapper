from flask import Flask, render_template, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/')
def index():
    response = make_response(render_template('index.html'))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/gamepad')
def get_gamepad():
    # This endpoint is for future use if we need to add server-side gamepad handling
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True) 