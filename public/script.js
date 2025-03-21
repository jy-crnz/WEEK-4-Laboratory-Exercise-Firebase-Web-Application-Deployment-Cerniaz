// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4oxjs83Is_-FhoBwRvHd_EMQTfTo5sVA",
    authDomain: "mywebapp-69a02.firebaseapp.com",
    projectId: "mywebapp-69a02",
    storageBucket: "mywebapp-69a02.appspot.com",
    messagingSenderId: "483372728475",
    appId: "1:483372728475:web:a9fe61d9fd4a636940063e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

// Elements
const authForms = document.getElementById("auth-forms");
const userInfo = document.getElementById("user-info");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showLoginBtn = document.getElementById("show-login");
const showSignupBtn = document.getElementById("show-signup");
const logoutBtn = document.getElementById("logout-btn");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const loadingSpinner = document.getElementById("loading-spinner");

function showLoading() {
    loadingSpinner.style.display = "block";
}

function hideLoading() {
    loadingSpinner.style.display = "none";
}


// Show Login Form, Hide Sign Up
showLoginBtn.addEventListener("click", () => {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
});

// Show Sign Up Form, Hide Login
showSignupBtn.addEventListener("click", () => {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
});

// Initially, show login form
loginForm.style.display = "block";

// Signup function (Stores Name in Firestore)
document.getElementById("signup-btn").addEventListener("click", async function() {
    showLoading(); // Show loading spinner
    document.getElementById("message").innerText = ""; // Clear previous error messages

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,  
            email: user.email,
            createdAt: new Date().toISOString()
        });

        showUserInfo(user.uid);
    } catch (error) {
        document.getElementById("message").innerText = error.message;
        document.getElementById("message").style.color = "red";
    }

    hideLoading(); // Hide loading spinner
});


// Login function (Retrieve Name from Firestore)
document.getElementById("login-btn").addEventListener("click", async function() {
    showLoading(); // Show loading spinner
    document.getElementById("message").innerText = ""; // Clear previous error messages
    console.log("Login button clicked");

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    console.log("Email:", email, "Password:", password);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password); 
        console.log("User logged in:", userCredential.user);

        const user = userCredential.user;
        showUserInfo(user.uid);
    } catch (error) {
        console.error("Login error:", error.message);
        document.getElementById("message").innerText = error.message;
        document.getElementById("message").style.color = "red";
    }

    hideLoading(); // Hide loading spinner
});



// Get elements
const userCreated = document.getElementById("user-created");

// Function to Display User Info and Hide Forms
async function showUserInfo(userId) {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
        const userData = userDoc.data();
        userName.innerText = userData.name;
        userEmail.innerText = userData.email;
        userCreated.innerText = new Date(userData.createdAt).toLocaleString(); // Convert to readable date format

        // Hide login/signup forms
        authForms.style.display = "none";
        showLoginBtn.style.display = "none";
        showSignupBtn.style.display = "none";

        // Show user info
        userInfo.style.display = "block";
    }
}


// Logout function
logoutBtn.addEventListener("click", async function() {
    try {
        await signOut(auth);

        // Show login/signup forms
        authForms.style.display = "block";
        showLoginBtn.style.display = "inline-block";
        showSignupBtn.style.display = "inline-block";

        // Hide user info
        userInfo.style.display = "none";
    } catch (error) {
        document.getElementById("message").innerText = error.message;
        document.getElementById("message").style.color = "red";
    }
});
