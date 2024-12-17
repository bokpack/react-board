import './App.css';
import { useState, useEffect } from 'react';
import Axios from "axios";
import colors from "tailwindcss/colors";

function App() {
  const [boardContent, setBoardContent] = useState({
    title: '',
    content: ''
  });

  const [viewContent, setViewContent] = useState([]);
  const submitDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // 글 등록 시 입력값 처리
  const getValue = (e) => {
    const { name, value } = e.target;
    setBoardContent({
      ...boardContent,
      [name]: value
    })
  }

  // 서버에서 게시글 목록 가져오기
  const boardUpdate = () => {
    Axios.get('http://localhost:8000/api/get')
        .then((res) => {
          setViewContent(res.data);
        })
        .catch((err) => {
          console.error('데이터 가져오기 실패:', err);
        });
  }

  // 게시글 추가하기
  const submit = () => {
    Axios.post('http://localhost:8000/api/insert', {
      title: boardContent.title,
      content: boardContent.content,
      date: submitDate
    })
        .then(() => {
          boardUpdate(); // 데이터가 추가된 후 목록 새로고침
        })
        .catch((err) => {
          console.error('게시글 등록 실패:', err);
        });
  }

  // 컴포넌트가 처음 렌더링될 때 게시글 목록을 가져오기
  useEffect(() => {
    boardUpdate();
  }, []); // 빈 배열([])로 설정하여 한 번만 실행되도록

  return (
      <div className="App">
        <div className='addListBox'>
          <input
              placeholder='제목'
              onChange={getValue}
              name='title'
          />
          <input
              placeholder='내용'
              onChange={getValue}
              name='content'
          />
          <button onClick={submit}>등록</button>
        </div>

        {viewContent.map((i, index) => {
          return (
              <div key={index} className='listBox'>
                <p>{i.index}</p>
                <p>{i.date}</p>
                <p>{i.title}</p>
                <p>{i.content}</p>
                <button className="bg-green-400 p-4">수정</button>
                <button>삭제</button>
              </div>
          )
        })}
      </div>
  );
}

export default App;
