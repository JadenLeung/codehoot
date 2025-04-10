const config = {
    questions: 2,
    time: {
        Q1: 1000,
        Q2: 1000
    },
    testcases: {
        Q1: 2,
        Q2: 2
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