from flask import jsonify, request
from ..app.models import db, Subject
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

class SubjectsAPI(Resource):

    @marshal_with(subject_fields)
    @auth_required('token')
    @cache.cached(timeout=5)
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

        db.session.delete(subject)
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


