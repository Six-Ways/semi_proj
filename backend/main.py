from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import math, materials, devices

app = FastAPI(
    title="半导体物理与器件 API",
    description="为半导体物理与器件教育网站提供后端API服务",
    version="1.0.0"
)

# 配置CORS以支持前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:8085", "null"],  # 支持多个前端地址和文件协议
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(math.router, prefix="/api/math", tags=["数学计算"])
app.include_router(materials.router, prefix="/api/materials", tags=["半导体材料"])
app.include_router(devices.router, prefix="/api/devices", tags=["半导体器件"])

@app.get("/")
async def root():
    return {"message": "半导体物理与器件 API 服务"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)