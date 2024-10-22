export enum LogLevel {
    INFO = 'info',
    ERROR = 'error',
    WARN = 'warn',
}

export type LogMessage = {
    level: LogLevel
    message: string;
    trace?: string;
    context?: string;
};

export interface LogTransport {
    send(message: LogMessage): Promise<void>;
}