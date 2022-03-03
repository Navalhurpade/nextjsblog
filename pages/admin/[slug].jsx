import React, { useContext, useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import AuthCheck from './../../components/AuthCheck';
import AuthContext from '../../lib/AuthContext';
import style from './../../styles/Admin.module.css';
import toast from 'react-hot-toast';
import Link from 'next/link';

function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManeger />
    </AuthCheck>
  );
}

const PostManeger = ({}) => {
  const [isPreview, setIsPreview] = useState(false);
  const { user, userName } = useContext(AuthContext);

  const { slug } = useRouter().query;
  const postDocRef = doc(firestore, `users/${user.uid}/posts/${slug}`);

  const [post] = useDocumentDataOnce(postDocRef);
  console.log(post);
  return (
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p> ID: {post.slug}</p>
            <PostForm postRef={postDocRef} defaultValues={post} isPreview={isPreview} />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setIsPreview(!isPreview)}>{isPreview ? 'Edit' : 'Preview'}</button>
            <Link className="btn-blue" href={`/${post.userName}/${post.slug}`}>
              Live View
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

const PostForm = ({ postRef, defaultValues, isPreview }) => {
  const {
    register,
    watch,
    formState: { isDirty, isValid, errors },
    handleSubmit,
  } = useForm({ defaultValues, mode: 'onChange' });

  const editPost = async ({ content, published }) => {
    await updateDoc(postRef, {
      published,
      content,
      updatedAt: serverTimestamp(),
    });

    toast.success('Changes saved !');
  };

  return (
    <form onSubmit={handleSubmit(editPost)}>
      {isPreview && <ReactMarkdown>{watch('content')}</ReactMarkdown>}
      <div className={style.controls}>
        <textarea
          name="content"
          {...register('content', {
            minLength: {
              value: 20,
              message: 'Content is too short.',
            },
            maxLength: {
              value: 20000,
              message: 'Content is too long.',
            },
            required: {
              value: true,
              message: 'Content is required.',
            },
          })}
        ></textarea>
        {!isValid && isDirty && errors.content && <p className="text-danger">{errors.content.message}</p>}
        <fieldset>
          <input
            type="checkbox"
            name="published"
            id="published"
            className={style.checkbox}
            {...register('published')}
          />
          <label htmlFor="published">Published</label>
        </fieldset>

        <button disabled={!isValid && isDirty} type="submit" className="btn-green">
          Save changes
        </button>
      </div>
    </form>
  );
};

export default AdminPostEdit;
