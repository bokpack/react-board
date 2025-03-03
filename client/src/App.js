import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkSession } from './redux/slices/userSlice';
import BoardList from './components/BoardList';
import BoardWrite from './components/BoardWrite';
import DetailBoard from './components/DetailBoard';
import { searchPosts, createBoard, deleteBoard, updateBoard } from './services/api';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import { setFilteredPosts, clearFilteredPosts, fetchPosts } from './redux/slices/postsSlice';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux 상태 가져오기
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { posts, filteredPosts, status } = useSelector((state) => state.posts);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState(""); 

  useEffect(() => {
    dispatch(checkSession());
    dispatch(fetchPosts());
  }, [dispatch]);

const loadPosts = () => {
    dispatch(fetchPosts()); // Redux에서 게시글 목록 다시 불러오기
    };

    useEffect(() => {
    // 세션 확인 및 게시글 로드
    dispatch(checkSession());
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleSearch = async (query, field) => {
    try {
        if (!field) {
            alert("검색 필드를 선택해주세요!");
            return;
        }
        if (!query || query.trim() === "") {
            alert("검색어를 입력해주세요!");
            return;
        }
        
        const response = await searchPosts(query, field);
        console.log("검색 결과:", response.data);

        dispatch(setFilteredPosts(response.data));
        setSearchQuery(query);
        setSelectedField(field);
    } catch (err) {
        console.error("검색 실패:", err);
    }
};


  const handleHomeClick = () => {
    dispatch(clearFilteredPosts()); // Redux 검색 결과 초기화
    setSearchQuery("");
    setSelectedField("");
    navigate("/board");
  };


  const handleWriteClick = () => {
    if (isAuthenticated) {
      navigate("/insert");
    } else {
      alert("글쓰기를 하려면 로그인이 필요합니다!");
      navigate("/login");
    }
  };

    const handleDelete = (id) => {
     deleteBoard(id)
       .then(() => loadPosts())
       .catch((err) => console.error("게시글 삭제 실패:", err));
   };




   const handlePostSubmit = async (id, postData, actionType) => {
    try {
        let response;
        if (actionType === "update" && id) {
            console.log("게시글 수정 요청:", id, postData);
            response = await updateBoard(id, postData); // 
        } else {
            console.log("새 글 추가됨:", postData);
            response = await createBoard(postData); // 
        }

        console.log("API 응답:", response.data);

        if (response.data.success) {
            console.log("게시글이 성공적으로 저장되었습니다.");
            dispatch(fetchPosts()); //
            navigate("/board");
        } else {
            alert(`게시글 처리 실패: ${response.data.message || "알 수 없는 오류"}`);
        }
    } catch (error) {
        console.error("게시글 처리 중 오류 발생:", error);
        alert(`게시글 처리 중 오류: ${error.response?.data?.message || error.message}`);
    }
};


const handlePostUpdate = async (id, updatedData) => {
        try {
            console.log("게시글 수정 요청:", updatedData);

            const response = await updateBoard(id, updatedData);
            console.log("수정 API 응답:", response.data);

            if (response.data.success) {
                console.log("게시글이 성공적으로 수정되었습니다.");
                dispatch(fetchPosts()); // ✅ 수정 후 게시글 목록 다시 불러오기
                navigate("/board");
            } else {
                alert(`게시글 수정 실패: ${response.data.message || "알 수 없는 오류"}`);
            }
        } catch (error) {
            console.error("게시글 수정 중 오류 발생:", error);
            alert(`게시글 수정 중 오류: ${error.response?.data?.message || error.message}`);
        }
    };



  return (
    <div className="App mx-auto p-6 py-4">
      <NavBar 
        isAuthenticated={isAuthenticated} 
        onSearch={handleSearch} 
        onHomeClick={handleHomeClick} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedField={selectedField} 
        setSelectedField={setSelectedField} 
      />
      <Routes>
        <Route path="/" element={<Navigate to="/board" replace />} />
        <Route
          path="/board"
          element={
            <div>
              <BoardList />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleWriteClick}
                  className="bg-lime-400 text-white p-2 rounded mb-4"
                >
                  글쓰기
                </button>
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/insert"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <BoardWrite posts={posts} onSubmit={handlePostSubmit} isAuthenticated={isAuthenticated} />
            </PrivateRoute>
          }
        />
        {/* 글쓰기 상세보기 */}
        <Route
          path="/detail/:id"
          element={
            <DetailBoard
              user={user}
              isAuthenticated={isAuthenticated}
              posts={posts}
              onDelete={handleDelete}
            />
          }
        />
        {/* 글쓰기 수정 */}
        <Route
          path="/update/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated} >
                <BoardWrite posts={posts} onSubmit={handlePostSubmit} isAuthenticated={isAuthenticated} />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;






// Resux 적용 전
// import './App.css';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect,  } from 'react';
// import BoardList from './components/BoardList';
// import BoardWrite from './components/BoardWrite';
// import DetailBoard from './components/DetailBoard';
// import { fetchBoardList, createBoard, deleteBoard, updateBoard, checkSession, searchPosts } from './services/api';
// import { useNavigate } from 'react-router-dom';
// import Login from './components/Login';

// import PrivateRoute from './components/PrivateRoute';
// import NavBar from './components/NavBar';
// import SignUp from './components/SignUp';

// function App() {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [sessionUser, setSessionUser] = useState(null);
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchField, setSearchField] = useState("");
  
//   useEffect(() => {
//     verifySession();
//     loadPosts();
//   }, []);

//   const verifySession = async() => {
//     try {
//       const response = await checkSession();
//       console.log("세션 확인 응담 : ", response.data)
//       setIsAuthenticated(response.data.success);
//       if(response.data.success) {
//         setSessionUser(response.data.user); // 사용자 정보 저장
//       } else {
//         setSessionUser(null);
//       }
//     } catch(err) {
//       console.error("세선 확인 실패 : ", err)
//       setIsAuthenticated(false)
//       setSessionUser(null);
//     }
//   }

//   const loadPosts = async () => {
//     try {
//       const response = await fetchBoardList();
//       setPosts(response.data);
//       setFilteredPosts(response.data); // 초기값으로 전체 게시글 표시
//     } catch (err) {
//       console.error("게시글 목록 가져오기 실패:", err);
//     }
//   };

//   const handleCreate = (data) => {
//     createBoard(data)
//       .then(() => {
//         loadPosts();
//         navigate("/")
//       })
//        .catch((err) => console.error("게시글 등록 실패:", err));
//   };

//   const handleDelete = (id) => {
//     deleteBoard(id)
//       .then(() => loadPosts())
//       .catch((err) => console.error("게시글 삭제 실패:", err));
//   };

//   const handleUpdate = (data) => {
//     const { id, title, content } = data;
//     updateBoard(id, {title, content})
//       .then(() => {
//         loadPosts();
//         navigate("/");
//       })
//       .catch((err) => console.error("게시글 수정 실패 : ", err))
//   }

//   const handleWriteClick = () => {
//     if(isAuthenticated) {
//       navigate("/insert")
//     } else {
//       alert("글쓰기를 하려면 로그인이 필요합니다!")
//       navigate("/login")
//     }
//   }

//   const handleSearch = async (query, field) => {
//     try {
//       if (!field) {
//         alert("검색 필드를 선택해주세요!");
//         return;
//       }
//       const response = await searchPosts(query, field);
//       setFilteredPosts(response.data);
//       setSearchQuery(query);
//       setSearchField(field);
//     } catch (err) {
//       console.error("검색 실패:", err);
//     }
//   };

//   return (
//     <div className="App mx-auto p-6 py-4 ">
//       <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} onSearch={handleSearch} />
//        <Routes>
//           <Route path="/" element={<Navigate to="/board" replace />}/>

//           <Route path="/board" element={
//             <div>
//               <BoardList posts={filteredPosts} loadPosts={loadPosts} searchQuery={searchQuery} searchField={searchField} onDelete={isAuthenticated ? handleDelete : null}/>
//               <div className='flex justify-end mt-4'>
//                   <button onClick={handleWriteClick} className='bg-lime-400 text-white p-2  rounded mb-4 '
//                     >글쓰기</button>
//               </div>
//             </div>
//           } />

//         {/* 로그인*/}
//           <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
//         {/* 회원가입 */}
//           <Route path='/signup' element={<SignUp />}/>
//         {/* 글쓰기 */}
//           <Route 
//               path="/insert"
//               element={
//                 <BoardWrite onSubmit={handleCreate} isAuthenticated={isAuthenticated} />
//                 } />
//         {/*게시글 상세보기*/}
//           <Route
//               path="/detail/:id"
//               element={
//                 <DetailBoard posts={posts} onDelete={isAuthenticated ? handleDelete : null} isAuthenticated={isAuthenticated} user={sessionUser} onSearch={handleSearch} />
//                   } />
//         {/* 게시글 수정 */}
//           <Route
//               path="/update/:id"
//               element={
//                 <PrivateRoute isAuthenticated={isAuthenticated}>
//                   <BoardWrite posts={posts} onSubmit={handleUpdate} isAuthenticated={isAuthenticated} />
//                 </PrivateRoute>
//                   } />
//        </Routes>
//     </div>
//   );
// }

// export default App;
  

// 컴포넌트 분리 전 코드
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
