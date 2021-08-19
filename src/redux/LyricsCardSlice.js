import {createSlice} from '@reduxjs/toolkit'
import {lyrics} from "../fakeRestApi.js";

const initialState = lyrics;
const lyricsSlice = createSlice({
  name: "lyrics",
  initialState,
  reducers : {

  }
});

export default lyricsSlice.reducer
