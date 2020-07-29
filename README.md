# COMP3900 (Group: I dont care) - Implementing the MealMatch Project

Remember to add your diaries in the diaries directory with zXXXXXXX.txt as the name

# Project Setup.
Set up Backend first
------------

After cloning, create a virtual environment and install the requirements.
NOTE: If your 'pip' is linked to Python 2, use 'pip3' instead

For Linux and Mac users:

    $ cd backend
    $ virtualenv venv
    $ source venv/bin/activate
    (venv) $ pip install -r requirements.txt

Or if you are on Windows, then use the following commands instead:

    $ cd backend
    $ virtualenv venv
    $ venv\Scripts\activate
    (venv) $ pip install -r requirements.txt
    
After you install all the required packages run the server and seed the database:

    (venv) python run.py
    
    Visit localhost:5000/db_seed to populate your database with recipes

Set up Frontend
------------

NOTE: Do the following on another terminal and keep the backend Python API running
Install all packages, build the Angular app and run:

    $ cd frontend/MealMatch-Webapp
    $ npm install
    $ ng build
    $ ng serve
    Visit localhost:4200 to view the app!

# Members
- Emmanuel Borra
- Waqif Alam
- Manni Huang
- Kenny Wong
- Owen Silver
