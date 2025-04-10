const config = {
    time: {
        Q1: 10,
        Q2: 300
    },
    testcases: {
        Q1: 2,
        Q2: 2
    },
    timeIncrement: 30,
    tiebreakerDeduct: 10, // amount of time deducted if there is a tie in testcases passed
    tiebreakerMaxDeduct: 100, // max amount of time deducted due to tiebrakerDeduct

}

export default config;