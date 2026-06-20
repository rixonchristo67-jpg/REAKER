import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Send a stock item to a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to send to')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('product')
                .setDescription('MCFA, Nitro or Netflix')
                .setRequired(true)
        ),

    async execute(interaction) {
        const receiver = interaction.options.getUser('user');
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

        const account = stock[product].shift();

        fs.writeFileSync(
            './src/stock/stock.json',
            JSON.stringify(stock, null, 2)
        );

        try {
            await receiver.send(
`📦 ${product}

Email: ${account.email}

Password: ${account.password}`
            );

            await interaction.reply({
                content: `✅ Sent ${product} to ${receiver.tag}`,
                ephemeral: true
            });

        } catch (err) {
            await interaction.reply({
                content: `❌ Could not DM ${receiver.tag}`,
                ephemeral: true
            });
        }
    }
};
