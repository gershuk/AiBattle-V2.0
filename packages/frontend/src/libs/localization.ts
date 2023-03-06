import { combine, createStore } from 'effector'
import { useUnit } from 'effector-react'
import { useCallback } from 'react'

enum Languages {
	en = 'en',
	ru = 'ru',
}

const $rawLanguage = createStore<Languages>(Languages.en)

export const $activeLanguage = $rawLanguage.map(rawLanguage =>
	rawLanguage === Languages.ru ? Languages.ru : Languages.en
)

interface TranslationItem {
	[k: string]: string | number | TranslationItem
}

type Translation<T extends TranslationItem> = {
	[key in Languages]?: T
}

type GetterTranslation<T> = {
	<G>(param: (scheme: T) => G): G
	<G extends keyof T>(param: G): T[G]
}

export const createGetterTranslation = <T extends TranslationItem>(
	scheme: T
) => {
	const getter: GetterTranslation<T> = (getterText: any) => {
		if (typeof getterText === 'function') return getterText(scheme)
		return scheme[getterText]
	}
	return getter
}

export const createTranslation = <L extends TranslationItem>(
	scheme: Translation<L>
) => {
	const $scheme = createStore(scheme)
	const $schemeByActiveLanguage = combine(
		$scheme,
		$activeLanguage,
		(scheme, activeLanguage) => scheme[activeLanguage] as L
	)

	const createGetterTranslationItem = () =>
		createGetterTranslation($schemeByActiveLanguage.getState())

	const useTranslation = () => {
		const schemeByActiveLanguage = useUnit($schemeByActiveLanguage)
		const getter = useCallback(
			createGetterTranslation(schemeByActiveLanguage),
			[scheme]
		)
		return getter
	}

	return { createGetterTranslationItem, useTranslation }
}
