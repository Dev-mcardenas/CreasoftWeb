// Form Submission Logic
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  const originalText = btn.innerText;
  
  btn.innerText = 'ENVIANDO...';
  btn.disabled = true;

  const data = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    btn.disabled = false;
    btn.innerText = originalText;
    
    if (response.ok) {
      feedback.innerText = '¡Gracias! Tu solicitud ha sido enviada con éxito. Te contactaremos pronto.';
      feedback.className = 'form-feedback success';
      form.reset();
      setTimeout(() => {
        feedback.innerText = '';
        feedback.className = 'form-feedback';
      }, 6000);
    } else {
      feedback.innerText = 'Hubo un error al enviar. Por favor, revisa tus datos e intenta nuevamente.';
      feedback.className = 'form-feedback error';
    }
  }).catch(error => {
    btn.disabled = false;
    btn.innerText = originalText;
    feedback.innerText = 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.';
    feedback.className = 'form-feedback error';
  });
});

// Input Filters
document.getElementById('name').addEventListener('input', function (e) {
  this.value = this.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, '');
});
document.getElementById('phone').addEventListener('input', function (e) {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Mobile Slider Logic
const slider = document.querySelector('.projects-grid');
const dots = document.querySelectorAll('.dot');
const projectCards = document.querySelectorAll('.project-card');

if (slider && dots.length > 0 && projectCards.length > 0) {
  let currentIndex = 0;
  const totalOriginalSlides = dots.length;
  let slideInterval = null;
  let isTransitioning = false;

  // Clone the first slide and append it to the end for seamless loop
  const firstClone = projectCards[0].cloneNode(true);
  firstClone.classList.add('mobile-clone');
  slider.appendChild(firstClone);

  // Update projectCards list to include the clone for the click listener
  const allProjectCards = document.querySelectorAll('.project-card');

  const updateSliderPosition = (behavior = 'smooth') => {
    isTransitioning = true;
    slider.scrollTo({
      left: currentIndex * slider.offsetWidth,
      behavior: behavior
    });

    // If we reached the clone, jump back to start after animation
    if (currentIndex === totalOriginalSlides) {
      setTimeout(() => {
        currentIndex = 0;
        slider.scrollTo({
          left: 0,
          behavior: 'auto'
        });
        isTransitioning = false;
      }, 600); // Wait for smooth scroll to finish
    } else {
      setTimeout(() => { isTransitioning = false; }, 600);
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    currentIndex++;
    updateSliderPosition();
  };

  const startAutoSlide = () => {
    stopAutoSlide(); // Always clear before starting
    if (window.innerWidth <= 768) {
      slideInterval = setInterval(nextSlide, 4000); // 4 seconds
    }
  };

  const stopAutoSlide = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  };

  slider.addEventListener('scroll', () => {
    // Use a small buffer to avoid flickering during the "auto" jump
    const scrollLeft = slider.scrollLeft;
    const width = slider.offsetWidth;
    const index = Math.round(scrollLeft / width);

    // Update dots only for real slides
    const dotIndex = index % totalOriginalSlides;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === dotIndex);
    });

    // Update currentIndex if user scrolls manually
    if (!isTransitioning) {
      currentIndex = index;
    }
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      currentIndex = i;
      updateSliderPosition();
      startAutoSlide();
    });
  });

  startAutoSlide();

  slider.addEventListener('touchstart', stopAutoSlide, { passive: true });
  slider.addEventListener('touchend', startAutoSlide, { passive: true });

  // Click to show overlay
  allProjectCards.forEach(card => {
    card.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.stopPropagation(); // Prevent closing when clicking the card itself
        allProjectCards.forEach(c => {
          if (c !== this) c.classList.remove('show-overlay');
        });
        this.classList.toggle('show-overlay');
      }
    });
  });

  // Close overlay when clicking outside
  document.addEventListener('click', function () {
    if (window.innerWidth <= 768) {
      allProjectCards.forEach(c => {
        c.classList.remove('show-overlay');
      });
    }
  });

  window.addEventListener('resize', () => {
    stopAutoSlide();
    startAutoSlide();
  });
}
