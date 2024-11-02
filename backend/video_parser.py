import os
import random
import cv2
import shutil
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure the main upload folder exists
if os.path.exists(app.config['UPLOAD_FOLDER']):
    shutil.rmtree(app.config['UPLOAD_FOLDER'])
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Create a secure filename and a subdirectory for the video
    filename = secure_filename(file.filename)
    video_name = os.path.splitext(filename)[0]
    video_folder = os.path.join(app.config['UPLOAD_FOLDER'], video_name)
    os.makedirs(video_folder, exist_ok=True)

    # Save the video file in the video folder
    filepath = os.path.join(video_folder, filename)
    file.save(filepath)

    # Create a "pictures" subdirectory within the video folder for frames
    pictures_folder = os.path.join(video_folder, 'pictures')
    os.makedirs(pictures_folder, exist_ok=True)

    # Process the video and get random frames
    frames = extract_random_frames(filepath, pictures_folder, num_frames=5)
    return jsonify({"frames": frames})

@app.route('/uploads/<video_name>/pictures/<filename>')
def uploaded_file(video_name, filename):
    # Serve extracted frames from the "pictures" subdirectory
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], video_name, 'pictures'), filename)

def resize_frame(frame):
    height, width = frame.shape[:2]
    max_area = 25000  # Maximum area allowed
    current_area = height * width
    
    # Check if the current area is greater than max area
    if current_area > max_area:
        # Calculate the scaling factor
        scaling_factor = (max_area / current_area) ** 0.5
        new_width = int(width * scaling_factor)
        new_height = int(height * scaling_factor)
        frame = cv2.resize(frame, (new_width, new_height))
    return frame

def extract_random_frames(filepath, pictures_folder, num_frames=5):
    # Extract video name from the filepath
    video_name = os.path.splitext(os.path.basename(filepath))[0]
    
    # Open the video file
    video = cv2.VideoCapture(filepath)
    frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    frames = []

    # Select random frame indices
    selected_frames = sorted(random.sample(range(frame_count), num_frames))

    for frame_no in selected_frames:
        video.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
        success, frame = video.read()
        if success:
            # Resize the frame
            resized_frame = resize_frame(frame)
            
            frame_filename = f"{os.path.splitext(os.path.basename(filepath))[0]}_frame_{frame_no}.jpg"
            frame_path = os.path.join(pictures_folder, frame_filename)
            cv2.imwrite(frame_path, resized_frame)
            frames.append(f"{video_name}/pictures/{frame_filename}")  # Send relative path to frontend

    video.release()
    return frames

if __name__ == '__main__':
    app.run(debug=True)
