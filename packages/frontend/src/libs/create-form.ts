import { createEvent, createStore } from 'effector'

export const createForm = () => {
	const $formValues = createStore<{ [k: string]: any }>({})
	const setFieldValue = createEvent<{ fieldName: string; value: any }>()

	$formValues.on(setFieldValue, (formValues, { fieldName, value }) => ({
		...formValues,
		[fieldName]: value,
	}))

	return { $formValues, setFieldValue }
}
