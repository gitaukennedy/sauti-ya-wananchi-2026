import os
import faiss
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from sentence_transformers import SentenceTransformer

# Global placeholders to hold our models and data structures securely in server RAM
embedding_model = None
document_chunks = []
faiss_index = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global embedding_model, document_chunks, faiss_index
    
    print("\n==================================================")
    print("⏳ [RAG AUDIT] Starting up engine and checking files...")
    print("==================================================")
    
    try:
        app_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(app_dir)
        file_path = os.path.join(backend_dir, "finance_bill_2026.txt")
        
        print(f"📁 Looking for asset file at: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"❌ CRITICAL ERROR: The file '{file_path}' does not exist!")
            print("👉 Action: Please verify that 'finance_bill_2026.txt' is sitting in your main backend/ folder.")
        else:
            print("✅ File found! Reading content...")
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
            
            print(f"📊 File size read: {len(text)} characters.")
            
            if "--- SECTION/PAGE" in text:
                raw_chunks = text.split("--- SECTION/PAGE")
                print(f"✂️ Split document using '--- SECTION/PAGE' markers. Found {len(raw_chunks)} sections.")
            else:
                raw_chunks = text.split("\n\n")
                print(f"✂️ No page markers found. Split document using double newlines. Found {len(raw_chunks)} sections.")
            
            # Filter empty strings
            document_chunks = [chunk.strip() for chunk in raw_chunks if len(chunk.strip()) > 30]
            print(f"📝 Filtered out micro-chunks. Total valid chunks for RAG: {len(document_chunks)}")
            
            if document_chunks:
                if embedding_model is None:
                    print("📦 Loading Local Machine Learning Embedding Model...")
                    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
                    print("✅ Model loaded successfully!")
                
                print("🧬 Converting text chunks to mathematical vectors (This may take a moment)...")
                embeddings = embedding_model.encode(document_chunks)
                
                dimension = embeddings.shape[1]
                faiss_index = faiss.IndexFlatL2(dimension)
                faiss_index.add(np.array(embeddings).astype("float32"))
                print("==================================================")
                print("🎉 SUCCESS: RAG System Connected & Fully Armed in FAISS!")
                print("==================================================\n")
            else:
                print("❌ CRITICAL ERROR: Document chunks array is empty. The text file has no content.")
                
    except Exception as e:
        print(f"💥 CRITICAL PIPELINE FAILURE: {str(e)}")
        
    yield
    print("🛑 Shutting down application context safely.")

# Pass our modern lifespan parameters straight into the framework app configuration
app = FastAPI(lifespan=lifespan)

# Enable cross-port communication between Next.js (port 3000) and FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize free-tier Gemini Client
client = genai.Client()

class ChatRequest(BaseModel):
    message: str
    language: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    global embedding_model, document_chunks, faiss_index

    if not document_chunks or faiss_index is None or embedding_model is None:
        raise HTTPException(
            status_code=503, 
            detail="The RAG text database engine is uninitialized or loading. Please refresh in a moment."
        )

    try:
        # STEP 1: Process semantic query via the model instance
        query_vector = embedding_model.encode([request.message])
        distances, indices = faiss_index.search(np.array(query_vector).astype("float32"), k=4)
        
        matched_paragraphs = []
        for idx in indices[0]:
            if 0 <= idx < len(document_chunks):
                matched_paragraphs.append(document_chunks[idx])
        
        context = "\n\n---\n\n".join(matched_paragraphs)

        if not context.strip():
            context = "\n\n".join(document_chunks[:5])

        # STEP 2: Structural system instructions 
        system_instruction = (
            f"You are a specialized civic assistant analyzing the official 2026 Kenyan Finance Bill.\n"
            f"Break down the provisions, hidden additions, clauses, and socio-economic consequences for everyday citizens.\n"
            f"Be brutally honest, highly specific, objective, and grounded strictly in the provided legal context text.\n"
            f"Respond fully and natively in {request.language}."
        )

        # STEP 3: Dispatch context window directly to the core client
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
        print(f"Endpoint Processing Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error running processing engine: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)