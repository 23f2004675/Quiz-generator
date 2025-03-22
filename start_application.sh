#! /bin/sh
echo "\n\n\n======================================================================"
echo "Welcome to to the run. This will run your application." 
echo "You can rerun this without any issues."
echo "----------------------------------------------------------------------\n\n\n"
if [ -d ".env" ];
then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run setup.sh first"
    exit N
fi

# Activate virtual env
. .env/bin/activate
export ENV=development
python3 main.py
deactivate
