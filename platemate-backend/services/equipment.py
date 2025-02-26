import base64
from openai import OpenAI
import json
from dotenv import load_dotenv
import re

load_dotenv()
client = OpenAI()

def get_equipment_info_from_images(image_paths):
    image_descriptions = []
    for image_path in image_paths:
        with open(image_path, "rb") as image:
            base64_image = base64.b64encode(image.read()).decode("utf-8")
        image_descriptions.append(
            {
                "type": "image_url",
                "image_url": {
                        "url":  f"data:image/jpeg;base64,{base64_image}"
                },
            }
        )

    messages = [
        {
            "role": "system",
            "content": """You are a highly skilled fitness equipment expert. The user will send you multiple images of workout equipment. 
            Your task is to:
            
            1. Identify and describe each piece of equipment.
            2. Use the provided equipment collectively to create a balanced workout plan.

            ### Step 1: Equipment Identification
            For each image, provide the following details:
            - `equipment_name`: The name of the equipment.
            - `equipment_description`: A detailed description of its purpose and features.

            ### Step 2: Workout Plan Creation
            Using all the identified equipment, generate a comprehensive workout plan. For each workout, provide:
            - `workout_name`: The name of the workout.
            - `muscles_targeted`: A list of muscles targeted by the workout.
            - `equipment_required`: The list of equipment needed to perform the workout.
            - `workout_description`: A very brief description of how to perform workout.

            ### Final Output Format
            Return the result as a single JSON object with the following structure:
            {
                "equipment_details": [
                    {
                        "equipment_name": "name of the equipment",
                        "equipment_description": "detailed description of the equipment"
                    }
                ],
                "workouts": [
                    {
                        "workout_name": "Name of the workout",
                        "muscles_targeted": ["list", "of", "muscles"],
                        "equipment_required": ["list of required equipment"],
                        "workout_description": "Very brief description of the workout"
                    }
                ]
            }

            Ensure all responses strictly adhere to this format. If there are dependencies between equipment (e.g., a squat rack and barbell are needed for squats), reflect this in the workout plan."""
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Here are the images of the workout equipment:"
                },
            ],
        }
    ]

    # Add image descriptions to the user message
    messages[1]["content"].extend(image_descriptions)
    print(messages)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    response_message = response.choices[0].message
    content = response_message.content

    try:
        # Remove non-JSON text (e.g., backticks or markdown formatting)
        cleaned_content = re.sub(r'```json|```', '', content).strip()
        equipment_info = json.loads(cleaned_content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {content}")

    return equipment_info

def get_additional_equipment_recommendations(current_equipment):
    """Generate recommendations for additional equipment using OpenAI."""
    client = OpenAI()

    prompt = f"""
    You are a highly skilled fitness equipment expert. The user currently owns the following workout equipment: {', '.join(current_equipment)}.
    Recommend 2 additional pieces of equipment they should consider purchasing to enhance their workout setup. Ensure your recommendations are tailored to complement the existing equipment.
    For each recommendation, provide:
    - Equipment Name: The name of the recommended equipment.
    - Purpose: A detailed explanation of its purpose and how it can improve the user's workouts.
    - Complementary Use: Explain how this equipment complements the existing equipment.
    - Price: Provide an estimated USD price range for the equipment.

    Return the 2 recommendations as a JSON list with the following structure:
    [
        {{
            "equipment_name": "Name of the equipment",
            "purpose": "Explanation of the purpose",
            "complementary_use": "Explanation of how it complements the existing equipment"
            "price": "Price range in USD"
        }}
    ]
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a fitness equipment expert providing detailed and actionable recommendations."},
                {"role": "user", "content": prompt},
            ],
        )

        # Parse and validate JSON response
        raw_content = response.choices[0].message.content.strip()
        cleaned_content = re.sub(r'```json|```', '', raw_content).strip()  # Remove markdown formatting if present
        recommendations = json.loads(cleaned_content)

        return recommendations
    
    except json.JSONDecodeError as json_error:
        raise RuntimeError(f"Invalid JSON response: {raw_content}") from json_error
    except Exception as e:
        raise RuntimeError(f"Error generating recommendations: {str(e)}") from e
