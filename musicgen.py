import requests
import os
from dotenv import load_dotenv
import librosa
import numpy as np
import soundfile as sf
import base64
from tempfile import NamedTemporaryFile

API_URL = "https://api-inference.huggingface.co/models/facebook/musicgen-small"
load_dotenv()
api_token = os.getenv("HUGGINGFACE_HUB_TOKEN")
headers = {"Authorization": f"Bearer {api_token}"}

def generate_music_from_audio(input_audio_path, output_file):
    # Load the audio file
    audio, sr = librosa.load(input_audio_path, sr=32000)  # MusicGen expects 32kHz

    # Get total duration in seconds
    duration = len(audio) / sr

    # If audio is longer than 15 seconds, select random 15-second interval
    if duration > 15:
        max_start = int((duration - 15) * sr)
        start_idx = np.random.randint(0, max_start)
        end_idx = start_idx + (15 * sr)
        audio_segment = audio[start_idx:end_idx]
    else:
        audio_segment = audio

    # Save the segment to a temporary file
    with NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
        sf.write(temp_file.name, audio_segment, sr, format='wav')

        # Read and encode the temporary file
        with open(temp_file.name, 'rb') as audio_file:
            audio_bytes = audio_file.read()
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.content
    
    print(temp_file.name)

    textprompt = '''A hauntingly beautiful orchestral piece 
    with gentle strings and distant, ethereal choirs, 
    evoking a sense of vastness and wonder. Soft woodwinds and shimmering 
    bells add a mystical quality, while subtle, deep percussion creates an 
    undercurrent of power and solitude. The music crescendos gradually, 
    reflecting the awe and humility of standing alone beneath a cosmic sky. '''

    # Create payload with audio
    payload = {
        # "inputs": audio_base64,
        # "parameters": {
        #     "continuation": True,
        #     "duration": 15,  # Generate 15 seconds of audio
        #     "guidance_scale": 3.0
        # }
        "inputs":textprompt
    }

    # Generate and save the output
    generated_audio = query(payload)
    with open(output_file, "wb") as f:
        f.write(generated_audio)

    # Clean up temporary file
    os.unlink(temp_file.name)

# Example usage
input_path = "reflection07.mp3"
output_path = "continuation.wav"
generate_music_from_audio(input_path, output_path)