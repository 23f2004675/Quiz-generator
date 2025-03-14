from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import db, Quiz, Question
from flask import request


question_fields = {
    'id': fields.Integer,
    'question_text': fields.String,
    'options': fields.String, 
    'correct_option': fields.String
}

quiz_fields = {
    'id': fields.Integer,
    'time_duration': fields.String,
    'remarks': fields.String,
    'questions': fields.List(fields.Nested(question_fields)),
}

class QuestionAPI(Resource):

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
    
    @auth_required('token')
    def post(self, quiz_id):
        data = request.get_json()
        print(data)
        quiz = Quiz.query.filter_by(id=quiz_id).first()
        if not quiz:
            return {"message": "Quiz not found"}, 404

        data = request.get_json()
        question_title = data.get('question_title')
        question_text = data.get('question')
        options = data.get('option')
        correct_option = data.get('correct_answer')
        # print(quiz_id, question_title, question_text, options, correct_option)
        question = Question(quiz_id=quiz.id,question_title=question_title, question_text=question_text, options=options, correct_option=correct_option)
        db.session.add(question)
        db.session.commit()
        return {"message": "Question added successfully"}, 201

    @auth_required('token')
    def put(self,question_id):
        data = request.get_json()
        # print(data)
        question = Question.query.filter_by(id=question_id).first()
        if not question:
            return {"message": "Question not found"}, 404
        question.question_title = data.get('question_title')
        question.question_text = data.get('question_text')
        question.options = data.get('option')
        question.correct_option = data.get('correct_answer')
        db.session.commit()
        return {"message": "Question updated successfully"}, 200
        
    @auth_required('token')
    def delete(self, question_id):  
        question = Question.query.filter_by(id=question_id).first()
        if not question:
            return {"message": "Question not found"}, 404
        db.session.delete(question)
        db.session.commit()
        return {"message": "Question deleted successfully"}, 200

# class StartQuizAPI(Resource):

#     @marshal_with(question_fields)
#     @auth_required('token')
#     def get(self, quiz_id):
#         quiz = Quiz.query.filter_by(id=quiz_id).first()
#         if not quiz:
#             return {"message": "Quiz not found"}, 404

#         questions = Question.query.filter_by(quiz_id=quiz.id).all()
#         if not questions:
#             return {"message": "No questions found for this quiz"}, 404

#         quiz.questions = questions
#         return quiz, 200    