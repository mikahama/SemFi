#encoding: utf-8
from flask import Flask
from flask import render_template
import sqlite3
import os
import json
from flask import g, request, jsonify
app = Flask(__name__)

BASE_DIR = os.path.dirname(__file__)
DATABASE = os.path.join(BASE_DIR, 'SemFi.db')


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

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
    if pos == "noun":
        result = query_db('select * from koululaiset_nouns where word = ?', [lemma], one=True)
        print result
        d = {"verbs": json.loads(result[1]), "adjectives": json.loads(result[2]), "nouns": json.loads(result[3])}
    elif pos == "verb":
        result = query_db('select * from koululaiset_verbs where word = ?', [lemma], one=True)
        objs = json.loads(result[2])
        d = {"subjects": json.loads(result[1]), "adverbs": json.loads(result[3]), "dir": objs["dir"], "indir": objs["indir"]}
    return jsonify(d)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)