from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input
from PIL import Image
import numpy as np
import os, time, traceback, dotenv
from groq import Groq
import gdown  # <--- Tambahkan ini

app = Flask(__name__)
CORS(app)
dotenv.load_dotenv()

# === [ DOWNLOAD MODEL DARI GOOGLE DRIVE JIKA BELUM ADA ] ===
model_path = './model/model_resnet50.h5'
file_id = '1sW0Qg2A_qMzfwfE2GxnwGkQ5xZv4Xqj2'  # Ganti sesuai ID file model kamu


if not os.path.exists(model_path):
    print("📥 Downloading model from Google Drive...")
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    url = f"https://drive.google.com/uc?id={file_id}"
    gdown.download(url, model_path, quiet=False)
else:
    print("✅ Model sudah tersedia secara lokal.")

# === [ LOAD MODEL ] ===
model = load_model(model_path)
output_class = ["glioma", "healthy", "meningioma", "pituitary"]
UPLOAD_FOLDER = './img_raw'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return "<h1>Brain MRI Classifier + AI Describer</h1>"

def preprocessing_input(img_path):
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224))
    img = np.array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    return img

def ai_description(category):
    try:
        token = os.getenv("API_GROQ")
        if not token:
            print("❌ API_GROQ token not found in environment.")
            return "Deskripsi tidak tersedia (token tidak ditemukan).", "Solusi tidak tersedia (token tidak ditemukan)."

        client = Groq(api_key=token)
        messages = [
            {
                "role": "system",
                "content": (
                    "Anda adalah seorang ahli medis spesialis otak. "
                    "Berikan deskripsi singkat (maksimal 2 kalimat) tentang kondisi atau tumor otak yang disebutkan, "
                    "termasuk karakteristik utama dan metode penanganannya. "
                    "Kemudian, berikan pencegahan atau tindakan medis yang dapat diambil (maksimal 1 kalimat). "
                    "Jawaban dalam bahasa Indonesia."
                )
            },
            {
                "role": "user",
                "content": category
            }
        ]
        chat = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=messages
        )
        reply = chat.choices[0].message.content

        # Pisahkan deskripsi dan solusi berdasarkan titik (.)
        sentences = reply.split('. ')
        description = sentences[0] + '.' if len(sentences) > 0 else "Deskripsi tidak tersedia."
        solution = sentences[1] + '.' if len(sentences) > 1 else "Solusi tidak tersedia."

        return description, solution
    except Exception as e:
        print("❌ Error generating description:", e)
        traceback.print_exc()
        return "Deskripsi tidak tersedia (error API).", "Solusi tidak tersedia (error API)."

def predict_image(img_path):
    try:
        img = preprocessing_input(img_path)
        result = model.predict(img)[0]
        predicted_class_idx = np.argmax(result)
        predicted_class = output_class[predicted_class_idx]
        predicted_probability = result[predicted_class_idx]

        description, solution = ai_description(predicted_class)

        return {
            "accuracy": f"{predicted_probability:.2%}",
            "class_category": predicted_class.title(),
            "description": description,
            "solution": solution
        }

    except Exception as e:
        print("❌ Prediction error:", e)
        traceback.print_exc()
        return {
            "accuracy": "-%",
            "class_category": "Not Found",
            "description": "Not Found",
            "solution": "Not Found"
        }

@app.route('/upload', methods=['POST'])
def upload():
    start_time = time.time()

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        result = predict_image(file_path)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    duration = time.time() - start_time
    print(f"🕒 Execution time: {duration:.2f} seconds")

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
