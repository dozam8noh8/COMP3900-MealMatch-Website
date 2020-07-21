from app import db, jwt, time, app, generate_password_hash, check_password_hash, ma
from sqlalchemy import func, desc

userRatings = db.Table('user_ratings',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('rating_id', db.Integer, db.ForeignKey('rating.id'), primary_key=True)
)

recipeRatings = db.Table('recipe_ratings',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id'), primary_key=True),
    db.Column('rating_id', db.Integer, db.ForeignKey('rating.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(70), index=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))
    profile_pic = db.Column(db.String(64))
    recipes = db.relationship('Recipe', backref='user', lazy='dynamic')

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expires_in=600):
        return jwt.encode(
            {'id': self.id, 'exp': time.time() + expires_in},
            app.config['SECRET_KEY'], algorithm='HS256')

    def json_dump(user):
        schema = UserSchema()
        return schema.dump(user)

    def upload_profile_image(user_id, path):
        user = User.query.filter_by(id=user_id).first()
        user.profile_pic = path

    @staticmethod
    def verify_auth_token(token):
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'],
                              algorithms=['HS256'])
        except:
            return
        if 'exp' in data:
            if (time.time() <= data['exp']):
                return User.query.get(data['id'])
        return

ingredientCategories = db.Table('ingredient_categories',
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredient.id')),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'))
)

recipeMealTypes = db.Table('recipe_mealtypes',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id')),
    db.Column('mealtype_id', db.Integer, db.ForeignKey('mealtype.id'))
)

class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    recipes = db.relationship('RecipeIngredients', backref=db.backref('ingredients'))

    def get(name):
        ingredient = Ingredient.query.filter_by(name=name).first()
        return ingredient

    # unused method? cleanup?
    def get_all(names):
        ingredients = []
        for name in names:
            ingredient = Ingredient.get(name)
            if ingredient != None:
                ingredients.append(ingredient)
        return ingredients

    def add_ingredient(name, category):
        db_category = Category.query.filter(func.lower(Category.name) == func.lower(category)).first()
        if not db_category:
            return 'Category does not exist: ' + category

        ingredient = Ingredient(name=name)
        ingredient.categories.append(db_category)
        db.session.add(ingredient)
        db.session.commit()
        return ingredient

    def json_dump(ingr):
        schema = IngredientSchema(many=True)
        return schema.dump(ingr)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    ingredients = db.relationship('Ingredient', secondary=ingredientCategories, backref=db.backref('categories', lazy='dynamic'))

    def json_dump(recipe):
        schema = CategorySchema(many=True)
        return schema.dump(recipe)

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.String(256))
    comment = db.Column(db.String(2000))
    user = db.relationship('User', secondary=userRatings, backref=db.backref('rating', lazy='dynamic'))
    recipe = db.relationship('Recipe', secondary=recipeRatings, backref=db.backref('rating', lazy='dynamic'))

    def json_dump(rating):
        schema = RatingSchema(many=True)
        return schema.dump(rating)

class IngredientPairs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pairs = db.Column(db.String(2000), index=True)
    count = db.Column(db.Integer, default=1)

    def increment_count(pair):
        ingr_pair = IngredientPairs.query.filter_by(pairs=str(pair).strip('[]')).first()
        if ingr_pair:
            ingr_pair.count = ingr_pair.count + 1
        else:
            ingr_pair = IngredientPairs(pairs=str(pair).strip('[]'), count=1)
            db.session.add(ingr_pair)
        db.session.commit()

    def get_highest_pairs():
        pairs = IngredientPairs.query.order_by(desc(IngredientPairs.count)).limit(5).all()
        list = []
        for pair in pairs:
            pair_to_find = pair.pairs.split(", ")
            new_pair = []
            for in_pair in pair_to_find:
                new_pair.append(Ingredient.query.filter_by(id=in_pair).first())
            list.append(new_pair)
        return list

    def json_dump(pairs):
        schema = IngredientPairsSchema(many=True)
        return schema.dump(pairs)

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    image = db.Column(db.String(100))
    instruction = db.Column(db.String(2000))
    ingredients = db.relationship('RecipeIngredients', backref=db.backref('recipes'))

    def get_recipe_by_id(id):
        recipe = Recipe.query.get(id)
        schema = RecipeSchema(many=False)
        return schema.dump(recipe)

    def get_recipes(ingredients):
        ingredients = [x.lower() for x in ingredients]
        ingredients_id = (Ingredient
                          .query
                          .with_entities(Ingredient.id)
                          .filter(func.lower(Ingredient.name).in_(ingredients))
                          .order_by("id")
                          .all()
        )
        ingredients_id = [x[0] for x in ingredients_id]

        filtered = []
        recipes = Recipe.query.all()
        for recipe in recipes:
            res = True
            for recipe_ingredient in recipe.ingredients:
                if recipe_ingredient.ingredient_id not in ingredients_id:
                    res = False
                    break
            if res:
                filtered.append(recipe)

        if len(filtered) == 0:
            IngredientPairs.increment_count(ingredients_id)
        return filtered

    def get_recipes_by_user_id(user_id):
        recipes = Recipe.query.filter_by(user_id=user_id).limit(10).all()
        schema = RecipeSchema(many=True)
        return schema.dump(recipes)


    # Make new recipe
    def add_recipe(name, instruction, mealType, ingredients, user, image=None):
        recipe = ''
        if image:
            recipe = Recipe(name=name, instruction=instruction, image=image)
        else:
            recipe = Recipe(name=name, instruction=instruction)
        db.session.add(recipe)

        mealtype = Mealtype.query.filter(func.lower(Mealtype.name) == func.lower(mealType)).first()
        if not mealtype:
            db.session.rollback()
            return 'Mealtype does not exist: ' + mealType

        recipe.mealtypes.append(mealtype)
        user = User.query.filter_by(email=user).first()

        for ingredient in ingredients:
            db_ingredient = Ingredient.query.filter(func.lower(Ingredient.name) == func.lower(ingredient['name'])).first()
            if not db_ingredient:
                db.session.rollback()
                return 'Ingredient does not exist: ' + ingredient['name']

            recipe_ingredient = RecipeIngredients(quantity=ingredient['quantity'])
            recipe_ingredient.ingredients = db_ingredient
            recipe.ingredients.append(recipe_ingredient)

        user.recipes.append(recipe)
        db.session.commit()
        return recipe

    def edit_recipe(recipe_id, name, instruction, mealType, ingredients):
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return 'Recipe id does not exist:' + recipe(recipe_id)

        recipe.name = name
        recipe.instruction = instruction

        db_mealtype = Mealtype.query.filter(func.lower(Mealtype.name) == func.lower(mealType)).first()
        if db_mealtype:
            recipe.mealtypes = [db_mealtype]

        # Check if any of the ingredients have been updated to avoid an additional delete and write
        recipe_ingredients = (RecipeIngredients
                              .query
                              .with_entities(Ingredient.name, RecipeIngredients.quantity)
                              .filter(RecipeIngredients.ingredient_id == Ingredient.id)
                              .filter(RecipeIngredients.recipe_id == recipe.id)
                              .all()
        )
        recipe_ingredients.sort()

        ingredients = [(x['name'], x['quantity']) for x in ingredients]
        ingredients.sort()
        if recipe_ingredients != ingredients:
            RecipeIngredients.query.filter_by(recipe_id=recipe.id).delete()
            for name, quantity in ingredients:
                ingredient = Ingredient.query.filter(func.lower(Ingredient.name) == func.lower(name)).first()
                # doesn't support ingredient creation
                if ingredient:
                    recipe_ingredient = RecipeIngredients(quantity=quantity)
                    recipe_ingredient.ingredients = ingredient
                    recipe.ingredients.append(recipe_ingredient)

        db.session.commit()
        return recipe

    def recipe_delete(recipe_id):
        Recipe.query.filter_by(id=recipe_id).delete()
        db.session.commit()
        return True #TODO change this to actually return false if the id isnt found.

    def upload_recipe_image(id, image):
        recipe = Recipe.query.filter_by(id=id).first()
        recipe.image = image
        db.session.commit()

    def json_dump(recipe):
        schema = RecipeSchema(many=True)
        return schema.dump(recipe)



class RecipeIngredients(db.Model):
    __tablename__ = 'recipe_ingredients'
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'))
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'))
    quantity = db.Column(db.Text)

    recipe = db.relationship('Recipe', backref=db.backref('ingredient'))
    ingredient = db.relationship('Ingredient', backref=db.backref('recipe'))

    def get_recommendations(search_ids):
        recipe_ids = (RecipeIngredients
                      .query
                      .with_entities(RecipeIngredients.recipe_id)
                      .filter(RecipeIngredients.ingredient_id.in_((search_ids)))
                      .subquery()
        )
        ingredients = (RecipeIngredients
                       .query
                       .with_entities(Ingredient.id, Ingredient.name)
                       .filter(RecipeIngredients.recipe_id.in_(recipe_ids))
                       .filter(RecipeIngredients.ingredient_id.notin_((search_ids)))
                       .filter(RecipeIngredients.ingredient_id == Ingredient.id)
                       .group_by(RecipeIngredients.ingredient_id)
                       .order_by(func.count().desc())
                       .limit(5)
                       .all()
        )
        return ingredients

class Mealtype(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    recipes = db.relationship('Recipe', secondary=recipeMealTypes, backref=db.backref('mealtypes', lazy='dynamic'))

    def json_dump(mealtypes):
        schema = MealtypeSchema(many=True)
        return schema.dump(mealtypes)

# Marshmallow serialiase the schema
class IngredientSchema(ma.ModelSchema):
    class Meta:
        fields = ("id", "name")

class CategorySchema(ma.ModelSchema):
    ingredients = ma.Nested(IngredientSchema, many=True)

    class Meta:
        model = Category

class MealtypeSchema(ma.ModelSchema):
    class Meta:
        fields = ("id", "name")

class RecipeIngredientsSchema(ma.ModelSchema):
    ingredient = ma.Nested(IngredientSchema)

    class Meta:
        fields = ("ingredient.id", "ingredient.name", "quantity")

class IngredientPairsSchema(ma.ModelSchema):
    class Meta:
        model = IngredientPairs

class RatingSchema(ma.ModelSchema):
    class Meta:
        model = Rating

class RecipeSchema(ma.ModelSchema):
    mealtypes = ma.Nested(MealtypeSchema, many=True)
    ingredients = ma.Nested(RecipeIngredientsSchema, many=True)

    class Meta:
        fields = ("id", "name", "user_id", "image", "instruction", "ingredients", "mealtypes")

class UserSchema(ma.ModelSchema):
    recipes = ma.Nested(RecipeSchema, many=True)

    class Meta:
        fields = ("id", "email", "recipes")
        include_relationships = True