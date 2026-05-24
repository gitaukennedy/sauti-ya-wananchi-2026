import os
from pypdf import PdfReader

def extract_pdf_text():
    # Paths setup
    pdf_path = "document.pdf"
    output_path = "finance_bill_2026.txt"
    
    if not os.path.exists(pdf_path):
        print("❌ Error: Could not find 'document.pdf' in the backend folder!")
        return

    print("⏳ Extracting 124 pages of text... Please wait...")
    reader = PdfReader(pdf_path)
    full_text = []
    
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            full_text.append(f"--- PAGE {i+1} ---\n{text}")
            
    # Write the clean text out directly to your data file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n\n".join(full_text))
        
    print(f"✅ Success! Clean text saved directly to '{output_path}'")

if __name__ == "__main__":
    extract_pdf_text()