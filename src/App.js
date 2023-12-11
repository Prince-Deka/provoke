import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css'


const YouTubePlayer = ({ videoId, apiKey }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const playerRef = useRef(null);


  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


    window.onYouTubeIframeAPIReady = () => {
      setPlayer(new window.YT.Player(playerRef.current, {
        videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      }));
    };

    
    return () => {
      tag.remove();
    };
  }, [videoId]);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/videos',
          {
            params: {
              part: 'snippet',
              id: videoId,
              key: apiKey,
            },
          }
        );

        if (response.data.items.length > 0) {
          setVideoData(response.data.items[0].snippet);
        } else {
          console.error('Video not found');
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [videoId, apiKey]);

  const onPlayerReady = (event) => {
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };




  return (
    <div className='App'>
      <header className='App-header'>

        <div ref={playerRef}></div>
        <div style={{ marginTop: '10px' }}></div>
            {videoData && (
              <div>
                <h2>{videoData.title}</h2>
                
              </div>
            )}
            <button className={`button ${isPlaying ? 'pl' : 'ps'}`} onClick={handlePlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            
      </header>
    </div>
  );
};

function App() {
  const unlistedVideoId = 'Twxgmr6ZqVo'; 
  const apiKey = 'AIzaSyAUu9pJtkTOgw6x77DZux82zBXK0ysCZiQ'; 

  return (
    <div className="App">
      <YouTubePlayer videoId={unlistedVideoId} apiKey={apiKey} />
    </div>
  );
}

export default App;
