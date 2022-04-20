const actual = document.getElementById("actual");
const result = document.getElementById("result");
const clearNumber = document.getElementById("Backspace");
const buttons = document.getElementById("buttons");

const symbs = ['+','-','x','/','(',')'];


const buttonClickEvent = (ev) => {
    if(ev.target.classList.contains("button")){
        const button = ev.target;
        
        updateActual(button, button.dataset.type);
    }
}

buttons.addEventListener("click", buttonClickEvent);

addEventListener("keydown", ev => {
    if(ev.key === 'Backspace') clearNumber.click();
    else if(ev.key === 'Enter') updateActual(null, 'equal');
    else if(ev.key === '*') updateActual({textContent: 'x'}, 'operator')
    else {
        Array.from(buttons.children).forEach(button => {
            if(ev.key === button.textContent) {
                button.click();
            }
        })
    }
})

clearNumber.addEventListener("click", () => {
    if(result.textContent) result.textContent = '';
    if(actual.innerHTML){
        if(actual.lastChild.nodeName === '#text') {
            actual.innerHTML = actual.innerHTML.slice(0,-1);
        } else {
            actual.removeChild(actual.lastElementChild);
        }
    }
})

const updateActual = (button, type) => {
    if(type === 'number') {
        if(actual.textContent[actual.textContent.length - 1] === ')') {
            actual.innerHTML += `<op>x</op>`;
        }
        if(result.textContent) {
            actual.innerHTML = '';
            result.textContent = '';
        }
        actual.innerHTML += button.textContent;
    }
    else if(type === 'point') {
        if(!actual.textContent.includes('.')){
            if(actual.textContent[actual.textContent.length - 1] === ')') {
                actual.innerHTML += `<op>x</op>`;
            }
            if(isNaN(actual.textContent[actual.textContent.length - 1])) {
                actual.innerHTML += '0.';
            } else {
                actual.innerHTML += '.';
            }
        }
    }
    else if(type === 'operator') {
        if(result.textContent) {
            actual.innerHTML = result.textContent;
            result.textContent = '';
        }
        actual.innerHTML += `<op>${button.textContent}</op>`;
    }
    else if(type === 'parenthesis') {
        if(button.textContent === '(' && !isNaN(actual.textContent[actual.textContent.length - 1])) {
            actual.innerHTML += `<op>x${button.textContent}</op>`;
        } else {
            actual.innerHTML += `<op>${button.textContent}</op>`;
        }
    }
    else if(type === 'clear'){
        actual.innerHTML = '';
        result.innerHTML = '';
    }
    else if(type === 'equal') {
        if(!actual.textContent) return
        try {
            const op = actual.textContent.replace(/x/g,'*');
            result.textContent = eval(op).toString();
        } catch(err) {
            result.textContent = "ERROR"
        }
    }
    else if(type === 'changeSign') {
        if(!actual.textContent) actual.innerHTML = '<op>-</op>';
        else {
            let index = actual.textContent.length - 1;

            while(index !== 0) {
                if(symbs.includes(actual.textContent[index])) {
                    break;
                }
                index--;
            }
    
            if(isNaN(actual.textContent[index])) {
                let operator = '-';
    
                if(actual.textContent[index] === '+'){
                    operator = '-';
                } else if(actual.textContent[index] === '-'){
                    operator = '+';
                }
        
                const number = actual.textContent.slice(index + 1);
        
                actual.innerHTML = `${actual.innerHTML.slice(0,index)}<op>${operator}</op>${number}`;
            } else {
                actual.innerHTML = '<op>-</op>' + actual.textContent;
            }
        }
    }
        
}