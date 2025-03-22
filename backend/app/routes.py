from flask import current_app as app, jsonify, render_template, request
from flask_security import auth_required, SQLAlchemyUserDatastore, verify_password, hash_password
from .models import db,Chapter,User,Score

from datetime import datetime

datastore:SQLAlchemyUserDatastore = app.security.datastore
cache=app.cache

# from ..tasks.tasks import add

from datetime import datetime, timedelta
today = datetime.today()
first_day_of_current_month = today.replace(day=1)
last_day_of_current_month = today.replace(day=1, month=today.month+1) - timedelta(days=1)
@app.get('/celery')
def celery():
    print('toda',today)
  
    user = User.query.filter_by(email="vaibhavsonisatya1@gmail.com").first()
    if not user:
        raise ValueError(f"User with email {to} not found")
    print('user',user.fullname)
    scores = Score.query.filter(
        Score.user_id == user.id,
        Score.timestamp >= first_day_of_current_month,
        Score.timestamp <= last_day_of_current_month
    ).all()
    print('scores',scores)

    return "Hello",200


@app.get('/')
def home():
    return render_template('index.html')

# from flask import current_app as app
# cache=app.cache
# @cache.cached(timeout=5)
# @cache.memoize(timeout=5)


@app.route('/login', methods=['POST'])
def login():
    data=request.get_json()
    email=data.get('email')
    password=data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'invalid inputs'}), 404 
    
    user=datastore.find_user(email=email)
    if not user:
        return jsonify({'message': 'invalid email'}), 404 

    if verify_password(password, user.password):
        role= user.roles[0].name
        if role=='admin':
            return jsonify({
                'id': user.id,
                'email': user.email,
                'role': user.roles[0].name,
                'token': user.get_auth_token(),
                })
        return jsonify({
            'id': user.id,
            'email': user.email,
            'password': user.password,
            'fullname': user.fullname,
            'qualification': user.qualification,
            'dob': user.dob,
            'token': user.get_auth_token(),
            'role': user.roles[0].name,
            })

    return jsonify({'message': 'password wrong'}), 404 

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