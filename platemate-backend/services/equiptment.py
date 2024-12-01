import base64
from openai import OpenAI
import json
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def get_equipment_info_from_image(image_path):
    with open(image_path, "rb") as image:
        base64_image = base64.b64encode(image.read()).decode("utf-8")

    messages = [
        {
            "role": "system",
            "content": """You are a fitness equipment expert. A user sends you an image of workout equipment, and you provide detailed information about it. Use the following JSON format:

{
    "equipment_name": "name of the equipment",
    "description": "detailed description of the equipment",
    "muscles_targeted": ["list", "of", "muscles"],
    "exercises": ["list of exercises that can be performed"]
}"""
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please provide information about this workout equipment."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url":  f"data:image/jpeg;base64,{base64_image}"
                    },
                }
            ]
        },
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    response_message = response.choices[0].message
    content = response_message.content

    try:
        equipment_info = json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {content}")

    return equipment_info