export interface Bot {
    name: string;
    controller: string;
}

export interface SceneParams {
    maxTurnIndex: number;
    animTicksCount: number;
    animTicksTime: number;
    autoTurnTime: number;
}

export interface ISubmitForm {
    bot: Bot[];
    "replay-name": string;
    sceneParams: SceneParams;
}