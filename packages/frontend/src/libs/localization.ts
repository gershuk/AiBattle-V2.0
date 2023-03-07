import {
	combine,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'
import { useUnit } from 'effector-react'
import { useCallback } from 'react'

enum Languages {
	en = 'en',
	ru = 'ru',
}

const initLanguage = (() => {
	try {
		const languageLocalStorage = localStorage.getItem('language')
		if (languageLocalStorage && languageLocalStorage in Languages) return languageLocalStorage
	} catch (_) {}
	return Languages.en
})()

const $rawLanguage = createStore<string>(initLanguage)

const $activeLanguage = $rawLanguage.map<Languages>(rawLanguage =>
	rawLanguage in Languages ? (rawLanguage as Languages) : Languages.en
)

const changeLanguage = createEvent<Languages>()

const saveLanguageToLocalStorageFx = createEffect((language: Languages) => {
	localStorage.setItem('language', language)
})

$rawLanguage.on(changeLanguage, (_, newLanguage) => newLanguage)

sample({ clock: changeLanguage, target: saveLanguageToLocalStorageFx })

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

const createGetterTranslation = <T extends TranslationItem>(scheme: T) => {
	const getter: GetterTranslation<T> = (getterText: any) => {
		if (typeof getterText === 'function') return getterText(scheme)
		return scheme[getterText]
	}
	return getter
}

const createTranslation = <L extends TranslationItem>(
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
			[schemeByActiveLanguage]
		)
		return getter
	}

	return { createGetterTranslationItem, useTranslation }
}

export { $activeLanguage, changeLanguage, Languages, createTranslation }
