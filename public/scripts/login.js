const auth = firebase.auth();

(new firebaseui.auth.AuthUI(auth)).start("#firebaseui-auth-container", {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    tosUrl: "/term",
    privacyPolicyUrl: "/policy",
});

const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
    if (user) {
        const firebaseUser = db.collection("users").doc(user.uid);

        try {
            if (!(await firebaseUser.get()).exists) {
                throw new Error("Empty user");
            }
        } catch (err) {
            await firebaseUser.set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }

        window.location = "/";
    }
});
