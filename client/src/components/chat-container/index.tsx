"use client";

import ChatHeader from "../chat-header";
import MessageBar from "../message-bar";
import MessageContainer from "../message-container";

function ChatContainer() {
    return ( 
        <div className="fixed top-11 left-2  bottom-2 right-2 md:h-full md:w-full bg-gray-100 flex flex-col md:static md:flex-1 rounded-lg md:rounded-none md:rounded-r-lg ">
            <ChatHeader/>
            <MessageContainer/>
            <MessageBar />
        </div>
     );
}

export default ChatContainer;