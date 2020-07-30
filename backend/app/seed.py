import json
from app import db
from app.models import Ingredient, User, Ingredient, Category, Recipe, Mealtype, RecipeIngredients
from sqlalchemy import func
import random
import datetime

########################################### SETUP INGREDIENTS AND CATEGORIES #############################################

def seed_db():
    db.drop_all()
    db.create_all()

    # Load json
    input_file=open('data_seed/categories.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    for item in json_decode['categories']:
        category_object = Category(name=item)
        db.session.add(category_object)

    # Load json
    input_file=open('data_seed/ingredients.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    # To view all categories added uncomment this line
    # print('categories: ', categories)

    # Seed the ingredients
    # ingredients = []

    for item in json_decode['ingredients']:
        # ingredients.append(item['strIngredient'])
        category = Category.query.filter_by(name=item['strType']).first()
        ingredient = Ingredient(name=item['strIngredient'])
        ingredient.categories.append(category)
        db.session.add(ingredient)

    # print('ingredients: ', ingredients)


    ########################################################################################################################

    ########################################### SETUP MEALTYPES ############################################################
    # Load json
    input_file=open('data_seed/mealtypes.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    # Find all the categories
    # all_mealtypes = []
    for item in json_decode['categories']:
        if (item['strCategory'] != None):
            # all_mealtypes.append(item['strCategory'])
            mealtype = Mealtype(name=item['strCategory'])
            db.session.add(mealtype)

    # print('mealTypes: ', all_mealtypes)

    ########################################################################################################################

    ########################################### SETUP RECIPES ##############################################################

    # Load json
    input_file=open('data_seed/recipes2.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    user = User(username='admin', password_hash='pbkdf2:sha256:150000$V5gA5nPN$3377ab719495472c4b4f6efcdb0066d7591c29f3f5721dcb469ddd5c54fb9232', email='admin@admin.com', profile_pic=None)
    db.session.add(user)

    for item in json_decode['meals']:
        # Make new recipe
        if 'image' in item:
            recipe = Recipe(name=item['name'], instruction=item['instruction'], image=item['image'])
        else:
            recipe = Recipe(name=item['name'], instruction=item['instruction'])
        db.session.add(recipe)

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

    ########################################################################################################################

    # Load json
    input_file=open('data_seed/recipes.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    MAX_INGREDIENTS = 20
    for item in json_decode['meals']:
        # Make new recipe
        instruction = item['strInstructions'].splitlines()
        instruction = '\n'.join([x for x in instruction if len(x) > 2])
        recipe = Recipe(name=item['strMeal'],instruction=instruction, image=item['strMealThumb'])
        db.session.add(recipe)

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

    db.session.commit()