import { AbstractObjectComponent } from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { Message } from './Message'

export interface IMessageBroker {
	SendMessage(
		component: AbstractObjectComponent,
		receiverUuid: string,
		data: any
	): number

	GetMessage(component: AbstractObjectComponent): [number, Message?]
}
