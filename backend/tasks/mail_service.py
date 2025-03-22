import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from ..app.models import Quiz
from datetime import datetime
# from flask import render_template

SMTP_SERVER = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = "Quiz-Admin@ds.study.iitm.ac.in"
SENDER_PASSWORD = "password"

def send_mail(to, subject, content, name):

    msg = MIMEMultipart()

    msg["From"] = SENDER_EMAIL
    msg["To"] = to
    msg["Subject"] = subject
    
    # html_content = render_template('/Users/vb/Desktop/IIT_Madras/github/Quiz-generator/backend/tasks/Daily_reminder.html', name=name,quizzes=quizzes)
    msg.attach(MIMEText(content, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()
