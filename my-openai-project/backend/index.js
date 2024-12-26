const express = require("express");
const OpenAI = require("openai");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: "input your api key", // Replace with your OpenAI API key
});

app.post("/api/generate", async (req, res) => {
    try {
      const { messages } = req.body;
  
      // Append a system message to instruct summarization
      const instruction = {
        role: "system",
        content: "Please summarize the response to fit within 100 tokens and ensure it's concise and well-formatted.",
      };
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [instruction, ...messages], // Add system instruction before user messages
        max_tokens: 100, // Limit the response to 100 tokens
      });
  
      // Format the response content for HTML rendering
      const formattedContent = response.choices[0].message.content.replace(
        /\n/g,
        "<br>"
      ); // Replace newlines with <br> tags
  
      res.json({ content: formattedContent }); // Return formatted content
    } catch (error) {
      console.error("Error interacting with OpenAI:", error);
      res.status(500).send("Error generating response");
    }
  });
   

app.listen(8080, () => {
  console.log("Backend running at http://localhost:8080");
});
