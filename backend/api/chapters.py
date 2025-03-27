from flask import jsonify, request
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import db, Quiz, Subject, Chapter, Question

from flask import current_app as app
cache=app.cache
# @cache.cached(timeout=5)
# @cache.memoize(timeout=5)


question_fields = {
    'id': fields.Integer,
    'question_text': fields.String,
    'question_title': fields.String,
    'options': fields.String,
    'correct_option': fields.String,
}

quiz_chapter_fields = {
    'id': fields.Integer,
    'chapter_id': fields.Integer,
    'chapter_name': fields.String,
    'questions': fields.List(fields.Nested(question_fields)),
    'time_duration': fields.String,
    'remarks': fields.String,
}

all_chapters_fields = {
    'id': fields.Integer,
    'name': fields.String,
}

class ChapterAPI(Resource):
    @auth_required('token')
    @marshal_with(quiz_chapter_fields)
    @cache.cached(timeout=2)
    def get(self):
        quizzes = Quiz.query.filter_by(active=True).all()
        
        if not quizzes:
            return {"message": "No quizzes found"}, 404
        
        quiz_data_list = []
        for quiz in quizzes:
            quiz_data = {
                'id': quiz.id,
                'chapter_id': quiz.chapter_id,
                'time_duration': quiz.time_duration,
                'remarks': quiz.remarks,
                'chapter_name': quiz.chapter.name if quiz.chapter else None,
                'questions': [
                    {
                        'id': question.id,
                        'question_text': question.question_text,
                        'question_title': question.question_title,
                        'options': question.options,
                        'correct_option': question.correct_option,
                    } for question in quiz.questions if question.active
                ],
            }
            quiz_data_list.append(quiz_data)
        # print(quiz_data_list)
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

        chapter.active = False

        # Find all quizzes associated with the chapter
        quizzes = Quiz.query.filter_by(chapter_id=chapter_id).all()
        if quizzes:
            for quiz in quizzes:
                quiz.active = False
                questions = Question.query.filter_by(quiz_id=quiz.id).all()
                if questions:
                    for question in questions:
                        question.active = False

        
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

class AllChapterAPI(Resource):
    @auth_required('token')
    @marshal_with(all_chapters_fields)
    @cache.cached(timeout=2)
    def get(self):
        chapters = Chapter.query.filter_by(active=True).all()  # Get all chapters
        if not chapters:
            return {"message": "No chapters found"}, 404    
        return chapters