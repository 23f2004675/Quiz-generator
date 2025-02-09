from flask import Flask
from backend.app.config import LocalDevelopmentConfig
from backend.app.models import db

def createapp():
    app = Flask(__name__,template_folder='frontend',static_folder='frontend',static_url_path='/static')
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    app.app_context().push()
    return app

app = createapp()

import backend.app.routes

if __name__ == '__main__':
    app.run()