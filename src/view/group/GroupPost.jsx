import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/group/group_home.css";

const GroupPosts = () => {
  const { g_no, m_no } = useParams(); // URL에서 g_no와 m_no 가져오기
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/group/${g_no}/posts/${m_no}`);
        if (!response.ok) throw new Error("게시글을 가져오지 못했습니다.");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [g_no, m_no]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <p>오류 발생: {error}</p>;
  if (posts.length === 0) return <p>작성된 게시글이 없습니다.</p>;

  return (
    <div className="group_posts">
      <h2>작성글 보기</h2>
      {posts.map((post) => (
        <div key={post.p_no} className="post_item">
          <div className="post_header">
            <img
              src={post.m_profile_img || `${process.env.PUBLIC_URL}/img/profile_default.png`}
              alt={post.m_nickname}
              className="profile_image"
            />
            <p className="post_author">{post.m_nickname}</p>
          </div>
          <h3>{post.p_text}</h3>
          {post.p_img && <img src={post.p_img} alt="Post" />}
          <p>{new Date(post.g_reg_date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupPosts;
