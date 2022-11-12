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
