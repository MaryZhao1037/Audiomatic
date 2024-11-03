import torch
import torchaudio
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import librosa
import numpy as np
import logging
import os
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MusicGenerator:
    def __init__(self, model_name='melody'):
        """Initialize the MusicGen model."""
        logger.info(f"Loading MusicGen model: {model_name}")
        self.model = MusicGen.get_pretrained(model_name)
        self.sample_rate = self.model.sample_rate
        logger.info(f"Model loaded successfully. Sample rate: {self.sample_rate}")

    def process_audio_file(self, input_path, max_duration=15):
        """Load and process input audio file."""
        logger.info(f"Loading audio file: {input_path}")
        
        # Load audio file and resample to model's sample rate
        audio, orig_sr = torchaudio.load(input_path)
        if orig_sr != self.sample_rate:
            resampler = torchaudio.transforms.Resample(orig_sr, self.sample_rate)
            audio = resampler(audio)
            logger.info(f"Resampled audio from {orig_sr}Hz to {self.sample_rate}Hz")

        # Convert to mono if stereo
        if audio.shape[0] > 1:
            audio = torch.mean(audio, dim=0, keepdim=True)
            logger.info("Converted stereo to mono")

        # Trim to max_duration if needed
        if audio.shape[1] > max_duration * self.sample_rate:
            audio = audio[:, :int(max_duration * self.sample_rate)]
            logger.info(f"Trimmed audio to {max_duration} seconds")

        return audio

    def generate_continuation(self, input_path, output_dir="outputs", 
                            num_variations=1, duration=8, 
                            descriptions=None):
        """Generate music continuations based on input audio."""
        try:
            # Create output directory if it doesn't exist
            os.makedirs(output_dir, exist_ok=True)

            # Process input audio
            melody = self.process_audio_file(input_path)

            # Set generation parameters
            self.model.set_generation_params(duration=duration)

            # Default description if none provided
            if descriptions is None:
                descriptions = ["Continue the melody"] * num_variations
            elif isinstance(descriptions, str):
                descriptions = [descriptions] * num_variations
            
            # Ensure we have enough descriptions
            descriptions = descriptions[:num_variations]
            
            logger.info(f"Generating {num_variations} continuation(s)...")
            
            # Generate the continuations
            with torch.no_grad():
                wav = self.model.generate_with_chroma(
                    descriptions,
                    melody[None].expand(num_variations, -1, -1),
                    self.sample_rate
                )

            # Save the generated audio
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            generated_files = []
            
            for idx, one_wav in enumerate(wav):
                filename = f"continuation_{timestamp}_{idx}"
                output_path = os.path.join(output_dir, filename)
                
                # Save with loudness normalization
                audio_write(
                    output_path, 
                    one_wav.cpu(), 
                    self.sample_rate, 
                    strategy="loudness"
                )
                generated_files.append(f"{output_path}.wav")
                logger.info(f"Saved continuation {idx+1} to {output_path}.wav")

            return generated_files

        except Exception as e:
            logger.error(f"Error generating continuation: {str(e)}")
            raise

def main():
    # Example usage
    input_path = "reflection07.mp3"  # Replace with your input file
    
    try:
        # Initialize generator
        generator = MusicGenerator()
        
        # Generate multiple variations with different descriptions
        descriptions = [
            "Continue the melody with similar style",
            "Add an energetic twist to the melody",
            "Create a calmer version of the melody"
        ]
        
        output_files = generator.generate_continuation(
            input_path=input_path,
            num_variations=3,
            duration=8,
            descriptions=descriptions
        )
        
        logger.info("Generation completed successfully!")
        logger.info("Generated files:")
        for file in output_files:
            logger.info(f"- {file}")
            
    except Exception as e:
        logger.error(f"Generation failed: {str(e)}")

if __name__ == "__main__":
    main()