import os
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

app = FastAPI()

# Enable cross-port communication between Next.js (port 3000) and FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize free-tier Gemini Client (automatically uses GEMINI_API_KEY from environment)
client = genai.Client()

class ChatRequest(BaseModel):
    message: str
    language: str

def extract_relevant_context(file_path: str, query: str) -> str:
    """
    High-speed scan engine tailored for the official text-extracted bill.
    Scans the pages in milliseconds and extracts relevant clauses matching the query keywords.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        
        # If the entire file is small, pass the whole document directly
        if len(text) <= 30000:
            return text
            
        # Split the text by pages or sections based on how parse.py formatted it
        paragraphs = text.split("--- SECTION/PAGE")
        if len(paragraphs) <= 1:
            # Fallback to standard double newline splits if no page markers exist
            paragraphs = text.split("\n\n")
            
        # Clean up the user query into searchable keywords, ignoring generic text filler
        keywords = [w.lower() for w in re.findall(r'\b\w{4,}\b', query) if w.lower() not in ['this', 'that', 'with', 'from', 'bill', 'about', 'please']]
        
        # Fallback if the query is too short or doesn't have unique searchable keywords
        if not keywords:
            return text[:30000]
            
        scored_paragraphs = []
        for para in paragraphs:
            if len(para.strip()) < 20:
                continue
            # Score this section based on keyword match hits
            score = sum(2 for word in keywords if word in para.lower())
            if score > 0:
                scored_paragraphs.append((score, para))
                
        # Sort by best match density and take the top 15 most relevant sections
        scored_paragraphs.sort(key=lambda x: x[0], reverse=True)
        best_matches = [para for score, para in scored_paragraphs[:15]]
        
        context_chunk = "\n\n".join(best_matches)
        
        # CRITICAL SAFEGUARD: If no specific keyword hits are found, return the first 30k characters 
        # of the actual bill so the AI always has data to answer the user!
        if not context_chunk.strip():
            return text[:30000]
            
        return context_chunk
    except Exception as e:
        print(f"Context engine notice: {str(e)}")
        return ""

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Map the folder location to find your newly generated text asset file
    app_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(app_dir)
    file_path = os.path.join(backend_dir, "finance_bill_2026.txt")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="The 'finance_bill_2026.txt' data asset file was not found in the backend root folder.")

    # 1. Run our high-speed context text extractor
    context = extract_relevant_context(file_path, request.message)

    # 2. Fire the compiled request off to the Gemini Flash Engine
    try:
        system_instruction = (
            f"You are a specialized civic assistant analyzing the official 2026 Kenyan Finance Bill. "
            f"Break down the provisions, hidden additions, clauses, and socio-economic consequences for everyday citizens. "
            f"Be brutally honest, highly specific, objective, and grounded strictly in the provided legal context text. "
            f"Respond fully and natively in {request.language}."
        )

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"Context From Document:\n{context}\n\nQuestion: {request.message}",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
            )
        )
        return {"response": response.text}
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Endpoint Processing Error: {error_details}")
        raise HTTPException(status_code=500, detail=f"Error running prompt processing engine: {str(e)}")

# Safe Windows process spawning entry check guardrail
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)