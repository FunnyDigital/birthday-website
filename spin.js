window.onload = function() {
    const gifts = [
        'Money 💸',
        'Chowdeck coupon for 5 days 🍔',
        'Spa day 🧖‍♀️',
        'TLC XXX 💖',
        'Blank Cheque 📝'
    ];
    const colors = ['#ff9a9e', '#fad0c4', '#ff6f91', '#fff6e0'];
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const resultDiv = document.getElementById('result');
    if (!wheel || !spinBtn || !resultDiv) {
        alert('Spin: Required elements not found.');
        return;
    }
    const ctx = wheel.getContext('2d');
    let spinning = false;
    let angle = 0;

    function drawWheel() {
        const num = gifts.length;
        const arc = 2 * Math.PI / num;
        for (let i = 0; i < num; i++) {
            ctx.beginPath();
            ctx.moveTo(200, 200);
            ctx.arc(200, 200, 190, arc * i + angle, arc * (i + 1) + angle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(arc * i + arc / 2 + angle);
            ctx.textAlign = 'center';
            ctx.font = 'bold 1.1rem Poppins, sans-serif';
            ctx.fillStyle = '#333';
            // Wrap Chowdeck coupon text
            if (gifts[i].startsWith('Chowdeck')) {
                ctx.fillText('Chowdeck coupon', 120, 0);
                ctx.fillText('for 5 days 🍔', 120, 22);
            } else {
                ctx.fillText(gifts[i], 120, 10);
            }
            ctx.restore();
        }
        // Draw pointer on the right
        ctx.beginPath();
        ctx.moveTo(390, 200);
        ctx.lineTo(360, 190);
        ctx.lineTo(360, 210);
        ctx.closePath();
        ctx.fillStyle = '#ff6f91';
        ctx.fill();
    }

    drawWheel();

    function spinWheel() {
        if (spinning) return;
        spinning = true;
        resultDiv.textContent = '';
        const num = gifts.length;
        const arc = 2 * Math.PI / num;
        // Pick a random segment index
        const selected = Math.floor(Math.random() * num);
        // For pointer at right (0 radians is right), so selected segment's center is at 0 radians
        let finalAngle = 2 * Math.PI - (selected * arc);
        let spinAngle = finalAngle + 8 * Math.PI; // 4 full spins
        let duration = 3200 + Math.random() * 800;
        let start = null;
        function animate(ts) {
            if (!start) start = ts;
            let elapsed = ts - start;
            let progress = Math.min(elapsed / duration, 1);
            angle = spinAngle * easeOutCubic(progress);
            ctx.clearRect(0, 0, 400, 400);
            drawWheel();
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                spinning = false;
                showResult(selected);
            }
        }
        requestAnimationFrame(animate);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function showResult(selected) {
        resultDiv.innerHTML = `<div class="prize-popup">🎉 You won:<br><span>${gifts[selected]}</span>!</div>`;
        launchConfetti();
    }

    function launchConfetti() {
        const confettiColors = ['#ff9a9e', '#fad0c4', '#ff6f91', '#fff6e0', '#ff6f91', '#fff6e0'];
        for (let i = 0; i < 40; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.animationDelay = (Math.random() * 0.7) + 's';
            conf.style.width = (Math.random() * 8 + 6) + 'px';
            conf.style.height = (Math.random() * 16 + 8) + 'px';
            conf.style.top = '-30px';
            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 2200);
        }
    }

    spinBtn.addEventListener('click', spinWheel);
};
spinBtn.addEventListener('click', spinWheel);
