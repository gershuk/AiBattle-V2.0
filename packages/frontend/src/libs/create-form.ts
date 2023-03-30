import { createEvent, createStore } from 'effector'
import { jsonToDot } from 'libs/json-to-dot'

export const createFormValuesSaver = ({
	initialValues = {},
}: {
	initialValues: { [fieldName: string]: any }
}) => {
	const $values = createStore<{ [k: string]: any }>(jsonToDot(initialValues))
	const setFieldValue = createEvent<{ fieldName: string; value: any }>()
	const setValues = createEvent<{ [fieldName: string]: any }>()

	$values.on(setFieldValue, (formValues, { fieldName, value }) => ({
		...formValues,
		[fieldName]: value,
	}))

	$values.on(setValues, (_, values) => jsonToDot(values))

	return { $values, setFieldValue, setValues }
}

// import { combine, createEvent, createStore, Store } from 'effector'
// import { AllFields } from 'ui'
// import { dotToJson } from './dot-to-json'

// export const createForm = <T = null>({
// 	$source = createStore(null as T),
// 	fieldsBuilder,
// 	initialValues,
// }: {
// 	$source?: Store<T>
// 	fieldsBuilder: (obj: {
// 		sourceValue: T
// 		values: { [fieldName: string]: any }
// 	}) => AllFields[]
// 	initialValues?: { [fieldName: string]: any }
// }) => {
// 	const $values = createStore<{ [k: string]: any }>(initialValues ?? {})
// 	const setFieldValue = createEvent<{ fieldName: string; value: any }>()

// 	const $parsedValues = $values.map(dotToJson)

// 	const $rawFields = combine($source, $values, (sourceValue, values) =>
// 		fieldsBuilder({
// 			sourceValue,
// 			values,
// 		})
// 	)

// 	const $fields = $rawFields.map(
// 		rawFields =>
// 			rawFields.map(rawField => ({
// 				...rawField,
// 				onChange: (...rest: Parameters<Required<AllFields>['onChange']>) => {
// 					//@ts-expect-error
// 					rawField?.onChange?.(...rest)
// 					setFieldValue({ fieldName: rawField.name, value: rest[0] })
// 				},
// 			})) as AllFields[]
// 	)

// 	$values.on(setFieldValue, (values, { fieldName, value }) => ({
// 		...values,
// 		[fieldName]: value,
// 	}))

// 	return { $fields, $values, $parsedValues, setFieldValue }
// }
