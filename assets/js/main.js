// Main interactions for the IntechDigital landing site

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("show");
    });

    // Close menu when clicking a link
    navList.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navList.classList.remove("show");
      }
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Dynamic footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    let isSubmitting = false;

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      if (isSubmitting) return;
      isSubmitting = true;

      // Disable submit button and show loading state
      if (submitButton) {
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = "Sending...";
      }

      try {
        const formData = new FormData(contactForm);
        // Convert FormData to JSON for Node.js serverless function
        const formDataObj = {};
        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });
        
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObj),
        });

        const result = await response.json();

        if (result.success) {
          showToastNotification(result.message || "Thank you! Your message has been sent successfully.", "success");
          contactForm.reset();
        } else {
          showToastNotification(
            result.message || "Sorry, there was an error. Please try again later.",
            "error"
          );
        }
      } catch (error) {
        console.error("Form submission error:", error);
        showToastNotification(
          "Network error. Please check your connection and try again, or contact us directly.",
          "error"
        );
      } finally {
        isSubmitting = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Message";
        }
      }
    });
  }
});


