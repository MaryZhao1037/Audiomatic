import requests
import os
from dotenv import load_dotenv

API_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small"
load_dotenv()
api_token = os.getenv("HUGGINGFACE_HUB_TOKEN")
headers = {"Authorization": f"Bearer {api_token}"}

def generate_music(description, output_file):
    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.content

    audio_bytes = query({
        "inputs": description,
    })
    with open(output_file, "wb") as f:
        f.write(audio_bytes)
