import { createTranslation } from 'libs'
import { ViewParams } from 'libs/tutorial'
import './style.scss'

const { getTranslationItem } = createTranslation({
	ru: {
		back: 'Назад',
		next: 'Вперёд',
		close: 'Закрыть',
	},
	en: {
		back: 'Back',
		next: 'Forward',
		close: 'Close',
	},
})


export const createTutorialPanel = ({ data, canBack, canNext, back, next, close }: ViewParams) => {
	const div = document.createElement('div')
	div.innerHTML = `
			<div class="tutorial-panel">
                <div class="header">${data?.title ? `<span class="title">${data?.title}</span>` : ''} <i class="close"></i> </div>
                <div class="body">
				    ${data.message}
                </div>
                <div class="footer">
                    ${canBack ? `<button class="back-btn button">${getTranslationItem('back')}</button>` : '<div></div>'}
                    ${canNext ? 
						`<button class="next-btn button">${getTranslationItem('next')}</button>` : 
						`<button class="done-btn button">${getTranslationItem('close')}</button>`}
                </div>
			</div>
		`
    const backBtn = div.querySelector('.back-btn') as HTMLButtonElement
    if(backBtn) backBtn.onclick = back

    const nextBtn = div.querySelector('.next-btn') as HTMLButtonElement
    if(nextBtn) nextBtn.onclick = next

	const doneBtn = div.querySelector('.done-btn') as HTMLButtonElement
    if(doneBtn) doneBtn.onclick = close

	const closeBtn = div.querySelector('.close') as HTMLElement
	if(closeBtn) closeBtn.onclick = close

    return div
}
