# Setup Capacitor per il Plugin MediaPlayer

Questo documento spiega come configurare un nuovo progetto Capacitor da zero per usare il plugin MediaPlayer.

## Creazione di un Nuovo Progetto Capacitor

Se non hai ancora un progetto Capacitor, creane uno:

```bash
# Installa Capacitor globalmente
npm install -g @capacitor/cli

# Crea un nuovo progetto
npx create-capacitor-app my-media-app

# Naviga nella cartella
cd my-media-app
```

## Aggiunta del Plugin MediaPlayer

### 1. Installa il plugin

```bash
npm install @eduardoroth/media-player
```

### 2. Aggiungi iOS e Android

```bash
npx cap add ios
npx cap add android
```

### 3. Sincronizza con i platform nativi

```bash
npx cap sync
```

## Configurazione Platform-Specifica

### iOS

#### 1. Apri Xcode

```bash
npx cap open ios
```

#### 2. Verifica il Pod

Una volta in Xcode, il plugin verrà installato automaticamente tramite CocoaPods.

Se vedi errori di build:

```bash
cd ios
rm -rf Pods
rm -rf Podfile.lock
pod install
cd ..
npx cap sync ios
```

#### 3. Capabilities (Opzionale)

Se vuoi supportare Picture-in-Picture:

1. Seleziona il target nell'editor del progetto
2. Vai su "Signing & Capabilities"
3. Clicca "+ Capability"
4. Aggiungi "Picture in Picture"

### Android

#### 1. Verifica Gradle

Il file `android/build.gradle` dovrebbe avere:

```gradle
buildscript {
    ext {
        gradlePluginVersion = '7.0.0' // Minimo 7.0
    }
}
```

#### 2. Configura AndroidManifest.xml

Nel file `android/app/src/main/AndroidManifest.xml`, aggiorna l'activity:

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

#### 3. Build

```bash
npx cap build android
```

### Web

Il web non richiede configurazioni aggiuntive. Usa semplicemente il plugin nel tuo codice web e funzionerà automaticamente.

## Esempio di Utilizzo Completo

### src/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>MediaPlayer Example</title>
    <style>
      #player {
        width: 100%;
        height: 500px;
        margin: 20px 0;
      }
      .controls {
        margin: 20px 0;
      }
      button {
        padding: 10px 20px;
        margin: 5px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>MediaPlayer Plugin</h1>
    
    <div id="player"></div>
    
    <div class="controls">
      <button id="playBtn">Play</button>
      <button id="pauseBtn">Pause</button>
      <button id="volumeBtn">Volume: 50%</button>
      <button id="rateBtn">Speed: 1x</button>
      <button id="infoBtn">Info</button>
    </div>

    <p id="status">Status: Ready</p>

    <script type="module" src="main.ts"></script>
  </body>
</html>
```

### src/main.ts

```typescript
import { MediaPlayer } from '@eduardoroth/media-player';

const playerId = 'player';
let currentVolume = 0.5;
let currentRate = 1;

// Crea il player
async function initializePlayer() {
  const result = await MediaPlayer.create({
    playerId,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    placement: {
      width: '100%',
      height: '100%',
    },
    extra: {
      title: 'Big Buck Bunny',
      subtitle: 'A free short film',
      poster: 'https://peach.blender.org/wp-content/uploads/12_video_bunny_800.png?x11217',
      autoPlayWhenReady: false,
    },
    web: {
      enableChromecast: true,
    },
  });

  if (result.result) {
    updateStatus('Player created successfully');
  } else {
    updateStatus('Error: ' + result.message);
  }
}

// Setup event listeners
function setupListeners() {
  MediaPlayer.addListener('MediaPlayer:Play', () => {
    updateStatus('▶️ Playing');
  });

  MediaPlayer.addListener('MediaPlayer:Pause', () => {
    updateStatus('⏸️ Paused');
  });

  MediaPlayer.addListener('MediaPlayer:TimeUpdated', (event) => {
    updateStatus(`Time: ${Math.floor(event.currentTime)}s`);
  });

  MediaPlayer.addListener('MediaPlayer:Ended', () => {
    updateStatus('✅ Video ended');
  });
}

// Setup button handlers
function setupButtons() {
  document.getElementById('playBtn')?.addEventListener('click', async () => {
    await MediaPlayer.play({ playerId });
  });

  document.getElementById('pauseBtn')?.addEventListener('click', async () => {
    await MediaPlayer.pause({ playerId });
  });

  document.getElementById('volumeBtn')?.addEventListener('click', async () => {
    currentVolume = currentVolume === 0.5 ? 1 : currentVolume === 1 ? 0 : 0.5;
    await MediaPlayer.setVolume({ playerId, volume: currentVolume });
    const btn = document.getElementById('volumeBtn');
    if (btn) {
      btn.textContent = `Volume: ${Math.round(currentVolume * 100)}%`;
    }
  });

  document.getElementById('rateBtn')?.addEventListener('click', async () => {
    const rates = [0.5, 1, 1.5, 2];
    const currentIndex = rates.indexOf(currentRate);
    currentRate = rates[(currentIndex + 1) % rates.length];
    await MediaPlayer.setRate({ playerId, rate: currentRate });
    const btn = document.getElementById('rateBtn');
    if (btn) {
      btn.textContent = `Speed: ${currentRate}x`;
    }
  });

  document.getElementById('infoBtn')?.addEventListener('click', async () => {
    const duration = await MediaPlayer.getDuration({ playerId });
    const currentTime = await MediaPlayer.getCurrentTime({ playerId });
    const isPlaying = await MediaPlayer.isPlaying({ playerId });
    updateStatus(
      `Duration: ${duration.value}s | Current: ${currentTime.value}s | Playing: ${isPlaying.value}`
    );
  });
}

function updateStatus(message: string) {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = `Status: ${message}`;
  }
}

// Avvia quando il DOM è pronto
document.addEventListener('DOMContentLoaded', async () => {
  await initializePlayer();
  setupListeners();
  setupButtons();
});
```

### capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.mediaplayer',
  appName: 'MediaPlayer Example',
  webDir: 'dist',
  plugins: {
    MediaPlayer: {
      // Opzioni specifiche del plugin se necessarie
    },
  },
};

export default config;
```

## Comandi Utili

### Sviluppo

```bash
# Serve l'app in sviluppo
npm run dev

# Costruisci per il web
npm run build

# Sincronizza con i platform nativi
npx cap sync

# Apri Xcode
npx cap open ios

# Apri Android Studio
npx cap open android
```

### Deploy

```bash
# Build e sync per iOS
npx cap build ios

# Build e sync per Android
npx cap build android

# Pubblica su npm (solo se sei il maintainer)
npm publish
```

## Test sui Device

### iOS

```bash
# Sincronizza prima
npx cap sync ios

# Apri Xcode e seleziona il device fisico
npx cap open ios

# Oppure usa la CLI di Capacitor
npx cap run ios --device
```

### Android

```bash
# Sincronizza prima
npx cap sync android

# Connetti un device o apri un emulatore

# Run
npx cap run android
```

## Troubleshooting

### Pod install fallisce su iOS

```bash
cd ios
rm -rf Pods
rm -rf Podfile.lock
pod install
cd ..
npx cap sync ios
```

### Gradle build fallisce su Android

Verifica che:
1. `gradle-wrapper.properties` abbia Gradle 7.0+
2. `build.gradle` abbia `minSdkVersion 22` e `targetSdkVersion 31+`
3. Java è correttamente configurato

### Il plugin non si carica

```bash
npm install @eduardoroth/media-player@latest
npx cap sync
```

## Prossimi Step

Consulta `INTEGRATION_GUIDE.md` per esempi di integrazione con React, Vue, Angular e altro.
