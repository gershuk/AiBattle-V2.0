import { SceneParams } from 'api/engine'

export interface Bot {
	name: string
	controller: string
}

export interface SubmitForm {
	bot: Bot[]
	'replay-name': string
	sceneParams: SceneParams
}
