from fastapi import APIRouter
import numpy as np
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class FunctionRequest(BaseModel):
    function_type: str
    parameters: Dict[str, Any] = {}

class FunctionData(BaseModel):
    x: List[float]
    y: List[float]

@router.post("/fermi-function", response_model=FunctionData)
async def calculate_fermi_function(request: FunctionRequest):
    """计算费米-狄拉克分布函数"""
    Ef = request.parameters.get("Ef", 0.0)  # 费米能级
    kT = request.parameters.get("kT", 0.025)  # 室温下的kT值 (eV)
    x_min = request.parameters.get("x_min", -0.5)
    x_max = request.parameters.get("x_max", 0.5)
    num_points = request.parameters.get("num_points", 100)
    
    x = np.linspace(x_min, x_max, num_points)
    y = 1 / (1 + np.exp((x - Ef) / kT))
    
    return FunctionData(x=x.tolist(), y=y.tolist())

@router.post("/band-structure", response_model=FunctionData)
async def calculate_band_structure(request: FunctionRequest):
    """计算能带结构"""
    material_type = request.parameters.get("material_type", "semiconductor")
    Eg = request.parameters.get("Eg", 1.12)  # 带隙宽度，默认为硅的带隙
    
    x_min = request.parameters.get("x_min", -5)
    x_max = request.parameters.get("x_max", 5)
    num_points = request.parameters.get("num_points", 100)
    
    k = np.linspace(x_min, x_max, num_points)
    
    if material_type == "semiconductor":
        # 半导体能带结构
        valence_band = -Eg/2 - 0.1 * np.sin(k)
        conduction_band = Eg/2 + 0.1 * np.sin(k)
    elif material_type == "metal":
        # 金属能带结构
        valence_band = 0.2 * k
        conduction_band = 0.2 * k + 0.5
    else:  # insulator
        # 绝缘体能带结构
        valence_band = -Eg/2 - 0.05 * np.sin(k)
        conduction_band = Eg/2 + 0.05 * np.sin(k)
    
    # 返回价带和导带数据
    return {
        "k": k.tolist(),
        "valence_band": valence_band.tolist(),
        "conduction_band": conduction_band.tolist(),
        "material_type": material_type,
        "band_gap": Eg
    }

@router.post("/carrier-concentration", response_model=FunctionData)
async def calculate_carrier_concentration(request: FunctionRequest):
    """计算载流子浓度与温度关系"""
    Eg = request.parameters.get("Eg", 1.12)  # 带隙宽度
    T_min = request.parameters.get("T_min", 100)  # 最低温度(K)
    T_max = request.parameters.get("T_max", 500)  # 最高温度(K)
    num_points = request.parameters.get("num_points", 100)
    
    T = np.linspace(T_min, T_max, num_points)
    k = 8.617e-5  # 玻尔兹曼常数 (eV/K)
    
    # 本征载流子浓度 ni = sqrt(Nc * Nv) * exp(-Eg/(2*k*T))
    # 简化模型，假设 Nc * Nv 为常数
    ni = 1e19 * np.exp(-Eg / (2 * k * T))
    
    return {
        "temperature": T.tolist(),
        "concentration": ni.tolist(),
        "band_gap": Eg
    }

@router.post("/plot-data")
async def generate_plot_data(request: FunctionRequest):
    """生成通用绘图数据"""
    plot_type = request.parameters.get("plot_type", "line")
    num_points = request.parameters.get("num_points", 100)
    
    if plot_type == "sine":
        x = np.linspace(0, 2*np.pi, num_points)
        y = np.sin(x)
    elif plot_type == "cosine":
        x = np.linspace(0, 2*np.pi, num_points)
        y = np.cos(x)
    elif plot_type == "parabola":
        x = np.linspace(-2, 2, num_points)
        y = x**2
    else:  # default to line
        x = np.linspace(0, 1, num_points)
        y = x
    
    return FunctionData(x=x.tolist(), y=y.tolist())