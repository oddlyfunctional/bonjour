"use client";

import { Avatar } from "@/app/components/Avatar";
import * as Icons from "@/app/components/Icons";
import { TimeAgo } from "@/app/components/TimeAgo";
import type { MemberReadModel } from "@/app/core/contexts/chat/chat";
import {
  DeliveryStatus,
  Message,
  schema,
} from "@/app/core/contexts/chat/message";
import type { UserId } from "@/app/core/core";
import { useAppDispatch, useAppSelector, useChannel } from "@/app/lib/hooks";
import { currentChatSelector } from "@/store/chatsSlice";
import { membersSelector } from "@/store/membersSlice";
import { fullMessagesSelector, messageReceived } from "@/store/messagesSlice";
import { useTranslations } from "next-intl";
import { useRef } from "react";

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
  member,
  currentUserId,
  showHeader,
}: {
  message: Message;
  member: MemberReadModel;
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
            userId={message.authorId}
            src={member.avatarUrl}
            size="sm"
            alt={member.name}
            position="absolute"
            className={`top-0 ${isSender ? "-right-10" : "-left-10"}`}
          />
          <BubbleTriangle direction={isSender ? "right" : "left"} />
          <div
            className={`px-4 py-1 font-semibold text-white ${isSender ? "bg-emerald-700" : "bg-gray-700"}`}
          >
            {member.name}
          </div>
        </>
      )}
      <div className="flex flex-col p-2">
        <div>{message.body}</div>
        <div className="mt-2 flex flex-row justify-between">
          <span className="mr-2 text-xs text-gray-500">
            <TimeAgo date={message.sentAt} />
          </span>
          <Status deliveryStatus={message.deliveryStatus} />
        </div>
      </div>
    </div>
  );
};

const renderMessages = (
  messages: Array<Message>,
  members: Record<UserId, MemberReadModel>,
  currentUserId: UserId,
) => {
  const children: Array<React.ReactNode> = [];
  messages.forEach((message, i) => {
    const member = members[message.authorId];
    if (!member) {
      console.error(
        `Couldn't find member data for user id ${message.authorId}`,
      );
      return;
    }
    children.push(
      <MessageBubble
        key={message.id}
        message={message}
        member={member}
        currentUserId={currentUserId}
        showHeader={messages[i - 1]?.authorId !== message.authorId}
      />,
    );
  });
  return children;
};

export const Messages = ({ currentUserId }: { currentUserId: UserId }) => {
  const t = useTranslations("CHAT");
  const chat = useAppSelector(currentChatSelector);
  if (!chat) throw new Error("This component cannot be used without a chat");
  const messages = useAppSelector(fullMessagesSelector);
  const members = useAppSelector(membersSelector);
  const dispatch = useAppDispatch();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  useChannel(`chat:${chat.id}`, (channel) => {
    channel.on("message", (event) => {
      const validatedMessage = schema.safeParse({
        ...event.message,
        sentAt: new Date(Date.parse(event.message.sentAt)),
      });
      if (validatedMessage.success) {
        dispatch(messageReceived(validatedMessage.data));
        chatBottomRef.current && chatBottomRef.current.scrollIntoView();
      } else {
        throw validatedMessage.error;
      }
    });
  });

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gray-200 p-4">
      {messages.length === 0 && (
        <div className="mt-4 text-center">{t("CHAT_BLANKSLATE")}</div>
      )}
      {renderMessages(messages, members.map, currentUserId)}
      <div ref={chatBottomRef} />
    </div>
  );
};
