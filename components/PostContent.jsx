import Link from 'next/link';
import React from 'react';
// import ReactMarkdown from 'markdown-to-jsx';
import ReactMarkdown from 'react-markdown';

function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt?.toDate();
  // let date = Date(createdAt);
  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written By
        <Link href={`/${post.userName}`}>
          <a className="text-info"> @{post.userName} </a>
        </Link>
        on {createdAt?.toDateString()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}

export default PostContent;
