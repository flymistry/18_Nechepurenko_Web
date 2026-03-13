function saveMinionGame() {
    alert("Миньон в беде!\n\nЗлой дракон похитил миньона и запер его в одной из трёх башен. У тебя есть 3 попытки, чтобы его спасти!");    
    let secretTower = Math.floor(Math.random() * 3) + 1;
    
    let attempts = 3;
    
    while (attempts > 0) {
        alert("Осталось попыток: " + attempts);
        
        let action = prompt(
            "Что будешь делать?\n" +
            "1. Спросить у стража (он может соврать)\n" +
            "2. Подкупить стража (узнать правду, но дорого)\n" +
            "3. Пойти на штурм башни (назвать номер)\n\n" +
            "Введи номер действия (1, 2 или 3):"
        );
        
        if (action === null) {
            if (confirm("Сдаёшься? Желтый будет не в восторге.")) {
                alert("Миньончик остался в башне.");
                break;
            } else {
                continue;
            }
        }
        
        if (action.trim() === "") {
            alert("Введи цифру!");
            continue;
        }
        
        if (isNaN(action)) {
            alert("Введи цифру!");
            continue;
        }
        
        action = Number(action);
        
        if (action < 1 || action > 3) {
            alert("Только 1, 2 или 3!");
            continue;
        }
        
        if (action === 1) {
            let guardAnswer;
            
            if (Math.random() > 0.5) {
                guardAnswer = secretTower;
                alert("Страж говорит: Миньон в башне номер " + guardAnswer);
            } else {
                do {
                    guardAnswer = Math.floor(Math.random() * 3) + 1;
                } while (guardAnswer === secretTower);
                alert("Страж говорит: Миньон в башне номер " + guardAnswer);
            }
            attempts--;
            
        } else if (action === 2) {
            let bribe = confirm("Отдать стражу золотой?");
            
            if (bribe) {
                alert("Страж (шепотом): Он в башне номер " + secretTower + ", только никому не говори!");
            } else {
                alert("Страж ушёл.");
            }
            
        } else if (action === 3) {
            let guess = prompt(
                "Какую башню атакуем? (1, 2 или 3)\n\n" +
                "Но будь осторожен: если ошибешься - дракон проснётся!"
            );
            
            if (guess === null) {
                alert("Передумал? Тогда думай дальше!");
                continue;
            }
            
            if (guess.trim() === "" || isNaN(guess)) {
                alert("Нужно ввести номер башни!");
                continue;
            }
            
            guess = Number(guess);
            
            if (guess < 1 || guess > 3) {
                alert("Таких башен нет! Только 1, 2 или 3!");
                continue;
            }
            
            if (guess === secretTower) {
                let minions = ["Боб", "Кевин", "Карл", "Джерри", "Фил", "Дэйв"];
                let savedMinion = minions[Math.floor(Math.random() * minions.length)];
                
                alert("УРА! Ты спас " + savedMinion + "! Он дарит тебе банан!");
                break; 
            } else {
                attempts--;
                alert("Ты не справился! В башне " + guess + " жил дракон! Он выдохнул огонь!\nОсталось попыток: " + attempts);
                
                if (attempts === 0) {
                    let minions = ["Боб", "Кевин", "Карл", "Джерри", "Фил", "Дэйв"];
                    let lostMinion = minions[Math.floor(Math.random() * minions.length)];
                    alert(lostMinion + " остался в плену навсегда... Дракон его съел. Ты проиграл.");
                }
            }
        }
    }
    if (confirm("Хочешь спасти другого миньона?")) {
        saveMinionGame(); 
    } else {
        alert("Миньоны запомнят твой выбор. Пока!");
    }
}