import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { SYSTEM_PROMPT } from "./prompts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = apiKey ? new Anthropic({ apiKey }) : null;
const CLAUDE_MODEL =
  process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
export const CLAUDE_HAIKU_MODEL =
  process.env.CLAUDE_HAIKU_MODEL || "claude-haiku-4-5";

export const isClaudeConfigured = () => !!client;

export const parseJSONResponse = (text) => {
  let cleanText = text.trim();
  cleanText = cleanText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanText);
};

export const callClaude = async (userPrompt, maxTokens, options = {}) => {
  if (!client) {
    throw new Error("Claude API client is not initialized.");
  }

  const response = await client.messages.create({
    model: options.model || CLAUDE_MODEL,
    max_tokens: maxTokens,
    system: options.system || SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  return response.content[0].text.trim();
};

export const callClaudeJSON = async (userPrompt, maxTokens, options = {}) => {
  const text = await callClaude(userPrompt, maxTokens, options);
  return parseJSONResponse(text);
};
