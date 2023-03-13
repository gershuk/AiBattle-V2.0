import { GameObjectComponent } from 'GameEngine/BaseComponents/GameObjectComponent'
import { Message } from './Message'

export interface IMessageBroker {
	SendMessage(
		component: GameObjectComponent,
		receiverUuid: string,
		data: any
	): number

	GetMessage(component: GameObjectComponent): [number, Message?]
}
