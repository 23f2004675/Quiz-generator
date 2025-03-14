from flask import jsonify, request   
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import Score,db

from datetime import datetime

score_fields={
    'id' : fields.Integer,
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
        Scores=Score.query.filter_by(user_id=user_id).all()
        if not Scores:
            return {"message":"no Scores found"},404
        for score in Scores:
            score.no_of_questions = int(score.score.split('/')[-1])
        return Scores

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
