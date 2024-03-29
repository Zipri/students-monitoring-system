from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb://localhost:27017/skeleton-python-mongo"
mongo = PyMongo(app)

@app.route('/')
def ping():
    return 'python working'

# from routes import *
from routes.users import *
from routes.groups import *
from routes.projects import *
from routes.tasks import *
from routes.comments import *
