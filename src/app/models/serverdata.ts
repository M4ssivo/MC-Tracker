export interface ServerData {
    server_id: number
    error: string
    favicon: string,
    graphPeakData: {
        playerCount: number,
        timestamp: number
    },
    playerCount: number,
    playerCountHistory: number[],
    recordData: {
        playerCount: number,
        timestamp: number
    },
    versions: []
}