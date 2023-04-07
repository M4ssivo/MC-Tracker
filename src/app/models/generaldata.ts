import { ServerData } from "./serverdata";
import { ServerInfo } from "./serverinfo";

export interface GeneralData {
    config: {
        graphDurationLabel: string,
        graphMaxLength: number,
        isGraphVisible: boolean,
        minecraftVersions: {
            PC: []
        },
        serverGraphMaxLength: number,
        servers: ServerInfo[],
    }
    message: string,
    mojangServices: {
        API: string,
        Auth: string,
        Sessions: string,
        Skins: string
    },
    servers: ServerData[],
    timestampPoints: number[]
}