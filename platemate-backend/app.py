from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User
from services.auth_service import register_user, authenticate_user
import os
from dotenv import load_dotenv
from services.equiptment import detect_labels, get_workout_recommendations
import logging
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')

logging.basicConfig(format="%(levelname)s:%(name)s %(message)s")

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
    app.logger.info("Received request to upload an image.")

    if 'image' not in request.files:
        app.logger.error("No image file provided in the request.")
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    image_path = os.path.join('/tmp', image_file.filename)
    app.logger.info("Saving image to temporary path: %s", image_path)

    try:
        # Save the image to a temporary location
        image_file.save(image_path)
        app.logger.info("Image saved successfully.")

        # Get labels from Google Vision API
        app.logger.info("Starting label detection.")
        labels = detect_labels(image_path)
        app.logger.info("Label detection completed. Labels: %s", labels)

        # Get workout recommendations from OpenAI
        app.logger.info("Generating workout recommendations based on detected labels.")
        recommendations = get_workout_recommendations(labels)
        app.logger.info("Workout recommendations generated successfully.")

        # Remove the temporary file
        os.remove(image_path)
        app.logger.info("Temporary image file deleted.")

        return jsonify({'recommendations': recommendations})

    except Exception as e:
        app.logger.exception("An error occurred during the upload-image process.")
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
