from flask import jsonify, request
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import db, Quiz, Subject, Chapter

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

    @auth_required('token')
    def post(self):
        data = request.get_json()
        subject_id = data.get('subject_id')
        name = data.get('name')
        description = data.get('description')

        if not subject_id or not name or not description:
            return {"message": "Subject ID, name, and description are required"}, 400

        subject = Subject.query.get(subject_id)
        if not subject:
            return {"message": "Subject not found"}, 404

        new_chapter = Chapter(
            name=name,
            description=description,
            subject_id=subject_id
        )

        db.session.add(new_chapter)
        db.session.commit()

        return {"message": "Chapter added successfully", "chapter_id": new_chapter.id}, 201

    @auth_required('token')
    def delete(self, chapter_id):
        # Find the chapter by ID
        chapter = Chapter.query.get(chapter_id)
        
        if not chapter:
            return {"message": "Chapter not found"}, 404

        # Delete the chapter
        db.session.delete(chapter)
        db.session.commit()

        return {"message": "Chapter deleted successfully"}, 200
    
    @auth_required('token')
    def put(self, chapter_id):
        """Edit an existing chapter."""
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return {"error": "Chapter not found"}, 404

        data = request.get_json()
        chapter.name = data.get('name', chapter.name)
        chapter.description = data.get('description', chapter.description)

        db.session.commit()
        return {"message": "Chapter updated successfully"}