// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all content cards and letter
document.querySelectorAll('.content-card, .letter, .cake-container').forEach(el => {
    observer.observe(el);
});

// Audio recognition for candle blowing
let mediaRecorder;
let audioContext;
let analyser;
let dataArray;
let isListening = false;
let candlesBlown = false;

const blowBtn = document.getElementById('blowBtn');
const volumeBar = document.getElementById('volumeBar');
const flames = document.querySelectorAll('.flame');

blowBtn.addEventListener('click', toggleListening);

async function toggleListening() {
    if (!isListening) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startListening(stream);
        } catch (err) {
            alert('Please allow microphone access to blow out the candles!');
        }
    } else {
        stopListening();
    }
}

function startListening(stream) {
    isListening = true;
    blowBtn.textContent = '🎤 Listening... Blow now!';
    blowBtn.classList.add('listening');

    // Create audio context and analyser
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // Start monitoring audio levels
    monitorAudio();

    // Store stream for cleanup
    blowBtn.stream = stream;
}

function stopListening() {
    isListening = false;
    blowBtn.textContent = '🎤 Blow Out the Candles!';
    blowBtn.classList.remove('listening');
    
    if (blowBtn.stream) {
        blowBtn.stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close();
    }
}

function monitorAudio() {
    if (!isListening) return;

    analyser.getByteFrequencyData(dataArray);
    
    // Calculate volume level
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const volume = (average / 255) * 100;

    // Update volume bar
    volumeBar.style.width = volume + '%';

    // Check if volume is high enough (blowing sound)
    if (volume > 20 && !candlesBlown) {
        blowOutCandles();
    }

    // Continue monitoring
    requestAnimationFrame(monitorAudio);
}

function blowOutCandles() {
    candlesBlown = true;
    
    // Blow out candles with delay
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add('blown');
        }, index * 200);
    });

    // Show wish message
    setTimeout(() => {
        const wishMessage = document.createElement('div');
        wishMessage.className = 'wish-message';
        wishMessage.textContent = '✨ Make a Wish! ✨';
        document.querySelector('.cake-section').appendChild(wishMessage);
        
        // Stop listening
        setTimeout(() => {
            stopListening();
        }, 2000);
    }, 1000);
}

// Floating hearts animation
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '♥';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 3 + 's';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    document.getElementById('hearts').appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Create hearts periodically
setInterval(createHeart, 2000);

// Smooth scrolling for better experience
document.documentElement.style.scrollBehavior = 'smooth';