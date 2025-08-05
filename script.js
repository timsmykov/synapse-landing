// Particle animation script
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

const mouse = { x: null, y: null, radius: (canvas.height / 150) * (canvas.width / 150) };
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height / 150) * (canvas.width / 150));
    init();
});

class Particle {
    constructor(x, y, dX, dY, size) {
        this.x = x; 
        this.y = y; 
        this.directionX = dX; 
        this.directionY = dY; 
        this.size = size;
        this.opacity = Math.random() * 0.3 + 0.1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
        if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) { this.x += 2; }
            if (mouse.x > this.x && this.x > this.size * 10) { this.x -= 2; }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) { this.y += 2; }
            if (mouse.y > this.y && this.y > this.size * 10) { this.y -= 2; }
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let dX = (Math.random() * 0.2) - 0.1;
        let dY = (Math.random() * 0.2) - 0.1;
        particlesArray.push(new Particle(x, y, dX, dY, size));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
            if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                opacityValue = 1 - (distance / 25000);
                if (opacityValue > 0) {
                    ctx.strokeStyle = `rgba(102, 126, 234, ${opacityValue * 0.7})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();

// Pageclip form handling
document.addEventListener('DOMContentLoaded', function() {
    // Function to show thank you message
    function showThankYouMessage(form) {
        const waitlistCard = form.closest('.waitlist-card');
        
        // Hide the original form
        form.style.display = 'none';
        
        // Create thank you message
        const thankYouHTML = `
            <div class="thank-you-message show">
                <h3>🎉 Thank you for joining!</h3>
                <p>You've been successfully added to our waitlist. We'll keep you updated on Synapse's progress and notify you as soon as we're ready to launch!</p>
            </div>
        `;
        
        // Insert thank you message after the form
        form.insertAdjacentHTML('afterend', thankYouHTML);
        
        // Reset form after 5 seconds and hide thank you message
        setTimeout(() => {
            const thankYouMessage = waitlistCard.querySelector('.thank-you-message');
            if (thankYouMessage) {
                thankYouMessage.remove();
            }
            form.style.display = 'flex';
            form.reset();
        }, 5000);
    }
    
    // Handle Pageclip success events
    window.addEventListener('pageclip-success', function(event) {
        const form = event.target;
        if (form.classList.contains('pageclip-form')) {
            showThankYouMessage(form);
        }
    });
    
    // Fallback for manual form submission
    const forms = document.querySelectorAll('.pageclip-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Let Pageclip handle the submission
            // The success event will be triggered automatically
        });
    });
});
