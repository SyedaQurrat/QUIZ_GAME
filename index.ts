#! /usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";

// Store some enemies in an array
let enemies: string[] = ["skeleton", "Zombie", "warrior", "Assassin"];

// Store enemies health and attack amount
let enemyHealth: number = 100;
let enemyAttack: number = 20;

// Our health and attack amount
let ourHealth: number = 100;
let ourAttack: number = 20;

// Health potion and healing amount
let healthPotion: number = 3;
let healthHealingAmount: number = 30;

// When we kill enemies, we will get these points in percentage...
let healthPotionDropChance: number = 50;

let running: boolean = true;

let getRandomNumber = (minimum: number, max: number) => {
    return Math.floor(Math.random() * (max - minimum + 1)) + minimum;
};

console.log("<<", "=".repeat(15), "*".repeat(20), "=".repeat(15), ">>");
console.log(chalk.bold.italic.green("\t\tWELCOME TO ADVENTURE GAME"));
console.log("<<", "=".repeat(15), "*".repeat(20), "=".repeat(15), ">>");

(async () => {
    // Prompt for the player's name
    let playerNameAnswer = await inquirer.prompt({
        type: "input",
        name: "playerName",
        message: "What is your name?"
    });
    let playerName: string = playerNameAnswer.playerName;

    while (running) {

        // Allow the player to select an enemy to fight
        let enemySelection = await inquirer.prompt({
            type: "list",
            name: "selectedEnemy",
            message: "Which enemy would you like to fight?",
            choices: enemies
        });
        let currentEnemy: string = enemySelection.selectedEnemy;

        // Generate random health for the current enemy
        let currentEnemyHealth: number = getRandomNumber(50, enemyHealth);

        // Log the encounter
        console.log(`${playerName}, you have encountered a ${currentEnemy} with ${currentEnemyHealth} health!`);

        while (currentEnemyHealth > 0 && ourHealth > 0) {
            console.log(`\t${playerName} HP: ${ourHealth}`);
            console.log(`\t${currentEnemy} HP: ${currentEnemyHealth}`);

            // Ask the user what they want to do
            let control = await inquirer.prompt({
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: ["Attack", "Use Health Potion", "Run Away"]
            });

            switch (control.action) {
                case "Attack":
                    let attackDamage: number = getRandomNumber(10, ourAttack);
                    let enemyDamage: number = getRandomNumber(5, enemyAttack);

                    console.log(`\tYou attack the ${currentEnemy} for ${attackDamage} damage.`);
                    currentEnemyHealth -= attackDamage;

                    if (currentEnemyHealth > 0) {
                        console.log(`\t${currentEnemy} attacks you for ${enemyDamage} damage.`);
                        ourHealth -= enemyDamage;
                    } else {
                        console.log(`\tYou defeated the ${currentEnemy}!`);
                        let potionDropChance: number = getRandomNumber(1, 100);
                        if (potionDropChance <= healthPotionDropChance) {
                            healthPotion++;
                            console.log(`\tThe ${currentEnemy} dropped a health potion! You now have ${healthPotion} potions.`);
                        }
                    }
                    break;

                case "Use Health Potion":
                    if (healthPotion > 0) {
                        ourHealth += healthHealingAmount;
                        healthPotion--;
                        console.log(`\tYou used a health potion. Your health is now ${ourHealth}. You have ${healthPotion} potions left.`);
                    } else {
                        console.log("\tYou have no health potions left!");
                    }
                    break;

                case "Run Away":
                    console.log(`\tYou run away from the ${currentEnemy}!`);
                    running = false;
                    break;
            }

            if (ourHealth <= 0) {
                console.log("You have been defeated! Game Over.");
                running = false;
            }
        }

        if (ourHealth > 0 && running) {
            console.log("You have defeated the enemy. Do you want to continue?");
            let continueGame = await inquirer.prompt({
                type: "confirm",
                name: "continue",
                message: "Do you want to keep playing?"
            });
            running = continueGame.continue;
        } else {
            console.log("Exiting the game. Thanks for playing!");
            running = false;
        }
    }
})();
