import { useState, useEffect } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import { socket } from "@/utils/soocket";
import user1 from "../../public/user1.png";

export default function Home() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket?.emit("register");
  }, []);

  useEffect(() => {
    const recieveMessage = (message) => {
      setMessages([...messages, message]);
    };
    socket?.on("recieve-message", recieveMessage);
    socket?.on("recieve-voice", recieveMessage);

    return () => {
      socket.off("recieve-message", recieveMessage);
      socket.off("recieve-voice", recieveMessage);
    };
  });

  return (
    <div className="w-10/12  bg-white mx-auto flex h-screen">
      <div className="w-1/5 flex items-center justify-center">
        <Image src={user1} alt="Picture of the author" />
      </div>
      <div className="w-4/5 relative border border-blue-600 flex flex-col justify-between">
        <div className="h-100 relative overflow-y-auto p-5">
          {messages.map((message, i) => {
            if (message.type === "text") {
              return (
                <div
                  key={i}
                  className={`flex my-5 ${
                    socket.id == message.user ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`p-2 flex break-all ${
                      socket.id == message.user ? "bg-blue-600" : "bg-gray-700"
                    } rounded-lg text-white max-w-md`}
                  >
                    {message.message}
                  </span>
                </div>
              );
            } else {
              return (
                <div
                  key={i}
                  className={`flex my-5 ${
                    socket.id == message.user ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`p-2 flex break-all ${
                      socket.id == message.user ? "bg-blue-600" : "bg-gray-700"
                    } rounded-lg text-black max-w-md`}
                  >
                    <audio
                      controls
                      className={`${
                        socket.id == message.user
                          ? "bg-blue-600"
                          : "bg-gray-700"
                      }`}
                    >
                      <source src={message.message} type="video/webm" />
                    </audio>
                  </span>
                </div>
              );
            }
          })}
        </div>
        <Input messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
}
