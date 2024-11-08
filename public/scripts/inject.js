
const db = firebase.firestore();

(async () => {
    const tags = db.collection("tags");
    try {
        const tagsData = await tags.get();
        if (tagsData.empty) {
            throw new Error("Empty tags");
        }
    } catch (error) {
        [
            [
                "cafe",
                "Cafe",
                "location_type",
                [
                    true,
                    false,
                ],
            ],
            [
                "school",
                "School",
                "location_type",
                [
                    true,
                    false,
                ],
            ],
            [
                'wifi',
                "Wi-Fi",
                "feature",
                [
                    "free",
                    "paid",
                    "none",
                ],
            ],
            [
                'charger',
                "Charger",
                "feature",
                [
                    true,
                    false,
                ],
            ],
        ].forEach(async ([id, name, type, values]) => {
            await tags.doc(id).set({
                name,
                type,
                values,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        })
    }

    const studySpots = db.collection("studySpots");
    try {
        const studySpotsData = await studySpots.get();
        if (studySpotsData.empty) {
            throw new Error("Empty studySpots");
        }
    } catch (error) {
        [
            [
                'bcit',
                "BCIT Downtown Campus",
                {
                    cafe: {
                        status: false
                    },
                    school: {
                        status: true
                    },
                    wifi: {
                        status: "free"
                    },
                    charger: {
                        status: true
                    }
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
                "This is a school for tech :)"
            ],
            [
                'ubc',
                "UBC",
                {
                    cafe: {
                        status: false
                    },
                    school: {
                        status: true
                    },
                    wifi: {
                        status: "paid"
                    },
                    charger: {
                        status: false
                    }
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
                "this is a school whose students go to BCIT anyway"
            ],
            [
                'sfu',
                "SFU",
                {
                    cafe: {
                        status: false
                    },
                    school: {
                        status: true
                    },
                    wifi: {
                        status: "free"
                    },
                    charger: {
                        status: false
                    }
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
                "8888 University Dr W, Burnaby, BC V5A 1S6",
                "https://maps.app.goo.gl/mfn2uG3h9QZqA5nU8",
                "Simon Fraser University is a public research university in British Columbia, Canada. It maintains three campuses in Greater Vancouver, respectively located in Burnaby, Surrey, and Vancouver"
            ],
            [
                "vpl",
                "Vancouver Public Library",
                {
                    cafe: {
                        status: false
                    },
                    school: {
                        status: false
                    },
                    library: {
                        status: true
                    },
                    wifi: {
                        status: "free"
                    },
                    charger: {
                        status: true
                    }
                },
                {
                    monday: {
                        open: "09:00:00",
                        close: "20:30:00"
                    },
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true,
                    sunday: true
                },
                "350 West Georgia Street,Vancouver BC V6B 6B1, Canada",
                "https://maps.app.goo.gl/C1VoanLfCF3PjLxL6",
                "The city's grand central library, with a colonnaded surround reminiscent of a Roman amphitheater. Also has good books."
            ]
        ].forEach(async ([id, name, tags, schedule, address, googleMapLink, description]) => {
            await studySpots.doc(id).set({
                name,
                tags,
                schedule,
                address,
                googleMapLink,
                description,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        })
    }

    const users = db.collection("users");
    try {
        const usersData = await users.get();
        if (usersData.empty) {
            throw new Error("Empty users");
        }
    } catch (error) {
        [
            [
                'uODQK7ziLBNZlpptGOQcdD0RpCW2',
                "I'm the very first user!!"
            ],
            [
                'X0HK803N6LgzddlDqdhrSd7AOR12',
                "Just an user..."
            ],
            [
                'echtgbx7ZuTlXlSWT0HwYMIQ9Dj1',
                ""
            ],
        ].forEach(async ([id, description]) => {
            await users.doc(id).set({
                description,
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
        [
            [
                'bcit',
                'uODQK7ziLBNZlpptGOQcdD0RpCW2',
                5,
                'A great place!'
            ],
            [
                'bcit',
                'echtgbx7ZuTlXlSWT0HwYMIQ9Dj1',
                4,
                'The place are nice, but there are too many events on 2nd floor.'
            ],
            [
                'ubc',
                'echtgbx7ZuTlXlSWT0HwYMIQ9Dj1',
                3,
                'Just a town. Yup, a town.'
            ],
            [
                'ubc',
                'X0HK803N6LgzddlDqdhrSd7AOR12',
                4,
                "Beaches!!!!!"
            ]
        ].forEach(async ([studySpotId, userId, rating, comment]) => {
            await reviews.add({
                studySpotId,
                userId,
                rating,
                comment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
        })
    }

    await users.add({
        username: "",
        description: "Add a brief discription about yourself!",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
})();