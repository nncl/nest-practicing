export interface IPubSubService {
  publishLog(topic: string, message: any): Promise<void>;
}
