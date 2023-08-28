


import Navigation from "./Navigation.js";
import observer from './observer.js';
import fetchArticle from "../lang/fetchArticle.js";
import fetchExercice from "../lang/fetchExercice.js";
class Accordion {
    article
    constructor(selector, articleSelector) {
        this.article = document.querySelector(articleSelector);
        observer.subscribe(async (data) => {
            const liAttribute = data.liAttribute;
            const dataLang = data.dataLang;
            const title = document.querySelector('h1');
            title.innerText = this.upperCaseTitle(liAttribute, '-', ' ');

            const jsonDataExercice = await fetchExercice(dataLang, liAttribute);
            const jsonData = await fetchArticle(dataLang, liAttribute);

            this.removeOldPanel();
            if (jsonData || jsonDataExercice) {
                this.updateArticleContent(jsonData);
                this.createExerciceElement(jsonDataExercice);
                this.showArticle();
            }
        });
    }

    showArticle() {
        this.article.style.opacity = '1';
    }
    removeOldPanel() {
        const oldAccordions = this.article.querySelectorAll('.accordion');
        const oldPanels = this.article.querySelectorAll('.panel');
        const oldTitles = this.article.querySelectorAll('h2');
        const oltEnonce = this.article.querySelectorAll('.exercice')
        oldAccordions.forEach((el) => {
            el.remove();
        });
        oldPanels.forEach((el) => {
            el.remove();
        });
        oldTitles.forEach((el) => {
            el.remove();
        });
        oltEnonce.forEach((el) => {
            el.remove();
        });
    }
    upperCaseTitle(str, target, replacement) {
        return str.charAt(0).toUpperCase() + str.slice(1).replaceAll(target, replacement);
    }
    createCodeElement(code, codeCounter) {
        const codeElement = document.createElement('code');
        const highlightedCode = this.highlightCode(code);
        codeElement.innerHTML = highlightedCode;
        codeElement.classList.toggle('code-template');
        const uniqueId = `${codeCounter}`;
        codeElement.setAttribute('data-code', `${uniqueId}`);

        const codeCopyButton = document.createElement('button');
        codeCopyButton.classList.toggle('code-template-button');
        codeCopyButton.innerText = 'Copier';
        codeCopyButton.addEventListener('click', () => {
            const codeElement = document.querySelector(`[data-code="${uniqueId}"]`);
            const code = codeElement.textContent;
            navigator.clipboard.writeText(code).then(() => {
                codeCopyButton.innerText = 'Copié!';
                setTimeout(() => {
                    codeCopyButton.innerText = 'Copier';
                }, 2000);
            });
        });
        codeElement.appendChild(codeCopyButton);
        return codeElement;
    }
    createExerciceElement(jsonDataExercice) {
        if (!jsonDataExercice) {
            return;
        }
        const exerciceTemplate = document.querySelector('#exerciceTemplate');
        const article = document.querySelector('article');
        let counterExercice = 1;
        let codeCounterCor = 1;

        for (const key in jsonDataExercice) {
            const clone = document.importNode(exerciceTemplate.content, true);

            const title = clone.querySelector('h2');
            title.innerText = key;
            const p = clone.querySelector('p');
            p.innerText = jsonDataExercice[key].description;
            if (jsonDataExercice[key].code) {
                const buttonEx = clone.querySelector('#accordion1');
                buttonEx.innerText = "Indice exercice " + counterExercice;
                const panelEnnonce = clone.querySelector('#panelEnnonce');
                const codeElement = document.createElement('code');
                codeElement.textContent = jsonDataExercice[key].code;
                let codeCounterExercice = 1;
                const codeContainer = this.createCodeElement(jsonDataExercice[key].code, codeCounterExercice);
                panelEnnonce.appendChild(codeContainer);
                this.setupAccordionButton(buttonEx, panelEnnonce);
            } else {
                const buttonEx = clone.querySelector('#accordion1');
                buttonEx.style.display = 'none';
            }
            if (jsonDataExercice[key].correction) {
                const buttonCor = clone.querySelector('#accordion2');
                buttonCor.innerText = "Solution " + counterExercice;
                const panelCor = clone.querySelector('#panelCorrec');
                const codeElementCor = document.createElement('code');
                codeElementCor.textContent = jsonDataExercice[key].correction;
                const codeContainerCor = this.createCodeElement(jsonDataExercice[key].correction, codeCounterCor);
                panelCor.appendChild(codeContainerCor);
                this.setupAccordionButton(buttonCor, panelCor);
            }


            article.appendChild(clone);
            counterExercice++;
            codeCounterCor++;
        }
    }


    updateArticleContent(jsonData) {
        const template = document.querySelector('#accordeonTemplate');
        const article = document.querySelector('article');
        const p = article.querySelector('.general-panel');

        if (p) {
            p.innerText = '';
        }
        let codeCounter = 0;
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                if (key === 'general') {
                    p.innerText = jsonData[key];
                    article.appendChild(p);
                    continue;
                }
                const clone = document.importNode(template.content, true);
                const button = clone.querySelector('.accordion');
                button.innerText = this.upperCaseTitle(key, '_', ' ');
                const panel = clone.querySelector('.panel');
                panel.innerText = jsonData[key].description;
                const codeElement = document.createElement('code');
                codeElement.textContent = jsonData[key].code;
                if (jsonData[key].exemple) {
                    const exempleElement = document.createElement('p');
                    exempleElement.innerText = jsonData[key].exemple;
                    panel.appendChild(exempleElement);
                }
                if (jsonData[key].code) {
                    const codeContainer = this.createCodeElement(jsonData[key].code, codeCounter);
                    panel.appendChild(codeContainer);

                }
                this.setupAccordionButton(button, panel);
                article.appendChild(clone);
                codeCounter++;
            }
        }
    }
    setupAccordionButton(button, panel) {
        button.addEventListener("click", () => {
            button.classList.toggle("active");
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                panel.style.padding = '0';
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                panel.style.padding = '20px';
            }
        });
    }
    highlightCode(code) {
        if (typeof code === 'string') {

            const regex = /\/\/[^\n]*/g;
        const highlightedCode = code.replaceAll(regex, (match) => {
            return `<span class="comment">${match}</span>`;
        });
        return highlightedCode;
        } else {
            // Gérer le cas où 'code' n'est pas une chaîne de caractères (peut-être un objet ou autre chose)
            return code;
        }
    }


}
const myAccordion = new Accordion(".accordion", "article");

export default Accordion;