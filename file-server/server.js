//
// --- server.js (අලුත්ම Code එක) ---
//
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = 5000;

app.use(cors());

// --- Uploads Folder & Multer Setup ---
// Client ගෙ "Documents" folder එකේ path එක හොයාගමු
const docsPath = path.join(os.homedir(), 'Documents');
// ඒක ඇතුළෙ අපේ App එකට folder එකක් හදමු
const UPLOAD_DIR = path.join(docsPath, 'My PC File Hub Uploads');

// Folder එක නැත්නම්, අලුතෙන් හදමු
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// --- Setup එක ඉවරයි ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


// -----------------------------------------------------------------
// 1. API Routes (මුලින්ම API ටික දාමු)
// -----------------------------------------------------------------
app.get('/api/files', (req, res) => {
  const searchTerm = req.query.search || '';
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Files කියවන්න බෑ' });
    }
    const filteredFiles = files.filter(file =>
      file.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const fileDetails = filteredFiles.map((file) => {
      const stats = fs.statSync(path.join(UPLOAD_DIR, file));
      return { name: file, size: stats.size, isFolder: stats.isDirectory() };
    });
    res.json(fileDetails);
  });
});

app.post('/api/upload', upload.single('myFile'), (req, res) => {
  res.json({ message: 'File එක සාර්ථකව upload උනා!' });
});

app.get('/api/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(UPLOAD_DIR, fileName);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File එකක් නෑ' });
  }
});


// -----------------------------------------------------------------
// 2. React UI එක Serve කිරීම (API වලට පස්සෙ)
// -----------------------------------------------------------------
const staticFilesPath = path.join(__dirname, '../client-ui/dist');
app.use(express.static(staticFilesPath));


// -----------------------------------------------------------------
// 3. Server එක Start කිරීම (අන්තිමටම දාමු)
// -----------------------------------------------------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server එක http://localhost:${5000} හි දුවමින් පවතී...`);
  console.log(`Local Network එකේ අනිත් අයට: http://<YOUR_PC_IP>:${5000} (ipconfig ගහල IP එක බලන්න)`);
});