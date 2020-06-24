from app import db, jwt, time, app, generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))
    recipes = db.relationship('recipes', backref='user', lazy='dynamic')

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

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)

recipeMealTypes = db.Table('recipe_mealtypes',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id')),
    db.Column('mealtype_id', db.Integer, db.ForeignKey('meal_types.id'))
)

ingredientCategories = db.Table('ingredient_categories',
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredients.id')),
    db.Column('category.id', db.Integer, db.ForeignKey('categories.id'))
)

class Recipe(db.Model):
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    image = db.Column(db.String(100))
    instruction = db.Column(db.String(2000))
    mealtypes = db.relationship('Mealtype', secondary=recipeMealTypes, lazy='subquery',
        backref=db.backref('recipes', lazy=True))

recipeIngredients = db.Table('recipe_ingredients',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id')),
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredients.id')),
    db.Column('amount', db.Integer),
    db.Column('unit', db.String)
)

class Mealtype(db.Model):
    __tablename__ = 'meal_types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)