from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import Quiz, Question, Chapter, Subject

from datetime import datetime

quizzes_fields={
    'id' : fields.Integer,
    'chapter_id' : fields.Integer,
    'date_of_quiz': fields.String,
    'time_duration' : fields.String,
    'remarks' : fields.String,
    'no_of_questions': fields.Integer,
    'chapter_name' : fields.String,
    'subject_name' : fields.String,
}

class get_quizzes_today_or_future(Resource):

    @marshal_with(quizzes_fields)
    @auth_required('token')
    def get(self):
        today = datetime.today().date()
        Quizzes=Quiz.query.filter(Quiz.date_of_quiz >= today).all()
        if not Quizzes:
            return {"message":"no Quiz found"},404
        for quiz in Quizzes:
            total_questions = len(quiz.questions)
            quiz.no_of_questions = total_questions
        
            chapter_name = quiz.chapter.name if quiz.chapter else None
            quiz.chapter_name = chapter_name  
            subject_name = quiz.chapter.subject.name if quiz.chapter and quiz.chapter.subject else None
            quiz.subject_name = subject_name  
        return Quizzes
