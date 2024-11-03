import os
import random
import cv2
import shutil
from flask import Flask, request, jsonify, send_from_directory, send_file
from werkzeug.utils import secure_filename
from moviepy.editor import VideoFileClip, AudioFileClip
import mysql.connector

import ai_endpoints
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure the main upload folder exists
# if os.path.exists(app.config['UPLOAD_FOLDER']):
#     shutil.rmtree(app.config['UPLOAD_FOLDER'])
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

@app.route('/upload_images', methods=['POST'])
def upload_images():
    image_files = [file for key, file in request.files.items() if key.startswith('image_')]
    
    if not image_files:
        return jsonify({"error": "No images in the request"}), 400
    
    # Create a unique directory to store the images
    images_folder = os.path.join(app.config['UPLOAD_FOLDER'], f"images_{random.randint(0, 1e6)}")
    os.makedirs(images_folder, exist_ok=True)

    recent_path = os.path.join(app.config['UPLOAD_FOLDER'], 'recent_image')
    print(recent_path)

    image_paths = []
    for image_file in image_files:
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(images_folder, filename)
        image_file.save(image_path)
        image_paths.append(os.path.relpath(image_path, app.config['UPLOAD_FOLDER']))
        shutil.copy(image_path, "uploads/recent_image"+os.path.splitext(filename)[1])

    filename = secure_filename(image_files[0].filename)
    print(image_files[0].filename)
    # image_files[0].save(recent_path+)
    return jsonify({"images": image_paths})

# Serve images from the upload folder
@app.route('/uploads/<path:filename>')
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/video_preview', methods=['GET'])
def video_preview():
    process_video()
    # Construct the path relative to the project root
    video_path = os.path.join(os.getcwd(), 'results', 'processed_video.mp4')
    return send_file(video_path, mimetype='video/mp4')


    
@app.route('/audio_preview', methods=['GET'])
def audio_preview():
    # Construct the path relative to the project root
    print("wassup")
    # api_key = os.getenv("OPENAI_API_KEY")
    # def check_recent_image():
    #     if os.path.exists(app.config['UPLOAD_FOLDER']+'/recent_image.jpg'):
    #         return 'uploads/recent_image.jpg'
    #     elif os.path.exists(app.config['UPLOAD_FOLDER']+'recent_image.png'):
    #         return 'uploads/recent_image.png'
        
    # image_path = check_recent_image()
    # print(image_path)
    # img_description = ai_endpoints.imageToText(image_path, api_key)
    # print(img_description)
    # audio_description = ai_endpoints.reprompt(img_description, api_key)
    # print(audio_description)

    output_path = os.path.join(os.getcwd(), 'output', 'realaudio.mp3')
    # ai_endpoints.generate_music(audio_description, output_path)
    # audio_path = os.path.join(os.getcwd(), 'output', 'reflection07.mp3')
    return send_file(output_path, mimetype='audio/mp3')

def process_video():
    # Load the video 'clip'
    video_clip = VideoFileClip("output/video.mp4")
    # Load the audio clip
    audio_clip = AudioFileClip("output/audio.mp3")
    # Set the audio to the video clip
    final_clip = video_clip.set_audio(audio_clip)
    # Save the resulting video
    final_clip.write_videofile("results/processed_video.mp4", codec="libx264", audio_codec="aac")

# Database connection configuration
db_config = {
    'host': 'favorable-mark-440605-h0:us-central1:audiomatic',       # e.g., 'localhost'
    'user': 'root',   # MySQL username
    'password': 'mysqliscool69!', # MySQL password
    'database': 'hacktx'       # Your database name
}

# Route to fetch all data from the "Prompts" table
@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM Prompts"
        cursor.execute(query)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(results)
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Database connection failed"}), 500

if __name__ == '__main__':
    app.run(debug=True)
