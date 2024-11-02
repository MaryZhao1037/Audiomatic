import React, { useState } from 'react';
import './App.css';

function App() {
  const [frames, setFrames] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Media Uploader</h1>
        <div>
          <h2>Upload Video</h2>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
        </div>
        <div>
          <h2>Upload Images</h2>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </div>
        {uploading && <p>Uploading and processing...</p>}
        <div className="frames-container">
          <h3>Frames</h3>
          {frames.map((frame, index) => (
            <img key={index} src={`http://localhost:5000/${frame}`} alt={`Frame ${index}`} className="frame-image" />
          ))}
        </div>
        <div className="images-container">
          <h3>Uploaded Images</h3>
          {images.map((image, index) => (
            <img key={index} src={`http://localhost:5000/${image}`} alt={`Image ${index}`} className="uploaded-image" />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
