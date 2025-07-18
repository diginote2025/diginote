// redux/notebookSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { downloadNotebookAsPDF } from "@/utils/pdfHelpers"; // adjust path as needed

// 👇 Async thunk to be dispatched from anywhere
export const exportNotebookAsPDF = createAsyncThunk(
  "notebook/exportNotebookAsPDF",
  async (chapter, thunkAPI) => {
    await downloadNotebookAsPDF();
  }
);

const initialState = {
  savedResponses: {},
  showNotebook: false,
};

const notebookSlice = createSlice({
  name: "notebook",
  initialState,
  reducers: {
    setSavedResponses: (state, action) => {
      state.savedResponses = action.payload;
    },
    setShowNotebook: (state, action) => {
      state.showNotebook = action.payload;
    },
  },
});

export const { setSavedResponses, setShowNotebook } = notebookSlice.actions;
export default notebookSlice.reducer;
