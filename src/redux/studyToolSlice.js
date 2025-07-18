// studyToolSlice.js में ये actions add करें

import { createSlice } from '@reduxjs/toolkit';

const studyToolSlice = createSlice({
  name: 'studyTool',
  initialState: {
    savedResponses: {},
    showNotebook: false,
    downloadPDF: null, // Add this new state
  },
  reducers: {
    setSavedResponses: (state, action) => {
      state.savedResponses = action.payload;
    },
    updateSavedResponses: (state, action) => {
      state.savedResponses = { ...state.savedResponses, ...action.payload };
    },
    setShowNotebook: (state, action) => {
      state.showNotebook = action.payload;
    },
    // Add this new action
    setDownloadPDF: (state, action) => {
      state.downloadPDF = action.payload;
    },
  },
});

export const { 
  setSavedResponses, 
  updateSavedResponses, 
  setShowNotebook,
  setDownloadPDF // Export the new action
} = studyToolSlice.actions;

export default studyToolSlice.reducer;