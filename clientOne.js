import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGY0YjY4NjIxMjkyYTU1ZTc0YWYyNiIsInVzZXJuYW1lIjoicGFzcyIsImlhdCI6MTc1NDMwNzI4MSwiZXhwIjoxNzU0MzkzNjgxfQ.RzEgVFW7ccR2XJObGGzpG_1u5-dNI1oC9cEGVxUdsiA",
  },
   
}); 

socket.on("connect", () => {
  console.log("Connected!");
   
   let message=[]
  console.log("Connec");
  
  socket.emit("generalRoom", socket.id);
  socket.emit("generalRoom", socket.id);

  socket.emit("send","hello22")


  socket.on("rec",(msg,username)=>{
    message.push(msg)
    console.log(message);
    

  })

  
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