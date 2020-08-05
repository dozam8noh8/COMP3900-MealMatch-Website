import json
from app import db
from app.models import Ingredient, User, Ingredient, Category, Recipe, Mealtype, RecipeIngredients, Rating, RecipeInstructions
from sqlalchemy import func
import random
import datetime

########################################### SETUP INGREDIENTS AND CATEGORIES #############################################

def seed_db():
    db.drop_all()
    db.create_all()

    random.seed(333)

    # Load json
    input_file=open('data_seed/categories.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    for item in json_decode['categories']:
        category_object = Category(name=item)
        db.session.add(category_object)

    # Load json
    input_file=open('data_seed/ingredients.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    for item in json_decode['ingredients']:
        category = Category.query.filter_by(name=item['strType']).first()
        ingredient = Ingredient(name=item['strIngredient'])
        ingredient.categories.append(category)
        db.session.add(ingredient)


    ########################################################################################################################

    ########################################### SETUP MEALTYPES ############################################################
    # Load json
    input_file=open('data_seed/mealtypes.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    for item in json_decode['categories']:
        if (item['strCategory'] != None):
            mealtype = Mealtype(name=item['strCategory'])
            db.session.add(mealtype)


    ########################################################################################################################

    ########################################### SETUP RECIPES ##############################################################
    user = User(username='admin', email='admin@admin.com')
    user.hash_password('admin')
    db.session.add(user)

    ########################################################################################################################

    # Load json
    input_file=open('data_seed/recipes.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    MAX_INGREDIENTS = 20
    for item in json_decode['meals']:
        # Make new recipe
        recipe = Recipe(name=item['strMeal'], image=item['strMealThumb'])
        db.session.add(recipe)

        for instruction in item['strInstructions'].splitlines():
            if len(instruction) > 2:
                recipe_instruction = RecipeInstructions(instruction=instruction)
                recipe.instructions.append(recipe_instruction)

        mealtype = Mealtype.query.filter_by(name=item['strCategory']).first()
        recipe.mealtypes.append(mealtype)

        for i in range(1, MAX_INGREDIENTS + 1):
            ingredient_name = item['strIngredient' + str(i)]
            measure = item['strMeasure' + str(i)]
            if ingredient_name and measure:
                ingredient = Ingredient.query.filter(func.lower(Ingredient.name) == func.lower(ingredient_name)).first()
                if ingredient:
                    recipe_ingredient = RecipeIngredients(quantity=measure)
                    recipe_ingredient.ingredients = ingredient
                    recipe.ingredients.append(recipe_ingredient)
            else:
                break
        user.recipes.append(recipe)

    # Load json
    input_file=open('data_seed/recipes2.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    for item in json_decode['meals']:
        # Make new recipe
        if 'image' in item:
            recipe = Recipe(name=item['name'], image=item['image'])
        else:
            recipe = Recipe(name=item['name'])
        db.session.add(recipe)

        for instruction in item['instruction'].splitlines():
            recipe_instruction = RecipeInstructions(instruction=instruction)
            recipe.instructions.append(recipe_instruction)

        mealtype = Mealtype.query.filter_by(name=item['mealtype']).first()
        recipe.mealtypes.append(mealtype)

        ingredients = item['ingredients']
        for ingredient in ingredients:
            db_ingredient = Ingredient.query.filter_by(name=ingredient['name']).first()
            if db_ingredient:
                recipe_ingredient = RecipeIngredients(quantity=ingredient['quantity'])
                recipe_ingredient.ingredients = db_ingredient
                recipe.ingredients.append(recipe_ingredient)
        user.recipes.append(recipe)

    db.session.commit()

    ########################################################################################################################

    ########################################### ADD RANDOM RATINGS #########################################################
    newUser = User(username='Emmanuel', email='emmanuel@mealmatch.com')
    newUser.hash_password('test')
    db.session.add(newUser)

    newUser = User(username='kenny', email='kenny@gmail.com')
    newUser.hash_password('test')
    db.session.add(newUser)

    recipes = Recipe.query.all()
    for recipe in recipes:
        if random.randrange(10) > 3:
            rating = Rating(rating=(random.randrange(5) + 1), comment='Demo Comment.')
            recipe.rating.append(rating)
            newUser.rating.append(rating)
    db.session.commit()
    print('Database has been seeded')
