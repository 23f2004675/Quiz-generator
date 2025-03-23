import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import calendar
import os
from flask import jsonify, send_file
from flask_restful import Resource
from flask_security import auth_required
from ..app.models import Quiz, Subject, Score,db,Chapter

class MakeChart(Resource):

    @auth_required('token')
    def get(self, user_id):
        # Create the directory if it doesn't exist
        os.makedirs('frontend/assets/Images', exist_ok=True)

        # Define the paths for the charts
        chart_urls = {
            'bar_chart_url': f'frontend/assets/Images/quiz_by_subject{user_id}.jpg',
            'pie_chart_url': f'frontend/assets/Images/quizzes_by_month{user_id}.jpg'
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

        quizzes_by_month = {}
        # Pie Chart: Quizzes attempted by user across all 12 months
        # quizzes_by_month = {month: 0 for month in calendar.month_name[1:]}
        scores = Score.query.filter_by(user_id=user_id).all()
        for score in scores:
            month_name = score.timestamp.strftime("%B")
            if month_name in quizzes_by_month:
                quizzes_by_month[month_name] += 1
            else:
                quizzes_by_month[month_name] = 1
        if(list(quizzes_by_month.values())!=[]):

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
        else:
            chart_urls['pie_chart_url']=None
        return jsonify(chart_urls)


class AdminSummaryCharts(Resource):
    @auth_required('token')
    # @roles_required('admin')  # Ensure only admins can access this endpoint
    def get(self):
        # Create the directory if it doesn't exist
        os.makedirs('frontend/assets/Images', exist_ok=True)

        # Define the paths for the charts
        chart_urls = {
            'top_scores_chart_url': 'frontend/assets/Images/admin_top_scores.jpg',
            'user_attempts_chart_url': 'frontend/assets/Images/admin_user_attempts.jpg',
        }

        # Fetch subject-wise top scores
        subject_top_scores = (
            db.session.query(
                Chapter.name,
                db.func.max(Score.score).label('top_score')
            )
            .join(Quiz, Score.quiz_id == Quiz.id)
            .join(Chapter, Quiz.chapter_id == Chapter.id)
            .group_by(Chapter.name)
            .all()
        )

        # Generate Top Scores Chart
        subjects = [row[0] for row in subject_top_scores]
        top_scores = [row[1] for row in subject_top_scores]

        plt.figure(figsize=(10, 6))
        plt.bar(subjects, top_scores, color='skyblue')
        plt.title("Subject-wise Top Scores")
        plt.xlabel("Subjects")
        plt.ylabel("Top Score")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig(chart_urls['top_scores_chart_url'])
        plt.close()

        # Fetch subject-wise user attempts
        subject_user_attempts = (
            db.session.query(
                Chapter.name,
                db.func.count(Score.id).label('user_attempts')
            )
            .join(Quiz, Score.quiz_id == Quiz.id)
            .join(Chapter, Quiz.chapter_id == Chapter.id)
            .group_by(Chapter.name)
            .all()
        )

        # Generate User Attempts Chart
        subjects = [row[0] for row in subject_user_attempts]
        user_attempts = [row[1] for row in subject_user_attempts]

        plt.figure(figsize=(10, 6))
        plt.bar(subjects, user_attempts, color='orange')
        plt.title("Subject-wise User Attempts")
        plt.xlabel("Subjects")
        plt.ylabel("Number of Attempts")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig(chart_urls['user_attempts_chart_url'])
        plt.close()

        # Return the URLs of the generated charts
        return jsonify(chart_urls)