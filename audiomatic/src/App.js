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
      <aside className="App-sidebar">
        <h1 className="App-title">Audiomatic</h1>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Upload</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
      <main className="App-main">
        <header className="App-header">
          <h2>Media Uploader</h2>
          <p>Upload your media files to get started.</p>
        </header>
        <div className="upload-section">
          <h3>Upload Video</h3>
          <input className="file-input" type="file" accept="video/*" onChange={handleVideoUpload} />
        </div>
        <div className="upload-section">
          <h3>Upload Images</h3>
          <input className="file-input" type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </div>
        {uploading && <p className="uploading-text">Uploading and processing...</p>}
      </main>
    </div>
  );
}

export default App;
