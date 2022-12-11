import { AbstractObjectComponent } from 'GameEngine/BaseComponents/AbstractObjectComponent'
import { Queue } from 'Utilities'
import { Message } from './Message'

export class MessageBroker {
	private messages: { [key: string]: Queue<Message> } = {}

	public SendMessage(
		component: AbstractObjectComponent,
		receiverUuid: string,
		data: any
	): number {
		if (!this.messages[receiverUuid]) {
			this.messages[receiverUuid] = new Queue<Message>()
		}
		this.messages[receiverUuid].Enqueue(
			new Message(component.uuid, data, receiverUuid)
		)
		return this.messages[receiverUuid].Size()
	}

	public GetMessage(component: AbstractObjectComponent): [number, Message?] {
		if (!this.messages[component.uuid]) {
			return [0]
		}
		return [
			this.messages[component.uuid].Size() - 1,
			this.messages[component.uuid].Dequeue(),
		]
	}
}
