document.addEventListener("DOMContentLoaded", () => {
    const CONTACT_EMAIL = "eliasmuiruri198@gmail.com";

    /* ---------- 1. Footer year ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- 2. Highlight the nav link of the section in view ---------- */
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = [...navLinks]
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    function setActiveLink(id) {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === "#" + id;
            link.classList.toggle("active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
                // Keep the active link visible in the scrollable mobile menu
                link.scrollIntoView({ block: "nearest", inline: "center" });
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window && sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            // A section counts as "current" when it crosses the middle band of the screen
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach((section) => observer.observe(section));
    }

    /* ---------- 3. Profile photo fallback ---------- */
    // If profile.png is missing, show initials instead of a broken image icon.
    const photo = document.querySelector(".profile-photo");
    if (photo) {
        photo.addEventListener("error", () => {
            const fallback = document.createElement("div");
            fallback.className = "profile-photo profile-fallback";
            fallback.setAttribute("role", "img");
            fallback.setAttribute("aria-label", photo.alt || "Profile photo");
            fallback.textContent = "ME";
            fallback.style.cssText =
                "width:200px;height:200px;border-radius:50%;display:flex;" +
                "align-items:center;justify-content:center;font-size:3rem;" +
                "font-weight:800;background:#f0a830;color:#0a2b24;";
            photo.replaceWith(fallback);
        });
    }

    /* ---------- 4. Contact form ---------- */
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");

    if (form && status) {
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        
        function showStatus(text, isError) {
            status.textContent = text;
            status.style.color = isError ? "#b3261e" : "";
        }

        // Clear the error message as soon as the person starts correcting it
        form.addEventListener("input", () => showStatus("", false));

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            



            if (!name || !email || !message) {
                showStatus("Please complete all fields.", true);
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showStatus("Enter a valid email address, like name@example.com.", true);
                emailInput.focus();
                return;
            }

            // There is no server, so open the visitor's email app with the message filled in.
            const subject = "Portfolio message from " + name;
            const body = message + "\n\nFrom: " + name + " (" + email + ")";
            const mailto =
                "mailto:" + CONTACT_EMAIL +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);

            window.location.href = mailto;

            showStatus(
                "Thank you, " + name + "! Your email app should open with the message ready to send.",
                false
            );
            form.reset();
        });
    }
});