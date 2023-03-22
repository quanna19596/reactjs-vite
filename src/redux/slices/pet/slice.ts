import { createSlice } from '@reduxjs/toolkit';

const petSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    findPetById(state, action) {},
    updatePost(state, action) {},
    deletePost(state, action) {}
  }
});

console.log(postsSlice);
/*
{
    name: 'posts',
    actions : {
        createPost,
        updatePost,
        deletePost,
    },
    reducer
}
*/

const { createPost } = postsSlice.actions;
