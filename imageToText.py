import base64
import os
from openai import OpenAI
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

load_dotenv()
 # Function to encode the image
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

# Example usage
api_key = os.getenv("OPENAI_API_KEY")
image_path = "IMG20240725210516.jpg"
# description = imageToText(image_path, api_key)

description = '''
The scene unfolds in a vibrant nightclub, pulsating with energy and life. Soft hues of deep red and electric blue wash over the crowd, creating a warm, inviting glow that dances across the faces of joyful revelers. The atmosphere is thick with anticipation, as laughter and music intertwine seamlessly, wrapping everyone in a shared sense of exhilaration.

Palm trees, artfully illuminated in luminous colors, add a tropical flair, suggesting a paradise far removed from reality. Tables glow with flickering candles, their soft light casting enchanting shadows that sway to the rhythm of the beat. In this haven of joy, strangers become friends, lost in the moment—each smile and shared glance amplifying the electric vibe around them.

Yet, beneath this vibrant exterior lies a subtle undercurrent of wistfulness. As the night deepens, there's a fleeting sense of transience, a reminder that such joyous moments are ephemeral. Despite the exuberance, a lingering melancholia weaves through the air—a bittersweet acknowledgment of time

'''
audio_prompt = reprompt(description, api_key)
print(description)

print(audio_prompt)