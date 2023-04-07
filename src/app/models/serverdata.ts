export interface ServerData {
    favicon: string,
    graphPeakData: {
        playerCount: number,
        timestamp: number
    },
    playerCount: number,
    playerCountHistory: [],
    recordData: {
        playerCount: number,
        timestamp: number
    },
    versions: []
}