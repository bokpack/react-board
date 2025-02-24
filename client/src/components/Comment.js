import { useEffect, useState } from "react";
import { fetchComments, updateComment, addComment, deleteComment } from "../services/api";

const Comment = ({ postId, isAuthenticated, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const formatDate = (dateStr) => {
    if (!dateStr) {
      console.error("Date is null or undefined:", dateStr);
      return "날짜 없음";
    }
  
    const date = new Date(dateStr);
    if (isNaN(date)) {
      console.error("Invalid date format:", dateStr);
      return "Invalid Date";
    }
  
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  
  

  useEffect(() => {
    const loadComments = async () => {
        try {
            console.log("댓글 불러오기 요청: Post ID =", postId); //  API 호출 로그 추가

            const response = await fetchComments(postId);
            console.log("댓글 API 응답:", response.data); //  응답 데이터 확인

            if (response.data.success) {
                setComments(response.data.data || []);
            } else {
                console.error("댓글 불러오기 실패 (서버 응답 오류):", response.data);
                setComments([]);
            }
        } catch (err) {
            console.error("댓글 불러오기 실패 (네트워크 또는 서버 오류):", err);
            setComments([]);
        }
    };

    loadComments();
}, [postId]);


  const handleAddComment = async () => {
    if (!newComment.trim()) {
        alert("댓글 내용을 입력해주세요");
        return;
    }
    try {
        console.log("Adding comment for Post ID:", postId);

        // 서버로 댓글 전송
        const response = await addComment(postId, { content: newComment });

        if (response.data.success) {
            // 서버에서 반환된 댓글 데이터 사용
            const newCommentData = {
                ...response.data.comment, // 서버에서 반환된 댓글 데이터
                writer: user?.name || "익명", // 작성자 이름 반영
            };

            // 기존 댓글 목록에 새 댓글 추가
            setComments([...comments, newCommentData]);
            setNewComment(""); // 입력 필드 초기화
        } else {
            alert("댓글 추가 중 오류가 발생하였습니다.");
        }
    } catch (err) {
        console.error("댓글 추가 실패:", err);
        alert("댓글 추가 중 오류가 발생하였습니다.");
    }
};

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) {
      alert("수정할 내용을 입력해주세요");
      return;
    }
    try {
      const response = await updateComment(commentId, { content: editingContent });

      if (response.data.success) {
          const updatedComment = response.data.comment; // 수정된 댓글 데이터
          setComments((prevComments) =>
              prevComments.map((comment) =>
                  comment.id === commentId
                      ? { ...comment, ...updatedComment } // 수정된 댓글 데이터로 교체
                      : comment
              )
          );
          setEditingCommentId(null);
          setEditingContent("");
      } else {
          alert("댓글 수정 중 오류가 발생하였습니다.");
      }
  } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정 중 오류가 발생하였습니다.");
  }
};
  const handleDeleteComment = async (commentId) => {
      if(!window.confirm("댓글을 삭제하시겠습니까?")) {
          return;
      }
      try {
          const response = await deleteComment(commentId);
          if(response.data.success) {
           setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId))
          } else {
              alert(response.data.message || "댓글 삭제 실패");
          }
      } catch (err) {
          console.error("댓글 삭제 실패 : ", err);
          alert("댓글 삭제 증 오류가 발생하였습니다.")
      }
  }
  return (
    <div className="mt-6">
      <p className="text-2xl text-gray-600 p-2">댓글</p>
      <div className="space-y-4">
        {/*  댓글이 존재할 경우 표시, 없으면 "댓글이 없습니다." 출력 */}
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment.id || `comment-${index}`} className="border rounded p-2">
              {console.log("댓글 id :", comment.id)}
              <p className="text-lg">{comment.writer}</p>
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border rounded"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    className="mt-2 p-2 bg-indigo-400 text-white rounded"
                  >
                    등록
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="mt-2 ml-2 p-2 bg-gray-400 text-white rounded"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <p>{comment.content}</p>
                  <p className="text-gray-400 text-sm">
                    {console.log("Date to format:", comment.date)}
                    {formatDate(comment.date)}
                  </p>
                  {isAuthenticated && user?.name === comment.writer && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingContent(comment.content);
                        }}
                        className="text-gray-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-500"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">댓글이 없습니다.</p>
        )}
      </div>

      {/*  댓글 입력창 */}
      <div className="mt-4 flex items-center gap-2">
        <textarea
          className="flex-1 p-2 border rounded"
          placeholder={isAuthenticated ? "댓글을 남겨보세요" : "로그인 후 댓글을 작성할 수 있습니다!"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isAuthenticated}
        ></textarea>
        <button
          onClick={handleAddComment}
          disabled={!isAuthenticated}
          className={`p-2 rounded bg-indigo-400 text-white ${
            !isAuthenticated && "opacity-50 cursor-not-allowed"
          }`}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default Comment;
