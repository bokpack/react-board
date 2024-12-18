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

  // 게시글 수정하기
  

  // 컴포넌트가 처음 렌더링될 때 게시글 목록을 가져오기
  useEffect(() => {
    boardUpdate();
  }, []); // 빈 배열([])로 설정하여 한 번만 실행되도록

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {
      year: 'numeric',
      month : 'long',
      day : 'numeric',
      hour: '2-digit',
      minute:'2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleString('ko-KR', options)
   }

  return (
      <div className="App">
        <div className='max-w-4xl mx-auto p-6 bg-blue mb-6'>
          <div className='flex flex-col space-y-4'>
            <input
                placeholder='제목'
                onChange={getValue}
                name='title'
                className='border-2 border-gray-300 p-2 rounded-md w-full'

            />
            <input
                placeholder='내용'
                onChange={getValue}
                name='content'
                className='border-2 border-gray-300 p-2 rounded-md w-full'

            />
            <button onClick={submit}
            className='bg-blue-500 text-white p-2 rounded-md '
            >등록</button>
          </div>
        </div>

        {viewContent.map((i, index) => {
            return (
              <div key={index} className="flex justify-between p-4 shadow-md ">
                <div className="flex items-center mb-2 gap-6">
                  <p className='text-lg text-gray-500'>{i.id}</p>
                  <p className="text-lg font-semibold">{i.title}</p>
                  <p className="text-gray-700 ">{i.content}</p>
                </div>

                  <div className="flex items-center gap-1 ">
                    <p className="text-sm text-gray-500">{formatDate(i.date)}</p>
                    <button className=" text-gray-500 px-1  rounded-md">수정</button>
                    <button className=" text-gray-500 px-1  rounded-md">삭제</button>
                  </div>
              </div>
            )
        })}
      </div>
  );
}

export default App;
