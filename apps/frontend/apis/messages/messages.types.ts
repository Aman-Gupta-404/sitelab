export interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export interface SendMessageType {
  message: string;
}

// export interface SendMessagePayload {
//   text: string;
//   receiverId: string;
// }
