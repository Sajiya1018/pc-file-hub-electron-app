//
// 2. --- App.jsx (සම්පූර්ණ Code එක) ---
//
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import './App.css';

const API_URL = '/api'; // Production වලට '/api' විතරක් තියන්න

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [networkUrl, setNetworkUrl] = useState('');
  const canvasRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getFiles = async (term = '') => {
    try {
      const response = await axios.get(`${API_URL}/files?search=${term}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Files ගේන්න බැරි උනා 😥');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('කරුණාකර file එකක් තෝරන්න');
      return;
    }
    const formData = new FormData();
    formData.append('myFile', selectedFile);
    try {
      setMessage('Uploading... ⏳');
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      setSelectedFile(null);
      getFiles(searchTerm);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Upload එක අසාර්ථකයි!');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    getFiles(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (window.api && window.api.getIPAddress) {
      window.api.getIPAddress()
        .then(url => setNetworkUrl(url))
        .catch(err => console.error(err));
    } else {
      console.error("'window.api' පාලම හමු වුනේ නැත. preload.js බලන්න.");
    }
  }, []);

  useEffect(() => {
    if (networkUrl && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, networkUrl, (error) => {
        if (error) console.error('QR Code Error:', error);
      });
    }
  }, [networkUrl]);

  return (
    <div className="container">
      <h1>My PC File Hub 🚀</h1>

      <div className="card qr-card">
        <h2>Phone එකෙන් Connect වෙන්න</h2>
        <p>ඔබගේ දුරකථනයෙන් මේ QR Code එක Scan කරන්න:</p>
        <div className="qr-container">
          <canvas ref={canvasRef}></canvas>
        </div>
        <p className="ip-text">නැතහොත් මේ ලිපිනය Browser එකේ ගහන්න:</p>
        <strong>{networkUrl || 'IP එක සොයමින්...'}</strong>
      </div>

      <div className="card">
        <h2>File Upload කරන්න</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload කරන්න
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="card">
        <h2>PC එකේ තියෙන Files</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="File නමක් ගහලා හොයන්න..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => getFiles(searchTerm)} className="refresh-btn">🔄 Refresh</button>
        <ul className="file-list">
          {files.length === 0 && searchTerm && (
            <p>"{searchTerm}" නමින් Files කිසිවක් හමුවුයේ නැත.</p>
          )}
          {files.length === 0 && !searchTerm && (
            <p>Files කිසිවක් නැත.</p>
          )}
          {files.map((file) => (
            <li key={file.name}>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <a
                href={`${API_URL}/download/${file.name}`}
                download
                className="download-btn"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;