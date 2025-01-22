import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import './App.css';

function EditorPage() {
    const { id: documentId } = useParams();
    const [value, setValue] = useState('');
    const socketRef = useRef();

    useEffect(() => {
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.emit('get-document', documentId);

    socket.on('load-document', (document) => {
      setValue(document);
    });

    socket.on('receive-changes', (delta) => {
      setValue(delta);
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId]);
    


    const modules = {
          toolbar: [
              [{ 'font': [] }, { 'size': [] }],
              [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['link', 'image', 'video'],
              ['clean']
            ]
        };

    return (
        <div className="editor-page">
      <div className="navbar">
        <div className="navbar-left">
          <h1>Untitled document</h1>
        </div>
        <div className="navbar-right">
          <button className="share-button">Share</button>
        </div>
      </div>
      <div className="toolbar-container">
        <ReactQuill value={value} modules={modules}/>
      </div>
    </div>
    )
}

export default EditorPage;