const config = {
    dev: true,
    port: 5004,
    questions: 3,
    submitCooldown: 1,
    namelength: 15,
    websocket: 'https://api.virtual-cube.net:3001/',
    // websocket: 'http://localhost:3001',
    time: {
        Q1: 1000,
        Q2: 1000,
        Q3: 1000,
    },
    questionNames: {
        Q1: "Q1",
        Q2: "is_bst",
        Q3: "least_letter",
    },
    testcases: {
        Q1: 2,
        Q2: 9,
        Q3: 6,
    },
    medalColor: {
        0: "gold",
        1: "#C0C0C0",
        2: "#cd7f32"
    },
    grades: {
        90: "A+",
        85: "A",
        80: "A-",
        77: "B+",
        73: "B",
        70: "B-",
        67: "C+",
        63: "C",
        60: "C-",
        57: "D+",
        53: "D",
        50: "D-",
        0: "F"
    },
    timeIncrement: 30,
    tiebreakerDeduct: 10, // amount of time deducted if there is a tie in testcases passed
    tiebreakerMaxDeduct: 100, // max amount of time deducted due to tiebrakerDeduct
    maxPoints: 1000,
    colors: ["red", "orange", "yellow", "green", "blue", "purple", "pink", "brown"],
}

export default config;