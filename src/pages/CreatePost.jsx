
import React, { useState, useContext, useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import ReactQuill from 'react-quill'

import {UserContext} from '../context/userContext'
import { useNavigate} from 'react-router-dom'
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  // redirect to login page for any user who isn't logged in

  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  }, [])

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Technology", "Uncategorized"];

  // useQuill returns an object with quill and quillRef properties
  const { quill, quillRef } = useQuill({
    modules,
    formats,
    theme: 'snow', // you can specify the theme here
    placeholder: 'Write something...',
  });

  const createPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)

    try {
      const response = await axios.post("https://blogbackend-xprw.onrender.com/posts", postData,
       {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})

       if(response.status == 201){
        return navigate('/')
       }
      
      
    } catch (err) {
      setError(err.response.data.message);

      
    }


  }

  return (
    <section className='create-post'>
      <div className='container'>
        <h2>Create Post</h2>
        {error && <p className='form__error-message'>${error}</p>}
        <form className='form create-post__form' onSubmit={createPost} >
          <input type='text' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <select name='category' value={category} onChange={e => setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)
            }
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          <input type='file' onChange={e => setThumbnail(e.target.files[0])} accept='png, jpg, jpeg' />
          <button type='submit' className='btn primary'>Create</button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
