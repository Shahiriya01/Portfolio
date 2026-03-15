// Custom Cursor Logic
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener('mousemove', function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add a slight delay for the outline for a smooth trailing effect
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Mobile menu toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Interactive Background Canvas - Particle Network
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resizing
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Draw particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // Update position
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Initialize Particle Array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = 'rgba(0, 245, 255, 0.2)'; // Primary color faint
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Draw connecting lines between close particles
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/10) * (canvas.height/10)) {
                opacityValue = 1 - (distance/20000);
                // Line styling
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.2})`; // Secondary color very faint
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

init();
animateParticles();

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// --- Skills Spider Web Graph ---
function initSpiderWeb() {
    const container = document.getElementById('spider-web');
    const canvas = document.getElementById('skills-canvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set up canvas size
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    // Radius distances for hierarchy
    // Utilizing the newly increased container height to physically spread the nodes farther apart
    const categoryRadius = Math.min(width, height) * 0.22;
    const subNodeRadius = Math.min(width, height) * 0.44;

    // Position Center Node
    const centerNode = container.querySelector('.center-node');
    centerNode.style.left = `${centerX}px`;
    centerNode.style.top = `${centerY}px`;

    const categories = Array.from(container.querySelectorAll('.category-node'));
    const allConnections = []; // to store pairs of coordinates for ctx drawing

    // Distribute categories evenly in a circle
    categories.forEach((catNode, index) => {
        const angle = (index / categories.length) * (Math.PI * 2) - Math.PI / 2;
        
        const catX = centerX + categoryRadius * Math.cos(angle);
        const catY = centerY + categoryRadius * Math.sin(angle);

        catNode.style.left = `${catX}px`;
        catNode.style.top = `${catY}px`;

        // Draw connection from center to category
        allConnections.push({
            startX: centerX, startY: centerY,
            endX: catX, endY: catY,
            color: 'rgba(0, 245, 255, 0.4)' // primary glowing color for main spokes
        });

        // Find sub nodes for this category
        const catId = catNode.getAttribute('data-id');
        const subNodes = Array.from(container.querySelectorAll(`.sub-node[data-parent="${catId}"]`));

        // Distribute sub nodes in an arc relative to the category angle
        // Decrease from Math.PI / 2 to (Math.PI / 2.5) leaves some padding gap between categories
        const arcSpread = Math.PI / 2.5; 
        
        subNodes.forEach((subNode, subIndex) => {
            // Calculate angle offset for this specific sub node
            let subAngle = angle;
            if (subNodes.length > 1) {
                const spreadSpacing = arcSpread / (subNodes.length - 1);
                subAngle = angle - (arcSpread/2) + (spreadSpacing * subIndex);
            }

            const subX = centerX + subNodeRadius * Math.cos(subAngle);
            const subY = centerY + subNodeRadius * Math.sin(subAngle);

            subNode.style.left = `${subX}px`;
            subNode.style.top = `${subY}px`;

            // Connection from category to sub node
            allConnections.push({
                startX: catX, startY: catY,
                endX: subX, endY: subY,
                color: 'rgba(139, 92, 246, 0.2)' // secondary faint color for outer web
            });
            
            // Connect adjacent subnodes together to form web loops
            if(subIndex > 0) {
                 const prevSubAngle = angle - (arcSpread/2) + ((arcSpread / (subNodes.length - 1)) * (subIndex - 1));
                 const prevSubX = centerX + subNodeRadius * Math.cos(prevSubAngle);
                 const prevSubY = centerY + subNodeRadius * Math.sin(prevSubAngle);
                 
                 allConnections.push({
                    startX: prevSubX, startY: prevSubY,
                    endX: subX, endY: subY,
                    color: 'rgba(255, 255, 255, 0.05)' // very faint web strand
                });
            }
        });
        
        // Connect category to category for inner web ring
        if(index > 0) {
            const prevAngle = ((index - 1) / categories.length) * (Math.PI * 2) - Math.PI / 2;
            const prevCatX = centerX + categoryRadius * Math.cos(prevAngle);
            const prevCatY = centerY + categoryRadius * Math.sin(prevAngle);
            
             allConnections.push({
                startX: prevCatX, startY: prevCatY,
                endX: catX, endY: catY,
                color: 'rgba(0, 245, 255, 0.15)' 
            });
        }
    });
    
    // Close the inner ring
    if(categories.length > 1) {
         const firstAngle = -Math.PI / 2;
         const firstCatX = centerX + categoryRadius * Math.cos(firstAngle);
         const firstCatY = centerY + categoryRadius * Math.sin(firstAngle);
         
         const lastAngle = ((categories.length - 1) / categories.length) * (Math.PI * 2) - Math.PI / 2;
         const lastCatX = centerX + categoryRadius * Math.cos(lastAngle);
         const lastCatY = centerY + categoryRadius * Math.sin(lastAngle);
         
          allConnections.push({
            startX: lastCatX, startY: lastCatY,
            endX: firstCatX, endY: firstCatY,
            color: 'rgba(0, 245, 255, 0.15)' 
        });
    }

    // Draw all calculated lines on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allConnections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.startX, conn.startY);
        ctx.lineTo(conn.endX, conn.endY);
        ctx.strokeStyle = conn.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Add tiny glowing nodes at intersections for tech effect
        ctx.beginPath();
        ctx.arc(conn.endX, conn.endY, 2, 0, Math.PI*2);
        ctx.fillStyle = conn.color === 'rgba(0, 245, 255, 0.4)' ? 'rgba(0, 245, 255, 0.8)' : 'rgba(139, 92, 246, 0.5)';
        ctx.fill();
    });
}

// Handle resizing elegantly
window.addEventListener('load', initSpiderWeb);
window.addEventListener('resize', initSpiderWeb);
