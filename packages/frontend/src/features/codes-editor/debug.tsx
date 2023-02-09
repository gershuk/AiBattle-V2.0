import { useUnit } from 'effector-react'
import { Input } from 'ui'
import { $logs, AllLogItem, CanvasComponent } from './model'

export const Debug = () => {
	return (
		<div class={'debug-wrapper'}>
			{/* <div>
				<CanvasComponent />
			</div> */}
			<Logs />
		</div>
	)
}

const Logs = () => {
	const logs = useUnit($logs)
	return (
		<div className={'logs-wrapper'}>
			<div>
				<Input />
			</div>
			<div className={'logs-list'}>
				{logs.map(log => (
					<div className={'log-item-wrapper'} key={log.guid}>
						{log.item.map(item => (
							<LogItem log={item} />
						))}
					</div>
				))}
			</div>
			<div>
				<Input />
			</div>
		</div>
	)
}

const LogItem = ({ log }: { log: AllLogItem }) => {
	if (log.type === 'json') {
		return <span>{log.jsonString}</span>
	}
	if (log.type === 'string') {
		return <span>{log.value}</span>
	}
	if (log.type === 'number') {
		return <span>{log.value}</span>
	}
	if (log.type === 'other') {
		return <span>{log.value}</span>
	}
	return null
}
