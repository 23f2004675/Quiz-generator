from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from flask_restful import Api
from flask_caching import Cache

from backend.app.config import LocalDevelopmentConfig
from backend.app.models import db, User, Role

from backend.tasks.celery import celery_init_app

import flask_excel as excel

def createApp():
    app =  Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
    app.config.from_object(LocalDevelopmentConfig)

    db.init_app(app)
    
    excel.init_excel(app)

    cache = Cache(app)

    datastore=SQLAlchemyUserDatastore(db, User, Role)
    app.security=Security(app, datastore, register_blueprint=False)
    app.cache = cache
    
    app.app_context().push()

    # from backend.app.api import *
    api=Api(app)
    
    return app,api

app,api = createApp()

celery_app = celery_init_app(app)

import backend.tasks.celery_schedule
#import backend.Createdata

import backend.app.routes 
from backend.api.subjects import SubjectsAPI, OneSubjectsAPI
from backend.api.chapters import ChapterAPI, AllChapterAPI
from backend.api.quiz import QuizAPI, QuizNewAPI, AdminQuizAPI
from backend.api.score import get_scores
from backend.api.questions import QuestionAPI, QAPI
from backend.api.users import UserAPI, StatusAPI
from backend.api.summary import MakeChart,AdminSummaryCharts

api.add_resource(SubjectsAPI,'/api/subjects', "/api/subjects/<int:subject_id>")
api.add_resource(OneSubjectsAPI,'/api/subject/<int:subject_id>/details')

api.add_resource(ChapterAPI, '/api/chapters', '/api/chapters/<int:chapter_id>')

api.add_resource(QuizAPI, '/api/quizzes/today_or_future', '/api/quizzes', '/api/quizzes/<int:quiz_id>')
api.add_resource(AdminQuizAPI,'/api/admin/quizzes/today_or_future')

api.add_resource(get_scores,'/api/score/<int:user_id>', '/api/score')
api.add_resource(QuestionAPI,'/api/quiz/<int:quiz_id>', '/api/quizzes/<int:quiz_id>/questions', '/api/questions/<int:question_id>')

api.add_resource(QAPI, '/api/questions')
api.add_resource(QuizNewAPI, '/api/quiz/<int:quiz_id>/details')

api.add_resource(UserAPI, '/api/users', '/api/users/<int:user_id>')

api.add_resource(StatusAPI,'/api/users/<int:user_id>/status')

api.add_resource(MakeChart, '/api/chart/<int:user_id>')

api.add_resource(AdminSummaryCharts, '/api/admin/summary')

api.add_resource(AllChapterAPI, '/api/allchapters')

if (__name__=='__main__'):
    app.run()