(new firebaseui.auth.AuthUI(firebase.auth())).start("#firebaseui-auth-container", {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    tosUrl: "/term",
    privacyPolicyUrl: "/policy",
    callbacks: {
        // uiShown: () => {
        //     // The widget is rendered.
        //     // Hide the loader.
        //     document.getElementById('loader').style.display = 'none';
        // },
    }
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        window.location = "/";
    }
});
