document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    const scrollThreshold = 100;

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add scroll effect for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // FAQ functionality
    const faqButton = document.getElementById('faqButton');
    const faqOverlay = document.getElementById('faqOverlay');
    const closeFaq = document.getElementById('closeFaq');
    const helpPrompt = document.getElementById('helpPrompt');
    const faqItems = document.querySelectorAll('.faq-item');

    // Show help prompt after 15 seconds
    setTimeout(() => {
        helpPrompt.classList.add('show');
        setTimeout(() => {
            helpPrompt.classList.remove('show');
        }, 5000); // Hide after 5 seconds
    }, 15000);

    // Toggle FAQ overlay
    faqButton.addEventListener('click', () => {
        faqOverlay.classList.add('show');
        helpPrompt.classList.remove('show');
    });

    closeFaq.addEventListener('click', () => {
        faqOverlay.classList.remove('show');
    });

    // Close FAQ when clicking outside
    faqOverlay.addEventListener('click', (e) => {
        if (e.target === faqOverlay) {
            faqOverlay.classList.remove('show');
        }
    });

    // Toggle FAQ answers
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});