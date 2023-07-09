export type RedisMessage = {
    sender: string;
    text: string;
    timestamp: number;
    roomId: string;
};
