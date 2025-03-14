import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import calendar
import os
from flask import jsonify, send_file
from flask_restful import Resource
from flask_security import auth_required
from ..app.models import Quiz, Subject, Score

class MakeChart(Resource):

    @auth_required('token')
    def get(self, user_id):
        # Create the directory if it doesn't exist
        os.makedirs('frontend/assets/Images', exist_ok=True)

        # Define the paths for the charts
        chart_urls = {
            'bar_chart_url': 'frontend/assets/Images/quiz_by_subject.jpg',
            'pie_chart_url': 'frontend/assets/Images/quizzes_by_month.jpg'
        }

        # Bar Chart: Number of quizzes per subject
        all_subjects = Subject.query.all()
        subject_quiz_count = {subject.name: 0 for subject in all_subjects}
        for quiz in Quiz.query.all():
            subject_quiz_count[quiz.chapter.subject.name] += 1

        plt.figure(figsize=(10, 6))
        plt.bar(subject_quiz_count.keys(), subject_quiz_count.values(), color='skyblue')
        plt.title("Number of Quizzes by Subject")
        plt.xlabel("Subjects")
        plt.ylabel("Number of Quizzes")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig(chart_urls['bar_chart_url'])
        plt.close()

        # Pie Chart: Quizzes attempted by user across all 12 months
        quizzes_by_month = {month: 0 for month in calendar.month_name[1:]}
        scores = Score.query.filter_by(user_id=user_id).all()
        for score in scores:
            month_name = score.timestamp.strftime("%B")
            quizzes_by_month[month_name] += 1

        plt.figure(figsize=(8, 8))
        plt.pie(
            quizzes_by_month.values(),
            labels=quizzes_by_month.keys(),
            autopct='%1.1f%%',
            startangle=140,
            colors=plt.cm.Paired.colors
        )
        plt.title("Quizzes Attempted by Month")
        plt.tight_layout()
        plt.savefig(chart_urls['pie_chart_url'])
        plt.close()

        # Return the URLs of the generated charts
        return jsonify(chart_urls)