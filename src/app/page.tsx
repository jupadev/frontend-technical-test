import styles from "./Home.module.css";
import { getLoggedUserId } from "../utils/getLoggedUserId";
import { Conversation } from "../types/conversation";
import Link from "next/link";

type Props = {
  conversations: Conversation[];
  userId: number;
  dateNow: number;
};

const getServerSideProps = async (): Promise<Props> => {
  const userId = getLoggedUserId();
  const conversations: Conversation[] = await fetch(
    `http://localhost:3005/conversations/${userId}`
  ).then((resp) => resp.json());

  return {
    conversations,
    userId,
    dateNow: Date.now(),
  };
};

const HomePage = async () => {
  const { conversations, userId, dateNow } = await getServerSideProps();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ul className={styles.conversations}>
          {conversations.map(
            ({
              id,
              senderId,
              recipientNickname,
              senderNickname,
              lastMessageTimestamp,
            }) => (
              <li key={id}>
                <Link href={`/${id}`} className={styles["conversation-item"]}>
                  <span>
                    {userId === senderId ? recipientNickname : senderNickname}
                  </span>
                  <span>
                    {new Date(dateNow - lastMessageTimestamp).toLocaleString(
                      "es-AR"
                    )}
                  </span>
                </Link>
              </li>
            )
          )}
        </ul>
      </main>
    </div>
  );
};

export default HomePage;
