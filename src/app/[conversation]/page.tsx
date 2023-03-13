import { getLoggedUserId } from "../../utils/getLoggedUserId";

import { Message } from "../../types/message";
import { Conversation } from "../../types/conversation";

import ConversationClientPage from "./client";

const getServerSideProps = async (conversationId: number) => {
  const userId = getLoggedUserId();
  const promises: [Promise<Message[]>, Promise<Conversation>] = [
    fetch(`http://localhost:3005/messages/${conversationId}`).then((resp) =>
      resp.json()
    ),
    fetch(`http://localhost:3005/conversation/${conversationId}`).then((resp) =>
      resp.json()
    ),
  ];

  const [messages, conversation] = await Promise.all(promises);

  return {
    messages,
    userId,
    conversation,
  };
};

const ConversationPage = async ({ params: { conversation } }) => {
  const props = await getServerSideProps(conversation);
  return <ConversationClientPage {...props} />;
};

export default ConversationPage;
