// JavaScript for The Simple Diner

document.addEventListener("DOMContentLoaded", () => {
    // --- Initialize Theme Toggle ---
    initTheme();

    // --- Initialize Mobile Navigation ---
    initMobileNav();

    // --- Initialize Category Filters ---
    initCategoryFilters();

    // --- Initialize Review Slider ---
    initReviewSlider();

    // --- Initialize Reservation Modal ---
    initReservationModal();

    // --- Initialize Scroll Animations & Navigation Tracking ---
    initScrollEffects();
});

/* ==========================================================================
   Theme Toggle System
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById("themeToggle");
    if (!themeToggleBtn) return;

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add("dark-theme");
    } else {
        document.documentElement.classList.remove("dark-theme");
    }

    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

/* ==========================================================================
   Mobile Navigation Menu Drawer
   ========================================================================== */
function initMobileNav() {
    const mobileNavToggle = document.getElementById("mobileNavToggle");
    const mainNav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll("nav a");

    if (!mobileNavToggle || !mainNav) return;

    mobileNavToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = mainNav.classList.toggle("active");
        
        // Update hamburger icon visual state if wanted (here using simple text toggles)
        if (isOpen) {
            mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>'; // Close icon
        } else {
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Hamburger icon
        }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("active");
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        if (!mainNav.contains(event.target) && event.target !== mobileNavToggle) {
            mainNav.classList.remove("active");
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

/* ==========================================================================
   Menu Category Filters
   ========================================================================== */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".menu-grid .card");

    if (filterButtons.length === 0 || cards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active state from current button
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Add active to clicked button
            button.classList.add("active");

            const selectedFilter = button.getAttribute("data-filter");

            cards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                
                // Add fade out animation state
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
                
                setTimeout(() => {
                    if (selectedFilter === "all" || cardCategory === selectedFilter) {
                        card.classList.remove("hidden");
                        // Trigger reflow to restart animation/opacity
                        void card.offsetWidth;
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    } else {
                        card.classList.add("hidden");
                    }
                }, 300); // Matches transition duration
            });
        });
    });
}

/* ==========================================================================
   Reviews Testimonial Slider / Carousel
   ========================================================================== */
function initReviewSlider() {
    const sliderTrack = document.getElementById("sliderTrack");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".slider-control.prev");
    const nextBtn = document.querySelector(".slider-control.next");
    const dotsContainer = document.getElementById("sliderDots");

    if (slides.length === 0 || !sliderTrack) return;

    let currentIndex = 0;
    let autoPlayTimer;

    // Create pagination dots
    slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function goToSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // Translate the slider track
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active class on slides for fade effects
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        // Update active dot
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Set up control click handlers
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    // Auto Play logic
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // Initialize state & start auto rotation
    goToSlide(0);
    startAutoPlay();
}

/* ==========================================================================
   Reservation Booking Dialog Modal & Form Validation
   ========================================================================== */
function initReservationModal() {
    const reservationModal = document.getElementById("reservationModal");
    const openBtns = document.querySelectorAll(".btn-open-booking");
    const closeBtn = document.getElementById("closeModal");
    const bookingForm = document.getElementById("bookingForm");
    const bookingSuccess = document.getElementById("bookingSuccess");
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");

    if (!reservationModal) return;

    // Open Modal Handlers
    openBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Set minimum date to today
            const dateInput = document.getElementById("bookDate");
            if (dateInput) {
                const today = new Date().toISOString().split("T")[0];
                dateInput.setAttribute("min", today);
            }

            // Reset modal states
            if (bookingForm) bookingForm.style.display = "flex";
            if (bookingSuccess) bookingSuccess.style.display = "none";
            
            reservationModal.classList.add("active");
            document.body.style.overflow = "hidden"; // Lock scroll
        });
    });

    // Close Modal Handlers
    const closeModalElements = [closeBtn, closeSuccessBtn];
    closeModalElements.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                reservationModal.classList.remove("active");
                document.body.style.overflow = ""; // Restore scroll
            });
        }
    });

    // Close modal on overlay click
    const overlay = reservationModal.querySelector(".modal-overlay");
    if (overlay) {
        overlay.addEventListener("click", () => {
            reservationModal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    // Validation & Submit handlers
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            if (validateBookingForm()) {
                const name = document.getElementById("bookName").value;
                const email = document.getElementById("bookEmail").value;
                const date = document.getElementById("bookDate").value;
                const time = document.getElementById("bookTime").value;
                const guests = document.getElementById("bookGuests").value;

                // Create random booking code
                const bookingCode = "DINER-" + Math.floor(100000 + Math.random() * 900000);

                // Populate Summary Elements
                document.getElementById("sumCode").textContent = bookingCode;
                document.getElementById("sumName").textContent = name;
                document.getElementById("sumEmail").textContent = email;
                document.getElementById("sumDate").textContent = formatDateString(date);
                document.getElementById("sumTime").textContent = formatTimeString(time);
                document.getElementById("sumGuests").textContent = guests + (guests == 1 ? " Guest" : " Guests");

                // Switch visible components inside modal
                bookingForm.style.display = "none";
                bookingSuccess.style.display = "flex";
                
                // Reset form inputs
                bookingForm.reset();
            }
        });
    }

    // Helper functions for validating fields
    function validateBookingForm() {
        let isValid = true;

        const nameInput = document.getElementById("bookName");
        const emailInput = document.getElementById("bookEmail");
        const dateInput = document.getElementById("bookDate");
        const timeInput = document.getElementById("bookTime");
        const guestsInput = document.getElementById("bookGuests");

        // Validate Name
        if (nameInput.value.trim() === "") {
            setError(nameInput, "Please enter your name");
            isValid = false;
        } else {
            clearError(nameInput);
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            setError(emailInput, "Please enter a valid email address");
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // Validate Date
        if (dateInput.value === "") {
            setError(dateInput, "Please select a date");
            isValid = false;
        } else {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (selectedDate < today) {
                setError(dateInput, "Booking date cannot be in the past");
                isValid = false;
            } else {
                clearError(dateInput);
            }
        }

        // Validate Time
        if (timeInput.value === "") {
            setError(timeInput, "Please select a time");
            isValid = false;
        } else {
            clearError(timeInput);
        }

        // Validate Guests
        if (guestsInput.value < 1 || guestsInput.value > 12) {
            setError(guestsInput, "Table sizes are between 1 and 12 guests");
            isValid = false;
        } else {
            clearError(guestsInput);
        }

        return isValid;
    }

    function setError(inputElement, message) {
        const parent = inputElement.parentElement;
        parent.classList.add("error");
        const errorMsgElement = parent.querySelector(".form-error-msg");
        if (errorMsgElement) {
            errorMsgElement.textContent = message;
        }
    }

    function clearError(inputElement) {
        const parent = inputElement.parentElement;
        parent.classList.remove("error");
    }

    function formatDateString(dateStr) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    function formatTimeString(timeStr) {
        // e.g. "18:30" to "6:30 PM"
        const [hours, minutes] = timeStr.split(':');
        let hh = parseInt(hours);
        const ampm = hh >= 12 ? 'PM' : 'AM';
        hh = hh % 12;
        hh = hh ? hh : 12; // the hour '0' should be '12'
        return `${hh}:${minutes} ${ampm}`;
    }
}

/* ==========================================================================
   Scroll Effects: Reveal Animations & Navbar Link Activation
   ========================================================================== */
function initScrollEffects() {
    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Stop observing once animated
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Active Link Observer on Scroll ---
    const sections = document.querySelectorAll("section[id], header");
    const navLinks = document.querySelectorAll("nav a");

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    // Menu link has href="#section_id"
                    if (id && link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: "-20% 0px -40% 0px"
    });

    sections.forEach(sec => sectionObserver.observe(sec));

    // --- Floating Action Button (Back to Top) ---
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add("active");
            } else {
                backToTopBtn.classList.remove("active");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}
