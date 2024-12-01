from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Image
from services.auth_service import register_user, authenticate_user
from werkzeug.utils import secure_filename  # For secure file names
import os
import logging
from services.equiptment import get_equipment_info_from_image
import tempfile
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(format='%(levelname)s:%(name)s%(message)s')

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    response = register_user(username, email, password)
    #register functionality handled by services/auth
    return jsonify(response), response.get('status', 200)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    response = authenticate_user(email, password)
    return jsonify(response), response.get('status', 200)

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        "username": user.username,
        "email": user.email
    }), 200

@app.route('/upload-image', methods=['POST'])
def upload_image():
    app.logger.info(f"Request Headers: {request.headers}")
    app.logger.info(f"Request Files: {request.files}")
    app.logger.info(f"Request Form: {request.form}")
    if 'image' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    image = request.files['image']

    if image.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    temp_file = tempfile.NamedTemporaryFile(delete=False)
    image.save(temp_file.name)

    try:
        equipment_info = get_equipment_info_from_image(temp_file.name)
    except Exception as e:
        temp_file.close()
        os.unlink(temp_file.name)
        app.logger.error(f"Error processing image: {str(e)}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

    temp_file.close()
    os.unlink(temp_file.name)

    return jsonify(equipment_info), 200
    
if __name__ == '__main__':
    app.run(debug=True)
