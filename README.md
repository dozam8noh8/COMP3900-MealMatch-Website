# COMP3900 (Group: I dont care) - Implementing the MealMatch Project

# Project Setup
Clone this repo to your local machine.

Preferred machines specifications:
- Python3+
- Linux/Mac

**Warning:** If python3 is not set as the default python version, the following guide may not work, as a work around, where “python” is mentioned in the setup doc use “python3” and if required, also replace “pip” with “pip3”.

# Backend Setup
1. Navigate to `capstone-project-i-dont-care/backend`

2. Create a python virtual environment, activate it, and install dependencies.
	For Linux and Mac users.
	```
	$ cd backend
	$ python -m venv venv
	$ source venv/bin/activate
	$ pip install -r requirements.txt
	``` 
If you are on Windows then run `venv\Scripts\activate` instead of `source venv/bin/activate`  
If you are using pip3 then run `pip3 install -r requirements.txt` instead of `pip install -r requirements.txt`  

3. Database setup  
** WARNING ** This step will reset and reseed your database. Only run when you want to reset recipe data.  
In the virtual environment with the required packages, run the following command.
```
(venv) $ python setup-db.py
```  

4. Run the server.  
In the virtual environment with the required packages, run the following command.
```
(venv) $ python run.py
```

**Possible Errors**
- If your database file `db.sqlite` in `backend/app/` does not exist, you may optionally hit the `localhost:5000/db_seed` endpoint to populate your database.

- If you are facing login errors, it is probably for multiple versions of Python JWT installed globally from other projects. Fix for the error is as follows:
```
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
```

# Frontend Setup
NOTE: Do the following on another terminal and keep the backend Python API running
Install all packages, build the Angular app and run:
```
$ cd frontend/MealMatch-Webapp
$ npm install
If you don't have Angular cli, then please install
$ npm install -g @angular/cli
```
Once the packages have been installed, run the following two commands to comment out conflicting style issues. (Linux only)
```
$ sed -i '11,42 s/^/\/\//' node_modules/bootstrap/scss/bootstrap.scss
$ sed -i '44 s/^/\/\//' node_modules/bootstrap/scss/bootstrap.scss
```

	If the above command does not work then:
	```
	$ cd node_modules/bootstrap/scss
	$ vi bootstrap.scss
	```
	and replace the contents of the file with the following
	```
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
	```
    
Run the Angular app:
```
$ ng serve
```

Finally, visit localhost:4200 to view the app!  
**WARNING: If when you load the website, the navbar is drooping down and the stylings do not look right, please review the step above
and comment out all imports in the bootstrap.scss file other than "functions", "variables", "mixins", "utilities"**. 


# Test Users For Logging in
Whilst making an account on MealMatch is easy, we’ve provided some test users so you can see what different views would be like after contributing multiple recipes. These users are created when the database is seeded and own the contributed recipes to populate the site with data.

**Account: Admin**

The “admin” account owns the majority of all recipes created on mealmatch, so if you would like to see a dashboard fully populated with recipes that you can edit/delete or view, you should use this account. Admin is the user that Waqif uses to demonstrate a “power user” in the final demo.

Username: admin  
Password: admin

**Account: Kenny**

The “kenny” account is a fresh account that would represent a starting user. It has contributed no recipes so its dashboard is empty.

Username: kenny  
Password: test  


# Members
- Emmanuel Borra
- Waqif Alam
- Manni Huang
- Kenny Wong
- Owen Silver
