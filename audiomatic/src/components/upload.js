// Upload.js
import React, { useState } from 'react';

function Upload() {
  const [frames, setFrames] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');

  const handleVideoUpload = async (event) => {
    // Existing video upload logic here...
  };

  const handleImageUpload = async (event) => {
    // Existing image upload logic here...
  };

  const loadVideoPreview = () => {
    setVideoPreviewUrl('http://localhost:5000/video_preview');
  };

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
      </div>

      {uploading && <p className="uploading-text">Uploading and processing...</p>}

      {/* Video Preview Section */}
      <div className="video-preview-section">
        <button className="btn-generate" onClick={loadVideoPreview}>
          Generate 
        </button>
        {videoPreviewUrl && (
          <video controls width="600">
            <source src={videoPreviewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}

export default Upload;
