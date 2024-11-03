// History.js
import React, { useState, useEffect } from 'react';
import history_audio from '../historystuff/realaudio.mp3';
import history_image from '../historystuff/recent_image.jpg';

function History() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [dataMap, setDataMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [playingHistory, setPlayingHistory] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [error, setError] = useState(null);
  const [audioUrls, setAudioUrls] = useState({});  // Add this new state
  const [showPlayer, setShowPlayer] = useState({});  // Add this to track which players are visible
  
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');

  const fetchAudioFiles = async () => {
    try {
      console.log("fetching audio files")
      const response = await fetch('http://localhost:5000/audio_list');
      if (!response.ok) {
          throw new Error('Failed to fetch audio files');
      }
      const data = await response.json();
        //const data = ["earthgettingdeleted", "eldenring", "nightclub"]
        setAudioFiles(Object.values(data));
        
    } catch (err) {
        setError(err.message);
    }
};

const handlePlayClick = async (filename) => {
  try {
      // Toggle the audio player visibility
      setShowPlayer(prev => ({
          ...prev,
          [filename]: !prev[filename]
      }));
      getAudioUrl(filename);

      // If we haven't loaded this audio file's URL yet, load it
      if (!audioUrls[filename]) {
          const response = await fetch(`http://localhost:5000/get_url/${filename}`);
          if (!response.ok) {
              throw new Error('Failed to fetch audio file');
          }
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          console.log(url);
          setAudioUrls(prev => ({
              ...prev,
              [filename]: url
          }));
      }
  } catch (err) {
      setError('Error loading audio file');
      console.error('Error:', err);
  }
};

const fetchDataMap = async () => {
  try {
      console.log("fetching data map");
      const response = await fetch('http://localhost:5000/data_map');
      if (!response.ok) {
          throw new Error('Failed to fetch data map');
      }
      const data = await response.json();
      const keys = Object.keys(data);
      // for (const key of keys) {
      //     data[key]["url"] = await getAudioUrl(key);
      // }
        console.log(data);
        // Set the entire data object directly
        setDataMap(data);

      //console.log(dataMap);
  } catch (err) {
      setError(err.message);
  }
};

const getAudioUrl = async (filename) => {
  try {
      setAudioPreviewUrl(`http://localhost:5000/get_url/${filename}`)
  } catch (err) {
      console.error('Error fetching audio:', err);
      throw err;
  }
};


useEffect(() => {
  fetchAudioFiles();
  fetchDataMap();
}, []);


  const handleDelete = async (id) => {
    try {
      // const response = await fetch(`http://localhost:5000/audio-files/${id}`, {
      //   method: 'DELETE',
      // });
      
      setAudioFiles(audioFiles.filter(file => file !== id));
      // if (response.ok) {
      //   setAudioFiles(audioFiles.filter(file => file.id !== id));
      // } else {
      //   setError('Failed to delete audio file');
      // }
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
          <p style={{ color: '#af7ac5' }}>{error}</p>
        </div>
      ) : (
        <div className="audio-files-section">
          {audioFiles.length === 0 ? (
            <div className="upload-section">
              <p>No audio files found</p>
            </div>
          ) : (
            audioFiles.map((file) => (
              <div key={file} className="upload-section" style={{ marginBottom: '1rem' }}>
                <p>
                  {file}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{file.name}</h3>
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>
                      Created: {dataMap && dataMap[file] && new Date(dataMap[file]["date"]).toLocaleDateString()}
                      {file.duration && ` • ${file.duration}s`}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => handlePlayClick(file)}
                        style={{
                            backgroundColor: '#5dade2',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {showPlayer[file] ? 'Hide Player' : 'Play'}
                    </button>
                    {/* ... Delete button ... */}
                    {/* showPlayer[file] && audioUrls[file] && (
                      console.log(audioUrls[file]), */}
                    <div style={{ marginTop: '1rem' }}>
                        <audio
                            controls
                            className="mt-3 w-full max-w-[600px]"
                            style={{ width: '100%' }}
                        >
                            <source src={audioPreviewUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>

                
                
                  {/* <audio
                    src={file.url}
                    controls
                    controlsList="nodownload"
                    style={{ 
                      width: '200px',
                      height: '40px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px'
                    }}
                  /> */}
                    <button
                      onClick={() => handleDelete(file)}
                      style={{
                        backgroundColor: '#af7ac5',
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
              </div>
            ))
          )}
        </div>

        
        
      )}

<div style={{ marginTop: '1rem' }}>
                        <audio
                            controls
                            className="mt-3 w-full max-w-[600px]"
                            style={{ width: '100%' }}
                        >
                            <source src={audioPreviewUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                

      <h2 className="mt-6">Audio Pipeline</h2>

      <img src={history_image} alt="Description of the image" style={{ width: '60%' }} />
      <div className="mt-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
<p>
        <b>Image Description - </b> In this enchanting scene, the world awakens to the gentle embrace of dawn. 
        A majestic stag stands silhouetted against a vivid tapestry of colors, its regal form mirrored in the tranquil waters below. 
        Soft hues of pink, orange, and purple blend seamlessly in the sky, creating a dreamlike atmosphere that pulls you into its serenity.

The landscape is alive with a sense of calm; the still water reflects the radiant sun as it begins its ascension, casting a warm glow that ignites the horizon. 
Lush trees stand like guardians, their dark silhouettes contrasting beautifully with the soft pastels of the morning light.
<br></br>
     
<b>Music Description - </b> 
A serene ambient piece featuring soft piano melodies intertwined with delicate strings, creating a tranquil atmosphere perfect for a moment of reflection. 
The gentle ebb and flow of wind chimes adds a touch of nature's harmony, inviting listeners to immerse themselves in the peaceful dawn. 
With lush harmonies and a subtle pulse, this composition captures the essence of new beginnings and the beauty of stillness.
     
      </p>
</div>
      
      <div style={{ marginTop: '1rem'}}>
                        <audio
                            controls
                            className="mt-3 w-full max-w-[600px]"
                            style={{ width: '100%' }}
                        >
                            <source src={history_audio} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
    </div>
  );
}

export default History;