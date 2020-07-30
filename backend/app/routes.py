#!/usr/bin/env python
import os
from flask import abort, request, jsonify, g, url_for, Response
from flask_httpauth import HTTPBasicAuth
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from werkzeug.datastructures import ImmutableMultiDict
from app.models import Ingredient, User, Recipe, Category, Mealtype, RecipeIngredients, IngredientPairs, Rating
from app import auth, app, db
from app.seed import seed_db
import secrets
from app.ErrorException import ErrorException


###############################################################
################### USER AUTHENTICATION ROUTES ################
###############################################################

#########INTERNAL FUNCTION#########
# Auth handler
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

# Error handler for responses
@app.errorhandler(ErrorException)
def handle_error_exception(error):
    response = jsonify(error.to_dict())
    response.status_code = error.statusCode
    return response

# Auth error handler
@auth.error_handler
def auth_error(status):
    raise ErrorException('Your authentication is invalid', 401)

# Health endpoint to check if service is up
@app.route('/healthz', methods=['GET'])
def healthz():
    return jsonify({'message': 'Server is up', 'statusCode': 200, 'status' : 'success'})

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
    if not username or not password:
        raise ErrorException('Username or Password is not entered', 500)
    if User.query.filter_by(username=username).first() is not None:
        raise ErrorException('This user already exists', 500)
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'username': user.username, 'statusCode': 201, 'status' : 'success'}), 201


@app.route('/api/users/<int:id>', methods=['GET'])
@auth.login_required
def get_user_info(id):
    '''
    Given a user's id, return the details associated with that user.

    A user is only allowed to request their own user information.

    @Return
     - Returns the username, id, email, profile picture and associated recipes of the user.

    @Return Codes
     - 401 - user is unauthorised (A user isn't logged in or trying to view someone elses information)
     - 400 - the requested user does not exist in the DB.
    '''
    # If the requesting user is not the user who's info is requested.
    if g.user.id != id:
        raise ErrorException('Your authentication is invalid', 401)
    user = User.query.get(id)
    # Can't find user in db.
    if not user:
        raise ErrorException('This user does not exist in the database', 500)
    page_num = request.args.get('page_num', default=1, type=int)
    page_size = request.args.get('page_size', default=12, type=int)
    response = Recipe.get_recipes_by_user_id(g.user.id, page_num, page_size)
    response.update({'user_id': user.id, 'email': user.email, 'username': user.username, 'profile_pic': user.profile_pic, 'statusCode': 200, 'status' : 'success'})
    return response

@app.route('/api/top_rated_recipes', methods=['GET'])
def top_rated():
    '''
    Returns a list of all the highest rated recipes

    '''
    return jsonify(Recipe.get_highest_rated_recipes(10))

@app.route('/api/top_contributors', methods=['GET'])
def top():
    '''
    Returns a list of all the top contributors

    '''
    return jsonify(User.top_contributors())

@app.route('/api/top_rated', methods=['GET'])
def combine():
    '''

    Returns a list of all the top contributors and recipes for hall of fame page

    '''
    recipes = (Recipe.get_highest_rated_recipes(10))
    users = (User.top_contributors())
    response = jsonify({'Recipes': recipes, 'Users': users})
    response.status_code = 200
    return response

@app.route('/api/edit_user/<int:id>', methods=['POST'])
@auth.login_required
def edit_user(id):
    '''
        On POST edit a user's profile

    '''
    # If the requesting user is not the user who's info is requested.
    if g.user.id != id:
        raise ErrorException('Your authentication is invalid', 401)
    user = User.query.get(id)
    # Can't find user in db.
    if not user:
        raise ErrorException('This user does not exist in the database', 500)
    old_pass = request.json.get('old_password')
    new_pass = request.json.get('new_password')
    if user.verify_password(old_pass):
        user.hash_password(new_pass)
    else:
        raise ErrorException('Your old password is invalid', 500)
    db.session.commit()
    return jsonify({'message': 'Success', 'statusCode': 200, 'status' : 'success'})


# Get Auth Token
@app.route('/api/token', methods=['GET'])
@auth.login_required
def get_auth_token():
    '''
        Return a token that can be used to access logged in endpoints
        as an alternative to a username and password authentication.

        - Once a token has been acquired, it will be appended to the authorisation header of loggedIn only requests.
        - The token will only last a certain amount of time (currently 24000 seconds) before
        a user must request another using their username and password.
        - To get this token, a user must send their username connected with their password
        as a base64 encoded string as part of the authorization header of the get request to this route.

        See https://security.stackexchange.com/questions/63435/ for more information on why this is useful.
        See frontend's auth.service.ts login function for an example of how to communicate with this route.
        Also see HTTP Basic Authentication

    '''
    token = g.user.generate_auth_token(24000)
    return jsonify({'user_id': g.user.id, 'token': token.decode('ascii'), 'duration': 24000, 'statusCode': 200, 'status' : 'success'})

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
    page_num = request.args.get('page_num', default=1, type=int)
    page_size = request.args.get('page_size', default=12, type=int)
    response = Recipe.get_recipes(ingredients, page_num, page_size)
    response.update({'statusCode': 200, 'status' : 'success'})
    return response

@app.route('/api/recipe_delete/<int:recipe_id>', methods=['DELETE'])
@auth.login_required
def recipe_delete(recipe_id):
    """ Delete a recipe by its id"""
    recipe = Recipe.get_recipe_by_id(recipe_id)
    if not recipe:
        raise ErrorException('This recipe does not exist', 500)
    if g.user.id != recipe["user_id"] :
        raise ErrorException('Your authentication is invalid', 401) # Cant delete a recipe that isn't yours
    if Recipe.recipe_delete(recipe_id):
        return jsonify({'message': 'Recipe deleted.', 'statusCode': 200, 'status' : 'success'})


# Actually returns sets as required. TODO Change variable names
@app.route('/api/popular_ingredient_pairs', methods=['GET'])
@auth.login_required
def popular_ingredient_pairs():
    response = IngredientPairs.get_highest_pairs()
    return jsonify(response)


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
    return {'ingredient_id' : ingredient.id, 'message': 'Ingredient has been added', 'statusCode': 201, 'status' : 'success'}

@app.route('/api/rating/<int:id>', methods=['GET', 'POST'])
def rating(id):
    '''
        On a GET request with /rating/recipe_id it will return all the ratings for a recipe

        On a POST request with /rating/recipe_id will add a new rating
            for post, please supply 'rating' between 1 and 5, 'comment', 'user_id' as a JSON
    '''
    if request.method == 'POST':
        rating = request.json.get('rating')
        if int(rating) > 5 or int(rating) < 1:
            raise ErrorException('Ratings must be between 1 and 5', 500)
        comment = request.json.get('comment')
        user = User.query.filter_by(id=request.json.get('user_id')).first()
        recipe = Recipe.query.filter_by(id=id).first()
        new_rating = Rating(rating=int(rating), comment=comment)
        # Check if rating already exists by a user
        for user_rating in user.rating:
            for rating_recipe in user_rating.recipe:
                if rating_recipe == recipe:
                    user_rating.rating = rating
                    user_rating.comment = comment
                    db.session.commit()
                    return jsonify({'id':user_rating.id, 'rating':user_rating.rating, 'comment': user_rating.comment})
        # return jsonify(Rating.json_dump(user.rating))
        recipe.rating.append(new_rating)
        user.rating.append(new_rating)
        db.session.add(new_rating)
        db.session.commit()
        return jsonify({'id':new_rating.id, 'rating':new_rating.rating, 'comment': new_rating.comment})
    recipe = Recipe.query.filter_by(id=id).first()
    ratings = recipe.rating
    return jsonify(Rating.json_dump(ratings))

@app.route('/api/add_recipe', methods=['POST'])
@auth.login_required
def add_recipe():
    '''

        On a POST request with /add_recipe will add a new recipe
            for post, please supply 'name', 'instruction', 'mealType' and 'ingredients'

    '''
    name = request.json.get('name')
    instruction = request.json.get('instruction')
    mealType = request.json.get('mealType')
    ingredients = request.json.get('ingredients')
    user_id = g.user.id
    recipe = Recipe.add_recipe(name, instruction, mealType, ingredients, user_id)
    return {'recipe_id' : recipe.id, 'message': 'Recipe has been added', 'statusCode': 201, 'status' : 'success'}

@app.route('/api/edit_recipe', methods=['POST'])
@auth.login_required
def edit_recipe():
    '''

        On a POST request with /edit_recipe will add a new recipe
            for post, please supply 'name', 'instruction', 'mealType' and 'ingredients'

    '''
    recipe_id = request.json.get('id')
    name = request.json.get('name')
    instruction = request.json.get('instruction')
    mealType = request.json.get('mealType')
    ingredients = request.json.get('ingredients')
    recipe = Recipe.edit_recipe(recipe_id, name, instruction, mealType, ingredients)
    if g.user.id != recipe.user_id:
        raise ErrorException('This is not your recipe, you cannot edit it.', 401)
    return {'recipe_id' : recipe.id, 'message': 'Recipe has been edited', 'statusCode': 201, 'status' : 'success'}

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

@app.route('/api/profile_pic_upload', methods=['POST'])
@auth.login_required
def profile_pic_upload():
    '''

        On a POST request with /profile_pic_upload will upload a picture and store in our storage

    '''
    msg, code = extract_photo(request)
    if code == 200: #TODO HANDLE ERRORS
        picture_path = 'http://localhost:5000' + url_for('static', filename=msg)
        user_id = g.user.id
        User.upload_profile_image(user_id, picture_path)
    else:
        raise ErrorException(msg, code)
    return jsonify({'msg':msg, 'statusCode': 201, 'status' : 'success'}), code

@app.route('/api/recipe_image_upload/<int:recipe_id>', methods=['POST'])
@auth.login_required
def recipe_image_upload(recipe_id):
    '''

        On a POST request with /recipe_image_upload will upload a picture and store in our storage

    '''
    msg, code = extract_photo(request)
    if code == 200: #TODO HANDLE ERRORS - Turn into objects?
        picture_path = 'http://localhost:5000' + url_for('static', filename=msg)
        Recipe.upload_recipe_image(recipe_id, picture_path)
    else:
        raise ErrorException(msg, code)
    return jsonify({'msg':msg, 'statusCode': 201, 'status' : 'success'}), code



def extract_photo(request):
    if 'file' not in request.files:
        return 'No File could not be uploaded', 500 # Fix error code
    file = request.files['file']
    if file.filename == '':
        return 'No File could not be uploaded', 500, # Fix error code
    if file:
        random_hex = secrets.token_hex(8)
        _, f_ext = os.path.splitext(file.filename)
        picture_fn = random_hex + f_ext
        picture_path = os.path.join(app.root_path, 'static', picture_fn)
        file.save(picture_path)
        return picture_fn, 200 # If we change code, change in update functions too!
    return 'No File could be uploaded', 500 # Fix error code


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
