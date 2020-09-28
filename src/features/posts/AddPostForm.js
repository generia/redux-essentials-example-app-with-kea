import React, { useState } from 'react'
import { useValues, useActions } from "kea";
import postsLogic from "./postsLogic";
import usersLogic from "../users/usersLogic";

export const AddPostForm = () => {
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const {addNewPost} = useActions(postsLogic)
  const {selectAllUsers} = useValues(usersLogic)
  const users = selectAllUsers

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  const onSavePostClicked = async () => {
    if (title && content) {
      try {
        setAddRequestStatus('pending')
        addNewPost({title: title, content: content, user: userId})

        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
        Save Post
      </button>
    </section>
  )
}
