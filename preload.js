// preload.js

const { contextBridge, ipcRenderer } = require('electron');

// React App එකට ("window" එකට) "api" කියලා අලුත් function set එකක්
// ආරක්ෂිතව "expose" කරනවා
contextBridge.exposeInMainWorld('api', {
  
  // React App එකට window.api.getIPAddress() කියලා call කරන්න පුළුවන්
  getIPAddress: () => ipcRenderer.invoke('get-ip-address') 
  
});