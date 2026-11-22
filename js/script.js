/**
 * BUDGET HOTEL - Main JavaScript File
 * Vanilla JavaScript implementation for interactive components,
 * date validations, price calculations, gallery lightbox, and demo form submissions.
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Dynamic Copyright Year
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Shadow on Scroll & Scroll To Top Button
  const header = document.querySelector(".site-header");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) {
      if (header) header.classList.add("scrolled");
      if (scrollTopBtn) scrollTopBtn.classList.add("visible");
    } else {
      if (header) header.classList.remove("scrolled");
      if (scrollTopBtn) scrollTopBtn.classList.remove("visible");
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 3. Mobile Navigation Hamburger Menu
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", function () {
      mobileToggle.classList.toggle("active");
      navMenu.classList.toggle("open");
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileToggle.classList.remove("active");
        navMenu.classList.remove("open");
      });
    });
  }

  // 4. Room Category Filter (used on Rooms page)
  const roomFilterBtns = document.querySelectorAll(".room-filter-btn");
  const roomCards = document.querySelectorAll(".filterable-room-card");

  if (roomFilterBtns.length > 0 && roomCards.length > 0) {
    roomFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        roomFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.getAttribute("data-category");

        roomCards.forEach(function (card) {
          const cardCat = card.getAttribute("data-category");
          if (category === "all" || cardCat === category) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // 5. Gallery Category Filter & Lightbox (used on Gallery page)
  const galleryFilterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".filterable-gallery-item");
  const lightboxModal = document.getElementById("galleryLightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImgHolder = document.getElementById("lightboxImgHolder");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCaption = document.getElementById("lightboxCaption");

  if (galleryFilterBtns.length > 0 && galleryItems.length > 0) {
    galleryFilterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        galleryFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.getAttribute("data-category");

        galleryItems.forEach(function (item) {
          const itemCat = item.getAttribute("data-category");
          if (category === "all" || itemCat === category) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  if (galleryItems.length > 0 && lightboxModal) {
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        const title = item.getAttribute("data-title") || "Budget Hotel View";
        const caption =
          item.getAttribute("data-caption") ||
          "Demonstration image placeholder representation.";
        const placeholderClass =
          item.getAttribute("data-placeholder-class") || "budget-hotel-hero";

        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCaption) lightboxCaption.textContent = caption;

        if (lightboxImgHolder) {
          lightboxImgHolder.className =
            "image-placeholder " + placeholderClass + " placeholder-16-9";
          lightboxImgHolder.innerHTML = "";
        }

        lightboxModal.classList.add("active");
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", function () {
        lightboxModal.classList.remove("active");
      });
    }

    lightboxModal.addEventListener("click", function (e) {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove("active");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
        lightboxModal.classList.remove("active");
      }
    });
  }

  // 6. FAQ Accordion Functionality
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    const questionBtn = item.querySelector(".faq-question");
    if (questionBtn) {
      questionBtn.addEventListener("click", function () {
        const isActive = item.classList.contains("active");

        // Close other items
        faqItems.forEach((other) => other.classList.remove("active"));

        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  // 7. Booking Enquiry Form Calculations & Validation (offers-booking.html)
  const bookingForm = document.getElementById("bookingEnquiryForm");
  const checkinInput = document.getElementById("checkinDate");
  const checkoutInput = document.getElementById("checkoutDate");
  const roomTypeSelect = document.getElementById("roomTypeSelect");
  const numRoomsSelect = document.getElementById("numRoomsSelect");

  // Summary display elements
  const summaryRoomType = document.getElementById("summaryRoomType");
  const summaryRate = document.getElementById("summaryRate");
  const summaryNights = document.getElementById("summaryNights");
  const summaryRooms = document.getElementById("summaryRooms");
  const summaryTotal = document.getElementById("summaryTotal");
  const bookingSuccessAlert = document.getElementById("bookingSuccessAlert");

  const roomPrices = {
    standard: 1499,
    deluxe: 2199,
    family: 2999,
    business: 2499,
  };

  const roomNames = {
    standard: "Standard Room",
    deluxe: "Deluxe Room",
    family: "Family Room",
    business: "Business Traveller Room",
  };

  // Set minimum date to today for check-in and check-out
  const today = new Date().toISOString().split("T")[0];
  if (checkinInput) {
    checkinInput.min = today;
  }
  if (checkoutInput) {
    checkoutInput.min = today;
  }

  // Set default dates if on booking page
  if (checkinInput && checkoutInput && !checkinInput.value) {
    const defaultCheckin = new Date();
    defaultCheckin.setDate(defaultCheckin.getDate() + 1);
    const defaultCheckout = new Date();
    defaultCheckout.setDate(defaultCheckout.getDate() + 2);

    checkinInput.value = defaultCheckin.toISOString().split("T")[0];
    checkoutInput.value = defaultCheckout.toISOString().split("T")[0];
  }

  // Check URL query parameters for pre-selecting room or offer
  const urlParams = new URLSearchParams(window.location.search);
  const preselectRoom = urlParams.get("room");
  if (preselectRoom && roomTypeSelect && roomPrices[preselectRoom]) {
    roomTypeSelect.value = preselectRoom;
  }

  function calculateBookingSummary() {
    if (!checkinInput || !checkoutInput || !roomTypeSelect) return;

    const checkinVal = checkinInput.value;
    const checkoutVal = checkoutInput.value;
    const selectedRoom = roomTypeSelect.value || "standard";
    const numRooms = numRoomsSelect ? parseInt(numRoomsSelect.value, 10) || 1 : 1;

    const ratePerNight = roomPrices[selectedRoom] || 1499;
    const roomName = roomNames[selectedRoom] || "Standard Room";

    let nights = 1;

    if (checkinVal && checkoutVal) {
      const d1 = new Date(checkinVal);
      const d2 = new Date(checkoutVal);
      const timeDiff = d2.getTime() - d1.getTime();
      const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (calculatedNights > 0) {
        nights = calculatedNights;
      } else {
        nights = 1;
      }
    }

    const totalEstimate = ratePerNight * nights * numRooms;

    if (summaryRoomType) summaryRoomType.textContent = roomName;
    if (summaryRate) summaryRate.textContent = "₹" + ratePerNight.toLocaleString("en-IN") + " / night";
    if (summaryNights) summaryNights.textContent = nights + (nights === 1 ? " Night" : " Nights");
    if (summaryRooms) summaryRooms.textContent = numRooms + (numRooms === 1 ? " Room" : " Rooms");
    if (summaryTotal) summaryTotal.textContent = "₹" + totalEstimate.toLocaleString("en-IN");
  }

  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener("change", function () {
      if (checkinInput.value) {
        checkoutInput.min = checkinInput.value;
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          const nextDay = new Date(checkinInput.value);
          nextDay.setDate(nextDay.getDate() + 1);
          checkoutInput.value = nextDay.toISOString().split("T")[0];
        }
      }
      calculateBookingSummary();
    });

    checkoutInput.addEventListener("change", calculateBookingSummary);
  }

  if (roomTypeSelect) {
    roomTypeSelect.addEventListener("change", calculateBookingSummary);
  }

  if (numRoomsSelect) {
    numRoomsSelect.addEventListener("change", calculateBookingSummary);
  }

  // Initial calculation call
  if (bookingForm) {
    calculateBookingSummary();

    // Booking Enquiry Form Submission Validation
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const fullName = document.getElementById("bookingName");
      const mobile = document.getElementById("bookingMobile");
      const email = document.getElementById("bookingEmail");

      // Validate Name
      if (!fullName || fullName.value.trim() === "") {
        showError(fullName, "Please enter your full name.");
        isValid = false;
      } else {
        clearError(fullName);
      }

      // Validate Mobile (at least 10 digits)
      const phoneRegex = /^[0-9+ -]{10,15}$/;
      if (!mobile || !phoneRegex.test(mobile.value.trim())) {
        showError(mobile, "Please enter a valid mobile number (10+ digits).");
        isValid = false;
      } else {
        clearError(mobile);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(email);
      }

      // Validate Dates
      if (checkinInput && checkoutInput) {
        if (!checkinInput.value || !checkoutInput.value) {
          alert("Please select both check-in and check-out dates.");
          isValid = false;
        } else if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
          alert("Check-out date must be strictly after check-in date.");
          isValid = false;
        }
      }

      if (isValid) {
        if (bookingSuccessAlert) {
          bookingSuccessAlert.classList.add("active");
          bookingSuccessAlert.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        bookingForm.reset();
        calculateBookingSummary();
      }
    });
  }

  // 8. Contact Form Validation (contact.html)
  const contactForm = document.getElementById("contactForm");
  const contactSuccessAlert = document.getElementById("contactSuccessAlert");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById("contactName");
      const mobileInput = document.getElementById("contactMobile");
      const emailInput = document.getElementById("contactEmail");
      const messageInput = document.getElementById("contactMessage");

      if (!nameInput || nameInput.value.trim() === "") {
        showError(nameInput, "Please enter your full name.");
        isValid = false;
      } else {
        clearError(nameInput);
      }

      const phoneRegex = /^[0-9+ -]{10,15}$/;
      if (!mobileInput || !phoneRegex.test(mobileInput.value.trim())) {
        showError(mobileInput, "Please enter a valid mobile number.");
        isValid = false;
      } else {
        clearError(mobileInput);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(emailInput);
      }

      if (!messageInput || messageInput.value.trim() === "") {
        showError(messageInput, "Please write your message.");
        isValid = false;
      } else {
        clearError(messageInput);
      }

      if (isValid) {
        if (contactSuccessAlert) {
          contactSuccessAlert.classList.add("active");
          contactSuccessAlert.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        contactForm.reset();
      }
    });
  }

  // 9. Home Quick Search Bar (index.html)
  const quickSearchForm = document.getElementById("quickSearchForm");
  if (quickSearchForm) {
    quickSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const room = document.getElementById("quickRoomSelect")?.value || "standard";
      const checkin = document.getElementById("quickCheckin")?.value;
      const checkout = document.getElementById("quickCheckout")?.value;

      let redirectUrl = "offers-booking.html?room=" + encodeURIComponent(room);
      if (checkin) redirectUrl += "&checkin=" + encodeURIComponent(checkin);
      if (checkout) redirectUrl += "&checkout=" + encodeURIComponent(checkout);

      window.location.href = redirectUrl;
    });
  }

  // Helper validation error functions
  function showError(inputEl, msg) {
    if (!inputEl) return;
    const parent = inputEl.closest(".form-group");
    if (parent) {
      parent.classList.add("has-error");
      let errSpan = parent.querySelector(".error-message");
      if (!errSpan) {
        errSpan = document.createElement("span");
        errSpan.className = "error-message";
        parent.appendChild(errSpan);
      }
      errSpan.textContent = msg;
    }
  }

  function clearError(inputEl) {
    if (!inputEl) return;
    const parent = inputEl.closest(".form-group");
    if (parent) {
      parent.classList.remove("has-error");
    }
  }
});
