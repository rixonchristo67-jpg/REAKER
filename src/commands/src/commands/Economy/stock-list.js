import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('stockview')
        .setDescription('View stock accounts')
        .addStringOption(option =>
            option
                .setName('product')
                .setDescription('MCFA, Nitro or Netflix')
                .setRequired(true)
        ),

    async execute(interaction) {
        const product = interaction.options.getString('product');

        const stock = JSON.parse(
            fs.readFileSync('./src/stock/stock.json', 'utf8')
        );

        if (!stock[product] || stock[product].length === 0) {
            return interaction.reply({
                content: `❌ No ${product} stock available`,
                ephemeral: true
            });
        }

        let message = `📦 ${product} Stock\n\n`;

        stock[product].forEach((item, index) => {
            message += `${index + 1}. ${item.email} : ${item.password}\n`;
        });

        await interaction.reply({
            content: `\`\`\`\n${message}\n\`\`\``,
            ephemeral: true
        });
    }
};
