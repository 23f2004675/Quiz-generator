#! /bin/sh
echo "\n\n\n======================================================================"
echo "Welcome to to the Application. This will setup the worker" 
echo "You can rerun this without any issues."
echo "----------------------------------------------------------------------\n\n\n"


# Activate virtual env
. .env/bin/activate
export ENV=development
celery -A main:celery_app worker -l INFO
deactivate