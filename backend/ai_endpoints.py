import requests
import os
import base64

from openai import OpenAI
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

API_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small"
load_dotenv()
api_token = os.getenv("HUGGINGFACE_HUB_TOKEN")
headers = {"Authorization": f"Bearer {api_token}"}

def encode_image(image_path):
    with Image.open(image_path) as image:
        # Calculate the aspect ratio
        aspect_ratio = image.width / image.height
        
        # Calculate new dimensions if total pixels exceed 25000
        if image.width * image.height > 25000:
            if image.width > image.height:
                new_width = int((25000 * aspect_ratio)**0.5)
                new_height = int(new_width / aspect_ratio)
            else:
                new_height = int((25000 / aspect_ratio)**0.5)
                new_width = int(new_height * aspect_ratio)
            
            # Resize the image
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Convert to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode('utf-8')
        
def imageToText(image_path, api):

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

def reprompt(description, api):
        #print(api)
    # Initialize OpenAI client
    client = OpenAI(api_key=api)
    prompt = '''
    Create a concise audio prompt (2-3 sentences) that captures the essence of a provided vivid description of a scene. Include the musical genre, key elements, mood/atmosphere, and relevant instruments. The prompt should be similar in style to these examples, but can be more (slightly more) detailed about mood or whatever is appropiate (once again, do not be too detailed): 
    A grand orchestral arrangement with thunderous percussion, epic brass fanfares, and soaring strings, creating a cinematic atmosphere fit for a heroic battle.
    Classic reggae track with an electronic guitar solo
    A dynamic blend of hip-hop and orchestral elements, with sweeping strings and brass, evoking the vibrant energy of the city.
    80s electronic track with melodic synthesizers, catchy beat and groovy bass
    Smooth jazz, with a saxophone solo, piano chords, and snare full drums
    '''

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "text",
                        "text": description
                    }
                ]
            }
        ],
        max_tokens=200
    )

    return response.choices[0].message.content

def generate_music(description, output_file):
    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.content

    audio_bytes = query({
        "inputs": description,
    })
    with open(output_file, "wb") as f:
        f.write(audio_bytes)