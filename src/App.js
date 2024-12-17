import './App.css';
import {useState} from 'react';
function App() {

  const [boardContent, setBoardContent] = useState({
    title:'',
    content:''
  });

  const [viewContent, setViewContent] = useState([]);

  const getValue = (e) => {
    const {name, value} = e.target;
    setBoardContent({
      ...boardContent,
      [name]:value
    })
    console.log(boardContent);
  }

  const submit = () => {
    setViewContent(viewContent.concat({...boardContent}))
    console.log(viewContent)
  }

  return (
    <div className="App">
      <div className='addListBox'>
        <input placeholder='제목' onChange={getValue} name='title' />
        <input placeholder='내용' onChange={getValue} name='content' />
        <button onClick={submit}>등록</button>
      </div>

      <div className='listBox'>
        <p>1</p>
        <p>2024.12.11오후 03:00:00</p>
        <p>제목입니다</p>
        <p>내용</p>
        <button>수정</button>
        <button>삭제</button>
      </div>
    </div>
  );
}

export default App;
