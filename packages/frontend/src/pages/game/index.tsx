import { useMemo } from 'preact/hooks'
import { SplitPanel } from 'ui'
import { DropDown } from 'ui/dropdown'

export const Game = () => {
	const sizes = useMemo(() => {
		const width = window.innerWidth
		const r = (300 / width) * 100
		return [r, 100 - r]
	}, [])
	return (
		<div class={'controller-editor'}>
			<SplitPanel
				className={'controller-editor-split'}
				sizes={sizes}
				gutterSize={3}
				minSize={0}
				Left={
					<DropDown
						options={[
							{ id: 'kek', text: 'kek kek kek' },
							{ id: 'lol', text: 'lol lol lol' },
						]}
						onChange={x => console.log(x)}
					/>
				}
				Right={null}
			/>
		</div>
	)
}
