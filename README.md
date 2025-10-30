# 🚀 My PC File Hub - Full-Stack Desktop App

A custom desktop application built with Electron, React, and Node.js to transfer files seamlessly between a PC and a mobile phone over a local Wi-Fi network.

This project was built as a portfolio item to demonstrate full-stack development skills, including backend API creation, frontend UI/UX, and desktop packaging.

![My PC File Hub App Screenshot](https://github.com/user-attachments/assets/0e5aa3bb-7ceb-49f6-a972-666048994edc)
*(This is a placeholder: I will help you add a real screenshot here later!)*

---

## ✨ Key Features

* **Wireless File Transfer:** Easily upload files from your phone to your PC and download files from your PC to your phone.
* **Works Offline (Local Network):** No internet connection required. All transfers happen securely over your local Wi-Fi.
* **Auto IP Detection:** The app automatically detects the PC's local IP address for easy connection.
* **Dynamic QR Code:** A unique QR code is generated on the PC app. Simply scan it with your phone to connect instantly.
* **Real-time File Search:** A live search bar to instantly filter and find files on your PC.
* **Standalone Desktop App:** Packaged into an installable `.exe` file for Windows using Electron Builder.

---

## 💻 Tech Stack (Technology Used)

This project uses a modern "Full-Stack" approach:

* **Frontend (UI):** React.js
* **Backend (Server):** Node.js, Express.js
* **Desktop App Framework:** Electron.js
* **File Uploads:** Multer
* **QR Code Generation:** `qrcode`
* **IP Detection:** `ip`
* **Installer/Builder:** Electron Builder

---

## 🧑‍💻 How to Run (For Developers)

1.  **Clone the repository:** `git clone [YOUR_REPO_URL]`
2.  **Run Backend:** `cd file-server` and `npm install`, then `npm start`
3.  **Run Frontend (for UI):** `cd client-ui` and `npm install`, then `npm run build` (to create the `dist` folder)
4.  **Run Electron App:** `cd ..` (to main folder) and `npm install`, then `npm start`
