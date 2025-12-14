import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List, Dict, Any

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))



model_rag = genai.GenerativeModel('gemini-2.0-flash')

# Refusal messages
REFUSAL_EN = "I'm sorry, I can only answer questions related to the textbook content."
REFUSAL_UR = "Maaf kijiye, mein sirf textbook ke content se related sawalon ka jawab de sakta hoon."

async def detect_language(text: str) -> str:
    """Detects if the text is English or Roman Urdu using the Gemini model."""
    try:
        # Prompt the model to identify the language
        prompt = f"Identify the language of the following text: '{text}'. Respond with 'en' for English or 'ur' for Roman Urdu."
        response = await model_rag.generate_content(prompt)
        lang_code = response.text.strip().lower()
        if "ur" in lang_code:
            return "ur"
        return "en" # Default to English
    except Exception as e:
        print(f"Error detecting language: {e}")
        return "en" # Default to English on error

async def check_relevance(question: str) -> bool:
    """Checks if the question is relevant to the Humanoid Robotics textbook content."""
    try:
        # Prompt the model to determine relevance
        prompt = f"Is the following question relevant to a 'Humanoid Robotics' textbook? Answer with 'yes' or 'no'. Question: '{question}'"
        response = await model_rag.generate_content(prompt)
        relevance_check = response.text.strip().lower()
        return "yes" in relevance_check
    except Exception as e:
        print(f"Error checking relevance: {e}")
        return True # Default to relevant on error to not block valid questions


async def generate_rag_response(question: str, context_chunks: List[str], source_references: List[str]) -> Dict[str, Any]:
    lang = await detect_language(question)
    lang = await detect_language(question)

    if not context_chunks:
        # Check relevance even if context is empty, to provide a relevant refusal
        is_relevant = await check_relevance(question)
        if not is_relevant:
            refusal_message = REFUSAL_EN if lang == "en" else REFUSAL_UR
            return {
                "answer": refusal_message,
                "detailed_answer": refusal_message,
                "sources": []
            }
        
        return {
            "answer": "Answer not found in the book. Please try rephrasing your question or selecting more relevant text.",
            "detailed_answer": "Answer not found in the book. Please try rephrasing your question or selecting more relevant text.",
            "sources": []
        }
    
    # Check relevance for non-empty context too
    is_relevant = await check_relevance(question)
    if not is_relevant:
        refusal_message = REFUSAL_EN if lang == "en" else REFUSAL_UR
        return {
            "answer": refusal_message,
            "detailed_answer": refusal_message,
            "sources": []
        }

    formatted_context = "\n\n".join(context_chunks)
    
    # System rules: Answer ONLY from provided context. If answer not found -> say "Answer not found in the book".
    # Provide a concise summary first, and then elaborate with more detail in a separate 'detailed_answer' section, including specific citations.
    system_message = (
        "You are a helpful assistant for a Humanoid Robotics textbook. Your primary goal is to answer questions strictly from the provided context from the book. "
        "If the answer is not found within the given context, clearly state 'Answer not found in the book.' Do not make up answers. "
        "Provide a concise summary first, and then elaborate with more detail in a separate 'detailed_answer' section, including specific citations to the provided sources (e.g., 'Source: chapter1.md'). "
        f"Respond in {'Roman Urdu' if lang == 'ur' else 'English'}."
    )
    user_message = f"Context from the book:\n{formatted_context}\n\nQuestion: {question}"

    full_prompt = f"{system_message}\n\n{user_message}"

    try:
        response = await model_rag.generate_content(
            full_prompt,
            generation_config={"temperature": 0.2}
        )
        llm_full_response = response.text.strip()

        # Attempt to parse into concise and detailed parts (heuristic)
        concise_answer = llm_full_response.split('\n\n')[0] # First paragraph as concise
        detailed_answer = llm_full_response

        unique_sources = list(set(source_references))
        
        return {
            "answer": concise_answer,
            "detailed_answer": detailed_answer,
            "sources": unique_sources
        }
    except Exception as e:
        print(f"Error generating LLM response: {e}")
        return {
            "answer": "An error occurred while generating the response. Please try again later.",
            "detailed_answer": "An error occurred while generating the response. Please try again later.",
            "sources": []
        }
