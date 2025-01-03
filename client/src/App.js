import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect,  } from 'react';
import BoardList from './components/BoardList';
import BoardWrite from './components/BoardWrite';
import DetailBoard from './components/DetailBoard';
import { fetchBoardList, createBoard, deleteBoard, updateBoard, checkSession } from './services/api';
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';

import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';

function App() {
  const [posts, setPosts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    verifySession();
    loadPosts();
  }, []);

  const verifySession = async() => {
    try {
      const response = await checkSession();
      console.log("세션 확인 응담 : ", response.data)
      setIsAuthenticated(response.data.success);
    } catch(err) {
      console.error("세선 확인 실패 : ", err)
      setIsAuthenticated(false)
    }
  }

  const loadPosts = () => {
    fetchBoardList()
    .then((res) => setPosts(res.data))
    .catch((err) => console.error("게시글 목록 가져오기 실패 : ", err));
  };
  const handleCreate = (data) => {
    createBoard(data)
      .then(() => {
        loadPosts();
        navigate("/")
      })
       .catch((err) => console.error("게시글 등록 실패:", err));
  };

  const handleDelete = (id) => {
    deleteBoard(id)
      .then(() => loadPosts())
      .catch((err) => console.error("게시글 삭제 실패:", err));
  };

  const handleUpdate = (data) => {
    const { id, title, content } = data;
    updateBoard(id, {title, content})
      .then(() => {
        loadPosts();
        navigate("/");
      })
      .catch((err) => console.error("게시글 수정 실패 : ", err))
  }

  const handleWriteClick = () => {
    if(isAuthenticated) {
      navigate("/insert")
    } else {
      alert("글쓰기를 하려면 로그인이 필요합니다!")
      navigate("/login")
    }
  }

  return (
    <div className="App mx-auto p-6 py-4 ">
      <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
       <Routes>
          <Route path="/" element={<Navigate to="/board" replace />}/>

          <Route path="/board" element={
            <div>
              <BoardList posts={posts} onDelete={isAuthenticated ? handleDelete : null}/>
              <div className='flex justify-end mt-4'>
                  <button onClick={handleWriteClick} className='bg-blue-400 text-white p-2 border-2 rounded mb-4 hover:bg-white hover:text-blue-400 hover:border-blue-400'
                    >글쓰기</button>
              </div>
            </div>
          } />

        {/* 로그인*/}
          <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
        {/* 회원가입 */}
          <Route path='/signup' element={<SignUp />}/>
        {/* 글쓰기 */}
          <Route 
              path="/insert"
              element={
                <BoardWrite onSubmit={handleCreate} isAuthenticated={isAuthenticated} />
                } />
        {/*게시글 상세보기*/}
          <Route
              path="/detail/:id"
              element={
                <DetailBoard posts={posts} onDelete={isAuthenticated ? handleDelete : null} />
                  } />
        {/* 게시글 수정 */}
          <Route
              path="/update/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <BoardWrite posts={posts} onSubmit={handleUpdate} isAuthenticated={isAuthenticated} />
                </PrivateRoute>
                  } />
       </Routes>
    </div>
  );
}

export default App;
  

// function App() {
//   const [boardContent, setBoardContent] = useState({
//     title: '',
//     content: ''
//   });

//   const [viewContent, setViewContent] = useState([]);
//   const submitDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
//   const { id } = useParams;

//   // 글 등록 시 입력값 처리
//   const getValue = (e) => {
//     const { name, value } = e.target;
//     setBoardContent({
//       ...boardContent,
//       [name]: value
//     })
//   }

//   // 서버에서 게시글 목록 가져오기
//   const boardList = () => {
//     Axios.get('http://localhost:8000/api/get')
//         .then((res) => {
//           setViewContent(res.data);
//         })
//         .catch((err) => {
//           console.error('데이터 가져오기 실패:', err);
//         });
//   }

//   // 게시글 추가하기
//   const submit = () => {
//     Axios.post('http://localhost:8000/api/insert', {
//       title: boardContent.title,
//       content: boardContent.content,
//       date: submitDate
//     })
//         .then(() => {
//           boardList(); // 데이터가 추가된 후 목록 새로고침
//         })
//         .catch((err) => {
//           console.error('게시글 등록 실패:', err);
//         });
//   }

//   // 게시글 수정하기

//   //게시글 삭제하기
//   const boardDelete = (id) => {
//     console.log("삭제요청 ID:", id)
//     Axios.delete(`http://localhost:8000/api/delete/${id}`)
//     .then((res) => {
//       console.log("삭제된 게시글 : ",res.data);
//       boardList();
//     })
//     .catch((err) => {
//       console.log("게시글 삭제 실패 : ", err);
//     })
//   }


  

//   // 컴포넌트가 처음 렌더링될 때 게시글 목록을 가져오기
//   useEffect(() => {
//     boardList();
//   }, []); // 빈 배열([])로 설정하여 한 번만 실행되도록

//   // date 한국어 형식으로 변경
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const options = {
//       year: 'numeric',
//       month : 'long',
//       day : 'numeric',
//       hour: '2-digit',
//       minute:'2-digit',
//       second: '2-digit',
//       hour12: true
//     };
//     return date.toLocaleString('ko-KR', options)
//    }

//   return (
//       <div className="App">
//         <div className='max-w-4xl mx-auto p-6 bg-blue mb-6'>
//           <div className='flex flex-col space-y-4'>
//             <input
//                 placeholder='제목'
//                 onChange={getValue}
//                 name='title'
//                 className='border-2 border-gray-300 p-2 rounded-md w-full'

//             />
//             <input
//                 placeholder='내용'
//                 onChange={getValue}
//                 name='content'
//                 className='border-2 border-gray-300 p-2 rounded-md w-full'

//             />
//             <button onClick={submit}
//             className='bg-blue-500 text-white p-2 rounded-md '
//             >등록</button>
//           </div>
//         </div>

//         {/* {viewContent.map((i, index) => {
//             return (
//               <div key={index} className="flex justify-between p-4 shadow-md ">
//                 <div className="flex items-center mb-2 gap-6">
//                   <p className='text-lg text-gray-500'>{i.id}</p>
//                   <p className="text-lg font-semibold">{i.title}</p>
//                   <p className="text-gray-700 ">{i.content}</p>
//                 </div>

//                   <div className="flex items-center gap-1 ">
//                     <p className="text-sm text-gray-500">{formatDate(i.date)}</p>
//                     <button className=" text-gray-500 px-1  rounded-md">수정</button>
//                     <button onClick={() => {console.log("삭제요청ID:", i.id); boardDelete(i.id)} } className=" text-gray-500 px-1  rounded-md">삭제</button>
//                   </div>
//               </div>
//             )
//         })} */}

//         <table className='w-full border-collapse border '>
//           <thead>
//             <tr>
//               <th className='border border-gray-300 p-2'>번호</th>
//               <th className='border border-gray-300 p-2'>제목</th>
//               <th className='border border-gray-300 p-2'>날짜</th>
//               <th className='border border-gray-300 p-2'>수정/삭제</th>
//             </tr>
//           </thead>
//           <tbody>
//             {viewContent.map((i,index) => (
//               <tr key={index} className='text-center'>
//                 <td className='border border-gray-300'>{i.id}</td>
//                 <td className='border border-gray-300'>{i.title}</td>
//                 <td className='border border-gray-300'>{formatDate(i.date)}</td>
//                 <td className='border border-gray-300'>
//                   <button className='text-gray-500 px-1'>수정</button>
//                   <button onClick={() => {boardDelete(i.id);}} className='text-gray-500 px-1'>삭제</button>
//                 </td>
//               </tr>  
//             ))}
//           </tbody>
//         </table>
//       </div>
//   );
// }

// export default App;
