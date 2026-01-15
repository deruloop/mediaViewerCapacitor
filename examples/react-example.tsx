// Esempio React del MediaPlayer Plugin

import React, { useEffect, useRef, useState } from 'react';
import { MediaPlayer } from '@eduardoroth/media-player';

interface VideoPlayerProps {
  url: string;
  title?: string;
  subtitle?: string;
  poster?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = 'Video',
  subtitle = '',
  poster = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerId = useRef(`player-${Math.random()}`);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState('Initializing...');

  const pid = playerId.current;

  useEffect(() => {
    const initPlayer = async () => {
      try {
        const result = await MediaPlayer.create({
          playerId: pid,
          url,
          placement: {
            width: '100%',
            height: '100%',
          },
          extra: {
            title,
            subtitle,
            poster,
            autoPlayWhenReady: false,
          },
          web: {
            enableChromecast: true,
          },
        });

        if (result.result) {
          setStatus('Ready');
          setupListeners();
        } else {
          setStatus(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Failed to initialize player:', error);
        setStatus('Initialization failed');
      }
    };

    initPlayer();

    return () => {
      MediaPlayer.remove({ playerId: pid }).catch(console.error);
    };
  }, [url, title, subtitle, poster, pid]);

  const setupListeners = () => {
    MediaPlayer.addListener('MediaPlayer:Play', () => {
      setIsPlaying(true);
      setStatus('Playing');
    });

    MediaPlayer.addListener('MediaPlayer:Pause', () => {
      setIsPlaying(false);
      setStatus('Paused');
    });

    MediaPlayer.addListener('MediaPlayer:TimeUpdated', (event) => {
      setCurrentTime(event.currentTime);
    });

    MediaPlayer.addListener('MediaPlayer:Seek', (event) => {
      setCurrentTime(event.newTime);
    });

    MediaPlayer.addListener('MediaPlayer:Ended', () => {
      setIsPlaying(false);
      setStatus('Ended');
    });
  };

  const handlePlay = async () => {
    const result = await MediaPlayer.play({ playerId: pid });
    if (!result.result) {
      setStatus(`Play error: ${result.message}`);
    }
  };

  const handlePause = async () => {
    const result = await MediaPlayer.pause({ playerId: pid });
    if (!result.result) {
      setStatus(`Pause error: ${result.message}`);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    const result = await MediaPlayer.setVolume({
      playerId: pid,
      volume: newVolume,
    });
    if (result.result) {
      setVolume(newVolume);
    }
  };

  const handleRateChange = async (newRate: number) => {
    const result = await MediaPlayer.setRate({
      playerId: pid,
      rate: newRate,
    });
    if (result.result) {
      setRate(newRate);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-player-container">
      <div ref={containerRef} id={pid} className="video-player" />

      <div className="controls">
        <div className="status">{status}</div>

        <div className="playback-controls">
          <button onClick={handlePlay} disabled={isPlaying}>
            ▶️ Play
          </button>
          <button onClick={handlePause} disabled={!isPlaying}>
            ⏸️ Pause
          </button>
        </div>

        <div className="progress">
          <span>{formatTime(currentTime)}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="volume-control">
          <label>🔊 Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>

        <div className="rate-control">
          <label>⏱️ Speed:</label>
          <select value={rate} onChange={(e) => handleRateChange(parseFloat(e.target.value))}>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      <style>{`
        .video-player-container {
          width: 100%;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }

        .video-player {
          width: 100%;
          height: 500px;
        }

        .controls {
          padding: 20px;
          background: #1a1a1a;
          color: #fff;
        }

        .status {
          margin-bottom: 10px;
          font-size: 14px;
          color: #aaa;
        }

        .playback-controls {
          margin: 10px 0;
          display: flex;
          gap: 10px;
        }

        .playback-controls button {
          padding: 8px 16px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .playback-controls button:disabled {
          background: #555;
          cursor: not-allowed;
        }

        .progress {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
          font-size: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #333;
          border-radius: 3px;
          overflow: hidden;
          cursor: pointer;
        }

        .progress-fill {
          height: 100%;
          background: #007bff;
          transition: width 0.1s;
        }

        .volume-control,
        .rate-control {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
          font-size: 14px;
        }

        .volume-control input,
        .rate-control select {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #555;
          background: #333;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
