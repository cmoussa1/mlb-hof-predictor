document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  try {
    const response = await fetch('sidebar.html');
    const sidebarHTML = await response.text();
    container.innerHTML = sidebarHTML;

    // Attach toggle behavior
    document.querySelectorAll('.hamburger').forEach(hamburger => {
      hamburger.addEventListener('click', toggleSidebar);
    });
  } catch (error) {
    console.error("Failed to load sidebar:", error);
  }
});

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}
