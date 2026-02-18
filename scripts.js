// countdown timer
const countdownEl = document.getElementById('countdown');
// Miriam's birthday is tomorrow, Feb 19 2026
const targetDate = new Date('2026-02-19T00:00:00');
// if you want to automatically roll to next year:
// targetDate.setFullYear(new Date().getFullYear());
// if (targetDate < new Date()) targetDate.setFullYear(targetDate.getFullYear()+1);

let countdownComplete = false;

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
        countdownEl.textContent = '🎉 Today!';
        countdownComplete = true;
        const startBtn = document.getElementById('startBtn');
        startBtn.disabled = false;
        startBtn.style.cursor = 'pointer';
        startBtn.style.opacity = '1';
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Disable start button until countdown is complete
const startBtn = document.getElementById('startBtn');
startBtn.disabled = true;
startBtn.style.cursor = 'not-allowed';
startBtn.style.opacity = '0.6';

// start button scroll
startBtn.addEventListener('click', () => {
    if (!countdownComplete) {
        return; // Don't do anything if countdown is not complete
    }
    const roadmap = document.getElementById('roadmap');
    roadmap.classList.add('show');
    roadmap.classList.add('activated');
    roadmap.scrollIntoView({ behavior: 'smooth' });
});

// flip card on click (delegated later after cards are added)
function attachFlipListeners() {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            // If this is the last card, flip to reveal the link, do not open immediately
            if (idx === cards.length - 1) {
                // Only flip if not already flipped
                if (!card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                }
                // Prevent card click from opening the link directly
                e.stopPropagation();
            } else {
                card.classList.toggle('flipped');
            }
        });
        // For the last card, allow clicking the link inside the back to open spin.html
        if (idx === cards.length - 1) {
            const link = card.querySelector('.back a');
            if (link) {
                link.addEventListener('click', (ev) => {
                    ev.stopPropagation(); // Prevent card flip when clicking the link
                    window.open('spin.html', '_blank');
                });
            }
        }
    });
}

// after cards are in DOM, reveal them when they scroll into view
function observeRoadmapItems() {
    const items = document.querySelectorAll('.roadmap-item');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    items.forEach(i => observer.observe(i));
}

// floating hearts generator
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
    document.querySelector('.hearts').appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

setInterval(createHeart, 500);

// build roadmap based on assets named with date MMDDYYYY.ext (e.g., 01032025.jpg)
function buildRoadmapFromAssets() {
    // add your filenames with optional captions - Our Love Story
    const photoFiles = [
        { name: '03302024.jpg', text: 'It all began on the beach, where fate brought us together and my world changed forever.' },
        { name: '09162024.jpg', text: '🏖️ That first meeting, the sand between our toes, and the feeling that something special was starting.' },
        { name: '10122024.jpg', text: '💕 Our first date, full of laughter and nervous smiles, made me realize how much I wanted to know you.' },
        { name: '04012025.jpg', text: '💐 We kept finding reasons to spend time together, and every moment made me feel luckier than before.' },
        { name: '05052025.jpg', text: '🤝 Through misunderstandings, we put in effort to learn and understand each other. Those moments made our bond stronger.' },
        { name: '08022025.jpg', text: '🍽️ Exploring restaurants and fun places in this lagos with you made every outing an adventure. Thank you for making time for us.' },
        { name: '10302025.jpg', text: '🍂 We kept choosing each other, again and again, and loving you became the easiest thing in the world.' },
        { name: '10302025 (2).JPG', text: '✨ Every moment with you is a treasure. The gift of your books and stories showed me new worlds and made me love you even more.' },
        // Rearranged ending sequence as requested
        { name: '02122026.jpg', text: '💖 HAPPY BIRTHDAY MIRIAM !!!' },
        { name: '01072026.jpg', text: '🌟 A new year, and I am even more grateful for you. You are my favorite adventure and my safe place.' },
        { name: '01092026.jpg', text: '💫 Thank you for making time for us, for all the moments when we are just ourselves together.' },
        { name: '01172026.JPG', text: '👑 You are my best friend, my dreamer, my inspiration. I am forever grateful for your love.' },
        { name: '01242026.jpg', text: '🎉 Happy Birthday, Miriam! Thank you for filling my life with love, laughter, and unforgettable memories.' },
        { name: '01242026 (2).jpg', text: '<a href="spin.html" target="_blank" style="color:#ff6f91;text-decoration:underline;font-weight:bold;">🎁 For a surprise, click me!</a>' }
    ];

    // parse date from name: MMDDYYYY format (e.g., 01032025)
    const items = photoFiles.map(file => {
        const name = file.name;
        const match = name.match(/(\d{2})(\d{2})(\d{4})/);;
        if (!match) return null;
        const [_, m, d, y] = match;
        const dateObj = new Date(`${y}-${m}-${d}`);
        return { name, date: dateObj, text: file.text };
    }).filter(Boolean);

    items.sort((a, b) => a.date - b.date);

    const container = document.getElementById('roadmap');
    items.forEach((item, idx) => {
        let cardHtml;
        // If this is the last card, only show the clickable link, no extra text
        if (idx === items.length - 1) {
            cardHtml = `
            <div class="roadmap-item">
                <div class="memory-card">
                    <div class="front">
                        <img src="assets/${item.name}" alt="Memory ${item.date.toDateString()}" />
                        <div class="date-badge">${item.date.toLocaleDateString()}</div>
                    </div>
                    <div class="back">
                        ${item.text}
                    </div>
                </div>
            </div>`;
        } else {
            cardHtml = `
            <div class="roadmap-item">
                <div class="memory-card">
                    <div class="front">
                        <img src="assets/${item.name}" alt="Memory ${item.date.toDateString()}" />
                        <div class="date-badge">${item.date.toLocaleDateString()}</div>
                    </div>
                    <div class="back">
                        <p>${item.text}</p>
                    </div>
                </div>
            </div>`;
        }
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
    attachFlipListeners();
    observeRoadmapItems();
}

// call builder on load
buildRoadmapFromAssets();
