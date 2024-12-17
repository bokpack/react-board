import './App.css';
import {useState} from 'react';
import Axios from "axios";
function App() {

  const [boardContent, setBoardContent] = useState({
    title:'',
    content:''
  });

  const [viewContent, setViewContent] = useState([]);
  const submitDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const getValue = (e) => {
    const {name, value} = e.target;
    setBoardContent({
      ...boardContent,
      [name]:value
    })
    console.log(boardContent);
  }

  const submit = () => {
    Axios.post('http://localhost:8000/api/insert', {
      title:boardContent.title,
      content:boardContent.content,
      date: submitDate
    })
  }

  return (
    <div className="App">
      <div className='addListBox'>
        <input placeholder='제목' onChange={getValue} name='title' />
        <input placeholder='내용' onChange={getValue} name='content' />
        <button onClick={submit}>등록</button>
      </div>


    {viewContent.map((i,index) => {
      return (
        <div className='listBox'>
        <p>1</p>
        <p>2024.12.11오후 03:00:00</p>
        <p>{i.title}</p>
        <p>{i.content}</p>
        <button>수정</button>
        <button>삭제</button>
      </div>
      )
    })

    }
      
    </div>
  );
}

export default App;
