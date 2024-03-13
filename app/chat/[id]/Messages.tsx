"use client";

import { Avatar } from "@/app/components/Avatar";
import * as Icons from "@/app/components/Icons";
import { TimeAgo } from "@/app/components/TimeAgo";
import type { DeliveryStatus, Message } from "@/app/core/contexts/chat/message";
import type { UserId } from "@/app/core/core";
import { useEffect, useRef } from "react";

const Status = ({ deliveryStatus }: { deliveryStatus: DeliveryStatus }) => {
  switch (deliveryStatus) {
    case "Pending":
      return <Icons.Circle />;
    case "Sent":
      return <Icons.Check />;
    case "Seen":
      return <Icons.CheckDouble />;
  }
};

const BubbleTriangle = ({ direction }: { direction: "left" | "right" }) => {
  switch (direction) {
    case "left":
      return (
        <div className="absolute -left-2 top-0 h-0 w-0 border-b-8 border-r-8 border-r-gray-700"></div>
      );
    case "right":
      return (
        <div className="absolute -right-2 top-0 h-0 w-0 border-b-8 border-l-8 border-l-emerald-700"></div>
      );
  }
};

const MessageBubble = ({
  message,
  currentUserId,
  showHeader,
}: {
  message: Message;
  currentUserId: UserId;
  showHeader: boolean;
}) => {
  const isSender = message.authorId === currentUserId;
  return (
    <div
      className={`relative mt-4 flex max-w-[50%] flex-col rounded ${isSender ? "mr-10 place-self-end bg-green-100" : "ml-10 bg-gray-300"}`}
    >
      {showHeader && (
        <>
          <Avatar
            size="sm"
            alt={"User name"}
            position="absolute"
            className={`top-0 ${isSender ? "-right-10" : "-left-10"}`}
          />
          <BubbleTriangle direction={isSender ? "right" : "left"} />
          <div
            className={`px-4 py-1 font-semibold text-white ${isSender ? "bg-emerald-700" : "bg-gray-700"}`}
          >
            User name
          </div>
        </>
      )}
      <div className="flex flex-col p-2">
        <div>{message.body}</div>
        <div className="mt-2 flex flex-row justify-between">
          <span className="mr-2 text-xs text-gray-500">
            <TimeAgo
              date={message.sentAt}
              minDiffInMinutes={10}
              maxDiffInMinutes={60 * 24}
            />
          </span>
          <Status deliveryStatus={message.deliveryStatus} />
        </div>
      </div>
    </div>
  );
};

const renderMessages = (messages: Array<Message>, currentUserId: UserId) => {
  const children: Array<React.ReactNode> = [];
  messages.forEach((message, i) => {
    children.push(
      <MessageBubble
        key={message.id}
        message={message}
        currentUserId={currentUserId}
        showHeader={messages[i - 1]?.authorId !== message.authorId}
      />,
    );
  });
  return children;
};

export const Messages = ({
  messages,
  currentUserId,
}: {
  messages: Array<Message>;
  currentUserId: UserId;
}) => {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatBottomRef.current && chatBottomRef.current.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-200 p-4">
      {messages.length === 0 && (
        <div className="mt-4 text-center">
          It's empty here, why not send the first message?
        </div>
      )}
      {renderMessages(messages, currentUserId)}
      <div ref={chatBottomRef} />
    </div>
  );
};