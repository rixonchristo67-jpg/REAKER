import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('stocklist')
        .setDescription('View stock'),

    async execute(interaction) {
        const stock = JSON.parse(
            fs.readFileSync('./src/stock/stock.json', 'utf8')
        );

        let message = '📦 Current Stock\n\n';

for (const product in stock) {
    message += `${product}: ${stock[product].length}\n`;
}
        }

        await interaction.reply({
            content: message,
            ephemeral: true
        });
    }
};
