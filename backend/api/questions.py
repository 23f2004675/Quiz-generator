from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import Quiz, Question


question_fields = {
    'id': fields.Integer,
    'question_text': fields.String,
    'options': fields.String, 
    'correct_option': fields.String
}

quiz_fields = {
    'id': fields.Integer,
    'time_duration': fields.String,
    'questions': fields.List(fields.Nested(question_fields)),
}

class get_questions(Resource):

    @marshal_with(quiz_fields)
    @auth_required('token')
    def get(self, quiz_id):
        
        quiz = Quiz.query.filter_by(id=quiz_id).first()
        if not quiz:
            return {"message": "Quiz not found"}, 404

        questions = Question.query.filter_by(quiz_id=quiz.id).all()
        if not questions:
            return {"message": "No questions found for this quiz"}, 404

        quiz.questions = questions
        return quiz, 200
        
