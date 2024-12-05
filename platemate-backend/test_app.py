import pytest
from app import app  # Import your Flask app
from unittest.mock import patch
import json
import io
from werkzeug.datastructures import FileStorage

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_get_equipment_recommendations(client):
    # Mock input data
    test_data = {
        "equipment": ["dumbell", "barbell", "squat rack"]
    }

    # Expected output from the mocked function
    mocked_recommendations = [
        {
            "equipment_name": "Plates",
            "purpose": "Used to add weight to barbells for strength training.",
            "complementary_use": "They complement barbells and allow for adjustable weight increments.",
            "price": "$10 - $100 per plate depending on weight"
        },
        {
            "equipment_name": "Safety Clips",
            "purpose": "Secure plates on barbells to prevent them from sliding off.",
            "complementary_use": "They enhance safety when using barbells with plates.",
            "price": "$5 - $20 per pair"
        },
        {
            "equipment_name": "Bench",
            "purpose": "Used for various exercises like bench presses, step-ups, and more.",
            "complementary_use": "Complements dumbbells and barbells for a wider range of exercises.",
            "price": "$50 - $200"
        }
    ]

    # Use patch to mock the external function
    with patch('app.get_additional_equipment_recommendations') as mock_get_recommendations:

        # Set the return value of the mocked function
        mock_get_recommendations.return_value = mocked_recommendations

        # Send a POST request to the endpoint
        response = client.post(
            '/get-equipment-recommendations',
            data=json.dumps(test_data),
            content_type='application/json'
        )

        # Assert the response status code
        assert response.status_code == 200

        # Parse the JSON response
        response_data = response.get_json()

        # Assert the response data
        assert "recommendations" in response_data
        assert response_data["recommendations"] == mocked_recommendations

        # Ensure the mocked function was called with the correct arguments
        mock_get_recommendations.assert_called_once_with(test_data["equipment"])

def test_upload_images(client):
    # Create a mock image file in memory
    data = {
        'file': (io.BytesIO(b"fake image data"), 'test_image.jpg')
    }

    # Expected response from the mocked processing function
    mocked_response = {
        "equipment": ["dumbbell", "barbell", "kettlebell"]
    }

    # Mock the get_equipment_info_from_images function
    with patch('app.get_equipment_info_from_images') as mock_process_images:
        mock_process_images.return_value = mocked_response

        # Send POST request to the endpoint
        response = client.post('/upload-images', content_type='multipart/form-data', data=data)

        # Assert the response status code
        assert response.status_code == 200

        # Parse the JSON response
        response_data = response.get_json()

        # Assert the response data
        assert response_data == mocked_response

        # Ensure the mocked function was called with a list of image paths
        assert mock_process_images.called
        args, kwargs = mock_process_images.call_args
        image_paths = args[0]
        assert isinstance(image_paths, list)
        assert len(image_paths) == 1  # Only one image uploaded

def test_upload_images_invalid_file(client):
    # Create a mock invalid file
    data = {
        'file': (io.BytesIO(b"fake data"), 'test_file.txt')
    }

    # Send POST request to the endpoint
    response = client.post('/upload-images', content_type='multipart/form-data', data=data)

    # Assert the response status code
    assert response.status_code == 400

    # Parse the JSON response
    response_data = response.get_json()

    # Assert the response data
    assert "error" in response_data
    assert response_data["error"] == "File test_file.txt is not a valid image."
