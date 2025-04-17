// Try to fetch data from the API
async function fetchProfileData(profileUrl) {
  try {
    // Extract LinkedIn username from URL
    const username = profileUrl.split('/in/')[1].split('/')[0];
    
    // This would be replaced with your actual API endpoint
    // For now, just return the sample data
    return profileData;
    
    // Actual implementation would be:
    // const response = await fetch(`https://your-api.com/profiles/${username}`);
    // return await response.json();
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return profileData; // Fallback to sample data
  }
}

function createWidget(data, container) {
  // Remove any existing widget first
  const existingWidget = document.getElementById("enhancer-widget");
  if (existingWidget) {
    existingWidget.remove();
  }

  const widget = document.createElement("div");
  widget.id = "enhancer-widget";
  widget.className = "enhancer-widget-container";

  widget.innerHTML = `
    <div class="enhancer-widget-header">
      <h2>${data.companyName}</h2>
      <div class="enhancer-widget-controls">
        <button id="minimize-btn" class="widget-control-btn">-</button>
        <button id="toggle-btn" class="widget-control-btn">×</button>
      </div>
    </div>
    <div class="enhancer-widget-content">
      <div class="progress">
        <div class="progress-bar" style="width: ${data.matchScore}%"></div>
      </div>
      <p style="margin-top: 8px;"><strong>Match Score:</strong> ${data.matchScore}</p>
      <span class="status ${data.accountStatus}">${data.accountStatus}</span>
    </div>
  `;

  // Add the widget to the container, or fallback to body with fixed position
  if (container && container.prepend) {
    container.prepend(widget);
    widget.classList.remove('fixed-position');
  } else {
    document.body.appendChild(widget);
    widget.classList.add('fixed-position');
  }

  // Ensure widget is visible
  widget.style.display = 'block';
  widget.style.zIndex = 9999;

  // Minimize functionality
  let minimized = false;
  widget.querySelector("#minimize-btn").addEventListener("click", () => {
    const content = widget.querySelector(".enhancer-widget-content");
    if (minimized) {
      content.style.display = "block";
      minimized = false;
    } else {
      content.style.display = "none";
      minimized = true;
    }
  });

  // Toggle functionality
  widget.querySelector("#toggle-btn").addEventListener("click", () => {
    widget.remove();
    chrome.storage.local.set({ widgetVisible: false });
    showFloatingToggle();
  });
}

function showFloatingToggle() {
  // Remove any existing toggle button first
  const existingButton = document.getElementById("show-widget-btn");
  if (existingButton) {
    existingButton.remove();
  }

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Show Enhancer";
  toggleButton.id = "show-widget-btn";
  toggleButton.classList.add("show-widget-button");

  toggleButton.addEventListener("click", () => {
    chrome.storage.local.set({ widgetVisible: true });
    toggleButton.remove();
    
    // Get the right sidebar again
    const rightSidebar = document.querySelector('.scaffold-layout__aside');
    if (rightSidebar) {
      // Try to fetch fresh data
      const profileUrl = window.location.href.split('?')[0];
      fetchProfileData(profileUrl)
        .then(data => {
          createWidget(data, rightSidebar);
        })
        .catch(() => {
          createWidget(profileData, rightSidebar);
        });
    } else {
      // Fallback to body if sidebar not found
      createWidget(profileData, document.body);
    }
  });

  document.body.appendChild(toggleButton);
}

// Wait for page to be fully loaded and inject widget at the right position
function injectWidget() {
  // Check if we're on a LinkedIn profile page
  if (!window.location.href.includes('linkedin.com/in/')) {
    return;
  }

  // Listen for DOM mutations to ensure our target container is loaded
  const observer = new MutationObserver((mutations, obs) => {
    // Look for a good injection point - the right sidebar
    const rightSidebar = document.querySelector('.scaffold-layout__aside');

    chrome.storage.local.get(["widgetVisible"], (result) => {
      const visible = result.widgetVisible ?? true;
      const profileUrl = window.location.href.split('?')[0];
      if (visible) {
        fetchProfileData(profileUrl)
          .then(data => {
            if (rightSidebar) {
              createWidget(data, rightSidebar);
            } else {
              // Fallback to body with fixed position
              createWidget(data, null);
            }
          })
          .catch(() => {
            if (rightSidebar) {
              createWidget(profileData, rightSidebar);
            } else {
              createWidget(profileData, null);
            }
          });
      } else {
        showFloatingToggle();
      }
    });

    // If widget injected, disconnect observer
    if (document.getElementById('enhancer-widget')) {
      obs.disconnect();
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

// Initialize when DOM content is loaded
document.addEventListener("DOMContentLoaded", injectWidget);

// For LinkedIn's SPA behavior, also listen for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    injectWidget();
  }
}).observe(document, {subtree: true, childList: true});

// Listen for extension messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showWidget") {
    const rightSidebar = document.querySelector('.scaffold-layout__aside');
    if (rightSidebar) {
      createWidget(profileData, rightSidebar);
    } else {
      createWidget(profileData, document.body);
    }
    chrome.storage.local.set({ widgetVisible: true });
  }
});
