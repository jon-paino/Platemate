from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from services.equipment import get_equipment_info_from_images, get_additional_equipment_recommendations
import tempfile
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(format='%(levelname)s:%(name)s%(message)s')

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config.from_object('config.Config')
app.config['TESTING'] = True
app.config['DEBUG'] = False

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """
    Check if the uploaded file has a valid extension.

    Args:
        filename (str): Name of the file to check.

    Returns:
        bool: True if the file extension is allowed, False otherwise.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload-images', methods=['POST'])
def upload_images():
    """
    Endpoint to handle image uploads.

    Receives image files via a POST request, processes them to extract equipment information, and returns the results.
    Temporary files are cleaned up after processing.

    Returns:
        JSON: A JSON response containing equipment information or an error message.
    """
    app.logger.info(f"Request Headers: {request.headers}")
    app.logger.info(f"Request Files: {request.files}")
    app.logger.info(f"Request Form: {request.form}")

    if not request.files:
        return jsonify({"error": "No files uploaded"}), 400

    # Save all uploaded images temporarily
    image_paths = []
    for key, file in request.files.items():
        if file and allowed_file(file.filename):
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            file.save(temp_file.name)
            image_paths.append(temp_file.name)
        else:
            return jsonify({"error": f"File {file.filename} is not a valid image."}), 400

    try:
        # Process images and generate the response
        response = get_equipment_info_from_images(image_paths)
    except Exception as e:
        logging.error(f"Error processing images: {str(e)}")
        return jsonify({"error": f"Error processing images: {str(e)}"}), 500
    finally:
        # Clean up temporary files
        for path in image_paths:
            if os.path.exists(path):
                os.unlink(path)

    return jsonify(response), 200


@app.route('/get-equipment-recommendations', methods=['POST'])
def get_equipment_recommendations():
    """
    Endpoint to generate additional equipment recommendations.

    Receives a list of current equipment via a POST request, generates recommendations using an external API, and returns the results.

    Returns:
        JSON: A JSON response containing additional equipment recommendations or an error message.
    """
    app.logger.info(f"Received request at /get-equipment-recommendations")
    data = request.get_json()
    app.logger.info(f"Request JSON: {data}")

    current_equipment = data.get("equipment", [])
    if not current_equipment:
        app.logger.error("No equipment provided in the request.")
        return jsonify({"error": "No equipment provided"}), 400

    try:
        app.logger.info(f"Processing equipment: {current_equipment}")
        app.logger.info(f"Calling OpenAI API for recommendations...")
        recommendations = get_additional_equipment_recommendations(current_equipment)
        app.logger.info(f"Generated recommendations: {recommendations}")
        return jsonify({"recommendations": recommendations}), 200
    except Exception as e:
        app.logger.error(f"Error occurred while generating recommendations: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    """
    Entry point for running the Flask application.

    The application runs in debug mode for development purposes.
    """
    app.run(debug=True)