//When adding constants update workerMessageTypes
const InitRequestType = 'InitRequest'
const InitAnswerType = 'InitAnswer'
const TurnRequestType = 'TurnRequest'
const TurnAnswerType = 'TurnAnswer'

export const workerMessageTypes = {
	InitRequestType,
	InitAnswerType,
	TurnRequestType,
	TurnAnswerType,
}

export function workerInitFunction() {
	//@ts-ignore
	let controller = new Controller()
	onmessage = function (event) {
		switch (event.data.type) {
			case InitRequestType:
				try {
					controller.Init(event.data.initInfo)
					this.postMessage({ type: InitAnswerType, initError: null })
				} catch (e) {
					this.postMessage({ type: InitAnswerType, initError: e })
				}
				break
			case TurnRequestType:
				try {
					let ans = controller.GetCommand(event.data.turnInfo)
					this.postMessage({
						type: TurnAnswerType,
						turnAnswer: ans,
						turnNumber: event.data.turnNumber,
					})
				} catch (e) {
					this.postMessage({
						type: TurnAnswerType,
						turnAnswer: e,
						turnNumber: event.data.turnNumber,
					})
				}
				break
			default:
				break
		}
		controller.Init()
	}
}
