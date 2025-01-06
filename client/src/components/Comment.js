import { useEffect, useState } from "react";
import { fetchComments, updateComment, addComment } from "../services/api";

const Comment = ({ postId, isAuthenticated, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24시간 형식
    });
};


  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetchComments(postId);
        setComments(response.data || []);
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
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
      const response = await addComment(postId, { content: newComment });
      const newCommentData = {
        id: response.data.commentId,
        writer: user?.name || "익명",
        content: newComment,
        date: new Date().toLocaleString("ko-KR"),
      };
      setComments([...comments, newCommentData]);
      setNewComment("");
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
    console.log("commentId : ", commentId);
    try {
      await updateComment(commentId, { content: editingContent });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: editingContent,
                date: new Date().toLocaleString("ko-KR"),
              }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditingContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정 중 오류가 발생하였습니다.");
    }
  };

  return (
    <div className="mt-6">
      <p className="text-2xl text-gray-600 p-2">댓글</p>
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={comment.id || index} className="border rounded p-2">
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
                <p className="text-gray-400 text-sm">{formatDate(comment.date)}</p>
                {isAuthenticated && user?.name === comment.writer && (
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingContent(comment.content);
                    }}
                    className="mt-2"
                  >
                    수정
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <textarea
          className="flex-1 p-2 border rounded"
          placeholder={
            isAuthenticated ? "댓글을 남겨보세요" : "로그인 후 댓글을 작성할 수 있습니다!"
          }
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
