from flask import current_app as app, jsonify, render_template, request, send_file
from flask_security import auth_required, SQLAlchemyUserDatastore, verify_password, hash_password
from .models import db,Chapter,User,Score

from datetime import datetime

datastore:SQLAlchemyUserDatastore = app.security.datastore
cache=app.cache

from celery.result import AsyncResult
from ..tasks.tasks import create_csv_user, create_csv_admin

@auth_required('token')
@app.get('/create_csv/user/<user_id>')
def createCSV(user_id):
    task=create_csv_user.delay(user_id)
    return jsonify({'message': task.id}), 200

@auth_required('token')
@app.get('/create_csv/admin')
def createCSVAdmin():
    task=create_csv_admin.delay()
    return jsonify({'message': task.id}), 200

@auth_required('token')
@app.get('/get_csv/<task_id>')
def getCSV(task_id):
    task=AsyncResult(task_id)
    if task.ready():
        return send_file(f'./backend/tasks/user-downloads/{task.result}')
    else:
        return jsonify({'message': 'not ready'}), 404


@app.get('/')
def home():
    return render_template('index.html')

# from flask import current_app as app
# cache=app.cache
# @cache.cached(timeout=5)
# @cache.memoize(timeout=5)


# from flask import jsonify, request

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check for missing inputs
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    # Find user by email
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({'message': 'Invalid email or user does not exist'}), 404

    # Check if the account is active
    if not user.active:
        return jsonify({'message': 'Your account has been deactivated. Please contact the admin.'}), 401

    # Verify password
    if not verify_password(password, user.password):
        return jsonify({'message': 'Wrong password. Please try again.'}), 401

    # Generate token and prepare response
    role = user.roles[0].name
    response_data = {
        'id': user.id,
        'email': user.email,
        'role': role,
        'token': user.get_auth_token(),
    }

    # Include additional fields for non-admin users
    if role != 'admin':
        response_data.update({
            'fullname': user.fullname,
            'qualification': user.qualification,
            'dob': user.dob,
        })

    return jsonify(response_data), 200

@app.route('/register',methods=['POST'])
def register():
    data=request.get_json()

    email=data.get('email')
    password=data.get('password')
    role='user'
    fullname=data.get('fullname')
    qualification=data.get('qualification')
    dob=data.get('dob')
    dob_date = datetime.strptime(dob, '%Y-%m-%d').date()


    if not email or not password or role not in ['admin','user']:
        return jsonify({'message': 'invalid inputs'}), 404 
    
    user=datastore.find_user(email=email)

    if user:
        return jsonify({'message': 'already exists'}), 404 

    try:
        datastore.create_user(email=email, password=hash_password(password), roles=[role], fullname=fullname, qualification=qualification, dob=dob_date)
        db.session.commit()
        return jsonify({'message': 'user created'}), 200
    except:
        db.session.rollback()
        return jsonify({'message': 'error creating user'}), 400