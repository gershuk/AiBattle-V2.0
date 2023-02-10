import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { CodesList, EditorCode } from 'features/codes-editor'
import { SplitPanel } from 'ui'
import { $selectCode, selectedCode, changedCode } from './model'
import './styles.scss'

export const ControllerEditor = () => {
	const selectCode = useUnit($selectCode)
	const sizes = useMemo(() => {
		const width = window.innerWidth
		const r = (200 / width) * 100
		return [r, 100 - r]
	}, [])
	const handlerDragEnd = () => {
		window.dispatchEvent(new Event('resize'))
	}

	return (
		<div class={'controller-editor'}>
			<SplitPanel
				onDragEnd={handlerDragEnd}
				className={'controller-editor-split'}
				sizes={sizes}
				gutterSize={5}
				minSize={0}
				Left={
					<CodesList
						active={selectCode?.name}
						ontToggleSelect={code => selectedCode(code)}
					/>
				}
				Right={
					selectCode ? (
						<EditorCode
							active={selectCode.name}
							onSave={value => changedCode({ ...selectCode, content: value })}
						/>
					) : null
				}
			/>
		</div>
	)
}
