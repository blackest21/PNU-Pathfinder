from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.admin.router import router as admin_router
from src.auth.router import router as auth_router
from src.chat.router import router as chat_router
from src.courses.router import router as courses_router
from src.database import init_db
from src.graduation.router import router as graduation_router
from src.recommendations.router import router as recommendations_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="PNU Pathfinder API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(courses_router)
app.include_router(graduation_router)
app.include_router(chat_router)
app.include_router(recommendations_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "pnu-pathfinder-backend"}
