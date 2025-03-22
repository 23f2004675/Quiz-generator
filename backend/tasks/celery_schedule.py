from celery.schedules import crontab
from flask import current_app as app
from backend.app.models import User

celery_app=app.extensions["celery"]

from .tasks import daily_Quiz_email_reminder, monthly_performance_report

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    Users=[user for user in User.query.all() if user.roles[0].name=="user"]
    for user in Users:

        #daily at 11:55 AM
        sender.add_periodic_task(crontab(hour=11,minute=55), daily_Quiz_email_reminder.s(user.email, "Daily remainder for Upcoming Quizz's",content.format(user.fullname), user.fullname),name=user.email)
        # sender.add_periodic_task(8.0, daily_Quiz_email_reminder.s(user.email, "Daily remainder for Upcoming Quizz's","daily.html", user.fullname),name=user.email)
        
        #monthly 1st day at 12:30 AM
        sender.add_periodic_task(crontab(day_of_month=1, hour=0, minute=30),monthly_performance_report.s(user.email, "Your Monthly Performance Report", "monthly_report.html", user.fullname),name=f"monthly_report_{user.email}")
        # sender.add_periodic_task(15.0,monthly_performance_report.s(user.email, "Your Monthly Performance Report", "monthly_report.html", user.fullname),name=f"monthly_report_{user.email}")
            
