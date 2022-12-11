export interface IQueue<T> {
	Enqueue(item: T): void
	Dequeue(): T | undefined
	Size(): number
}

export class Queue<T> implements IQueue<T> {
	private storage: T[] = []

	constructor(private capacity: number = Infinity) {}

	Enqueue(item: T): void {
		if (this.Size() === this.capacity) {
			throw Error('Queue has reached max capacity, you cannot add more items')
		}
		this.storage.push(item)
	}

	Dequeue(): T | undefined {
		return this.storage.shift()
	}

	Size(): number {
		return this.storage.length
	}
}
