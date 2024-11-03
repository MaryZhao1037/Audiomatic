// Upload.js
import React, { useState } from 'react';

function Upload() {
  const [frames, setFrames] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [fileNames, setFileNames] = useState([]);

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFrames(data.frames);
      } else {
        console.error('Failed to upload video');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setFileNames(files.map(file => file.name));
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });

    setUploading(true);
    try {
      const response = await fetch('http://localhost:5000/upload_images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      } else {
        console.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const loadVideoPreview = () => {
    setVideoPreviewUrl('http://localhost:5000/video_preview');
    
  };

  const loadAudioPreview = () => {
    setAudioPreviewUrl('http://localhost:5000/audio_preview');
  }

  return (
    <div className="upload">
      <header>
        <h2>Upload Media</h2>
        <p>Upload your media files to get started.</p>
      </header>
      {/* Upload Video Section */}
      <div className="upload-section">
        <h3>Upload Video</h3>
        <button onClick={() => document.getElementById('videoUpload').click()}>
          Choose File
        </button>
        <input
          id="videoUpload"
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Upload Images Section */}
      <div className="upload-section">
        <h3>Upload Images</h3>
        <button onClick={() => document.getElementById('imageUpload').click()}>
          Choose Files
        </button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {fileNames.length > 0 && (
          <div className="uploaded-files my-8">
            <h3>Uploaded Files:</h3>
            {fileNames.map((name, index) => (
              <div key={index} className="file-name">
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      {uploading && <p className="uploading-text">Uploading and processing...</p>}

      {/* Video Preview Section */}
      <div className="video-preview-section">
        <button className="btn-generate" onClick={loadVideoPreview}>
          Generate Video
        </button>
        {videoPreviewUrl && (
          <video controls width="600">
            <source src={videoPreviewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Audio Preview Section */}
    <div className="mt-5 mb-5">
      <button 
        className="btn-generate" 
        onClick={loadAudioPreview}
      >
        Generate Audio
      </button>
      {audioPreviewUrl && (
        <audio 
          controls 
          className="mt-3 w-full max-w-[600px]"
        >
          <source src={audioPreviewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
    </div>
  );
}

export default Upload;
