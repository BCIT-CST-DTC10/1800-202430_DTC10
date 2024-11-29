firebase.auth().onAuthStateChanged((user) => {
    const redirectUri = new URL(window.location).searchParams.get(redirectUriKey);

    if (user) {
        window.location = redirectUri;
    } else {
        (new firebaseui.auth.AuthUI(firebase.auth())).start("#firebaseui-auth-container", {
            signInFlow: "popup",
            signInSuccessUrl: redirectUri,
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            callbacks: {
                uiShown: () => {
                    document.querySelector('div#message').style.display = 'none';
                },
            },
        });
    }
});
