from flask import Flask
from flask import render_template
import sqlite3
from flask import g, request
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
	return lemma + " " + pos + " not implemented yet :-O"