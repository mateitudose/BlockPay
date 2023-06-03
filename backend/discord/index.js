const { Discord, Collection, Client, MessageEmbed, Message } = require('discord.js');
const client = new Client();
require('discord-buttons')(client);
const discordbuttons = require('discord-buttons');
const { MessageButton, MessageActionRow } = require("discord-buttons")
const abi = require("./abi.json");
const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
const contractAddress = "0x0d93d223BbE3Ea16a12b9AAE19dFF6A6e4A0e766";
const MyContract = new web3.eth.Contract(abi, contractAddress);
const prefix = "!";


client.on('clickButton', async (button) => {
    if (button.id == 'getid') {
        const member = button.clicker.member;
        //button.reply.send(`Your ID is: ${ member.id }`, true);
        button.reply.send(`ID-ul tău de discord este: \`${member.id}\``, true);
    }
})


client.on('ready', () => {
    console.log("╔══════════════════════════════╗");
    console.log(`║  Logged in as ${client.user.tag}!  ║`,);
    console.log("╚══════════════════════════════╝");
    const guild = client.guilds.resolve("1002949572018053190");
    const getMembers = async () => {
        try {
            const members = await guild.members.fetch();
            members.forEach(member => {
                const roleSubscribed = member.guild.roles.cache.get('1003199856619290624');
                const CheckSubscribed = async () => {
                    try {
                        const discordUserIDHash = Web3.utils.soliditySha3(member.user.id);
                        const userAddress = await MyContract.methods.userIds(discordUserIDHash).call();
                        const isSubscribed = await MyContract.methods.checkDue(userAddress).call();
                        if (isSubscribed == true && !member.roles.cache.some(role => role.name === "Subscribed")) {
                            console.log(`${member.user.tag} is subscribed`);
                            member.roles.add(roleSubscribed);
                        }
                        else if (isSubscribed == false && member.roles.cache.some(role => role.name === "Subscribed")) {
                            console.log(`${member.user.tag} is not subscribed`);
                            member.roles.remove(roleSubscribed);
                        }
                        else if (isSubscribed == false) {
                            console.log(`${member.user.tag} is not subscribed`);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
                CheckSubscribed();
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    const memberCount = guild.memberCount;
    setInterval(getMembers, 1000);
});


client.on('message', msg => {
    const args = msg.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    if (command === "button" && msg.author.id == "1003354840681947277") {
        if (!args.length) {
            return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
        }
        else {


            const embed = new MessageEmbed()
                .setTitle('Verification')
                .setColor("GREEN")
                .setDescription('Click the button below and get your Discord ID.');

            const add = new MessageButton()
                .setStyle("green")
                .setLabel("1. Get your Discord ID!")
                .setID("getid")

            const add2 = new MessageButton()
                .setStyle("url")
                .setURL(`https://mumbai.polygonscan.com/address/${contractAddress}#writeContract`)
                .setLabel("2. Click this link")

            //const row = new MessageActionRow()
            //    .addComponent(add)

            msg.channel.send({ component: [add, add2], embed: embed })
        }
    }

});

client.login('MTAwMjk0OTQ5NzMwNDkyMDE5Ng.G9GExi.-WgLeoOwgzpm7T6L1Q7VbyDqqTJ9kFI46Rqzsw');