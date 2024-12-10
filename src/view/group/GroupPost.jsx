import React, { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import instance from '../../api/axios';

const GroupPost = ({
  g_no,
  m_no,
  groupData,
  isMember,
  gMRole,
  formatRelativeDate,
  getMemberGrade,
  handleProfileClick,
  handleEdit,
  toggleMenuVisibility,
  handleEditImageUpload,
  handleSaveEdit,
  handleEditClose,
  handleDeletePost,
  handleDeleteComment,
  handleCommentChange,
  handleCommentSubmit,
  setCurrentPostText,
}) => {
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [menuVisibility, setMenuVisibility] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [currentPostText, setCurrentPostTextLocal] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [memberInfo, setMemberInfo] = useState('');

  // 회원 정보 가져오기
  useEffect(() => {
    instance.post('/member/getMemberInfo')
        .then(response => {
            console.log("성공적으로 사용자의 정보를 가져왔습니다.");
            setMemberInfo(response.data.memberDtos);
        })
        .catch(err => {
            console.error("사용자의 정보를 가져오는데 실패했습니다.", err);
        });
  }, []);

  useEffect(() => {
    const fetchPostsByMember = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/group/${g_no}/posts?m_no=${m_no}`
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);

        // Fetch comments for each post
        data.forEach((post) => fetchComments(post.p_no));
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    const fetchComments = async (p_no) => {
      try {
        const response = await fetch(
          `http://localhost:5000/group/${p_no}/comments`
        );
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setCommentsByPost((prev) => ({ ...prev, [p_no]: data }));
      } catch (error) {
        console.error(`Error fetching comments for post ${p_no}:`, error.message);
      }
    };

    fetchPostsByMember();
  }, [g_no, m_no]);

  if (groupData.g_public === 0 && !isMember) {
    return (
      <div className="home_board">
        <p className="no_member">비공개 그룹입니다. 멤버만 게시글을 볼 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="home_board">
      <div className="board_list">
        {posts.map((post) => (
          <div key={post.p_no} className="post_item">
            {/* Author Info */}
            <div className="author_info">
              <img
                src={
                  post.m_profile_img ||
                  `${process.env.PUBLIC_URL}/img/profile_default.png`
                }
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                }}
                onClick={() => handleProfileClick(post)}
                style={{ cursor: "pointer" }}
              />
              <p className="author_nick">
                {post.m_nickname}
                <span
                  className={`member_grade ${
                    post.g_m_role === 1
                      ? "role-normal"
                      : post.g_m_role === 2
                      ? "role-manager"
                      : post.g_m_role === 3
                      ? "role-leader"
                      : "role-unknown"
                  }`}
                >
                  {getMemberGrade(post.g_m_role)}
                </span>
              </p>
              <p className="author_date">{formatRelativeDate(post.p_reg_date)}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick={() => toggleMenuVisibility(post.p_no)}
                style={{ cursor: "pointer" }}
              >
                <circle cx="12" cy="5" r="1.5"></circle>
                <circle cx="12" cy="12" r="1.5"></circle>
                <circle cx="12" cy="19" r="1.5"></circle>
              </svg>
              {menuVisibility[post.p_no] && (
                <div className="post_menu">
                  {post.m_no === parseInt(memberInfo.m_no) && (
                    <button onClick={() => handleEdit(post.p_no, post.p_text)}>
                      수정
                    </button>
                  )}
                  {(gMRole === 3 || post.m_no === parseInt(memberInfo.m_no)) && (
                    <button onClick={() => handleDeletePost(post.p_no)}>
                      삭제
                    </button>
                  )}
                  <button>신고하기</button>
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="author_board">
              <p>{post.p_text}</p>
              {post.p_img && <img src={post.p_img} alt="Content" />}
            </div>

            {/* Comments Section */}
            {commentsByPost[post.p_no] && commentsByPost[post.p_no].length > 0 && (
              <div className="comment_list">
                <h4>
                  댓글{" "}
                  {commentsByPost[post.p_no].length > 0
                    ? `${commentsByPost[post.p_no].length}개`
                    : ""}
                </h4>
                {commentsByPost[post.p_no].map((comment) => (
                  <div key={comment.co_no} className="comment_item">
                    <img
                      src={
                        comment.m_profile_img ||
                        `${process.env.PUBLIC_URL}/img/profile_default.png`
                      }
                      alt="Profile"
                      className="comment_profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                      }}
                      onClick={() => handleProfileClick(comment)}
                      style={{ cursor: "pointer" }}
                    />
                    <div className="comment_content">
                      <p className="list_author">
                        {`${comment.m_nickname}`}
                        <span
                          className={`member_grade ${
                            comment.g_m_role === 1
                              ? "role-normal"
                              : comment.g_m_role === 2
                              ? "role-manager"
                              : comment.g_m_role === 3
                              ? "role-leader"
                              : "role-unknown"
                          }`}
                        >
                          {getMemberGrade(comment.g_m_role)}
                        </span>
                      </p>
                      <p className="list_comment">{comment.co_text}</p>
                      <p className="list_date">{new Date(comment.co_reg_date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            {isMember && gMRole !== 0 && (
              <div className="board_comment">
                <div className="comment_view">
                  <img
                    src={
                      memberInfo.m_profile_img ||
                      `${process.env.PUBLIC_URL}/img/profile_default.png`
                    }
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${process.env.PUBLIC_URL}/img/profile_default.png`;
                    }}
                  />
                  <input
                    type="text"
                    placeholder="댓글을 남겨주세요"
                    value={commentTexts[post.p_no] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.p_no, e.target.value)
                    }
                  />
                  <div
                    className="comment_button"
                    onClick={() => handleCommentSubmit(post.p_no)}
                  >
                    작성하기
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPost;
