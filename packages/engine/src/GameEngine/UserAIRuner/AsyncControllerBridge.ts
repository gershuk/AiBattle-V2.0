import {
	AbstractControllerCommand,
	AbstractControllerData,
} from './AbstractController'

export interface IAsyncControllerBridge<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand
> {
	Init(info: TInitData, timeout: number): Promise<unknown>
	GetCommand(
		info: TTurnData,
		turnNumber: number,
		timeout: number
	): Promise<TCommand>
	get GetUUID(): string
}
