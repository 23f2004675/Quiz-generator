from flask import jsonify, request
from flask_restful import Resource, fields, marshal_with
from flask_security import auth_required
from ..app.models import db, User, Role, UserRoles
from datetime import datetime

user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'fullname': fields.String,
    'qualification': fields.String,
    'dob': fields.String,
    'active': fields.Boolean,
}


class UserAPI(Resource):

    @marshal_with(user_fields)
    @auth_required('token')
    def get(self):
        # Query to get all users with the role 'user'
        users_with_user_role = (db.session.query(User).join(UserRoles, User.id == UserRoles.user_id).join(Role, UserRoles.role_id == Role.id).filter(Role.name == 'user').all()
)
        if not users_with_user_role:
            return {"message": "No users found"}, 404
        return users_with_user_role

    @auth_required('token')
    def put(self, user_id):
        data = request.get_json()
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        user.email = data.get('email', user.email)
        user.fullname = data.get('fullname', user.fullname)
        user.qualification = data.get('qualification', user.qualification)
        date = data.get('dob')

        user_dob = datetime.strptime(date, "%Y-%m-%d").date()
        user.dob = user_dob
        
        db.session.commit()
        return {"message": "User updated successfully"}, 200

class StatusAPI(Resource):

    @auth_required('token')
    def put(self, user_id):
        data = request.get_json()
        # print(data)
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        new_status = data.get('active')
        user.active=new_status
        db.session.commit()
        return {"message": "User status updated successfully"}, 200