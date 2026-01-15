// Esempio completo di utilizzo del MediaPlayer Plugin
// Questo file mostra come integrare il plugin in un progetto Capacitor vanilla

import { MediaPlayer } from '@eduardoroth/media-player';

class MediaPlayerExample {
  private playerId = 'example-player';
  private currentVolume = 0.5;
  private currentRate = 1;

  async initialize() {
    // Crea il player
    const result = await MediaPlayer.create({
      playerId: this.playerId,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      placement: {
        width: '100%',
        height: '500px',
      },
      extra: {
        title: 'Big Buck Bunny',
        subtitle: 'A free short film',
        poster: 'https://peach.blender.org/wp-content/uploads/12_video_bunny_800.png',
        autoPlayWhenReady: false,
        rate: 1,
      },
      ios: {
        showsPlaybackControls: true,
        allowsPictureInPicturePlayback: true,
      },
      android: {
        useDefaultControls: true,
        enableNetworkSecurityConfiguration: true,
      },
      web: {
        enableChromecast: true,
      },
    });

    if (result.result) {
      console.log('✅ Player initialized:', result.value);
      this.setupListeners();
      this.setupControls();
    } else {
      console.error('❌ Failed to initialize player:', result.message);
    }
  }

  private setupListeners() {
    // Ready event
    MediaPlayer.addListener('MediaPlayer:Ready', (event) => {
      console.log('🎬 Player ready:', event.playerId);
      this.updateStatus('Ready to play');
    });

    // Play event
    MediaPlayer.addListener('MediaPlayer:Play', (event) => {
      console.log('▶️ Playing:', event.playerId);
      this.updateStatus('Playing');
      this.updatePlayButtonState(true);
    });

    // Pause event
    MediaPlayer.addListener('MediaPlayer:Pause', (event) => {
      console.log('⏸️ Paused:', event.playerId);
      this.updateStatus('Paused');
      this.updatePlayButtonState(false);
    });

    // Time update
    MediaPlayer.addListener('MediaPlayer:TimeUpdated', (event) => {
      this.updateProgress(event.currentTime);
    });

    // Seek event
    MediaPlayer.addListener('MediaPlayer:Seek', (event) => {
      console.log('🔄 Seeked from', event.previousTime, 'to', event.newTime);
      this.updateStatus(`Seeked to ${Math.floor(event.newTime)}s`);
    });

    // Ended event
    MediaPlayer.addListener('MediaPlayer:Ended', (event) => {
      console.log('✅ Video ended:', event.playerId);
      this.updateStatus('Video ended');
    });

    // FullScreen event
    MediaPlayer.addListener('MediaPlayer:FullScreen', (event) => {
      console.log('🖥️ FullScreen:', event.isInFullScreen);
      this.updateStatus(event.isInFullScreen ? 'Fullscreen' : 'Normal');
    });

    // Picture in Picture
    MediaPlayer.addListener('MediaPlayer:PictureInPicture', (event) => {
      console.log('📱 PiP:', event.isInPictureInPicture);
      this.updateStatus(event.isInPictureInPicture ? 'Picture in Picture' : 'Normal');
    });

    // Background playback
    MediaPlayer.addListener('MediaPlayer:isPlayingInBackground', (event) => {
      console.log('🔊 Playing in background:', event.isPlayingInBackground);
    });

    // Removed event
    MediaPlayer.addListener('MediaPlayer:Removed', (event) => {
      console.log('🗑️ Player removed:', event.playerId);
    });
  }

  private setupControls() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const rateBtn = document.getElementById('rate-btn');
    const infoBtn = document.getElementById('info-btn');
    const removeBtn = document.getElementById('remove-btn');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.play());
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.pause());
    }

    if (volumeBtn) {
      volumeBtn.addEventListener('click', () => this.toggleVolume());
    }

    if (rateBtn) {
      rateBtn.addEventListener('click', () => this.toggleRate());
    }

    if (infoBtn) {
      infoBtn.addEventListener('click', () => this.showInfo());
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removePlayer());
    }
  }

  private async play() {
    try {
      const result = await MediaPlayer.play({ playerId: this.playerId });
      if (!result.result) {
        console.error('Failed to play:', result.message);
      }
    } catch (error) {
      console.error('Play error:', error);
    }
  }

  private async pause() {
    try {
      const result = await MediaPlayer.pause({ playerId: this.playerId });
      if (!result.result) {
        console.error('Failed to pause:', result.message);
      }
    } catch (error) {
      console.error('Pause error:', error);
    }
  }

  private async toggleVolume() {
    const volumes = [0, 0.5, 1];
    const currentIndex = volumes.indexOf(this.currentVolume);
    this.currentVolume = volumes[(currentIndex + 1) % volumes.length];

    const result = await MediaPlayer.setVolume({
      playerId: this.playerId,
      volume: this.currentVolume,
    });

    if (result.result) {
      this.updateStatus(`Volume: ${Math.round(this.currentVolume * 100)}%`);
      const btn = document.getElementById('volume-btn');
      if (btn) {
        btn.textContent = `🔊 ${Math.round(this.currentVolume * 100)}%`;
      }
    }
  }

  private async toggleRate() {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(this.currentRate);
    this.currentRate = rates[(currentIndex + 1) % rates.length];

    const result = await MediaPlayer.setRate({
      playerId: this.playerId,
      rate: this.currentRate,
    });

    if (result.result) {
      this.updateStatus(`Speed: ${this.currentRate}x`);
      const btn = document.getElementById('rate-btn');
      if (btn) {
        btn.textContent = `⏱️ ${this.currentRate}x`;
      }
    }
  }

  private async showInfo() {
    try {
      const duration = await MediaPlayer.getDuration({ playerId: this.playerId });
      const currentTime = await MediaPlayer.getCurrentTime({ playerId: this.playerId });
      const isPlaying = await MediaPlayer.isPlaying({ playerId: this.playerId });
      const isMuted = await MediaPlayer.isMuted({ playerId: this.playerId });

      const info = `
        Duration: ${Math.floor(duration.value || 0)}s
        Current: ${Math.floor(currentTime.value || 0)}s
        Playing: ${isPlaying.value ? 'Yes' : 'No'}
        Muted: ${isMuted.value ? 'Yes' : 'No'}
      `;

      this.updateStatus(info);
      console.log('📊 Player Info:', {
        duration: duration.value,
        currentTime: currentTime.value,
        isPlaying: isPlaying.value,
        isMuted: isMuted.value,
      });
    } catch (error) {
      console.error('Failed to get info:', error);
    }
  }

  private async removePlayer() {
    try {
      const result = await MediaPlayer.remove({ playerId: this.playerId });
      if (result.result) {
        this.updateStatus('Player removed');
        console.log('✅ Player removed successfully');
      }
    } catch (error) {
      console.error('Failed to remove player:', error);
    }
  }

  private updateStatus(message: string) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = `Status: ${message}`;
    }
  }

  private updateProgress(currentTime: number) {
    const progressEl = document.getElementById('progress');
    if (progressEl) {
      progressEl.textContent = `Time: ${Math.floor(currentTime)}s`;
    }
  }

  private updatePlayButtonState(isPlaying: boolean) {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    if (playBtn) playBtn.disabled = isPlaying;
    if (pauseBtn) pauseBtn.disabled = !isPlaying;
  }
}

// Avvia quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  const example = new MediaPlayerExample();
  example.initialize();
});
