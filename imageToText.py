import base64
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def imageToText(image_path, api):
    # Function to encode the image
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    # Getting the base64 string
    base64_image = encode_image(image_path)

    #print(api)
    # Initialize OpenAI client
    client = OpenAI(api_key=api)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image with vivid and emotionally resonant language. Focus on the mood, atmosphere, and feelings it evokes, capturing the beauty, intensity, warmth, or subtle melancholy in the scene. Keep the description clear and immersive, avoiding overly complex language."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "low"
                        }
                    }
                ]
            }
        ],
        max_tokens=200
    )

    return response.choices[0].message.content

def imageToText(image_path, api):
    # Function to encode the image
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    # Getting the base64 string
    base64_image = encode_image(image_path)

    #print(api)
    # Initialize OpenAI client
    client = OpenAI(api_key=api)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image with vivid and emotionally resonant language. Focus on the mood, atmosphere, and feelings it evokes, capturing the beauty, intensity, warmth, or subtle melancholy in the scene. Keep the description clear and immersive, avoiding overly complex language."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "low"
                        }
                    }
                ]
            }
        ],
        max_tokens=200
    )

    return response.choices[0].message.content

def reprompt(api):
        #print(api)
    # Initialize OpenAI client
    client = OpenAI(api_key=api)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe this image with vivid and emotionally resonant language. Focus on the mood, atmosphere, and feelings it evokes, capturing the beauty, intensity, warmth, or subtle melancholy in the scene. Keep the description clear and immersive, avoiding overly complex language."
                    },
                    {
                        "type": "text",
                        "text": ""
                    }
                ]
            }
        ],
        max_tokens=200
    )

    return response.choices[0].message.content

# Example usage
api_key = os.getenv("OPENAI_API_KEY")
image_path = "IMG20240725210516.jpg"
description = imageToText(image_path, api_key)
print(description)