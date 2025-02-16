from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from auth import auth_bp
from books import books_bp
from cart import cart_bp

app = Flask(__name__, static_folder="static")
CORS(app)
# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://giang:Bookstore12345!@localhost/books_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = "supersecretkey"
jwt = JWTManager(app)

db.init_app(app)
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(books_bp)
app.register_blueprint(cart_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
