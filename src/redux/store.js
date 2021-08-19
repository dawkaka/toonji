import { configureStore } from '@reduxjs/toolkit'

import lyricsReducer from './LyricsCardSlice'

export default configureStore({
  reducer: {
    lyrics: lyricsReducer
  }
});
