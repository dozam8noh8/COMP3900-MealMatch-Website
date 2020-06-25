import json
from app import db
from app.models import Ingredient, User, Ingredient, Category, Recipe, Mealtype

########################################### SETUP INGREDIENTS AND CATEGORIES #############################################

def seed_db():
    db.create_all()
    db.drop_all()
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

    ########################################### SETUP RECIPES ##############################################################

    # Load json
    input_file=open('data_seed/recipes.json', 'r')
    json_decode=json.load(input_file)

    user = User(username='admin', password_hash='pbkdf2:sha256:150000$V5gA5nPN$3377ab719495472c4b4f6efcdb0066d7591c29f3f5721dcb469ddd5c54fb9232')
    db.session.add(user)
    db.session.commit()

    for item in json_decode['meals']:
        # Make new recipe
        recipe = Recipe(name=item['name'],instruction=item['instruction'])
        db.session.add(recipe)
        db.session.commit()

        mealtype = Mealtype.query.filter_by(name=item['mealtype']).first()
        recipe.mealtypes.append(mealtype)
        db.session.commit()

        ingredients = item['ingredients']
        for ingredient in ingredients:
            db_ingredient = Ingredient.query.filter_by(name=ingredient['name']).first()
            if db_ingredient:
                recipe.ingredients.append(db_ingredient)
        user.recipes.append(recipe)
        db.session.commit()

    ########################################################################################################################