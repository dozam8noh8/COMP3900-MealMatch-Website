#!/usr/bin/env python
import os
from flask import abort, request, jsonify, g, url_for
from flask_httpauth import HTTPBasicAuth
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from werkzeug.datastructures import ImmutableMultiDict
from app.models import Ingredient, User, Recipe, Category, Mealtype, RecipeIngredients, IngredientPairs
from app import auth, app, db
from app.seed import seed_db
import secrets


###############################################################
################### USER AUTHENTICATION ROUTES ################
###############################################################

#########INTERNAL FUNCTION#########
@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True

@app.route('/healthz', methods=['GET'])
def healthz():
    return 'Server is up'

# Register a user
@app.route('/api/users', methods=['POST'])
def new_user():
    '''
    Given the signup details of a user, register them in the database so that login attempts can be made.

    @params username, password, (email coming soon?)

    @Returns
        - the username of the created user
    @Return codes
        - 400 - the correct signup details were not submitted OR the username already exists in the system.
        - 201 - code indicating the cresource has been created.
        - (TODO) - Add meaningful message to differentiate insufficient signup details vs username already taken.

    '''
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)    # existing user
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return (jsonify({'username': user.username}), 201)


@app.route('/api/users/<int:id>', methods=['GET'])
@auth.login_required
def get_user_info(id):
    '''
    Given a user's id, return the details associated with that user.

    A user is only allowed to request their own user information.

    @Return
     - Returns the username of the user.
     - (TODO) Return email of user
     - (TODO) Return any recipes/photos associated with a user

    @Return Codes
     - 401 - user is unauthorised (A user isn't logged in or trying to view someone elses information)
     - 400 - the requested user does not exist in the DB.
    '''
    # If the requesting user is not the user who's info is requested.
    if g.user.id != id:
        return 'Unauthorized Access', 401
    user = User.query.get(id)
    # Can't find user in db.
    if not user:
        abort(400)
    return jsonify(User.json_dump(user))

@app.route('/api/edit_user/<int:id>', methods=['POST'])
@auth.login_required
def edit_user(id):
    # If the requesting user is not the user who's info is requested.
    if g.user.id != id:
        return 'Unauthorized Access', 401
    user = User.query.get(id)
    # Can't find user in db.
    if not user:
        abort(400)
    old_pass = request.json.get('old_password')
    new_pass = request.json.get('new_password')
    if user.verify_password(old_pass):
        user.hash_password(new_pass)
    else:
        return "Old password does not match", 201
    db.session.commit()
    return "Success", 200

# Get Auth Token
@app.route('/api/token', methods=['GET'])
@auth.login_required
def get_auth_token():
    '''
        Return a token that can be used to access logged in endpoints
        as an alternative to a username and password authentication.

        - Once a token has been acquired, it will be appended to the authorisation header of loggedIn only requests.
        - The token will only last a certain amount of time (currently 12000 seconds) before
        a user must request another using their username and password.
        - To get this token, a user must send their username connected with their password
        as a base64 encoded string as part of the authorization header of the get request to this route.

        See https://security.stackexchange.com/questions/63435/ for more information on why this is useful.
        See frontend's auth.service.ts login function for an example of how to communicate with this route.
        Also see HTTP Basic Authentication

    '''
    token = g.user.generate_auth_token(12000)
    return jsonify({'user_id': g.user.id, 'token': token.decode('ascii'), 'duration': 12000})

@app.route('/api/recipe/<int:id>', methods=['GET'])
def get_recipe(id):
    ''' Given a recipe id, get the details of the corresponding recipe. Schemas can be found in models.py
        (TODO) Add the fields returned by the recipe once they are finalised.
    '''
    return jsonify(Recipe.get_recipe_by_id(id))

@app.route('/api/recipe_search', methods=['POST'])
def recipe_search():
    '''
        Given a json array of ingredients, find recipes that can be created using only a subset of those ingredients.

        Consider the body of requests to contain the ingredients in your fridge, the response will contain all recipes
        you can make using only the ingredients in your fridge.
        E.g. If you have cheese slices, buns, noodles. You can make cheese buns, but not noodles because you need water.
             If you have cheese slices, buns, noodles, water and carrots.
                You can make cheese buns and noodles, but not a salad because you don't have the other vegetables.

        (TODO) - Add the schema recipes will be returned in once it is finalised.
    '''
    ingredients = request.json.get('ingredients')
    recipes = Recipe.get_recipes(ingredients)
    return jsonify(Recipe.json_dump(recipes))

@app.route('/api/popular_ingredient_pairs', methods=['GET'])
@auth.login_required
def popular_ingredient_pairs():
    return jsonify(IngredientPairs.get_highest_pairs())


@app.route('/api/get_ingredients_in_categories', methods=['GET'])
def get_ingredients_in_categories():
    '''
        Returns a nested json object of all categories with each ingredient within that category inside.

        "id"            -> The id of the category
        "ingredients"   -> An array of all the ingredients in that category
            [
                "id":       -> The id of the actual ingredient within the category.
                "name":     -> The name of the ingredient.
            ]

    '''
    categories = Category.query.all()
    return jsonify(Category.json_dump(categories))

@app.route('/api/get_all_mealtypes', methods=['GET'])
def get_all_mealtypes():
    '''
    Returns a json list of all distinct mealtypes
    [
        {
            "id": 1,
            "name": "Beef"
        },
        ...
    '''
    mealtypes = Mealtype.query.all()
    return jsonify(Mealtype.json_dump(mealtypes))

@app.route('/api/add_ingredient', methods=['POST'])
def add_ingredient():
    '''
        Given an ingredient `name` and `category`, adds it to the database.
    '''
    name = request.json.get('name')
    category = request.json.get('category')
    ingredient = Ingredient.add_ingredient(name, category)
    if type(ingredient) is str:
        return ingredient, 201 # Error message FIX error code
    return {'ingredient_id' : ingredient.id, 'message': 'Ingredient has been added'}

@app.route('/api/add_recipe', methods=['POST'])
@auth.login_required
def add_recipe():
    name = request.json.get('name')
    instruction = request.json.get('instruction')
    mealType = request.json.get('mealType')
    ingredients = request.json.get('ingredients')
    user = 'admin@admin.com'
    recipe = Recipe.add_recipe(name, instruction, mealType, ingredients, user)
    if type(recipe) == str:
        return recipe, 201 # Error message FIX error code
    return {'recipe_id' : recipe.id, 'message': 'Recipe has been added'}

@app.route('/api/recipe_image_update', methods=['POST'])
@auth.login_required
def recipe_image_update():
    picture_path = 'http://localhost:5000' + url_for('static', filename=request.json.get('filename'))
    recipe = request.json.get('recipe_id')
    Recipe.upload_recipe_image(recipe, picture_path)
    return {"pic": picture_path}
    

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    '''
        This endpoint takes a list of ingredient ids that represent a user's current search set
        and return 5 suggestions for an ingredient that is used in a recipe with some of the
        ingredients within that set.
    '''
    ingredient_ids = request.json.get('ingredients')
    ingredients = RecipeIngredients.get_recommendations(ingredient_ids)
    return jsonify(Ingredient.json_dump(ingredients))


@app.route('/api/db_seed', methods=['GET'])
def db_seed():
    ''' Create database file and corresponding tables (used on startup of app) since db is not kept on github. '''
    seed_db()
    return 'DB has been reset'

@app.route('/api/picture_save', methods=['POST'])
@auth.login_required
def picture_save():
    image = ''
    if 'file' not in request.files:
        return 'File could not be uploaded', 201 # Fix error code
    file = request.files['file']
    if file.filename == '':
        return 'No file was uploaded', 201 # Fix error code
    if file:
        random_hex = secrets.token_hex(8)
        _, f_ext = os.path.splitext(file.filename)
        picture_fn = random_hex + f_ext
        picture_path = os.path.join(app.root_path, 'static', picture_fn)
        file.save(picture_path)
        print(request.form['name'])
        return picture_fn
    return 'No file was uploaded', 201 # Fix error code

#########INTERNAL FUNCTION#########
@app.after_request
def after_request(response):
    ''' This method adds the following headers after processing each request
        it's necessary (until I find a work around) so that the responses
        back to angular don't get blocked by the browser CORS check.
    '''

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

if __name__ == '__main__':
    app.run(debug=True)
