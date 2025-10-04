// Elements
const passwordInput = document.getElementById("password"); // Password input element
const togglePassword = document.getElementById("toggle-btn"); // Show/Hide button element
const strengthText = document.getElementById("strength-text"); // Strength label element
const segments = document.querySelectorAll(".strength-segment"); // NodeList of 4 segments

// Toggle Show/Hide
togglePassword.addEventListener("click", () => {
  // Click handler for the button
  const isPassword = passwordInput.type === "password"; // Check current type
  passwordInput.type = isPassword ? "text" : "password"; // Toggle type
  togglePassword.textContent = isPassword ? "Hide" : "Show"; // Update button text
});

// Show strength text only when focused
passwordInput.addEventListener("focus", () => {
  // On focus
  strengthText.style.visibility = "visible"; // Make label visible
});

passwordInput.addEventListener("blur", () => {
  // On blur (when input loses focus)
  if (!passwordInput.value.length) {
    // If input is empty
    strengthText.style.visibility = "hidden"; // Hide label again
  }
});

// Strength Check Logic
passwordInput.addEventListener("input", () => {
  // On every input change
  const password = passwordInput.value; // Current value of input

  // Reset bar
  segments.forEach((seg) => {
    // Loop each segment
    seg.classList.remove("active"); // Remove active class
    seg.style.color = "#333"; // Reset color (inactive)
  });

  if (password.length < 6) {
    // If shorter than 6 chars
    strengthText.textContent = "Too short"; // Show Too short
    strengthText.style.color = "#e4bc87"; // Brand gold color
    return; // Stop further checks
  }

  // Criteria checks: lowercase, uppercase, number, special char
  const rules = [
    /[a-z]/.test(password), // Lowercase present?
    /[A-Z]/.test(password), // Uppercase present?
    /\d/.test(password), // Number present?
    /[^a-zA-Z0-9]/.test(password), // Special char present?
  ];

  // Special case: numbers only (like "111111")
  if (/^\d+$/.test(password)) {
    // If password is only digits
    strengthText.textContent = "Weak"; // Treat as Weak
    strengthText.style.color = "red"; // Red label
    segments[0].classList.add("active"); // Activate first segment
    segments[0].style.color = "red"; // Color it red
    return; // Stop further checks
  }

  // Score = number of rules passed (0..4)
  const strength = rules.filter(Boolean).length; // Count true values

  const colors = ["red", "orange", "lightgreen", "darkgreen"]; // Colors per strength level
  const labels = ["Weak", "Medium", "Strong", "Very Strong"]; // Labels per level

  // Fill bar segments based on score
  for (let i = 0; i < strength; i++) {
    // For each segment up to score
    segments[i].classList.add("active"); // Mark active
    segments[i].style.color = colors[strength - 1]; // Color according to final score
  }

  // Update the text label and color
  strengthText.textContent = labels[strength - 1]; // Set label text
  strengthText.style.color = colors[strength - 1]; // Set label color
});

