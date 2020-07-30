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
    or if you're using pip3
    (venv) $ pip3 install -r requirements.txt

Or if you are on Windows, then use the following commands instead:

    $ cd backend
    $ virtualenv venv
    $ venv\Scripts\activate
    (venv) $ pip install -r requirements.txt
    or if you're using pip3
    (venv) $ pip3 install -r requirements.txt
    
After you install all the required packages run the server and seed the database:

    (venv) python run.py
    
    Visit localhost:5000/db_seed to populate your database with recipes
    
Please NOTE: if you are facing login errors, it is probably for multiple versions of Python JWT installed globally from other projects
Fix for the error is as follows:

    $ cd backend
    $ pip uninstall jwt
    $ pip3 uninstall jwt
    $ pip uninstall pyjwt
    $ pip uninstall pyjwt
    
    Then depending on whether you are using pip or pip3
    (venv) $ pip install pyjwt
    or if you're using pip3
    (venv) $ pip3 install pyjwt
    
    Run the server again and that should fix the bugs
    $ python run.py

Set up Frontend
------------

NOTE: Do the following on another terminal and keep the backend Python API running
Install all packages, build the Angular app and run:

    $ cd frontend/MealMatch-Webapp
    $ npm install
    
    Go to bootstrap node modules
    $ cd node_modules/bootstrap/scss
    $ vi bootstrap.scss
    
    and replace the contents of the file with the following
    
    ------------
        /*!
     * Bootstrap v4.5.0 (https://getbootstrap.com/)
     * Copyright 2011-2020 The Bootstrap Authors
     * Copyright 2011-2020 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     */

    @import "functions";
    @import "variables";
    @import "mixins";
    // @import "root";
    // @import "reboot";
    // @import "type";
    // @import "images";
    // @import "code";
    // @import "grid";
    // @import "tables";
    // @import "forms";
    // @import "buttons";
    // @import "transitions";
    // @import "dropdown";
    // @import "button-group";
    // @import "input-group";
    // @import "custom-forms";
    // @import "nav";
    // @import "navbar";
    // @import "card";
    // @import "breadcrumb";
    // @import "pagination";
    // @import "badge";
    // @import "jumbotron";
    // @import "alert";
    // @import "progress";
    // @import "media";
    // @import "list-group";
    // @import "close";
    // @import "toasts";
    // @import "modal";
    // @import "tooltip";
    // @import "popover";
    // @import "carousel";
    // @import "spinners";
    @import "utilities";
    // @import "print";
    ------------
    
    Run the Angular app:
    $ ng serve
    
    Visit localhost:4200 to view the app!

# Members
- Emmanuel Borra
- Waqif Alam
- Manni Huang
- Kenny Wong
- Owen Silver
