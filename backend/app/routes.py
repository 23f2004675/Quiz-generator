from flask import current_app as app, jsonify, render_template, request
from flask_security import auth_required, SQLAlchemyUserDatastore, verify_password, hash_password
from .models import db,Chapter

from datetime import datetime

datastore:SQLAlchemyUserDatastore = app.security.datastore

@app.get('/')
def home():
    return render_template('index.html')

@app.route('/protected', methods=['GET'])
#@auth_required('token')
def protected():
    All_chap=Chapter.query.all()
    for i in All_chap:
        print(f"id={i.id}+name={i.name}+description={i.description}")
    return '<h1>Accessed</h1>'

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