(() => {
  const overlay = document.getElementById("overlay");
  const popupTitle = document.getElementById("popupTitle");
  const popupImg = document.getElementById("popupImg");
  const popupClose = document.getElementById("popupClose");

  let lastFocused = null;

  function openPopup(name, imgSrc) {
    popupTitle.textContent = name;
    popupImg.src = imgSrc;
    popupImg.alt = "Photo of " + name;
    overlay.hidden = false;
    popupClose.focus();
  }

  function closePopup() {
    overlay.hidden = true;
    popupImg.src = "";
    if (lastFocused) lastFocused.focus();
  }

  // Collect room data from floorplan buttons
  const rooms = [];
  document.querySelectorAll(".floorplan .room").forEach((btn) => {
    const name = btn.dataset.name;
    const img = btn.dataset.img;
    if (!rooms.find((r) => r.name === name)) {
      rooms.push({ name, img });
    }
  });

  const sortedRooms = [...rooms].sort((a, b) => a.name.localeCompare(b.name));

  // ── Build Portfolio View ─────────────────────────────
  const portfolioContainer = document.getElementById("view-portfolio");
  const portfolioGrid = document.createElement("div");
  portfolioGrid.className = "portfolio-grid";
  sortedRooms.forEach((room) => {
    const card = document.createElement("button");
    card.className = "portfolio-card";
    card.dataset.name = room.name;
    card.dataset.img = room.img;

    const label = document.createElement("span");
    label.className = "portfolio-card-label";
    label.textContent = room.name;

    const img = document.createElement("img");
    img.className = "portfolio-card-img";
    img.src = room.img;
    img.alt = "Photo of " + room.name;
    img.loading = "lazy";

    card.appendChild(label);
    card.appendChild(img);
    portfolioGrid.appendChild(card);
  });
  portfolioContainer.appendChild(portfolioGrid);

  // ── Click handlers ───────────────────────────────────
  function attachRoomClick(el) {
    el.addEventListener("click", () => {
      lastFocused = el;
      openPopup(el.dataset.name, el.dataset.img);
    });
  }

  document.querySelectorAll(".floorplan .room").forEach(attachRoomClick);
  document.querySelectorAll(".portfolio-card").forEach(attachRoomClick);

  // ── View Toggle ──────────────────────────────────────
  const viewBtns = document.querySelectorAll(".view-btn");
  const views = {
    floorplan: document.getElementById("view-floorplan"),
    portfolio: document.getElementById("view-portfolio"),
  };

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.view;
      viewBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      Object.entries(views).forEach(([key, el]) => {
        if (key === target) {
          el.hidden = false;
          el.classList.add("active");
        } else {
          el.hidden = true;
          el.classList.remove("active");
        }
      });
    });
  });

  // ── Popup Close Handlers ─────────────────────────────
  popupClose.addEventListener("click", closePopup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closePopup();
  });

  // Trap focus inside popup
  overlay.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
