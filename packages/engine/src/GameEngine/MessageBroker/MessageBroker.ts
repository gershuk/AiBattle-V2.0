import { GameObjectComponent } from 'GameEngine/BaseComponents/GameObjectComponent'
import { Queue } from 'Utilities'
import { IMessageBroker } from './IMessageBroker'
import { Message } from './Message'

export class MessageBroker implements IMessageBroker {
	private messages: { [key: string]: Queue<Message> } = {}

	public SendMessage(
		component: GameObjectComponent,
		receiverUuid: string,
		data: any
	): number {
		if (!this.messages[receiverUuid]) {
			this.messages[receiverUuid] = new Queue<Message>()
		}
		this.messages[receiverUuid].Enqueue(
			new Message(data, receiverUuid, component.uuid)
		)
		return this.messages[receiverUuid].Size()
	}

	public SendMessageUnsigned(receiverUuid: string, data: any): number {
		if (!this.messages[receiverUuid]) {
			this.messages[receiverUuid] = new Queue<Message>()
		}
		this.messages[receiverUuid].Enqueue(new Message(data, receiverUuid))
		return this.messages[receiverUuid].Size()
	}

	public GetMessage(component: GameObjectComponent): [number, Message?] {
		if (!this.messages[component.uuid]) {
			return [0]
		}
		return [
			this.messages[component.uuid].Size() - 1,
			this.messages[component.uuid].Dequeue(),
		]
	}
}
