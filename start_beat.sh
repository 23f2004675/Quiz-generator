#! /bin/sh
echo "\n\n\n======================================================================"
echo "Welcome to to the setup. This will start the beat" 
echo "You can rerun this without any issues."
echo "----------------------------------------------------------------------\n\n\n"

celery -A main:celery_app beat -l info

