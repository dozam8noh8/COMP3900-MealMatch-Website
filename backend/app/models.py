from app import db, jwt, time, app, generate_password_hash, check_password_hash, ma

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(70), index=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))
    recipes = db.relationship('Recipe', backref='user', lazy='dynamic')

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expires_in=600):
        return jwt.encode(
            {'id': self.id, 'exp': time.time() + expires_in},
            app.config['SECRET_KEY'], algorithm='HS256')

    @staticmethod
    def verify_auth_token(token):
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'],
                              algorithms=['HS256'])
        except:
            return
        return User.query.get(data['id'])

recipeIngredients = db.Table('recipe_ingredients',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id')),
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredient.id')),
    db.Column('amount', db.Integer),
    db.Column('unit', db.String)
)

ingredientCategories = db.Table('ingredient_categories',
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredient.id')),
    db.Column('category.id', db.Integer, db.ForeignKey('category.id'))
)

recipeMealTypes = db.Table('recipe_mealtypes',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id')),
    db.Column('mealtype_id', db.Integer, db.ForeignKey('mealtype.id'))
)

class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    recipes = db.relationship('Recipe', secondary=recipeIngredients, backref=db.backref('ingredients', lazy='dynamic'))

    def get(name):
        if name == 'Noodle':
            print("PROBLEM")
        ingredient = Ingredient.query.filter_by(name=name).first()
        return ingredient

    def get_all(names):
        ingredients = []
        for name in names:
            ingredient = Ingredient.get(name)
            if ingredient != None:
                print('INSIDE ')
                print(ingredient)
                ingredients.append(ingredient)
        print(ingredients)
        return ingredients

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    ingredients = db.relationship('Ingredient', secondary=ingredientCategories, backref=db.backref('categories', lazy='dynamic'))

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    image = db.Column(db.String(100))
    instruction = db.Column(db.String(2000))

    def get_recipes(ingredients):
        recipes = Recipe.query.join(Recipe.ingredients).filter(Ingredient.name.in_(ingredients)).all()
        # Need to filter the recipes based on their availability not by numbers
        filtered = []
        for recipe in recipes:
            print(recipe.ingredients.all())
            res = True
            ingredients = Ingredient.get_all(ingredients)
            for ingr in recipe.ingredients.all():
                if ingr not in ingredients:
                    res = False

            if res:
                filtered.append(recipe)
            
        return filtered

    def json_dump(recipe):
        schema = RecipeSchema(many=True)
        return schema.dump(recipe)
        

class Mealtype(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    recipes = db.relationship('Recipe', secondary=recipeMealTypes, backref=db.backref('mealtypes', lazy='dynamic'))

# Marshmallow serialiase the schema
class CategorySchema(ma.ModelSchema):
    class Meta:
        model = Category

class IngredientSchema(ma.ModelSchema):
    class Meta:
        model = Ingredient

class UserSchema(ma.ModelSchema):
    class Meta:
        model = User

class MealtypeSchema(ma.ModelSchema):
    class Meta:
        model = Mealtype

class RecipeSchema(ma.ModelSchema):
    class Meta:
        model = Recipe 