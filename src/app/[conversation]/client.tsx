"use client";

import { FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Message } from "../../types/message";
import { User } from "../../types/user";
import { Conversation } from "../../types/conversation";
import styles from "./conversation.module.css";
import { useQuery } from "@tanstack/react-query";

type Props = {
  messages: Message[];
  userId: User["id"];
  conversation: Conversation;
};

const ConversationClientPage = ({
  messages: initialMessages,
  userId,
  conversation,
}: Props): ReactElement => {
  const [message, setMessage] = useState("");
  const messageBottomRef = useRef<HTMLLIElement | null>(null);

  const {
    isError,
    data: messages,
    error,
  } = useQuery<Props["messages"], Error>({
    queryKey: [`messages${conversation.id}`],
    queryFn: () =>
      fetch(`http://localhost:3005/messages/${conversation.id}`).then((resp) =>
        resp.json()
      ),
    refetchInterval: 3000,
    initialData: initialMessages,
  });

  useEffect(() => {
    messageBottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const handelSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:3005/messages/${conversation.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: message,
        authorId: userId,
        conversationId: conversation.id,
        timestamp: 0,
      }),
    });
    setMessage("");
  };

  return (
    <div className={styles.container}>
      <main>
        <div>
          {conversation.recipientId === userId && conversation.senderNickname}
          {conversation.senderId === userId && conversation.recipientNickname}
        </div>
        <ul className={styles.messages}>
          {messages.map(({ id, body, authorId }, index) => {
            const isSender = authorId === userId;
            const isLastMessage = index === messages.length - 1;
            return (
              <li
                key={id}
                className={`${
                  isSender ? styles["message-sender"] : styles["message-recipt"]
                } ${styles.message}`}
                {...(isLastMessage && { ref: messageBottomRef })}
              >
                {body}
              </li>
            );
          })}
        </ul>
        <form className={styles.form} onSubmit={handelSubmit}>
          <input
            type="text"
            className={styles.textbox}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            type="submit"
            className={styles.submit}
            {...(!Boolean(message) && { disabled: true })}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default ConversationClientPage;
