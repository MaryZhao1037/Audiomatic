import os
import random
import cv2
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure the main upload folder exists
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
            frame_filename = f"{os.path.splitext(os.path.basename(filepath))[0]}_frame_{frame_no}.jpg"
            frame_path = os.path.join(pictures_folder, frame_filename)
            cv2.imwrite(frame_path, frame)
            frames.append(f"{video_name}/pictures/{frame_filename}")  # Send relative path to frontend

    video.release()
    return frames

if __name__ == '__main__':
    app.run(debug=True)
