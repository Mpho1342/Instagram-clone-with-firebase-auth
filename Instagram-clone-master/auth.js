const firebaseAuthContainer = document.querySelector(
  "#firebase-auth-container"
);
const mainApp = document.querySelector("#main-app");
const ui = new firebaseui.auth.AuthUI(auth);

const redirectToAuth = () => {
  mainApp.style.display = "none";
  firebaseAuthContainer.style.display = "block";

  ui.start("#firebase-auth-container", {
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        redirectToApp();
      },
    },
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  });
};

const redirectToApp = () => {
  mainApp.style.display = "block";
  firebaseAuthContainer.style.display = "none";
};

const handleLogout = () => {
  auth
    .signOut()
    .then(() => {
      console.log("USER SIGNED OUT");
      redirectToAuth();
    })
    .catch((error) => {
      console.log("ERROR OCCURED", error);
    });
};

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.uid);
    redirectToApp();
  } else {
    redirectToAuth();
  }
});
