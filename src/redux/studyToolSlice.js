import { createSlice } from '@reduxjs/toolkit';

const studyToolSlice = createSlice({
  name: 'studyTool',
  initialState: {
    savedResponses: {},
    showNotebook: false,
    downloadPDF: null,
    // New state to hold data sent from SyllabusComponent
    activeSyllabusContent: null, 
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
    setDownloadPDF: (state, action) => {
      state.downloadPDF = action.payload;
    },
    // New Action to set the syllabus content
    setActiveSyllabusContent: (state, action) => {
      state.activeSyllabusContent = action.payload;
    },
  },
});

export const { 
  setSavedResponses, 
  updateSavedResponses, 
  setShowNotebook,
  setDownloadPDF,
  setActiveSyllabusContent // Exporting the new action
} = studyToolSlice.actions;

export default studyToolSlice.reducer;