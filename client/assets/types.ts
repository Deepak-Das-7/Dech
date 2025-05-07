export type MessageType = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

export type RawMessage = {
  _id: string;
  sender: { _id: string; username: string; email: string };
  receiver: { _id: string; username: string; email: string }[];
  content: string;
  chat: string;
  createdAt: string;
};
