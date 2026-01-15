# Guida di Integrazione - MediaPlayer Plugin per Capacitor

Questa guida spiega come integrare il plugin `@eduardoroth/media-player` nel tuo progetto Capacitor.

## Prerequisiti

- Node.js 14+ e npm
- Capacitor 5.0+
- Un progetto Capacitor esistente

## Installazione

### 1. Installa il plugin

```bash
npm install @eduardoroth/media-player
npx cap sync
```

### 2. Configurazione iOS

Per iOS, il plugin viene installato automaticamente tramite CocoaPods (SPM).

Se hai problemi, puoi reinstallare il pod:

```bash
cd ios
rm -rf Pods
rm -rf Podfile.lock
pod install
cd ..
npx cap sync ios
```

### 3. Configurazione Android

Aggiungi le seguenti configurazioni nel tuo `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|screenLayout|uiMode|fontScale|density|fontWeightAdjustment"
    android:label="@string/title_activity_main"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme"
    android:windowSoftInputMode="adjustResize">
</activity>
```

**Nota**: Assicurati che Gradle 7.0 o superiore sia installato.

### 4. Configurazione Web

Il plugin funziona automaticamente sul web senza configurazioni aggiuntive. Usa il fallback HTML5 Video Player con Vidstack.

## Utilizzo Base

### Importa il plugin

```typescript
import { MediaPlayer } from '@eduardoroth/media-player';
```

### Crea un player

```typescript
async function createMediaPlayer() {
  const result = await MediaPlayer.create({
    playerId: 'my-player',
    url: 'https://example.com/video.mp4',
    placement: {
      width: '100%',
      height: '300px',
    },
    extra: {
      title: 'My Video',
      subtitle: 'A great video',
      poster: 'https://example.com/poster.jpg',
      autoPlayWhenReady: false,
    },
    web: {
      enableChromecast: true,
    },
  });

  if (result.result) {
    console.log('Player created:', result.value);
  }
}
```

### Controlla il player

```typescript
// Play
await MediaPlayer.play({ playerId: 'my-player' });

// Pause
await MediaPlayer.pause({ playerId: 'my-player' });

// Get current time
const time = await MediaPlayer.getCurrentTime({ playerId: 'my-player' });

// Set volume (0-1)
await MediaPlayer.setVolume({ playerId: 'my-player', volume: 0.5 });

// Set playback rate
await MediaPlayer.setRate({ playerId: 'my-player', rate: 1.5 });

// Remove player
await MediaPlayer.remove({ playerId: 'my-player' });
```

### Ascolta gli eventi

```typescript
// Ready event
MediaPlayer.addListener('MediaPlayer:Ready', (event) => {
  console.log('Player ready:', event.playerId);
});

// Play event
MediaPlayer.addListener('MediaPlayer:Play', (event) => {
  console.log('Playing:', event.playerId);
});

// Pause event
MediaPlayer.addListener('MediaPlayer:Pause', (event) => {
  console.log('Paused:', event.playerId);
});

// Time update
MediaPlayer.addListener('MediaPlayer:TimeUpdated', (event) => {
  console.log('Current time:', event.currentTime);
});

// Seek event
MediaPlayer.addListener('MediaPlayer:Seek', (event) => {
  console.log('Seeked to:', event.newTime);
});

// Ended event
MediaPlayer.addListener('MediaPlayer:Ended', (event) => {
  console.log('Video ended:', event.playerId);
});

// FullScreen event
MediaPlayer.addListener('MediaPlayer:FullScreen', (event) => {
  console.log('Fullscreen:', event.isInFullScreen);
});

// Picture in Picture
MediaPlayer.addListener('MediaPlayer:PictureInPicture', (event) => {
  console.log('PiP:', event.isInPictureInPicture);
});
```

## Integrazione con Framework

### React

```typescript
import { useEffect, useRef } from 'react';
import { MediaPlayer } from '@eduardoroth/media-player';

export function VideoPlayer({ videoUrl }) {
  const containerRef = useRef(null);
  const playerId = 'react-player';

  useEffect(() => {
    const initializePlayer = async () => {
      await MediaPlayer.create({
        playerId,
        url: videoUrl,
        placement: {
          width: '100%',
          height: '100%',
        },
      });
    };

    initializePlayer();

    return async () => {
      await MediaPlayer.remove({ playerId });
    };
  }, [videoUrl]);

  return <div id={playerId} ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
```

### Vue

```typescript
<template>
  <div class="video-container">
    <div :id="playerId" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { MediaPlayer } from '@eduardoroth/media-player';

const playerId = 'vue-player';

const props = defineProps({
  videoUrl: String,
});

onMounted(async () => {
  await MediaPlayer.create({
    playerId,
    url: props.videoUrl,
    placement: {
      width: '100%',
      height: '100%',
    },
  });
});

onBeforeUnmount(async () => {
  await MediaPlayer.remove({ playerId });
});
</script>
```

### Angular

```typescript
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MediaPlayer } from '@eduardoroth/media-player';

@Component({
  selector: 'app-video-player',
  template: '<div [id]="playerId" style="width: 100%; height: 100%;"></div>',
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoUrl: string;
  playerId = 'angular-player';

  async ngOnInit() {
    await MediaPlayer.create({
      playerId: this.playerId,
      url: this.videoUrl,
      placement: {
        width: '100%',
        height: '100%',
      },
    });
  }

  async ngOnDestroy() {
    await MediaPlayer.remove({ playerId: this.playerId });
  }
}
```

## Opzioni di Configurazione

### MediaPlayerOptions

```typescript
{
  playerId: string;              // ID univoco del player
  url: string;                   // URL del video
  placement?: {                  // Posizionamento e dimensioni
    width?: string;
    height?: string;
    x?: number;
    y?: number;
  };
  ios?: {                        // Opzioni iOS specifiche
    showsPlaybackControls?: boolean;
    allowsPictureInPicturePlayback?: boolean;
    usesExternalPlaybackWhileExternalScreenIsActive?: boolean;
  };
  android?: {                    // Opzioni Android specifiche
    useDefaultControls?: boolean;
    showBuffering?: boolean;
    enableNetworkSecurityConfiguration?: boolean;
  };
  web?: {                        // Opzioni Web specifiche
    enableChromecast?: boolean;
  };
  extra?: {                      // Opzioni extra
    title?: string;
    subtitle?: string;
    artist?: string;
    poster?: string;
    autoPlayWhenReady?: boolean;
    rate?: number;
  };
}
```

## Troubleshooting

### Il plugin non viene riconosciuto in iOS

Soluzione:

```bash
npx cap sync ios
cd ios
rm -rf Pods
pod install
cd ..
```

### Errori su Android

Verifica che:
- Gradle 7.0+ è installato
- `targetSdkVersion` è 31 o superiore
- Il `AndroidManifest.xml` ha le configurazioni corrette

### Video non si carica sul web

Assicurati che:
- L'URL del video è accessibile
- CORS è correttamente configurato
- Il container con l'ID del player esiste nel DOM

## Supporto

Per segnalare bug o richiedere funzionalità, visita: https://github.com/eduardoRoth/media-player/issues
