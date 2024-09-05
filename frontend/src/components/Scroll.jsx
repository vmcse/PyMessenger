import React, { useCallback, useEffect, useRef } from "react";

const scrollContainerStyle = {
  height: `calc(100vh - 190px)`,
  overflowY: "scroll",
};

const customScrollbarStyles = `
.scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.scroll-container::-webkit-scrollbar-corner {
  background-color: transparent;
}
`;

const Scroll = ({ children }) => {
  const scrollRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, children]);

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div
        ref={scrollRef}
        className="scroll-container"
        style={scrollContainerStyle}
      >
        {children}
      </div>
    </>
  );
};

export default Scroll;
