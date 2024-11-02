import React, { useState } from 'react';
import './App.css';

function App() {
  const [frames, setFrames] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
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
        setFrames(data.frames); // Array of frame URLs from the backend
      } else {
        console.error('Failed to upload video');
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
        <h1>Video Frame Extractor</h1>
        <input type="file" accept="video/*" onChange={handleFileUpload} />
        {uploading && <p>Uploading and processing...</p>}
        <div className="frames-container">
          {frames.map((frame, index) => (
            <img key={index} src={`http://localhost:5000/${frame}`} alt={`Frame ${index}`} className="frame-image" />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
