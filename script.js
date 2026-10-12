(() => {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");
  const year = document.getElementById("year");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const reelModal = document.getElementById("reelModal");
  const reelFrame = document.getElementById("reelFrame");
  const reelOpenIg = document.getElementById("reelOpenIg");
  const reelModalClose = document.getElementById("reelModalClose");
  const bookForm = document.getElementById("bookForm");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    nav?.classList.toggle("open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle?.addEventListener("click", () => {
    setMenu(!nav?.classList.contains("open"));
  });

  mobile?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
    if (!reelModal?.classList.contains("open") && !nav?.classList.contains("open")) {
      document.body.style.overflow = "";
    }
  };

  document.querySelectorAll(".bento-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
      const img = btn.querySelector("img");
      if (src) openLightbox(src, img?.alt);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* Gallery filters */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const bentoItems = document.querySelectorAll(".bento-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";
      filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      bentoItems.forEach((item) => {
        const tag = item.getAttribute("data-filter");
        const show = filter === "all" || tag === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  const openReel = (id) => {
    const url = `https://www.instagram.com/reel/${id}/`;
    reelFrame.src = `${url}embed`;
    reelOpenIg.href = url;
    reelModal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeReel = () => {
    reelModal.classList.remove("open");
    reelFrame.src = "";
    if (!lightbox?.classList.contains("open") && !nav?.classList.contains("open")) {
      document.body.style.overflow = "";
    }
  };

  document.querySelectorAll(".reel-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-reel");
      if (id) openReel(id);
    });
  });

  reelModalClose?.addEventListener("click", closeReel);
  reelModal?.addEventListener("click", (e) => {
    if (e.target === reelModal) closeReel();
  });

  /* Booking → WhatsApp */
  bookForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(bookForm);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const classType = String(data.get("classType") || "").trim();
    const time = String(data.get("time") || "").trim();
    const message = String(data.get("message") || "").trim();

    const lines = [
      "Namaste Utsaahi 🙏",
      "I would like to book a yoga class.",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Class: ${classType}`,
      `Time: ${time}`,
    ];
    if (message) lines.push(`Message: ${message}`);
    lines.push("", "— Sent from Utsaahi website");

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/919423682125?text=${text}`, "_blank", "noopener");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeReel();
      setMenu(false);
    }
  });
})();
