import {createSlice} from '@reduxjs/toolkit'
import {lyrics} from "../fakeRestApi.js";

 const initialState = lyrics;
 const favouritesSlice = createSlice({
   name: 'favourites',
   initialState,
   reducer: {
     favouriteAdded(state,action){
       state.push(action.payload)
     }
   }
 })

export const {favouriteAdded} = favouritesSlice.actions
export default favouritesSlice.reducer
