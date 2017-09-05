#encoding: utf-8
from flask import Flask
from flask import render_template
import sqlite3
from flask import g, request, jsonify
app = Flask(__name__)

DATABASE = '/path/to/database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api', methods=['POST'])
def api():
	lemma = request.form['lemma']
	pos = request.form['pos']
	d = {"adjectives": {"ruma":1000, "hölmö": 5000, "nätti": 3000}, "verbs": {"juosta": 99, "nauraa": 500, "laulaa": 5000}}
	return jsonify(d)