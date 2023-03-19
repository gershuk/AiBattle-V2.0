export abstract class AbstractControllerData {}

export abstract class AbstractControllerCommand {
	static GetIdleCommand(): AbstractControllerCommand {
		throw Error('Method not implemented.')
	}
}

export abstract class AbstractController<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand
> {
	abstract Init(info: TInitData): void
	abstract GetCommand(info: TTurnData): TCommand
}
