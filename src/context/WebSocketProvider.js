// import React, { useState, useCallback, useContext, useEffect } from "react";
// import { useLocation } from 'react-router-dom';


// const WebSocketContext = React.createContext(null);

// export const useWebSocket = () => {
//   return useContext(WebSocketContext);
// };

// export const WebSocketProvider = ({ children }) => {
//   const [websocket, setWebsocket] = useState(null);

//   const connectToWebSocket = useCallback(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token || (websocket && websocket.readyState === WebSocket.OPEN)) {
//         return;
//       }
//     console.log("Token used for WebSocket:", token);
//     const ws = new WebSocket(
//       `wss://ip-91-227-40-30-92919.vps.hosted-by-mvps.net/api/ws?token=${token}`
//     );

//     console.log("ws-Provider", ws);

//     ws.onopen = () => {
//         console.log("Connected to the WebSocket");
//         localStorage.setItem("websocket_connected", "true");
    
//       };

//     ws.onerror = (error) => {
//       console.error("WebSocket Error:", error);
//     };

//     ws.onclose = (event) => {
//       if (event.wasClean) {
//         console.log(
//           `Closed cleanly, code=${event.code}, reason=${event.reason}`
//         );
//       } else {
//         console.error("Connection died");
//       }
//     };


//     setWebsocket(ws);
//   }, [websocket]);

//   const location = useLocation();

// useEffect(() => {
//   connectToWebSocket();

//   return () => {
//     if (websocket) {
//       websocket.close();
//     }
//   };
// }, [location, connectToWebSocket]);

//   return (
//     <WebSocketContext.Provider value={{ websocket, connectToWebSocket }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export default WebSocketContext;
