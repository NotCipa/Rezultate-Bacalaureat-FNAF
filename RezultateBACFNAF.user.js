// ==UserScript==
// @name         Rezultate BAC FNAF
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Un userscript pentru a-ți vedea media generală la BAC ca scorul în FNAF Ultimate Custom Night
// @match        https://bacalaureat.edu.ro/RezultateCautare.aspx*
// @grant        none
// @author       NotCipa
// @license      Apache v2
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Get the grade
    const table = document.querySelector('.mainTable');
    const row = table.querySelector('tr.tr1');
 
    const data = [...row.querySelectorAll('td')]
        .map(cell => cell.textContent.trim());
 
    const nota = Number(data[17]);
 
 
    // Black screen
    const box = document.createElement('div');
 
    box.style.position = 'fixed';
    box.style.top = '0';
    box.style.left = '0';
    box.style.width = '100vw';
    box.style.height = '100vh';
    box.style.backgroundColor = 'black';
    box.style.zIndex = '2147483647';
 
    document.body.appendChild(box);
 
 
    // Assets
    const base =
        'https://github.com/NotCipa/Rezultate-Bacalaureat-FNAF/raw/refs/heads/main/assets/';
 
    const gifUrls = {
        GreatJob: base + 'GreatJob.gif',
        Fantastic: base + 'Fantastic.gif',
        Amazing: base + 'Amazing.gif',
        Stupendous: base + 'Stupendous.gif',
        Perfect: base + 'Perfect.gif',
        Unbeatable: base + 'Unbeatable.gif'
    };
 
 
    // Preload GIFs
    Object.values(gifUrls).forEach(url => {
        const image = new Image();
        image.src = url;
    });
 
 
    // Choose music
    let musicFile;
 
    if (nota >= 7.50) {
        musicFile = base + 'Unbeatable.wav';
    } else {
        musicFile = base + 'Stupendous.wav';
    }
 
    const music = new Audio(musicFile);
    music.preload = 'auto';
 
 
    // Choose jingle
    let jingleFile;
 
    if (nota >= 9.50) {
        jingleFile = base + 'UnbeatableJingle.wav';
    } else if (nota >= 9.00) {
        jingleFile = base + 'StupendousJingle.wav';
    } else if (nota >= 8.00) {
        jingleFile = base + 'AmazingJingle.wav';
    } else if (nota >= 7.00) {
        jingleFile = base + 'FantasticJingle.wav';
    } else {
        jingleFile = base + 'GreatJobJingle.wav';
    }
 
    const jingle = new Audio(jingleFile);
    jingle.preload = 'auto';
 
 
    // Score
    function StartScore() {
        let score = 0;
 
        const gif = document.createElement('img');
 
        gif.style.position = 'absolute';
        gif.style.left = '50%';
        gif.style.top = '38%';
        gif.style.transform = 'translate(-50%, -50%)';
        gif.style.objectFit = 'contain';
 
        gif.src = gifUrls.GreatJob;
 
        box.appendChild(gif);
 
 
        const scoreText = document.createElement('div');
 
        scoreText.style.position = 'absolute';
        scoreText.style.left = '50%';
        scoreText.style.top = '50%';
        scoreText.style.transform = 'translate(-50%, -50%)';
 
        scoreText.style.color = 'white';
        scoreText.style.fontSize = '100px';
        scoreText.style.fontFamily = 'Consolas';
        scoreText.style.fontWeight = 'bold';
 
        scoreText.textContent = '0.00';
 
        box.appendChild(scoreText);
 
 
        // High score text
        const highScoreText = document.createElement('div');
 
        highScoreText.textContent = 'New high score!';
 
        highScoreText.style.position = 'absolute';
        highScoreText.style.left = '50%';
        highScoreText.style.top = '57%';
        highScoreText.style.transform = 'translate(-50%, -50%)';
 
        highScoreText.style.color = 'white';
        highScoreText.style.fontSize = '40px';
        highScoreText.style.fontFamily = 'Comic Sans MS';
 
        box.appendChild(highScoreText);
 
 
        // Blinking
        const style = document.createElement('style');
 
        style.textContent = `
            @keyframes blink {
                0%, 49% {
                    opacity: 1;
                }
 
                50%, 100% {
                    opacity: 0;
                }
            }
        `;
 
        document.head.appendChild(style);
 
        highScoreText.style.animation = 'blink 0.5s infinite';
 
 
        let currentGif = 'GreatJob';
 
 
        function ChangeGif(name) {
            if (currentGif === name) {
                return;
            }
 
            currentGif = name;
            gif.src = gifUrls[name];
        }
 
 
        // Count up
        const timer = setInterval(() => {
 
            score += 0.01;
 
            scoreText.textContent = score.toFixed(2);
 
 
            if (score >= 9.50) {
                ChangeGif('Unbeatable');
            } else if (score >= 9.00) {
                ChangeGif('Perfect');
            } else if (score >= 8.00) {
                ChangeGif('Stupendous');
            } else if (score >= 7.00) {
                ChangeGif('Amazing');
            } else if (score >= 6.00) {
                ChangeGif('Fantastic');
            }
 
 
            if (score >= nota) {
                score = nota;
                scoreText.textContent = score.toFixed(2);
 
                clearInterval(timer);
 
                highScoreText.style.animation = 'none';
                highScoreText.style.opacity = '1';
 
                FinishMusic();
                ShowContinueButton();
            }
 
        }, 45);
    }
 
 
    // You did it!
    function ShowYouDidIt() {
        const style = document.createElement('style');
 
        style.textContent = `
            @keyframes youDidIt {
                0% {
                    opacity: 0;
                    top: 55%;
                }
 
                100% {
                    opacity: 1;
                    top: 50%;
                }
            }
        `;
 
        document.head.appendChild(style);
 
 
        const message = document.createElement('div');
 
        message.textContent = 'You did it!';
 
        message.style.position = 'absolute';
        message.style.left = '50%';
        message.style.top = '55%';
        message.style.transform = 'translate(-50%, -50%)';
 
        message.style.opacity = '0';
        message.style.color = 'white';
        message.style.fontSize = '50px';
        message.style.fontFamily = 'Comic Sans MS';
 
        message.style.animation =
            'youDidIt 3s ease-out 1s forwards';
 
        box.appendChild(message);
 
 
        setTimeout(() => {
            message.remove();
            StartScore();
        }, 5000);
    }
 
 
    // Close button
    function ShowContinueButton() {
        const button = document.createElement('button');
 
        button.textContent = 'Pagina Normală';
 
        button.style.position = 'absolute';
        button.style.left = '50%';
        button.style.top = '70%';
        button.style.transform = 'translate(-50%, -50%)';
 
        button.style.color = 'white';
        button.style.backgroundColor = 'black';
 
        button.style.border = '2px solid white';
        button.style.padding = '10px 25px';
 
        button.style.fontSize = '25px';
        button.style.fontFamily = 'Consolas';
        button.style.fontWeight = 'bold';
 
        button.style.cursor = 'pointer';
 
        box.appendChild(button);
 
        button.addEventListener('click', () => {
            box.remove();
        });
    }
 
 
    // Finish music
    function FinishMusic() {
        music.pause();
        music.currentTime = 0;
 
        jingle.currentTime = 0;
 
        jingle.play().catch(() => {});
    }
 
 
    // Start screen
    const startText = document.createElement('div');
 
    startText.textContent = 'PRESS TO START';
 
    startText.style.position = 'absolute';
    startText.style.left = '50%';
    startText.style.top = '50%';
    startText.style.transform = 'translate(-50%, -50%)';
 
    startText.style.color = 'white';
    startText.style.fontSize = '40px';
    startText.style.fontFamily = 'Consolas';
    startText.style.fontWeight = 'bold';
    startText.style.cursor = 'pointer';
 
    box.appendChild(startText);
 
 
    // Wait for click
    box.addEventListener('click', () => {
 
        startText.remove();
 
        music.currentTime = 0;
 
        music.play().catch(() => {});
 
        ShowYouDidIt();
 
    }, { once: true });
 
})();