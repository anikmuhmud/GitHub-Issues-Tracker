
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}
const BASE_URL = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssues = [];
let currentTab = "all";

// DOM elements
const issuesGrid = document.getElementById("issuesGrid");
const loading = document.getElementById("loading");
const issueCountEl = document.getElementById("issueCount");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("issueModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// Tab switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active", "border-indigo-600", "text-indigo-600"));
    btn.classList.add("active", "border-indigo-600", "text-indigo-600");
    currentTab = btn.dataset.tab;
    renderIssues();
  });
});

// Fetch & render
async function fetchIssues(search = "") {
  loading.classList.remove("hidden");
  issuesGrid.innerHTML = "";

  let url = `${BASE_URL}/issues`;
  if (search) url = `${BASE_URL}/issues/search?q=${encodeURIComponent(search)}`;

  try {
    const res = await fetch(url);
    const { data } = await res.json(); // assuming { status, message, data: [...] }

    allIssues = data;
    renderIssues();
  } catch (err) {
    console.error(err);
    issuesGrid.innerHTML = '<p class="text-red-600 col-span-full text-center py-10">Failed to load issues</p>';
  } finally {
    loading.classList.add("hidden");
  }
}

function renderIssues() {
  let filtered = [...allIssues];

  if (currentTab === "open") {
    filtered = filtered.filter(i => i.status.toLowerCase() === "open");
  } else if (currentTab === "closed") {
    filtered = filtered.filter(i => i.status.toLowerCase() === "closed");
  }

  issueCountEl.textContent = filtered.length;

  issuesGrid.innerHTML = "";

  filtered.forEach(issue => {
    const card = document.createElement("div");
    card.className = `bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden border-t-4 ${
      issue.status.toLowerCase() === "open" ? "border-green-500" : "border-purple-600"
    }`;

    
// "id": 2,
// "title": "Add dark mode support",
// "description": "Users are requesting a dark mode option. This would improve accessibility and user experience.",
// "status": "open",
// "labels": [
// "enhancement",
// "good first issue"
// ],
// "priority": "medium",
// "author": "sarah_dev",
// "assignee": "",
// "createdAt": "2024-01-14T14:20:00Z",
// "updatedAt": "2024-01-16T09:15:00Z"
// },
    card.innerHTML = `
      <div class="p-5">
        <div class="flex justify-between items-center">
     <span class="px-2.5 py-1 rounded-full ${issue.status.toLowerCase() === 'open' ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'} text-sm font-medium">
      ${issue.status}
    </span>
          <span class="px-2.5 py-1 bg-gray-100 btn border-2 rounded-full">${issue.priority}</span>
        </div>
        <h3 class="font-semibold text-lg mb-2 line-clamp-2">${issue.title}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${issue.description || "No description"}</p>
        <div class="flex flex-wrap gap-2 text-sm">
          
          ${issue.labels.map(l => `<span class="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">${l}</span>`).join("")}
        </div>
        <div class="mt-4 text-[16px]  space-y-5 ">
          <span>By ${issue.author}</span><br/>
          
          <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => showModal(issue));
    issuesGrid.appendChild(card);
  });
}

function showModal(issue) {
  modalTitle.textContent = issue.title;
  modalContent.innerHTML = `
   
     <div class="p-5">
        <div class="flex justify-between items-center">
     <span class="px-2.5 py-1 rounded-full ${issue.status.toLowerCase() === 'open' ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'} text-sm font-medium">
      ${issue.status}
    </span>
          <span class="px-2.5 py-1 bg-gray-100 btn border-2 rounded-full">${issue.priority}</span>
        </div>
        <h3 class="font-semibold text-lg mb-2 line-clamp-2">${issue.title}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${issue.description || "No description"}</p>
        <div class="flex flex-wrap gap-2 text-sm">
          
          ${issue.labels.map(l => `<span class="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">${l}</span>`).join("")}
        </div>
        <div class="mt-4 text-[16px]  space-y-5 ">
          <span>By ${issue.author}</span><br/>
          <span>${new Date(issue.createdAt).toLocaleDateString()}</span>

        </div>
     <p><strong>Last Updated:</strong> ${new Date(issue.updatedAt).toLocaleString()}</p>
    ${issue.assignee ? `<p><strong>Assignee:</strong> ${issue.assignee}</p>` : `<strong>Assignee: Mahmudul hasan anik</strong>`}
      </div>
  `;
  modal.classList.remove("hidden");
}

// Events
searchBtn.addEventListener("click", () => fetchIssues(searchInput.value.trim()));
searchInput.addEventListener("keypress", e => { if (e.key === "Enter") fetchIssues(searchInput.value.trim()); });

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

// Initial load
fetchIssues();