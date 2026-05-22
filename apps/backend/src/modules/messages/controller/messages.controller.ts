import type { Request, Response } from "express";
import { MessagesService } from "../service/messages.service.js";

export class MessageController {
  private messageService: MessagesService;

  constructor() {
    this.messageService = new MessagesService();
  }

  postMessage = async (req: Request, res: Response) => {
    const data = req.body;

    const messageBody = {
      content: data.message,
    };

    // create a message
    const message = await this.messageService.createMessage(messageBody);

    // make axios api call

    res.json(message);

    // const result = await this.messageService.postMessage({
    //   message: "dummy msg",
    // });
    // console.log("Result: ", result);

    // res.json({ status: 200, result: "Check logs 1!" });
  };
}
