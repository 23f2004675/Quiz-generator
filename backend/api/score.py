from flask import jsonify, request   
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import Score,db, Quiz, Chapter 

from datetime import datetime

score_fields={
    'id' : fields.Integer,
    'quiz_name' : fields.String,
    'quiz_id' : fields.Integer,
    'user_id': fields.Integer,
    'timestamp' : fields.String,
    'score': fields.String,
    'no_of_questions': fields.Integer
}

class get_scores(Resource):

    @marshal_with(score_fields)
    @auth_required('token')
    def get(self,user_id):
        Scores =(db.session.query(Score, Quiz, Chapter)
        .join(Quiz, Score.quiz_id == Quiz.id)
        .join(Chapter, Quiz.chapter_id == Chapter.id)
        .filter(Score.user_id == user_id)
        .all())
        if not Scores:
            return {"message":"no Scores found"},404
        score_list = []
        for score, quiz, chapter in Scores:
            score_data = {
                'id': score.id,
                'quiz_name': chapter.name,  # Quiz name is stored in the Chapter model
                'quiz_id': score.quiz_id,
                'user_id': score.user_id,
                'timestamp': score.timestamp.isoformat(),  # Convert datetime to ISO format
                'score': score.score,
                'no_of_questions': int(score.score.split('/')[-1]),  # Calculate number of questions
            }
            score_list.append(score_data)

        return score_list, 200

    @auth_required('token') 
    def post(self):
        data = request.get_json()
        quiz_id=data['quiz_id']
        user_id=data['user_id']
        timestamp=datetime.utcnow()
        score=data['score']
        new_score = Score(quiz_id=quiz_id, user_id=user_id, timestamp=timestamp, score=score)
        db.session.add(new_score)
        db.session.commit()
        return {"message": "Score saved successfully"}, 201
