const present = document.querySelector('.present');
present.onclick = () => present.classList.toggle('open');

(function () {
    'use strict';

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    let width, height, lastNow;
    let stars;
    let maxStars = 100;

    function init() {
        stars = [];
        resize();
        render(lastNow = performance.now());
    }

    function render(now) {
        requestAnimationFrame(render);

        const elapsed = now - lastNow;
        lastNow = now;

        ctx.clearRect(0, 0, width, height);
        if (stars.length < maxStars)
            stars.push(new Star());

        ctx.fillStyle = ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';

        stars.forEach(star => star.update(elapsed, now));
    }

    function pause() {
        cancelAnimationFrame(render);
    }
    
    function resume() {
        lastNow = performance.now();
        requestAnimationFrame(render);
    }

    // Функция для рисования пятиконечной звезды
    function drawStar(ctx, x, y, radius, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const r = i % 2 === 0 ? radius : radius * 0.4;
            const xPos = Math.cos(angle) * r;
            const yPos = Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(xPos, yPos);
            } else {
                ctx.lineTo(xPos, yPos);
            }
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    class Star {
        constructor() {
            this.spawn();
        }

        spawn(anyY = false) {
            this.x = rand(0, width);
            this.y = anyY === true
                ? rand(-50, height + 50)
                : rand(-50, -10);
            this.xVel = rand(-0.03, 0.03);
            this.yVel = rand(0.01, 0.06);
            this.rotation = rand(0, Math.PI * 2);
            this.rotationSpeed = rand(-0.01, 0.01);
            this.size = rand(3, 8);
            this.pulseSpeed = rand(0.01, 0.05);
            this.pulsePhase = rand(0, Math.PI * 2);
            this.alpha = rand(0.3, 0.9);
            this.twinkleSpeed = rand(0.01, 0.03);
        }

        update(elapsed, now) {
            const xForce = rand(-0.001, 0.001);

            if (Math.abs(this.xVel + xForce) < 0.05) {
                this.xVel += xForce;
            }

            this.x += this.xVel * elapsed;
            this.y += this.yVel * elapsed;
            this.rotation += this.rotationSpeed * (elapsed * 0.1);
            this.pulsePhase += this.pulseSpeed * (elapsed * 0.1);
            
            // Мерцание звезд
            this.alpha = 0.3 + Math.sin(now * this.twinkleSpeed * 0.001) * 0.4;

            if (
                this.y - this.size > height ||
                this.x + this.size < 0 ||
                this.x - this.size > width
            ) {
                this.spawn();
            }

            this.render();
        }

        render() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            // Пульсация размера
            const pulseSize = this.size * (0.8 + Math.sin(this.pulsePhase) * 0.2);
            
            drawStar(ctx, this.x, this.y, pulseSize, this.rotation);
            ctx.restore();
        }
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        maxStars = Math.max(width / 15, 80);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);
    init();
})();