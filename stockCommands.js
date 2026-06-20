const fs = require("fs");

const STOCK_FILE = "./stock.json";

function loadStock() {
    if (!fs.existsSync(STOCK_FILE)) {
        fs.writeFileSync(STOCK_FILE, "{}");
    }

    return JSON.parse(fs.readFileSync(STOCK_FILE, "utf8"));
}

function saveStock(stock) {
    fs.writeFileSync(
        STOCK_FILE,
        JSON.stringify(stock, null, 2)
    );
}

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {

        if (!interaction.isChatInputCommand()) return;

        const stock = loadStock();

        // /addstock
        if (interaction.commandName === "addstock") {

            const type = interaction.options.getString("type");
            const account = interaction.options.getString("account");

            if (!stock[type])
                stock[type] = [];

            stock[type].push(account);

            saveStock(stock);

            return interaction.reply({
                content: `✅ Added account to **${type}**`,
                ephemeral: true
            });
        }


        // /stock
        if (interaction.commandName === "stock") {

            const type = interaction.options.getString("type");

            const amount = stock[type]?.length || 0;

            return interaction.reply({
                content: `📦 **${type}** stock: **${amount}**`,
                ephemeral: true
            });
        }


        // /deliver
        if (interaction.commandName === "deliver") {

            const type = interaction.options.getString("type");
            const user = interaction.options.getUser("user");

            if (!stock[type] || stock[type].length === 0) {
                return interaction.reply({
                    content: `❌ No ${type} stock available`,
                    ephemeral: true
                });
            }

            const item = stock[type].shift();

            saveStock(stock);

            try {

                await user.send(
`🎁 Your ${type} payout

${item}

Enjoy!`
                );

                interaction.reply({
                    content: `✅ Sent ${type} to ${user.tag}`,
                    ephemeral: true
                });

            } catch {

                stock[type].unshift(item);
                saveStock(stock);

                interaction.reply({
                    content: "❌ Couldn't DM user.",
                    ephemeral: true
                });
            }
        }

    }
};
