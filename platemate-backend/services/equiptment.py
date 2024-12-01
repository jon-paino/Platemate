from dotenv import load_dotenv
from openai import OpenAI
from flask import current_app as app

load_dotenv()
client = OpenAI()

def detect_labels(path):
    """Detects labels in the file."""
    from google.cloud import vision

    app.logger.info("Starting label detection for file: %s", path)
    
    try:
        client = vision.ImageAnnotatorClient()

        with open(path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)

        response = client.label_detection(image=image)
        labels = response.label_annotations
        
        label_descriptions = [label.description for label in labels]
        app.logger.info("Detected labels: %s", label_descriptions)

        if response.error.message:
            app.logger.error("Error from Vision API: %s", response.error.message)
            raise Exception(
                f"{response.error.message}\nFor more info on error messages, check: "
                "https://cloud.google.com/apis/design/errors"
            )
        return label_descriptions
    except Exception as e:
        app.logger.exception("An error occurred during label detection.")
        raise

def get_workout_recommendations(labels):
    """Generates workout recommendations based on equipment labels."""
    app.logger.info("Generating workout recommendations for labels: %s", labels)
    
    prompt = f"What workouts can be done with this equipment? The equipment is: {', '.join(labels)}"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """
                        You are a personal trainer creating a workout plan for a client.
                        You are very knowledgeable about workouts possible with specific equipment and like to make custom plans.
                    """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract the assistant's reply
        recommendations = response.choices[0].message.content.strip()
        app.logger.info("Generated workout recommendations: %s", recommendations)
        return recommendations
    except Exception as e:
        app.logger.exception("An error occurred while generating workout recommendations.")
        raise