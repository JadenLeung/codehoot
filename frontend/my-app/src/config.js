const config = {
    dev: false,
    flask: "https://flask-app-978883622231.northamerica-northeast2.run.app/",
    // flask: "http://127.0.0.1:8080",
    port: 5005,
    showRank: 0.2, // Decimal from 0-1. If 0.4, the top 40% of people get to see their scores.
    submitCooldown: 20,
    namelength: 15,
    timeout: 3, // # seconds until clang times out
    websocket: 'https://api.virtual-cube.net:3001/',
    // websocket: 'http://localhost:3001',
    qdata: {
        Q1: { time: 150, name: "linked_sum", testcases: 6 },
        Q2: { time: 500, name: "linked_middle", testcases: 7 },
        Q3: { time: 500, name: "bsearch", testcases: 5 },
        Q4: { time: 500, name: "bst_height", testcases: 6 },
        Q5: { time: 500, name: "is_bst", testcases: 9 },
        Q6: { time: 800, name: "least_letter", testcases: 7 },
        Q7: { time: 600, name: "limited_calculator", testcases: 8 },
    },

    inspiration: ["In modularity, you want low coupling, high cohesion", "You cannot directly dereference a void pointer.", 
        "String literals are stored in the read-only section of memory", "const int *p is a pointer to a constant integer", "Realloc has 2 effects: allocating and deallocating memory",
        "/data/avatars/nomair2.png", "/data/avatars/chin.png"],
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