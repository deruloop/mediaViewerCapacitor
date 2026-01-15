// Esempio Vue del MediaPlayer Plugin

<template>
  <div class="video-player-container">
    <div :id="playerId" class="video-player"></div>

    <div class="controls">
      <div class="status">{{ status }}</div>

      <div class="playback-controls">
        <button @click="play" :disabled="isPlaying">▶️ Play</button>
        <button @click="pause" :disabled="!isPlaying">⏸️ Pause</button>
      </div>

      <div class="progress">
        <span>{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="seek">
          <div class="progress-fill" :style="{ width: progressPercent }"></div>
        </div>
        <span>{{ formatTime(duration) }}</span>
      </div>

      <div class="volume-control">
        <label>🔊 Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          v-model.number="volume"
          @change="setVolume"
        />
        <span>{{ Math.round(volume * 100) }}%</span>
      </div>

      <div class="rate-control">
        <label>⏱️ Speed:</label>
        <select v-model.number="rate" @change="setRate">
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { MediaPlayer } from '@eduardoroth/media-player';

interface Props {
  url: string;
  title?: string;
  subtitle?: string;
  poster?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Video',
  subtitle: '',
  poster: '',
});

const playerId = ref(`player-${Math.random()}`);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.5);
const rate = ref(1);
const status = ref('Initializing...');

const progressPercent = computed(
  () => `${duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0}%`
);

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const initializePlayer = async () => {
  try {
    const result = await MediaPlayer.create({
      playerId: playerId.value,
      url: props.url,
      placement: {
        width: '100%',
        height: '100%',
      },
      extra: {
        title: props.title,
        subtitle: props.subtitle,
        poster: props.poster,
        autoPlayWhenReady: false,
      },
      web: {
        enableChromecast: true,
      },
    });

    if (result.result) {
      status.value = 'Ready';
      setupListeners();
    } else {
      status.value = `Error: ${result.message}`;
    }
  } catch (error) {
    console.error('Failed to initialize player:', error);
    status.value = 'Initialization failed';
  }
};

const setupListeners = () => {
  MediaPlayer.addListener('MediaPlayer:Play', () => {
    isPlaying.value = true;
    status.value = 'Playing';
  });

  MediaPlayer.addListener('MediaPlayer:Pause', () => {
    isPlaying.value = false;
    status.value = 'Paused';
  });

  MediaPlayer.addListener('MediaPlayer:TimeUpdated', (event) => {
    currentTime.value = event.currentTime;
  });

  MediaPlayer.addListener('MediaPlayer:Seek', (event) => {
    currentTime.value = event.newTime;
  });

  MediaPlayer.addListener('MediaPlayer:Ended', () => {
    isPlaying.value = false;
    status.value = 'Ended';
  });
};

const play = async () => {
  const result = await MediaPlayer.play({ playerId: playerId.value });
  if (!result.result) {
    status.value = `Play error: ${result.message}`;
  }
};

const pause = async () => {
  const result = await MediaPlayer.pause({ playerId: playerId.value });
  if (!result.result) {
    status.value = `Pause error: ${result.message}`;
  }
};

const setVolume = async () => {
  const result = await MediaPlayer.setVolume({
    playerId: playerId.value,
    volume: volume.value,
  });
  if (!result.result) {
    status.value = `Volume error: ${result.message}`;
  }
};

const setRate = async () => {
  const result = await MediaPlayer.setRate({
    playerId: playerId.value,
    rate: rate.value,
  });
  if (!result.result) {
    status.value = `Rate error: ${result.message}`;
  }
};

const seek = async (event: MouseEvent) => {
  const bar = event.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const newTime = percent * duration.value;

  const result = await MediaPlayer.setCurrentTime({
    playerId: playerId.value,
    time: newTime,
  });

  if (!result.result) {
    status.value = `Seek error: ${result.message}`;
  }
};

onMounted(() => {
  initializePlayer();
});

onBeforeUnmount(async () => {
  await MediaPlayer.remove({ playerId: playerId.value }).catch(console.error);
});
</script>

<style scoped>
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
</style>
