from flask import Flask
from backend.app.config import LocalDevelopmentConfig


def createapp():
    app = Flask(__name__,template_folder='frontend',static_folder='frontend',static_url_path='/static')
    app.config.from_object(LocalDevelopmentConfig)
    app.app_context().push()
    return app

app = createapp()

import backend.app.routes

if __name__ == '__main__':
    app.run()