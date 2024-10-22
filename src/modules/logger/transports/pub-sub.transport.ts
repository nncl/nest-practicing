import { Injectable } from "@nestjs/common";
import { LogMessage, LogTransport } from "./log.transport.interface";
import { PubSub } from "@google-cloud/pubsub";

@Injectable()
export class PubSubTransport implements LogTransport {
    private pubSubClient: PubSub;

    constructor(private projectId: string, private readonly topic: string) {
        this.pubSubClient = new PubSub({ projectId: this.projectId });
    }

    async send(message: LogMessage): Promise<void> {
        await this.pubSubClient.topic(this.topic).publishMessage({json: message});
    }    
}