import { useUnit } from 'effector-react'
import { CodesList, EditorCode } from 'features/codes-editor'
import { SplitPanel } from 'ui'
import { $selectCode, selectedCode, changedCode } from './model'
import './styles.scss'
import { createPanelSizeController } from 'libs'

const { $sizes, setSizes } = createPanelSizeController(200)

export const ControllerEditor = () => {
	const { selectCode, sizes } = useUnit({
		selectCode: $selectCode,
		sizes: $sizes,
	})

	const handlerDragEnd = (sizesPanel: number[]) => {
		setSizes([...sizesPanel])
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
