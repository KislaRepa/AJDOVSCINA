const fs = require("fs");
const createAssistant = async (openai) => {
  const assistantFilePath = "assistant.json";
  if (!fs.existsSync(assistantFilePath)) {
    const file = await openai.files.create({
      file: fs.createReadStream("1_Odlok_o_občinskem_prostorskem_načrtu_OPN_Ajdovščina.pdf"),
      purpose: "assistants",
    });
    let vectorStore = await openai.beta.vectorStores.create({
      name: "AJDOVSCINA_baza",
      file_ids: [file.id],
    });
    const assistant = await openai.beta.assistants.create({
      name: "AJDOVSCINA",
      instructions: `Interpretacija in odgovarjanje na vprašanja povezava z odlokom o občinskem prostorskem načrtu Mestne občine Ajdovsščina.`,
      tools: [{ type: "file_search" }],
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      model: "gpt-4o-mini",
    });
    fs.writeFileSync(assistantFilePath, JSON.stringify(assistant));
    return assistant;
  } else {
    const assistant = JSON.parse(fs.readFileSync(assistantFilePath));
    return assistant;
  }
};
module.exports = { createAssistant };
