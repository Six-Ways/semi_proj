from fastapi import APIRouter
import numpy as np
from pydantic import BaseModel
from typing import Dict, Any, List

router = APIRouter()

class MaterialProperties(BaseModel):
    name: str
    type: str  # semiconductor, metal, insulator
    band_gap: float  # eV
    electron_mobility: float  # cm²/V·s
    hole_mobility: float  # cm²/V·s
    dielectric_constant: float
    density: float  # g/cm³
    melting_point: float  # K
    lattice_constant: float  # Å

@router.get("/list", response_model=List[MaterialProperties])
async def list_materials():
    """获取所有半导体材料列表"""
    materials = [
        MaterialProperties(
            name="硅(Si)",
            type="semiconductor",
            band_gap=1.12,
            electron_mobility=1400,
            hole_mobility=450,
            dielectric_constant=11.7,
            density=2.33,
            melting_point=1687,
            lattice_constant=5.43
        ),
        MaterialProperties(
            name="锗(Ge)",
            type="semiconductor",
            band_gap=0.66,
            electron_mobility=3900,
            hole_mobility=1900,
            dielectric_constant=16.0,
            density=5.32,
            melting_point=1211,
            lattice_constant=5.66
        ),
        MaterialProperties(
            name="砷化镓(GaAs)",
            type="semiconductor",
            band_gap=1.42,
            electron_mobility=8500,
            hole_mobility=400,
            dielectric_constant=13.1,
            density=5.32,
            melting_point=1511,
            lattice_constant=5.65
        ),
        MaterialProperties(
            name="氮化镓(GaN)",
            type="semiconductor",
            band_gap=3.4,
            electron_mobility=2000,
            hole_mobility=300,
            dielectric_constant=9.5,
            density=6.15,
            melting_point=2791,
            lattice_constant=4.52
        )
    ]
    
    return materials

@router.get("/{material_name}", response_model=MaterialProperties)
async def get_material(material_name: str):
    """获取特定材料的属性"""
    materials = await list_materials()
    
    for material in materials:
        if material_name.lower() in material.name.lower():
            return material
    
    return {"error": "Material not found"}

@router.post("/calculate-properties")
async def calculate_material_properties(request: Dict[str, Any]):
    """根据输入参数计算材料属性"""
    material_type = request.get("material_type", "semiconductor")
    temperature = request.get("temperature", 300)  # K
    
    # 简化的模型，实际应用中会更复杂
    if material_type == "semiconductor":
        # 载流子浓度随温度变化
        band_gap = request.get("band_gap", 1.12)  # eV
        k = 8.617e-5  # 玻尔兹曼常数 (eV/K)
        intrinsic_concentration = 1e19 * np.exp(-band_gap / (2 * k * temperature))
        
        return {
            "material_type": material_type,
            "temperature": temperature,
            "intrinsic_concentration": intrinsic_concentration,
            "conductivity": intrinsic_concentration * 1.6e-19 * (1400 + 450) * 1e-4,  # S/cm
            "resistivity": 1 / (intrinsic_concentration * 1.6e-19 * (1400 + 450) * 1e-4)  # Ω·cm
        }
    elif material_type == "metal":
        # 金属电阻率随温度线性变化
        resistivity_300K = request.get("resistivity_300K", 1.7e-6)  # Ω·cm
        temperature_coefficient = request.get("temperature_coefficient", 0.004)  # 1/K
        resistivity = resistivity_300K * (1 + temperature_coefficient * (temperature - 300))
        
        return {
            "material_type": material_type,
            "temperature": temperature,
            "resistivity": resistivity,
            "conductivity": 1 / resistivity
        }
    else:  # insulator
        # 绝缘体电阻率极高，随温度指数变化
        activation_energy = request.get("activation_energy", 2.0)  # eV
        k = 8.617e-5  # 玻尔兹曼常数 (eV/K)
        resistivity = 1e14 * np.exp(activation_energy / (k * temperature))  # Ω·cm
        
        return {
            "material_type": material_type,
            "temperature": temperature,
            "resistivity": resistivity,
            "conductivity": 1 / resistivity
        }