from flask import jsonify
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import Quiz

question_fields = {
    'id': fields.Integer,
    'question_text': fields.String,
    'question_title': fields.String,
}

quiz_chapter_fields = {
    'id': fields.Integer,
    'chapter_id': fields.Integer,
    'chapter_name': fields.String,
    'questions': fields.List(fields.Nested(question_fields)),
}

class ChapterAPI(Resource):
    @marshal_with(quiz_chapter_fields)
    @auth_required('token')
    def get(self):
        quizzes = Quiz.query.all()
        
        if not quizzes:
            return {"message": "No quizzes found"}, 404
        
        quiz_data_list = []
        for quiz in quizzes:
            quiz_data = {
                'id': quiz.id,
                'chapter_id': quiz.chapter_id,
                'chapter_name': quiz.chapter.name,
                'questions': [
                    {
                        'id': question.id,
                        'question_text': question.question_text,
                        'question_title': question.question_title,
                    } for question in quiz.questions
                ],
            }
            quiz_data_list.append(quiz_data)
        
        return quiz_data_list
