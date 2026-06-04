document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loads scrolled down

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksList = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('active');
      navLinksList.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.classList.remove('active');
      navLinksList.classList.remove('active');
    });
  });

  // --- Smooth Scroll & Active Link Tracking ---
  const sections = document.querySelectorAll('section, .hero');
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      observer.observe(section);
    }
  });

  // --- Scroll Animations (Fade In) ---
  const fadeSections = document.querySelectorAll('.fade-in-section');
  const animObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, animObserverOptions);

  fadeSections.forEach(section => {
    animObserver.observe(section);
  });

  // --- Filterable Gallery ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          // Force reflow and animate in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          // Wait for transition before hiding
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });

  // --- Lightbox Functionality ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const imgSrc = img.getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scroll
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scroll
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
      }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // --- Booking/Inquiry Form Handling ---
  const bookingForm = document.getElementById('booking-form');
  const formFeedback = document.querySelector('.form-feedback');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const date = document.getElementById('date').value;
      const guests = document.getElementById('guests').value;
      const eventType = document.getElementById('event-type').value;

      // Basic validation check
      if (!name || !email || !date || !guests) {
        alert('Please fill out all required fields.');
        return;
      }

      // Simulate sending inquiry (API request delay)
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending details...';

      setTimeout(() => {
        // Success response
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        // Display feedback
        formFeedback.classList.add('success');
        formFeedback.textContent = `Thank you, ${name}! Your inquiry for a ${eventType} on ${date} has been sent successfully. Our events concierge will contact you at ${email} shortly.`;
        
        // Reset form
        bookingForm.reset();

        // Scroll feedback into view
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide feedback after 8 seconds
        setTimeout(() => {
          formFeedback.classList.remove('success');
          formFeedback.textContent = '';
        }, 8000);

      }, 1500);
    });
  }
});
