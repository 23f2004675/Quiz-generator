from flask import jsonify
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import Subject

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

class SubjectsAPI(Resource):

    @marshal_with(subject_fields)
    @auth_required('token')
    def get(self):
        subjects = Subject.query.all()
        result = []
        
        for subject in subjects:
            for chapter in subject.chapters:
                num_of_questios=0
                for quiz in chapter.quizzes:
                    num_of_questios+=len(quiz.questions)
                chapter.num_questions=num_of_questios
            result.append(subject)
        if not result:
            return {"message":"no Chapter found"},404                    
        return result

