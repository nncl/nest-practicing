import { Injectable } from "@nestjs/common";
import { LogMessage, LogTransport } from "./log.transport.interface";

@Injectable()
export class FakeTransport implements LogTransport {
    async send(message: LogMessage): Promise<void> {
        // TODO: Use winston or another layer of abstraction?
        console.log(`[Fake Transport]: ${message.level} - ${message.context} - ${message.message}`);
    }
}