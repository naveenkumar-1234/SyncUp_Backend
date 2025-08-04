import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGYzYWQ4NmI1MWY2NmQ5YzQxOGEyMCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NTQyNzg2ODIsImV4cCI6MTc1NDM2NTA4Mn0.HzQHJEBtQDdwXAaYNFzJDDAe9Hbq-OF4DEstzUWkMyQ",     
  },
  
});

socket.on("connect", () => {
  console.log("Connected!");
  
  // socket.emit("joinRoom", "general");
  
  // socket.on("roomHistory", (messages) => {
  //   console.log("Room history:", messages);
  // });
  
  // socket.on("newMessage", (message) => {
  //   console.log("New message:", message);
  // });
  
  
  setTimeout(() => {
    socket.emit("sendMessage", {
      roomId: "general",
      content: "Test"
    });
  }, 2000);
});

socket.on("error", (err) => {
  console.error("Socket error:", err);
});