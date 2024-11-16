const db = firebase.firestore();

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

(async () => {
    const types = db.collection("types");
    try {
        const typesData = await types.get();
        if (typesData.empty) {
            throw new Error("Empty types");
        }
    } catch (error) {
        [
            [
                "Café",
            ],
            [
                "School",
            ],
            [
                "Library"
            ],
        ].forEach(async ([name]) => {
            await types.add({
                name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        })
    }

    const features = db.collection("features");
    try {
        const featuresData = await features.get();
        if (featuresData.empty) {
            throw new Error("Empty features");
        }
    } catch (error) {
        [
            [
                "Wi-Fi",
                [
                    "free",
                    "paid",
                    "none",
                ],
            ],
            [
                "Charger",
                [
                    true,
                    false,
                ],
            ],
            [
                "Noise",
                [
                    true,
                    false,
                ],
            ],
            [
                "Music",
                [
                    true,
                    false,
                ],
            ],
            [
                "Time limited",
                [
                    true,
                    false,
                ],
            ],
        ].forEach(async ([name, values]) => {
            await features.add({
                name,
                values,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        })
    }

    const spots = db.collection("spots");
    try {
        const spotsData = await spots.get();
        if (spotsData.empty) {
            throw new Error("Empty spots");
        }
    } catch (error) {
        [
            [
                "BCIT Downtown Campus",
                "ZnGS4PhrIpl3PmADEeSw",
                {
                    "4MSI67kH6R9ptbJRbZ60": "free",
                    "CKt98mqJRpHZpteZIsaF": true,
                    "YzRl5QodFRqTBocHajrd": false,
                    "srumJqWmEevoPcGenLIP": true
                },
                {
                    monday: {
                        open: "08:00:00",
                        close: "16:00:00",
                    },
                    tuesday: {
                        open: "08:00:00",
                        close: "16:00:00",
                    },
                    wednesday: {
                        open: "08:00:00",
                        close: "16:00:00",
                    },
                    thursday: {
                        open: "08:00:00",
                        close: "16:00:00",
                    },
                    friday: {
                        open: "08:00:00",
                        close: "16:00:00",
                    }
                },
                "555 Seymour St, Vancouver, BC V6B 3H6",
                "https://maps.app.goo.gl/ZkmdWkmjK8Cv14GD7",
                "This is a school for tech :)",
                [
                    "30a64443-2257-408b-9217-4249242911f6.jpg",
                ],
            ],
            [
                "UBC",
                "ZnGS4PhrIpl3PmADEeSw",
                {
                    "4MSI67kH6R9ptbJRbZ60": "free",
                    "srumJqWmEevoPcGenLIP": false
                },
                {
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true,
                    sunday: true
                },
                "UBC, University Endowment Lands, BC",
                "https://maps.app.goo.gl/CbsUQ6zSzHTZPL556",
                "this is a school whose students go to BCIT anyway",
                [
                    "5e235690-1933-467d-a301-91a734f557a1.jpg",
                ],
            ],
            [
                "SFU",
                "ZnGS4PhrIpl3PmADEeSw",
                {
                    "4MSI67kH6R9ptbJRbZ60": "free",
                    "srumJqWmEevoPcGenLIP": false
                },
                {
                    monday: {
                        open: "09:00:00",
                        close: "16:00:00",
                    },
                    tuesday: {
                        open: "09:00:00",
                        close: "16:00:00",
                    },
                    wednesday: {
                        open: "09:00:00",
                        close: "16:00:00",
                    },
                    thursday: {
                        open: "09:00:00",
                        close: "16:00:00",
                    },
                    friday: {
                        open: "10:00:00",
                        close: "16:00:00",
                    },
                },
                "8888 University Dr W, Burnaby, BC V5A 1S6",
                "https://maps.app.goo.gl/mfn2uG3h9QZqA5nU8",
                "Simon Fraser University is a public research university in British Columbia, Canada. It maintains three campuses in Greater Vancouver, respectively located in Burnaby, Surrey, and Vancouver",
                [
                    "b5d861b6-b70c-453d-9a35-57c794145095.jpg",
                ],
            ],
            [
                "Vancouver Public Library, Central Library",
                "Qxep0iEDKUNrv9yOY9Mx",
                {
                    "4MSI67kH6R9ptbJRbZ60": "free",
                    "CKt98mqJRpHZpteZIsaF": true,
                    "srumJqWmEevoPcGenLIP": true
                },
                {
                    monday: {
                        open: "09:30:00",
                        close: "20:30:00",
                    },
                    tuesday: {
                        open: "09:30:00",
                        close: "20:30:00",
                    },
                    wednesday: {
                        open: "09:30:00",
                        close: "20:30:00",
                    },
                    thursday: {
                        open: "09:30:00",
                        close: "20:30:00",
                    },
                    friday: {
                        open: "09:30:00",
                        close: "18:00:00",
                    },
                    saturday: {
                        open: "10:00:00",
                        close: "18:00:00",
                    },
                    sunday: {
                        open: "11:00:00",
                        close: "18:00:00",
                    },
                },
                "350 West Georgia Street,Vancouver BC V6B 6B1, Canada",
                "https://maps.app.goo.gl/C1VoanLfCF3PjLxL6",
                "The city's grand central library, with a colonnaded surround reminiscent of a Roman amphitheater. Also has good books.",
                [
                    "867a08e2-2ce0-42dd-b1da-8d0d368f72e0.webp",
                ],
            ],
            [
                "Vancouver Public Library, Renfrew Branch",
                "Qxep0iEDKUNrv9yOY9Mx",
                {
                    "4MSI67kH6R9ptbJRbZ60": "free",
                    "CKt98mqJRpHZpteZIsaF": true,
                    "srumJqWmEevoPcGenLIP": true
                },
                {
                    sunday: {
                        open: "09:30:00",
                        close: "17:00:00",
                    },
                    monday: {
                        open: "09:30:00",
                        close: "20:00:00",
                    },
                    tuesday: {
                        open: "09:30:00",
                        close: "20:00:00",
                    },
                    wednesday: {
                        open: "09:30:00",
                        close: "20:00:00",
                    },
                    thursday: {
                        open: "09:30:00",
                        close: "20:00:00",
                    },
                    friday: {
                        open: "09:30:00",
                        close: "18:00:00",
                    },
                    saturday: {
                        open: "09:30:00",
                        close: "17:00:00",
                    },
                },
                "2969 E 22nd Ave, Vancouver, BC V5M 2Y3",
                "https://maps.app.goo.gl/mBBsZMFmkiSvmxre7",
                "The city's grand central library, with a colonnaded surround reminiscent of a Roman amphitheater. Also has good books.",
                [
                    "dd72cd73-6bec-40a9-b0aa-9c59e5ad3fc1.jpg",
                ],
            ],
        ].forEach(async ([name, type, features, schedule, address, googleMapLink, description, images]) => {
            await spots.add({
                name,
                type,
                features,
                schedule,
                address,
                googleMapLink,
                description,
                images,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        })
    }

    const reviews = db.collection("reviews");
    try {
        const reviewsData = await reviews.get();
        if (reviewsData.empty) {
            throw new Error("Empty reviews");
        }
    } catch (error) {
        await Promise.all(new Array(100).fill(0).map(() =>
            reviews.add({
                spotId:
                    Math.floor(Math.random() * 5) ?
                        Math.floor(Math.random() * 4) ?
                            Math.floor(Math.random() * 3) ?
                                Math.floor(Math.random() * 2) ?
                                    "DRkRHnZX09RIlToN95Ng" :
                                    "NFHDozOwdmK8HSEaghg6" :
                                "f4fBaKV4hPgcKTgFu6go" :
                            "jaF14M6yJBWKydQ57sD1" :
                        "oAy7kwM7fSQ4dIwqRg17",
                userId: Math.floor(Math.random() * 2) ? "T2XF3Io3woX53FNwF4R0MihYz1z1" : "U3AwU50UQMgw7aNeBOVxfKVBJq12",
                rating: Math.ceil(Math.random() * 5),
                comment: new Array(Math.floor(Math.random() * 32) + 8).fill(0).map(() => makeid(Math.ceil(Math.random() * 8))).join(" "),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        ));
    }
})();
