from celery import shared_task
from .mail_service import send_mail
from flask import render_template
from backend.app.models import Quiz, User, Score
from datetime import datetime, timedelta

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