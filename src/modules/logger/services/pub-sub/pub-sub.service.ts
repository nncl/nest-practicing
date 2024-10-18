import { Injectable } from '@nestjs/common';
import { IPubSubService } from '../../dto/pub-sub';
import { PubSub } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';

const PROJECT_ID_KEY = 'PUBSUB_PROJECT_ID';

@Injectable()
export class PubSubService implements IPubSubService {
  private pubsub: PubSub;

  constructor(private readonly configService: ConfigService) {
    this.pubsub = new PubSub({
      projectId: this.configService.get(PROJECT_ID_KEY),
    });
  }

  async publishLog(topic: string, message: any): Promise<void> {
    const dataBuffer = Buffer.from(JSON.stringify(message));
    await this.pubsub.topic(topic).publish(dataBuffer);
  }
}
