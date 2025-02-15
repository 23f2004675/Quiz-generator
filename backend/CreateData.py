from flask import current_app as app
from .app.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()
    
    userdatastore:SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name='admin', description='superuser')
    userdatastore.find_or_create_role(name='user', description='genral user') 

    if(not userdatastore.find_user(email='admin@gmail.com')):
        userdatastore.create_user(email='admin@gmail.com', password=hash_password('abc'),roles=['admin'],fullname='admin')
    if(not userdatastore.find_user(email='u1@gmail.com')):
        userdatastore.create_user(email='u1@gmail.com', password=hash_password('abc'),roles=['user'],fullname='User1',)
    
    db.session.commit()

