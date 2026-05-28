const dynamicTextSpan = document.getElementById("dynamic-text");
const roles = ["Full-Stack Developer", "MCA Graduate", "Tech Innovator"];
const typingSpeed = 100;
const erasingSpeed = 50;
const newRoleDelay = 2000; 
let roleIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < roles[roleIndex].length) {
        dynamicTextSpan.textContent += roles[roleIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, newRoleDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        dynamicTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, typingSpeed + 50);
    }
}

if (dynamicTextSpan) {
    dynamicTextSpan.textContent = "";
    type();
}

// Theme Engine Configuration
const themeToggleBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (!savedTheme || savedTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggleBtn.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "light") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Dual Highlight Controller (Desktop Navbar & Mobile Bottom Dock)
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");
const dockItems = document.querySelectorAll(".mobile-bottom-dock .dock-item");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 280)) {
            current = section.getAttribute("id");
        }
    });

    // Update Desktop Nav Links
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });

    // Update Mobile Bottom Dock Active Items
    dockItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("data-target") === current) {
            item.classList.add("active");
        }
    });
});

// --- Advanced Asynchronous Form Submission Logic ---
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("form-submit-btn");

contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // UI Feedback: Show sending status to user
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Send the structured form data via POST request to the Formbold API
    fetch('https://formbold.com/s/3VKLQ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            // Formbold returns a 200 status code on clean submissions
            if (response.ok) { 
                // Success State handling
                alert(`Thank you! Your message has been sent successfully.`);
            } else {
                // API rejected error handling
                try {
                    let res = await response.json();
                    console.log(res);
                    alert(`Something went wrong: ${res.message || 'Submission failed'}`);
                } catch(e) {
                    alert("Something went wrong with the submission.");
                }
            }
        })
        .catch(error => {
            // Network failure handling
            console.log(error);
            alert("Network error. Please try again later.");
        })
        .then(function() {
            // Reset UI states after execution completion
            contactForm.reset();
            submitBtn.innerText = "Send Message";
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        });
});