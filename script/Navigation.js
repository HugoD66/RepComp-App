import fetchLang from './fetch.js';
import { langData } from './template/longDataTemplate.js';
import observer from './observer.js';
import Accordeon from './Accordeon.js';
class Navigation {
    /** @type {HTMLTemplateElement} */
    template
    /** @type {HTMLPictureElement} */
    picture
    /** @type {HTMLElement} */
    latBarre
    /** @type {HTMLElement[]} */
    buttonsLang
    constructor({ templateSelector, pictureSelector, latBarreSelector, buttonsLangSelector }) {
        this.template = document.querySelector(templateSelector);
        this.picture = document.querySelector(pictureSelector);
        this.latBarre = document.querySelector(latBarreSelector);
        this.buttonsLang = Array.from(document.querySelectorAll(buttonsLangSelector));
        this.customEvent = new CustomEvent('addLiEvent');
        this.buttonsLang.forEach((button) => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button);
            });
        });
    }

    handleButtonClick(button) {
        this.latBarre.style.display = "block";
        const buttonId = button.id;
        const data = langData[buttonId];
        let dataLang = button.getAttribute('data-lang');
        if (data) {
            this.latBarre.classList.add('active');
            this.updateContent(data.contentHTML, data.imageURL);
            this.buttonsLang.forEach((otherButton) => {
                if (otherButton !== button) {
                    otherButton.classList.remove('active');
                }
            });
            const ul = document.querySelector('ul');
            ul.addEventListener('click', (event) => {
                if (event.target.tagName === 'LI') {
                    const liAttribute = event.target.getAttribute('data-content');
                    observer.broadcast({ dataLang, liAttribute });
                    const allLiElements = ul.querySelectorAll('li');
                    allLiElements.forEach((li) => {
                        li.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            });
            this.searchInput();
            button.classList.toggle('active', !button.classList.contains('active'));
            fetchLang().then(data => {
                data.forEach((el) => {
                    const ul = document.querySelector('ul')
                    const types = el.types;
                    if (dataLang === el.name) {
                        if (types && types.length > 0) {
                            types.forEach((type) => {
                                const li = document.createElement('li');
                                li.textContent = type.charAt(0).toUpperCase() + type.slice(1).replaceAll('-', ' ');
                                li.setAttribute('data-content', type);
                                ul.appendChild(li);
                            });
                        } else {
                            const p = document.createElement('p');
                            p.innerText = 'Aucun contenu disponible';
                            ul.appendChild(p);
                            const article = document.querySelector('article');
                            article.style.opacity = '0';

                        }
                    }
                });
            });
            button.dispatchEvent(this.customEvent);
        }
    }
    updateContent(contentHTML, imageURL) {
        this.template.innerHTML = contentHTML;
        if (this.picture) {
            this.picture.setAttribute('src', imageURL);
        }
    }
    searchInput() {
        const searchInput = document.getElementById("searchInput");
        if (!searchInput) {
            return;
        }
        searchInput.addEventListener("keydown", () => {
            const inputValue = searchInput.value.toLowerCase().trim();
            const ul = document.querySelector('ul');
            const allLiElements = ul.querySelectorAll('li');
            allLiElements.forEach((li) => {
                let liAttribute = li.textContent.toLowerCase();
                if (liAttribute.includes(inputValue)) {

                    li.style.display = 'block';
                } else {
                    li.style.display = 'none';
                }
            });
        });
    }
}
const navigation = new Navigation({
    templateSelector: '#lateralNav',
    pictureSelector: '.language-picture',
    latBarreSelector: '.lateral-barre',
    buttonsLangSelector: '.button-lang'
});

export default Navigation;

