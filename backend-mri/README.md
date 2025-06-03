<h1 align="center">
  Brain MRI Backend
</h1>

---

> **Description**: This backend application provides an API for classifying brain MRI images using a pre-trained ResNet50 model and generating AI-based descriptions and solutions for detected conditions.

---

## 🚀 Features

- **Image Classification**: Classify brain MRI images into four categories: Glioma, Healthy, Meningioma, and Pituitary.
- **AI Description**: Generate medical descriptions and solutions for detected conditions using Groq API.
- **Google Drive Integration**: Automatically download the model if not available locally.

---

## ✅ Getting Started

### 📦 Prerequisites

Ensure you have the following installed:

- **Python** (v3.8 or higher)
- **pip** (Python package manager)

### 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/backend-mri.git
   cd backend-mri
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory and add the following:

   ```properties
   API_GROQ=<your_groq_api_key>
   ```

   Replace `<your_groq_api_key>` with your Groq API key.

---

## 🚀 Running the Project

Start the Flask server:

```bash
python app.py
```

The server will run at `http://127.0.0.1:5000`.

---

## 📊 API Endpoints

### **GET /**

- **Description**: Returns a welcome message.
- **Response**:
  ```html
  <h1>Brain MRI Classifier + AI Describer</h1>
  ```

### **POST /upload**

- **Description**: Upload an MRI image for classification.
- **Request**:
  - **Content-Type**: `multipart/form-data`
  - **Body**: An image file.
- **Response**:
  ```json
  {
    "accuracy": "95.00%",
    "class_category": "Glioma",
    "description": "Deskripsi kondisi otak.",
    "solution": "Solusi medis yang disarankan."
  }
  ```

---

## 🧠 Project Structure

```
backend-mri/
├── model/                # Pre-trained model files
├── img_raw/              # Temporary image storage
├── app.py                # Main application file
├── .env                  # Environment variables
├── .gitignore            # Git ignored files
├── LICENSE               # Project license
└── README.md             # Project documentation
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🙌 Contributing

We welcome contributions! Follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request with a clear description.

---

## 🛠️ Troubleshooting

If you encounter issues:

- Ensure all dependencies are installed.
- Verify the `.env` file contains the correct API key.
- Check the console logs for error messages.

---

## 📧 Contact

For questions or feedback, reach out to:

- **Email**: support@neirasphere.com
- **GitHub**: [Neira Sphere Team](https://github.com/neirasphere)

---

## 🎉 Acknowledgments

Special thanks to contributors and the open-source community for their support!
