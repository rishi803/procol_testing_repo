import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    updateGroup: (state, action) => {
      const index = state.groups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
    deleteGroup: (state, action) => {
      state.groups = state.groups.filter(group => group.id !== action.payload);
    },
  },
});

export const { setGroups, addGroup, updateGroup, deleteGroup } = groupsSlice.actions;
export default groupsSlice.reducer;