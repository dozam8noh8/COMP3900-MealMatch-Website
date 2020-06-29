#!/usr/bin/env python
import os
from flask import abort, request, jsonify, g, url_for
from flask_httpauth import HTTPBasicAuth
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import Ingredient, User, Recipe, Category, Mealtype
from app import auth, app, db
from app.seed import seed_db


###############################################################
################### USER AUTHENTICATION ROUTES ################
###############################################################

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

# Register a user
@app.route('/api/users', methods=['POST'])
def new_user():
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


@app.route('/api/users/<int:id>')
@auth.login_required
def get_user(id):
    if current_user.id != id:
        return 'Unauthorized Access', 401
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.username})

# Get Auth Token
@app.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(12000)
    return jsonify({'token': token.decode('ascii'), 'duration': 12000})

@app.route('/api/recipes/<int:id>')
def get_recipe(id):
    return jsonify(Recipe.get_recipe_by_id(id))

@app.route('/api/recipe_search', methods=['POST'])
def recipe_search():
    ingredients = request.json.get('ingredients')
    recipes = Recipe.get_recipes(ingredients)
    return jsonify(Recipe.json_dump(recipes))

@app.route('/api/get_category', methods=['GET'])
def get_category():
    categories = Category.query.all()
    return jsonify(Category.json_dump(categories))

@app.route('/api/recommendations')
def get_recommendations():
    res = Ingredient.find_recommendations('Cheese Slices')
    return jsonify({"Recommendations": res})


@app.route('/api/db_seed')
def db_seed():
    seed_db()
    return 'DB has been reset'

@app.after_request
def after_request(response):
    ''' This method adds the following headers after processing each request
        it's necessary (until I find a work around) so that the responses
        back to angular don't get blocked by the browser CORS check. '''

    #print(response.headers)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    #print(response.headers)
    return response

if __name__ == '__main__':
    # if not os.path.exists('db.sqlite'):
    #     db.create_all()
    app.run(debug=True)
