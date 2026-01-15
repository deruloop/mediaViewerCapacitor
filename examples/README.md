# MediaPlayer Plugin Examples

Questa cartella contiene esempi di come integrare il plugin MediaPlayer in diversi framework e scenari.

## Contenuto

### vanilla-js.ts
Esempio completo di utilizzo con JavaScript/TypeScript vanilla. Include:
- Inizializzazione del player
- Setup di tutti gli event listener
- Controlli completi (play, pause, volume, velocità)
- Gestione degli stati

**Ideale per**: Progetti senza framework o progetti Capacitor vanilla.

### react-example.tsx
Componente React funcionale con Hooks. Include:
- Component lifecycle con `useEffect`
- State management con `useState`
- Cleanup e rimozione del player
- Binding dei controlli
- Styling inline

**Ideale per**: Progetti React e React Native.

### vue-example.vue
Componente Vue 3 con Composition API. Include:
- Setup con `onMounted` e `onBeforeUnmount`
- Binding reattivo con `v-model`
- Computed properties
- Event handling

**Ideale per**: Progetti Vue 3.

## Come usare gli esempi

### 1. Copia il file dell'esempio che vuoi usare

```bash
cp examples/react-example.tsx src/components/VideoPlayer.tsx
```

### 2. Adatta il percorso di importazione

```typescript
// Aggiusta l'import del plugin
import { MediaPlayer } from '@eduardoroth/media-player';
```

### 3. Integra nel tuo progetto

#### React
```tsx
import VideoPlayer from './components/VideoPlayer';

export default function App() {
  return (
    <VideoPlayer
      url="https://example.com/video.mp4"
      title="My Video"
      poster="https://example.com/poster.jpg"
    />
  );
}
```

#### Vue
```vue
<template>
  <div>
    <VideoPlayer
      url="https://example.com/video.mp4"
      title="My Video"
      poster="https://example.com/poster.jpg"
    />
  </div>
</template>

<script setup>
import VideoPlayer from './components/VideoPlayer.vue';
</script>
```

#### Vanilla JS
```html
<div id="player"></div>
<button id="play-btn">Play</button>
<button id="pause-btn">Pause</button>
<div id="status">Status: Ready</div>
<script type="module" src="main.ts"></script>
```

## URL di Test

Ecco alcuni video pubblici che puoi usare per testare:

- **Big Buck Bunny** (MP4, 9 min)
  ```
  https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4
  ```

- **Sintel** (MP4, 15 min)
  ```
  https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4
  ```

- **Tears of Steel** (MP4, 12 min)
  ```
  https://commondatastorage.googleapis.com/gtv-videos-library/sample/TearsOfSteel.mp4
  ```

## Funzionalità Disponibili

Tutti gli esempi mostrano come utilizzare:

- ✅ Creazione del player
- ✅ Play/Pause
- ✅ Controllo del volume
- ✅ Controllo della velocità di riproduzione
- ✅ Barra di progresso
- ✅ Listener degli eventi
- ✅ Informazioni del video (durata, tempo attuale)
- ✅ Rimozione del player

## Customizzazione

### Cambiare il tema

Modifica gli stili CSS nel file dell'esempio:

```css
.controls {
  background: #1a1a1a; /* Cambia il colore dello sfondo */
  color: #fff; /* Cambia il colore del testo */
}

.progress-fill {
  background: #007bff; /* Cambia il colore della barra di progresso */
}
```

### Aggiungere più controlli

Consulta `INTEGRATION_GUIDE.md` per la lista completa dei metodi disponibili.

### Opzioni iOS/Android

Personalizza il comportamento per iOS e Android:

```typescript
await MediaPlayer.create({
  playerId: 'my-player',
  url: 'https://example.com/video.mp4',
  ios: {
    showsPlaybackControls: true,
    allowsPictureInPicturePlayback: true,
    usesExternalPlaybackWhileExternalScreenIsActive: true,
  },
  android: {
    useDefaultControls: true,
    showBuffering: true,
    enableNetworkSecurityConfiguration: true,
  },
});
```

## Troubleshooting

### Il player non carica il video

1. Verifica che l'URL del video sia accessibile
2. Controlla i CORS su browser (web)
3. Assicurati che il container div con l'ID del player esista nel DOM

### Il player non riproduce

1. Verifica che `MediaPlayer.play()` sia stato chiamato
2. Controlla la console per gli errori
3. Assicurati che il video sia in un formato supportato

### Gli eventi non si attivano

1. Assicurati di aver aggiunto i listener **dopo** la creazione del player
2. Verifica che i nomi degli eventi siano corretti (maiuscole/minuscole)
3. Controlla che il playerId sia corretto

## Prossimi Step

- Consulta `INTEGRATION_GUIDE.md` per la documentazione completa
- Leggi `CAPACITOR_SETUP.md` per configurare un nuovo progetto Capacitor
- Visita il repository: https://github.com/eduardoRoth/media-player
