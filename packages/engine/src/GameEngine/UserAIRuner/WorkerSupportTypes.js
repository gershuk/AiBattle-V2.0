//When adding constants update the function GetConstants()
export const InitRequestType = 'InitRequest'
export const InitAnswerType = 'InitAnswer'
export const TurnRequestType = 'TurnRequest'
export const TurnAnswerType = 'TurnAnswer'

export const workerInitFunctionString = `function workerInitFunction() {
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
}`
