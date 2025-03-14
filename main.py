from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from flask_restful import Api

from backend.app.config import LocalDevelopmentConfig
from backend.app.models import db, User, Role

def createApp():
    app =  Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
    app.config.from_object(LocalDevelopmentConfig)

    db.init_app(app)
    api=Api(app)

    datastore=SQLAlchemyUserDatastore(db, User, Role)
    app.security=Security(app, datastore, register_blueprint=False)

    app.app_context().push()
    return app,api

app,api = createApp()

#import backend.Createdata

import backend.app.routes 
from backend.api.subjects import SubjectsAPI
from backend.api.chapters import ChapterAPI
from backend.api.quiz import QuizAPI, QuizNewAPI
from backend.api.score import get_scores
from backend.api.questions import QuestionAPI
from backend.api.users import UserAPI, StatusAPI
from backend.api.summary import MakeChart,AdminSummaryCharts

api.add_resource(SubjectsAPI,'/api/subjects', "/api/subjects/<int:subject_id>")
api.add_resource(ChapterAPI, '/api/chapters', '/api/chapters/<int:chapter_id>')

api.add_resource(QuizAPI, '/api/quizzes/today_or_future', '/api/quizzes', '/api/quizzes/<int:quiz_id>')

api.add_resource(get_scores,'/api/score/<int:user_id>', '/api/score')
api.add_resource(QuestionAPI,'/api/quiz/<int:quiz_id>', '/api/quizzes/<int:quiz_id>/questions', '/api/questions/<int:question_id>')

api.add_resource(QuizNewAPI, '/api/quiz/<int:quiz_id>/details')

api.add_resource(UserAPI, '/api/users', '/api/users/<int:user_id>')

api.add_resource(StatusAPI,'/api/users/<int:user_id>/status')

api.add_resource(MakeChart, '/api/chart/<int:user_id>')

api.add_resource(AdminSummaryCharts, '/api/admin/summary')

if (__name__=='__main__'):
    app.run()