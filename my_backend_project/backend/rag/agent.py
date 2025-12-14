from typing import List, Dict, Any
from openai import OpenAI
from ..config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

async def generate_rag_response(question: str, context_chunks: List[str], source_references: List[str]) -> Dict[str, Any]:
    if not context_chunks:
        return {
            "answer": "Answer not found in the book. Please try rephrasing your question or selecting more relevant text.",
            "detailed_answer": "Answer not found in the book. Please try rephrasing your question or selecting more relevant text.",
            "sources": []
        }

    formatted_context = "\n\n".join(context_chunks)
    
    # System rules: Answer ONLY from provided context. If answer not found -> say "Answer not found in the book".
    # Provide a concise summary first, and then elaborate with more detail in a separate 'detailed_answer' section, including specific citations.
    system_message = (
        "You are a helpful assistant for a Humanoid Robotics textbook. Your primary goal is to answer questions strictly from the provided context from the book. "
        "If the answer is not found within the given context, clearly state 'Answer not found in the book.' Do not make up answers. "
        "Provide a concise summary first, and then elaborate with more detail in a separate 'detailed_answer' section, including specific citations to the provided sources (e.g., 'Source: chapter1.md')."
    )
    user_message = f"Context from the book:\n{formatted_context}\n\nQuestion: {question}"

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message}
    ]

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or another suitable OpenAI model
            messages=messages,
            temperature=0.2, # Allow for slight creativity while remaining factual
        )
        llm_full_response = response.choices[0].message.content.strip()

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
