import React, { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import instance from '../../api/axios';

const PostList = ({
  groupData,
  isMember,
  gMRole,
  posts,
  commentsByPost,
  commentTexts,
  selectedMember,
  isModalOpen,
  closeModal,
  handleProfileClick,
  handleEdit,
  toggleMenuVisibility,
  handleEditImageUpload,
  handleSaveEdit,
  handleEditClose,
  handleDeleteComment,
  handleDeletePost,
  handleCommentChange,
  handleCommentSubmit,
  getMemberGrade,
  setCurrentPostText,
  menuVisibility,  
  editingPostId,
  currentPostText,
  isUploading,
  formatRelativeDate,
  handleKickMember,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [memberInfo, setMemberInfo] = useState('');

  const filteredPosts = posts.filter(
    (post) =>
      (post.p_no !== undefined) && // groupData 생성 메시지는 p_no가 없다고 가정
      (!searchQuery || // 검색어가 없거나
        post.p_text.toLowerCase().includes(searchQuery.toLowerCase()) || // 글 내용에 포함
        post.m_nickname?.toLowerCase().includes(searchQuery.toLowerCase())) // 작성자 닉네임에 포함
  );

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
  
  
    if (groupData.g_public === 0 && (!isMember || gMRole === 0)) {
      return (
        <div className="home_board">
          <p className="no_member">비공개 그룹입니다. 멤버만 게시글을 볼 수 있습니다.</p>
        </div>
      );
    }
    

  return (
    <div className="home_board">
      <div className="home_search">
        <input
          type="text"
          placeholder="글 내용 및 작성자를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 검색어 업데이트
        />
      </div>
      <div className="board_list">
        
        {filteredPosts.map((post) => (
          <div key={post.p_no} className="post_item">
            <div className="author_info">
              <img
                src={post.m_profile_img || `${process.env.PUBLIC_URL}/img/profile_default.png`}
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
                    <button onClick={() => handleEdit(post.p_no, post.p_text)}>수정</button>
                  )}
                  {(gMRole === 3 || post.m_no === parseInt(memberInfo.m_no)) && (
                    <button onClick={() => handleDeletePost(post.p_no)}>삭제</button>
                  )}
                  <button>신고하기</button>
                  {editingPostId && (
              <div className="edit_modal">
                <div className="edit_content">
                  <h2>게시글 수정</h2>
                  <textarea
                    value={currentPostText}
                    onChange={(e) => setCurrentPostText(e.target.value)}
                  />
                  <div className="image_upload">
                    <input type="file" onChange={handleEditImageUpload} />
                  </div>
                  {isUploading && (
                    <div className="loading-bar">
                      <div className="loading-spinner"></div>
                      <p>이미지 업로드 중입니다...</p>
                    </div>
                  )}
                  <div className="edit_buttons">
                    <button onClick={handleSaveEdit} disabled={isUploading}>
                      저장
                    </button>
                    <button onClick={handleEditClose}>취소</button>
                  </div>
                </div>
              </div>
            )}
                </div>
              )}
            </div>
            <div className="author_board">
              <p>{post.p_text}</p>
              {post.p_img && <img src={post.p_img} alt="Content" />}
            </div>
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
                        comment.m_profile_img
                          ? `${comment.m_profile_img}`
                          : `${process.env.PUBLIC_URL}/img/profile_default.png`
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
                        {comment.m_no === parseInt(memberInfo.m_no) && (
                          <span
                            className="comment_delete"
                            onClick={() => handleDeleteComment(comment.co_no, post.p_no)}
                          >
                            삭제
                          </span>
                        )}
                      </p>
                      <p className="list_comment">{comment.co_text}</p>
                      <p className="list_date">{new Date(comment.co_reg_date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    onChange={(e) => handleCommentChange(post.p_no, e.target.value)}
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
       {!searchQuery && (
          <div className="post_item">
            <div className="author_info">
              <img src={process.env.PUBLIC_URL + "/img/logo_mini.png"} alt="Logo" />
              <p className="author_nick">moim?</p>
              <p className="author_date">{formatRelativeDate(groupData.g_reg_date)}</p>
            </div>
            <div className="author_board">
              <p>{groupData.g_name}이(가) 생성 되었습니다</p>
            </div>
          </div>
        )}
        <ProfileModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={closeModal}
          g_m_role={gMRole}
          handleKickMember={handleKickMember}
        />
      </div>
    </div>
  );
};

export default PostList;
