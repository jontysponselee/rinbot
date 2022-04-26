import {ApplicationCommandOptionTypes, ApplicationCommandTypes, InteractionResponseTypes} from "../../deps.ts";
import {createCommand} from "./mod.ts";
import {GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID} from "../../configs.ts";

createCommand({
  name: "definition",
  description: "Search google for a definition",
  type: ApplicationCommandTypes.ChatInput,
  scope: "Global",
  options: [
    {
      name: "language",
      required: true,
      type: ApplicationCommandOptionTypes.String,
      description: "Choose a language",
      choices: [
        {
          name: "Dutch",
          value: "betekenis"
        },
        {
          name: "English",
          value: "definition"
        },
      ]
    },
    {
      name: "query",
      required: true,
      type: ApplicationCommandOptionTypes.String,
      description: "word for definition",
    }
  ],
  execute: async (bot, interaction) => {
    const definitionTranslated = interaction?.data?.options?.find(option => option.name == "language")?.value
    const query = interaction?.data?.options?.find(option => option.name == "query")?.value

    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${query}%20${definitionTranslated}`;

    const googleSearchResult = await (await fetch(url)).json();

    if(!googleSearchResult.hasOwnProperty("items")) {
      await bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {content: ":zany_face:"},
        },
      );
      return;
    }

    const content = googleSearchResult.items[0].snippet;

    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {content},
      },
    );
  },
});
