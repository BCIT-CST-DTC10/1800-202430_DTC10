(new firebaseui.auth.AuthUI(firebase.auth())).start("#firebaseui-auth-container", {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: "/term",
    privacyPolicyUrl: "/policy",
});
