#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import questionList from './questionList.js';

console.log(chalk.bgYellow('Hey Programmer'));

// const rainbow = chalkAnimation.rainbow('Lorem ipsum'); // Animation starts

// setTimeout(() => {
//     rainbow.stop(); // Animation stops
// }, 1000);

// setTimeout(() => {
//     rainbow.start(); // Animation resumes
// }, 2000);


let playerName;
let questionCounter;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

async function welcome() {
    const welcomeTitle = chalkAnimation.rainbow('Welcome to Programmer Game');
    await sleep()
    welcomeTitle.stop()
    console.log(`
    Lets start our programmer game.
    If you enter wrong answer, you will get ${chalk.bgRed('Killed')}.
    ONE MISS GAME FINISH.
    `);
}

async function getUserName() {
    const userName = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',
        default() {
            return 'Player';
        }
    });
    playerName = userName.player_name
    console.log('\n');
}

async function askQuestions(questionData) {
    const answer = await inquirer.prompt({
        name: `user_answer${questionCounter}`,
        type: 'list',
        message: questionData.question,
        choices: questionData.options
    });
    await handleAnswer(answer[`user_answer${questionCounter}`] == questionData.correctAnswer)
    await checkAndAskQuestion(questionCounter+1)
}

async function checkAndAskQuestion(questionId = 1) {
    questionCounter = questionId
    if (questionList[`q${questionId}`]){
        await askQuestions(questionList[`q${questionId}`])
    }
}

async function handleAnswer(isCorrect) {
    const loader = createSpinner('Checking answer...').start();
    await sleep(1000)
    if (isCorrect) {
        loader.success({ text: `🏆🥇 Well Done ${playerName}\n` })
        return
    } else {
        loader.error({ text: `🚫🫤 You are not a programmer, Loser!\n` })
        process.exit(1);
    }
}

function winner() {
    console.clear();
    const msg = `Congratulation, ${playerName}! \nYou are a Hacker.`
    figlet(msg.toUpperCase(), (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });
}

async function main() {
    await welcome()
    await getUserName()
    await checkAndAskQuestion()
    winner();
} 

main()