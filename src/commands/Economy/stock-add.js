import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('stockadd')
    .setDescription('Add stock')
    .addStringOption(option =>
      option
        .setName('product')
        .setDescription('MCFA, Nitro or Netflix')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('email')
        .setDescription('Email')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('password')
        .setDescription('Password')
        .setRequired(true)
    ),

  async execute(interaction) {
    const product = interaction.options.getString('product');
    const email = interaction.options.getString('email');
    const password = interaction.options.getString('password');

    const stock = JSON.parse(
      fs.readFileSync('./src/stock/stock.json', 'utf8')
    );

    if (!stock[product]) {
      stock[product] = [];
    }

    stock[product].push({
      email,
      password
    });

    fs.writeFileSync(
      './src/stock/stock.json',
      JSON.stringify(stock, null, 2)
    );

    await interaction.reply('✅ Stock added');
  }
};
