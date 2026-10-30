import base64
import io
import os
from typing import Any

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image, ImageOps, UnidentifiedImageError

MODEL_PATH = os.getenv("MODEL_PATH", "/app/best_plant_doctor.keras")
CLASS_NAMES = ["Healthy", "Rusty", "Powdery", "Other"]
IMAGE_SIZE = (224, 224)
# Conservative abstention: Other, weak confidence, or a near tie is not forced
# into one of the three user-facing disease categories.
MIN_CONFIDENCE = float(os.getenv("MIN_CONFIDENCE", "0.60"))
MIN_MARGIN = float(os.getenv("MIN_MARGIN", "0.12"))

app = FastAPI(title="Plant Doctor Model API", version="1.0.0")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

class PredictRequest(BaseModel):
    imageBase64: str

@app.get("/health")
def health():
    return {"status": "ok", "modelLoaded": model is not None, "classes": CLASS_NAMES}

@app.post("/predict")
def predict(payload: PredictRequest) -> dict[str, Any]:
    raw = payload.imageBase64.strip()
    if "," in raw and raw.startswith("data:"):
        raw = raw.split(",", 1)[1]
    try:
        image_bytes = base64.b64decode(raw, validate=True)
        with Image.open(io.BytesIO(image_bytes)) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            image = image.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)
            pixels = np.asarray(image, dtype=np.float32)
    except (ValueError, UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail="Could not decode image. Upload a clear JPEG or PNG leaf photo.") from exc

    # Must match the notebook's MobileNetV2 preprocessing exactly.
    batch = tf.keras.applications.mobilenet_v2.preprocess_input(np.expand_dims(pixels, axis=0))
    scores = model.predict(batch, verbose=0)[0].astype(float)
    order = np.argsort(scores)[::-1]
    best_idx = int(order[0])
    confidence = float(scores[best_idx])
    margin = confidence - float(scores[int(order[1])])
    probabilities = {name: round(float(scores[i]), 6) for i, name in enumerate(CLASS_NAMES)}

    if best_idx == 3 or confidence < MIN_CONFIDENCE or margin < MIN_MARGIN:
        reason = (
            "The model detected a condition outside the three supported categories."
            if best_idx == 3 else
            "The model's prediction is not sufficiently distinct to make a reliable supported-category classification."
        )
        return {
            "category": None, "confidence": None, "uncertain": True,
            "uncertaintyType": "outside_supported_categories",
            "uncertaintyReason": reason,
            "topPrediction": CLASS_NAMES[best_idx],
            "topScore": round(confidence * 100, 1),
            "probabilities": probabilities,
        }

    category = CLASS_NAMES[best_idx]
    return {
        "category": category,
        "confidence": round(confidence * 100, 1),
        "uncertain": False,
        "probabilities": probabilities,
        "topPrediction": category,
    }
