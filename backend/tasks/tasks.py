from celery import shared_task
from .mail_service import send_mail
from flask import render_template
from backend.app.models import Quiz, User, Score, Chapter, db, Subject
from datetime import datetime, timedelta

import flask_excel

def get_month_range(date):
    """Get the first and last day of the month for a given date."""
    first_day_of_month = date.replace(day=1)
    last_day_of_month = (first_day_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
    return first_day_of_month, last_day_of_month

def get_previous_month_range(date):
    """Get the first and last day of the previous month for a given date."""
    first_day_of_current_month = date.replace(day=1)
    last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
    first_day_of_previous_month = last_day_of_previous_month.replace(day=1)
    return first_day_of_previous_month, last_day_of_previous_month

def get_user_scores(user_id, start_date, end_date):
    """Fetch scores for a user within a specific date range."""
    scores = Score.query.filter(
        Score.user_id == user_id,
        Score.timestamp >= start_date,
        Score.timestamp <= end_date
    ).all()
    return scores


@shared_task(ignore_result=True)
def daily_Quiz_email_reminder(to, subject, content, name):

    today = datetime.today().date()
    Quizzes=Quiz.query.filter(Quiz.date_of_quiz >= today).all()
    html_content = render_template(content, name=name,quizzes=Quizzes)
    send_mail(to, subject, html_content ,name)

@shared_task(ignore_result=True)
def monthly_performance_report(to, subject, content, name):
    
    user = User.query.filter_by(email=to).first()
    today = datetime.today()
    first_day_of_current_month, last_day_of_current_month = get_month_range(today)

    # Get the date range for the previous month
    first_day_of_previous_month, last_day_of_previous_month = get_previous_month_range(today)

    # Fetch scores for the current month
    current_month_scores = get_user_scores(user.id, first_day_of_current_month, last_day_of_current_month)
    current_month_total_quizzes = len(current_month_scores)

    # Fetch scores for the previous month
    previous_month_scores = get_user_scores(user.id, first_day_of_previous_month, last_day_of_previous_month)
    previous_month_total_quizzes = len(previous_month_scores)

    html_content = render_template(
        content,
        name=name,
        current_month=first_day_of_current_month.strftime("%B %Y"),  # e.g., "October 2023"
        previous_month=first_day_of_previous_month.strftime("%B %Y"),  # e.g., "September 2023"
        current_month_total_quizzes=current_month_total_quizzes,
        previous_month_total_quizzes=previous_month_total_quizzes,
        current_month_scores=current_month_scores,
        previous_month_scores=previous_month_scores
    )

    # Send the email
    send_mail(to, subject, html_content, name)

@shared_task(bind=True,ignore_result=False)
def create_csv_user(self,user_id):
    resource=Quiz.query.all()

    scores =(db.session.query(
                Score.id,
                Chapter.name,  # Quiz name is stored in the Chapter model
                Score.quiz_id,
                Score.timestamp,  # Convert datetime to ISO format
                Score.score,
    )
        .join(Quiz, Score.quiz_id == Quiz.id)
        .join(Chapter, Quiz.chapter_id == Chapter.id)
        .filter(Score.user_id == user_id)
        .all())

    task_id=self.request.id
    file_name=f'score_{task_id}.csv'

    coloumns=['id','name','quiz_id','timestamp','score']
    csv_out=flask_excel.make_response_from_query_sets(scores, column_names=coloumns, file_type='csv')
    with open(f'./backend/tasks/user-downloads/{file_name}', 'wb') as f:
        f.write(csv_out.data)
    return file_name

@shared_task(bind=True, ignore_result=False)
def create_csv_admin(self):
    # Fetch all scores with related user, quiz, chapter, and subject information
    scores = (
        db.session.query(
            User.fullname,
            User.email,
            Subject.name.label('subject_name'),
            Chapter.name.label('chapter_name'),
            Score.timestamp,
            Score.score,
            User.id.label('user_id'),
            Quiz.id.label('quiz_id')
        )
        .join(Quiz, Score.quiz_id == Quiz.id)
        .join(Chapter, Quiz.chapter_id == Chapter.id)
        .join(Subject, Chapter.subject_id == Subject.id)
        .join(User, Score.user_id == User.id)
        .all()
    )

    # Generate a unique file name for the CSV
    task_id = self.request.id
    file_name = f'admin_{task_id}.csv'

    # Define the columns for the CSV
    columns = [
        'user_id', 'fullname', 'email', 'subject_name', 'chapter_name', 
        'timestamp', 'score', 'quiz_id'
    ]

    # Create the CSV file
    csv_out = flask_excel.make_response_from_query_sets(scores, column_names=columns, file_type='csv')

    # Save the CSV file to a specific directory
    with open(f'./backend/tasks/user-downloads/{file_name}', 'wb') as f:
        f.write(csv_out.data)

    return file_name