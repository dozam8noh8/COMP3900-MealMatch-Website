import json
from app import db
from app.models import Ingredient, User, Ingredient, Category, Recipe, Mealtype

########################################### SETUP INGREDIENTS AND CATEGORIES #############################################

def seed_db():
    db.create_all()

    # Load json
    input_file=open('data_seed/ingredients.json', 'r')
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
    ingredients = []

    for item in json_decode['ingredients']:
        if (item['strType'] != None):
            # ingredients.append({item['strIngredient']: item['strType']})
            category = Category.query.filter_by(name=item['strType']).first()
            ingredient = Ingredient(name=item['strIngredient'])
            ingredient.categories.append(category)
            db.session.add(ingredient)
            db.session.commit()

    # print('ingredients: ', ingredients)


    ########################################################################################################################

    ########################################### SETUP MEALTYPES ############################################################
    # Load json
    input_file=open('data_seed/mealtypes.json', 'r')
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