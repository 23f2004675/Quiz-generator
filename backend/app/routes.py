from flask import current_app as app, render_template
from .models import Subject

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/Subject')
def subject():
    All_subjects = Subject.query.all()
    for a in All_subjects:
        print(a.name)
    return "Hello World"