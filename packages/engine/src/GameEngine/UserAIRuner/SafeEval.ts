import {
	AbstractController,
	AbstractControllerCommand,
	AbstractControllerData,
} from './AbstractController'

export function RunEval<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand,
	TController extends AbstractController<TInitData, TTurnData, TCommand>
>(input: string): TController {
	return eval(input)
}

//ToDo : Add function parameters` type validation
function ValidateController<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand,
	TController extends AbstractController<TInitData, TTurnData, TCommand>
>(controller: TController) {
	try {
		return (
			controller.Init != null &&
			controller.Init != undefined &&
			typeof controller.Init === 'function' &&
			controller.GetCommand != null &&
			controller.GetCommand != undefined &&
			typeof controller.GetCommand === 'function'
		)
	} catch (error) {
		alert(error)
		return false
	}
}

export function LoadControllerFromString<
	TInitData extends AbstractControllerData,
	TTurnData extends AbstractControllerData,
	TCommand extends AbstractControllerCommand,
	TController extends AbstractController<TInitData, TTurnData, TCommand>
>(input: string): TController {
	const controller = RunEval<TInitData, TTurnData, TCommand, TController>(input)
	if (!ValidateController(controller)) {
		throw 'Controller broken'
	}
	return controller
}
