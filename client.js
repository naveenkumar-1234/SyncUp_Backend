import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTAzMDVlYWQ0ZjQ5MjMxNzBjODQyNiIsInVzZXJuYW1lIjoidGVzdGVyIiwiaWF0IjoxNzU0MzA3MDAyLCJleHAiOjE3NTQzOTM0MDJ9.-Si2BmYoInDxk3GPVQenyEc98ctZxC-ZsmD946Tvby4",
  }, 
  
});

socket.on("connect", () => {
  let message=[]
  console.log("Connected!12");
  
  socket.emit("generalRoom", socket.id);
  socket.emit("gameRoom", socket.id);

  socket.emit("send","hello")

    
  socket.on("rec",(msg,username)=>{
    message.push(msg)
    console.log(message);
    

  })
  // socket.on("old",(data)=>{
  //     console.log(data); 
  // });
   
  // socket.on("roomHistory", (messages) => {
  //   console.log("Room history:", messages);
  // });
  
  // socket.on("newMessage", (message) => {
  //   console.log("New message:", message);
  // });
  
  
  // setTimeout(() => {
  //   socket.emit("sendMessage", {
  //     roomId: "general",
  //     content: "Test"
  //   });
  // }, 2000);
}
);

socket.on("error", (err) => {
  console.error("Socket error:", err);
});