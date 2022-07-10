const path = require('path');

const questions = [
    'What is your name?',
    'Where are you from?',
    'What is your favirate fruit?'
];

const ask = (i = 0) => {
    process.stdout.write(`\n\n\n ${questions[i]}`);
    process.stdout.write(` > `);
}

ask();


const answers = [];
process.stdin.on('data', data => {
    answers.push(data.toString().trim());

    if (answers.length < questions.length) {
        ask(answers.length);
    } else {
        process.exit();
    }
});

process.on('exit', () => {
    const [name, country, fruit] = answers;
    console.log(`Your answers: ${name}, ${country}, ${fruit}`)
    console.log(`Thanks for you anwsers!!!!!!!!!!!!!!!`);
})