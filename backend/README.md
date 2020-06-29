#TLDR
1. Make a venv using `virtualenv <venv here>`
2. Activate venv `source <venvName>/bin/activate`
3. install requirements with pip or pip3 `pip3 -r requirements.txt`
4. Run program with `python run.py`

#Common issues
- Address already in use -> Find the process and kill it using `kill -9 <pid>`

Restful Authentication skeleton modified from REST-Auth [RESTful Authentication with Flask](http://blog.miguelgrinberg.com/post/restful-authentication-with-flask) article.
=========
Installation
------------

After cloning, create a virtual environment and install the requirements. For Linux and Mac users:

    $ virtualenv venv
    $ source venv/bin/activate
    (venv) $ pip install -r requirements.txt

If your 'pip' is linked to Python 2, use 'pip3' instead

If you are on Windows, then use the following commands instead:

    $ virtualenv venv
    $ venv\Scripts\activate
    (venv) $ pip install -r requirements.txt

Running
-------

To run the server use the following command:

    (venv) $ python run.py
     * Running on http://127.0.0.1:5000/
     * Restarting with reloader

Then from a different terminal window you can send requests.

API Documentation
-----------------

- POST **/api/users**

    Register a new user.<br>
    The body must contain a JSON object that defines `username` and `password` fields.<br>
    On success a status code 201 is returned. The body of the response contains a JSON object with the newly added user. A `Location` header contains the URI of the new user.<br>
    On failure status code 400 (bad request) is returned.<br>
    Notes:
    - The password is hashed before it is stored in the database. Once hashed, the original password is discarded.
    - In a production deployment secure HTTP must be used to protect the password in transit.

- GET **/api/token**

    Return an authentication token.<br>
    This request must be authenticated using a HTTP Basic Authentication header.<br>
    On success a JSON object is returned with a field `token` set to the authentication token for the user and a field `duration` set to the (approximate) number of seconds the token is valid.<br>
    On failure status code 401 (unauthorized) is returned.

- GET **/api/resource**

    Return a protected resource.<br>
    This request is only just for an example to look at

- GET **/api/db_seed**

    Seed your local db with the required data.<br>
    All previous data is REMOVED and replaced with standard data and a user (username: 'admin', password: 'admin')

Use Postman to send requests. Use BASIC Authentication with username and password to login and return a token

Once the token expires it cannot be used anymore and the client needs to request a new one. Note that in this last example the password is arbitrarily set to `x`, since the password isn't used for token authentication.

An interesting side effect of this implementation is that it is possible to use an unexpired token as authentication to request a new token that extends the expiration time. This effectively allows the client to change from one token to the next and never need to send username and password after the initial token was obtained.

Database Tutorial
-----------------

    category = Category(name='Pastry')
    ingredient = Ingredient(name='Puff Pastry')
    ingredient.categories.append(category)
    mealtype = Mealtype(name='Hello')
    user = User(id=1, username='Hello',password_hash='Hello')
    recipe = Recipe(name='recipename', user=user, image='hello', instruction='stuck in the toaster')
    recipe.mealtypes.append(mealtype)
    # link recipe and ingredient with new attribute of quantity
    recipe_ingredient = RecipeIngredients(quantity='50g')
    recipe_ingredient.ingredients = ingredient
    recipe.ingredients.append(recipe_ingredient)