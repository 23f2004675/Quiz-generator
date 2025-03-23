from flask import jsonify, request
from ..app.models import db, Subject, Chapter, Quiz, Question
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import Subject
from flask import current_app as app
cache=app.cache
# @cache.cached(timeout=5)
# @cache.memoize(timeout=5)
chapter_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'num_questions': fields.Integer
}

subject_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'chapters': fields.List(fields.Nested(chapter_fields))
}
Onesubject_fields={
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
}

class SubjectsAPI(Resource):

    @marshal_with(subject_fields)
    @auth_required('token')
    @cache.cached(timeout=2)
    def get(self):
        subjects = Subject.query.filter_by(active=True).all()
        result = []
        
        for subject in subjects:
            # Fetch all active chapters for the subject
            chapters = Chapter.query.filter_by(subject_id=subject.id, active=True).all()
            subject_chapters = []

            for chapter in chapters:
                # Fetch all active quizzes for the chapter
                quizzes = Quiz.query.filter_by(chapter_id=chapter.id, active=True).all()
                num_questions = 0

                # Calculate the total number of questions in the chapter
                for quiz in quizzes:
                    questions = Question.query.filter_by(quiz_id=quiz.id, active=True).all()
                    num_questions += len(questions)


                chapter_data = {
                    'id': chapter.id,
                    'name': chapter.name,
                    'description': chapter.description,
                    'num_questions': num_questions
                }
                subject_chapters.append(chapter_data)

            subject_data = {
                'id': subject.id,
                'name': subject.name,
                'description': subject.description,
                'chapters': subject_chapters
            }
            result.append(subject_data)
            
                
        if not result:
            return {"message":"no Subject found"},404                    
        return result

    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')

        if not name or not description:
            return {"message": "Name and description are required"}, 400

        subject = Subject(name=name, description=description)
        db.session.add(subject)
        db.session.commit()

        return {"message": "Subject created successfully"}, 201

    @auth_required('token')
    def delete(self, subject_id):
        subject = Subject.query.get(subject_id)

        if not subject:
            return {"message": "Subject not found"}, 404

        subject.active=False
        chapters=Chapter.query.filter_by(subject_id=subject.id,active=True)
        if chapters:
            for chapter in chapters:
                chapter.active = False
                quizzes = Quiz.query.filter_by(chapter_id=chapter.id).all()
                if quizzes:
                    for quiz in quizzes:
                        quiz.active = False
                        questions = Question.query.filter_by(quiz_id=quiz.id).all()
                        if questions:
                            for question in questions:
                                question.active = False
        db.session.commit()
        return {"message": "Subject deleted successfully"}, 200

    @auth_required('token')
    def put(self, subject_id):
        subject = Subject.query.get(subject_id)

        if not subject:
            return {"message": "Subject not found"}, 404

        data = request.get_json()
        new_name = data.get("name")
        new_description = data.get("description")

        if not new_name or not new_description:
            return {"message": "Both name and description are required"}, 400

        subject.name = new_name
        subject.description = new_description

        db.session.commit()
        return {"message": "Subject updated successfully"}, 200

class OneSubjectsAPI(Resource):

    @marshal_with(Onesubject_fields)
    @auth_required('token')
    @cache.cached(timeout=2)
    def get(self,subject_id):
        subject = Subject.query.filter_by(id=subject_id).first()
        if not subject:
            return {"message":"no Subject found"},404                    
        return subject
