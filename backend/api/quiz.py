from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import db, Quiz, Question, Chapter, Subject
from flask import request,  jsonify
from datetime import datetime
from flask import current_app as app
cache=app.cache
# @cache.cached(timeout=5)
# @cache.memoize(timeout=5)

quizzes_fields={
    'id' : fields.Integer,
    'chapter_id' : fields.Integer,
    'date_of_quiz': fields.String,
    'time_duration' : fields.String,
    'remarks' : fields.String,
    'no_of_questions': fields.Integer,
    'chapter_name' : fields.String,
    'subject_name' : fields.String,
    'active': fields.Boolean,
}

class QuizAPI(Resource):

    @marshal_with(quizzes_fields)
    @auth_required('token')
    @cache.cached(timeout=2)
    def get(self):
        # today = datetime.today().date()
        # Quizzes=Quiz.query.filter(Quiz.date_of_quiz >= today).all()
        Quizzes=Quiz.query.filter_by(active=True).all()
        if not Quizzes:
            return {"message":"no Quiz found"},404
        for quiz in Quizzes:
            questions=Question.query.filter_by(quiz_id=quiz.id,active=True).all()
            total_questions = len(questions)
            quiz.no_of_questions = total_questions
            chapter_name = quiz.chapter.name if quiz.chapter else None
            quiz.chapter_name = chapter_name  
            subject_name = quiz.chapter.subject.name if quiz.chapter and quiz.chapter.subject else None
            quiz.subject_name = subject_name  
        return Quizzes

    @auth_required('token')
    def post(self):
        """Create a new quiz"""
        data = request.json
        chapter_id = data.get("chapter_id")
        date = data.get("date")
        time_duration = data.get("time_duration")
        # print(data)
        try:
            quiz_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

        if not chapter_id or not quiz_date or not time_duration:
            return {"message": "All fields (chapter_id, date, time_duration) are required"}, 400

        new_quiz = Quiz(chapter_id=chapter_id, date_of_quiz=quiz_date, time_duration=time_duration)
        db.session.add(new_quiz)
        db.session.commit()
        return {"message": "Quiz added successfully", "id": new_quiz.id}, 201

    @auth_required('token')
    def put(self, quiz_id):
        """Update a quiz"""
        data = request.json
        chapter_name = data.get("chapter_name")
        date = data.get("date")
        time_duration = data.get("time_duration")
        remarks = data.get("remarks")
        # print(data)
        try:
            quiz_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

        if not chapter_name or not quiz_date or not time_duration or not remarks:
            return {"message": "All fields (quiz_id, chapter_id, date, time_duration, remarks) are required"}, 400

        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404

        # quiz.chapter_id = chapter_id
        quiz.date_of_quiz = quiz_date
        quiz.time_duration = time_duration
        quiz.chapter.name = chapter_name
        quiz.remarks = remarks

        db.session.commit()

        return {"message": "Quiz updated successfully"}, 200

    @auth_required('token')
    def delete(self, quiz_id):
        """Delete a quiz"""
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return {"message": "Quiz not found"}, 404
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        for question in questions:
            question.active = False
        quiz.active = False
        

        db.session.commit()

        return {"message": "Quiz deleted successfully"}, 200

class QuizNewAPI(Resource):

    @auth_required('token') 
    def get(self,quiz_id):
        """Get details of a quiz"""
        quiz = Quiz.query.filter_by(id=quiz_id).first()
        if not quiz:
            return {"message": "Quiz not found"}, 404

        chapter = Chapter.query.get(quiz.chapter_id)
        subject = Subject.query.get(chapter.subject_id)

        # Fetch the total number of questions for the quiz
        total_questions = Question.query.filter_by(quiz_id=quiz.id).count()
        
        # Prepare the response
        response = {
            "quiz_id": quiz.id,
            "subject_name": subject.name,
            "chapter_name": chapter.name,
            "total_questions": total_questions,
            "date_of_quiz": quiz.date_of_quiz.isoformat() if quiz.date_of_quiz else None,
            "time_duration": quiz.time_duration,
            "remarks": quiz.remarks
        }
        # print(response)
        return response, 200

class AdminQuizAPI(Resource):

    @marshal_with(quizzes_fields)
    @auth_required('token')
    @cache.cached(timeout=2)
    def get(self):
        # today = datetime.today().date()
        # Quizzes=Quiz.query.filter(Quiz.date_of_quiz >= today).all()
        Quizzes=Quiz.query.all()
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