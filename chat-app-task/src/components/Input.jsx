import { useRef, useState } from "react";
import { socket } from "@/utils/soocket";

const Input = ({ setMessages, messages }) => {
  const [sendedMessage, setSendedMessage] = useState("");
  const [sendedVoice, setSendedVoice] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const recorderRef = useRef();

  const handleSendedMessage = (e) => {
    setSendedMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (voiceMode) {
      recorderRef.current?.stop();
      socket?.emit("send-voice", sendedVoice);
      setMessages([
        ...messages,
        {
          message: sendedVoice,
          user: socket.id,
          type: "voice",
        },
      ]);
      setVoiceMode(false);
    } else {
      if (sendedMessage == "") return;
      socket?.emit("send-message", sendedMessage);
      setMessages([
        ...messages,
        {
          message: sendedMessage,
          user: socket.id,
          type: "text",
        },
      ]);
    }

    setSendedMessage("");
    setSendedVoice("");
  };

  const handleSendedVoice = () => {
    const device = navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    device.then((stream) => {
      setVoiceMode(true);
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (recorder.state == "recording") {
          chunks.push(e.data);
          const blob = new Blob(chunks, { type: "audio/webm" });
          setSendedVoice(URL.createObjectURL(blob));
        }
      };
      recorder.start(100);
    });
  };

  return (
    <form
      className="flex justify-between border border-white"
      onSubmit={handleSendMessage}
    >
      <input
        className="w-full px-4 py-0 outline-none border border-t-blue-600"
        placeholder="type message here"
        value={sendedMessage}
        onChange={handleSendedMessage}
      />
      {!voiceMode && (
        <button
          type="submit"
          className=" text-white bottom-0 bg-blue-600 p-4 border border-white"
          onClick={handleSendedVoice}
          id="voice"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
            fill="white"
            height={20}
            width={20}
          >
            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
          </svg>
        </button>
      )}
      {voiceMode && (
        <button
          type="submit"
          className=" text-white bottom-0 bg-blue-600 p-4 border border-white"
          id="send"
        >
          recording
        </button>
      )}
      <button
        type="submit"
        className=" text-white bottom-0 bg-blue-600 p-4 border border-white"
        id="send"
      >
        <svg height="20px" viewBox="0 0 24 24" width="20px">
          <title>Press enter to send</title>
          <path
            d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
            fill="white"
            height={20}
            width={20}
          ></path>
        </svg>
      </button>
    </form>
  );
};

export default Input;
