import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import {useActions} from "kea";
import { useAccessors } from "../../runtime";

import postsLogic from "./postsLogic";

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const {postUpdated} = useActions(postsLogic)
  const {selectPostById} = useAccessors(postsLogic)
  const post = selectPostById(postId)

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const history = useHistory()

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
      postUpdated({ id: postId, title: title, content: content })
      history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label>Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label>Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}
