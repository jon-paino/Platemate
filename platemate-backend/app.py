from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from services.equiptment import get_equipment_info_from_images
import tempfile
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(format='%(levelname)s:%(name)s%(message)s')

app = Flask(__name__)
cors = CORS(app, resources={r"/upload-images": {"origins": "http://localhost:3000"}})

app.config.from_object('config.Config')


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload-images', methods=['POST'])
def upload_images():

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

    
if __name__ == '__main__':
    app.run(debug=True)
