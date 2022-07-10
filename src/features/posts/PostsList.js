import React, { useState } from 'react'
import {
  useGetPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../api/apiSlice'

function PostsList() {
  const [addNewPost, response] = useAddNewPostMutation()
  const [deletePost] = useDeletePostMutation()

  const [inputField, setInputField] = useState({
    id: '',
    title: '',
    body: '',
  })

  const inputsHandler = (e) => {
    setInputField((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const setPostData = (data) => {
    setInputField({
      id: data.id,
      title: data.title,
      body: data.body,
    })
  }

  const onEditData = () => {
    updatePost({
      id: inputField.id,
      title: inputField.title,
      body: inputField.body,
    })

    setInputField(() => ({
      id: '',
      title: '',
      body: '',
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { title, body } = e.target.elements

    setInputField((inputField) => ({
      ...inputField,
      [e.target.name]: e.target.value,
    }))

    let formData = {
      title: title.value,
      body: body.value,
    }

    addNewPost(formData)
      .unwrap()
      .then(() => {
        setInputField(() => ({
          id: '',
          title: '',
          body: '',
        }))
      })
      .then((error) => {
        console.log(error)
      })
  }

  const {
    data: posts,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetPostsQuery({ refetchOnMountOrArgChange: true })

  let postContent

  if (isGetLoading) {
    postContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  } else if (isGetSuccess) {
    postContent = posts.map((item) => {
      return (
        <div className="col-lg-12 mb-3" key={item.id}>
          <div className="card alert alert-secondary">
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{item.body}</p>
              <button
                onClick={() => deletePost(item.id)}
                className="btn btn-outline-danger me-2"
              >
                Remove
              </button>
              <button
                onClick={() => setPostData(item)}
                className="btn btn-outline-primary"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )
    })
  } else if (isGetError) {
    postContent = (
      <div className="alert alert-danger" role="alert">
        {getError}
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-md-4 offset-md-*">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter Title</strong>
            </label>
            <input
              value={inputField.title}
              type="text"
              className="form-control"
              name="title"
              id="title"
              onChange={inputsHandler}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter content</strong>
            </label>
            <textarea
              value={inputField.body}
              className="form-control"
              rows="3"
              name="body"
              id="body"
              onChange={inputsHandler}
            ></textarea>
          </div>

          <button className="btn btn-danger me-2" type="submit">
            Submit
          </button>
          <button
            onClick={onEditData}
            className="btn btn-primary"
            type="button"
          >
            Update
          </button>
        </form>
      </div>

      <div className="col-lg-8">
        <div className="row">{postContent}</div>
      </div>
    </div>
  )
}

export default PostsList
