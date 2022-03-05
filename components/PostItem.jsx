import Link from 'next/link';
import React from 'react';
import AuthCheck from './AuthCheck';

function PostItem({ post, linkToAdmin }) {
  //native methad to calc word count and read timestamp
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.userName}`}>
        <a>
          <strong>By @{post.userName}</strong>
        </a>
      </Link>

      <Link href={linkToAdmin ? `admin/${post.slug}` : `/${post.userName}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>❤️ {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
}

export default PostItem;
