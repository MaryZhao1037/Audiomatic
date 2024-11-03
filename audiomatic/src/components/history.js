// History.js
import React, { useState, useEffect } from 'react';

function History() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = async () => {
    setLoading(true);
    try {
      // const response = await fetch('http://localhost:5000/audio-files');
      // if (response.ok) {
      //   const data = await response.json();
      //   setAudioFiles(data);
      // } else {
      //   setError('Failed to fetch audio files');
      // }

      setAudioFiles(["audio1", "audio2", "audio3"]);
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/audio-files/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAudioFiles(audioFiles.filter(file => file.id !== id));
      } else {
        setError('Failed to delete audio file');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error:', error);
    }
  };

  const handlePlay = (id, url) => {
    if (currentlyPlaying?.id === id) {
      currentlyPlaying.audio.pause();
      setCurrentlyPlaying(null);
    } else {
      // Stop currently playing audio if any
      if (currentlyPlaying) {
        currentlyPlaying.audio.pause();
      }
      
      const audio = new Audio(url);
      audio.play();
      setCurrentlyPlaying({ id, audio });

      // Reset playing state when audio ends
      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
      });
    }
  };

  return (
    <div className="history">
      <header>
        <h2>Audio History</h2>
        <p>View and manage your generated audio files.</p>
      </header>

      {loading ? (
        <p className="uploading-text">Loading audio files...</p>
      ) : error ? (
        <div className="upload-section">
          <p style={{ color: '#ff4444' }}>{error}</p>
        </div>
      ) : (
        <div className="audio-files-section">
          {audioFiles.length === 0 ? (
            <div className="upload-section">
              <p>No audio files found</p>
            </div>
          ) : (
            audioFiles.map((file) => (
              <div key={file.id} className="upload-section" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{file.name}</h3>
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>
                      Created: {new Date(file.createdAt).toLocaleDateString()}
                      {file.duration && ` • ${file.duration}s`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-generate"
                      onClick={() => handlePlay(file.id, file.url)}
                      style={{ minWidth: '100px' }}
                    >
                      {currentlyPlaying?.id === file.id ? 'Pause' : 'Play'}
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {file.url && (
                  <div style={{ marginTop: '1rem' }}>
                    <audio
                      controls
                      className="mt-3 w-full max-w-[600px]"
                      style={{ width: '100%' }}
                    >
                      <source src={file.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default History;