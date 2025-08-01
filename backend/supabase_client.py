import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

def upload_image(file_path, file_name):
    with open(file_path, "rb") as f:
        data = f.read()
        
    response = supabase.storage.from_("products-img").upload(file_name, data)
    if response.get("error"):
        print("Erro upload:", response["error"])
        return None
    else:
        # Retorna o caminho do arquivo no bucket
        return response["path"]
    
def get_public_url(file_name):
    url = supabase.storage.from_("products-img").get_public_url(file_name)
    return url
