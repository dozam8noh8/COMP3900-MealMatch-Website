import json
from app import db
from app.models import Ingredient, User, Ingredient, Category, Recipe, Mealtype, RecipeIngredients
from sqlalchemy import func
import random
import datetime

########################################### SETUP INGREDIENTS AND CATEGORIES #############################################

def seed_db():
    db.create_all()
    db.drop_all()
    db.create_all()

    # Load json
    input_file=open('data_seed/ingredients.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    # Find all the categories
    all_categories = []
    for item in json_decode['ingredients']:
        if (item['strType'] != None):
            all_categories.append(item['strType'])
    categories = set(all_categories)

    for category in categories:
        #add to db
        category_object = Category(name=category)
        db.session.add(category_object)
        db.session.commit()

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
        db.session.commit()

    # print('ingredients: ', ingredients)


    ########################################################################################################################

    ########################################### SETUP MEALTYPES ############################################################
    # Load json
    input_file=open('data_seed/mealtypes.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    # Find all the categories
    all_mealtypes = []
    for item in json_decode['categories']:
        if (item['strCategory'] != None):
            # all_mealtypes.append(item['strCategory'])
            mealtype = Mealtype(name=item['strCategory'])
            db.session.add(mealtype)
            db.session.commit()

    # print('mealTypes: ', all_mealtypes)

    ########################################################################################################################

    ########################################### SETUP RECIPES ##############################################################

    # Load json
    input_file=open('data_seed/recipes.json', 'r', encoding='utf8')
    json_decode=json.load(input_file)

    user = User(username='admin', password_hash='pbkdf2:sha256:150000$V5gA5nPN$3377ab719495472c4b4f6efcdb0066d7591c29f3f5721dcb469ddd5c54fb9232', email='admin@admin.com')
    db.session.add(user)
    db.session.commit()

    MAX_INGREDIENTS = 20
    for item in json_decode['meals']:
        # Make new recipe
        recipe = Recipe(name=item['strMeal'],instruction=item['strInstructions'], image=item['strMealThumb'])
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