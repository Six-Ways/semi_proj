from fastapi import APIRouter
import numpy as np
from pydantic import BaseModel
from typing import Dict, Any, List

router = APIRouter()

class DeviceProperties(BaseModel):
    name: str
    type: str  # diode, transistor, integrated_circuit
    description: str
    operating_voltage: float  # V
    max_current: float  # A
    switching_speed: float  # Hz
    power_consumption: float  # W
    applications: List[str]

@router.get("/list", response_model=List[DeviceProperties])
async def list_devices():
    """获取所有半导体器件列表"""
    devices = [
        DeviceProperties(
            name="PN结二极管",
            type="diode",
            description="最基本的半导体器件，由P型和N型半导体接触形成",
            operating_voltage=0.7,
            max_current=1.0,
            switching_speed=1e6,
            power_consumption=0.5,
            applications=["整流", "开关", "电压调节"]
        ),
        DeviceProperties(
            name="双极结型晶体管(BJT)",
            type="transistor",
            description="电流控制型器件，可用于放大和开关",
            operating_voltage=5.0,
            max_current=0.1,
            switching_speed=1e8,
            power_consumption=0.2,
            applications=["放大器", "开关", "逻辑电路"]
        ),
        DeviceProperties(
            name="金属氧化物半导体场效应管(MOSFET)",
            type="transistor",
            description="电压控制型器件，现代集成电路的基础",
            operating_voltage=3.3,
            max_current=0.05,
            switching_speed=1e9,
            power_consumption=0.1,
            applications=["数字电路", "功率开关", "射频放大"]
        ),
        DeviceProperties(
            name="CMOS反相器",
            type="integrated_circuit",
            description="由一个NMOS和一个PMOS晶体管组成的基本逻辑门",
            operating_voltage=3.3,
            max_current=0.001,
            switching_speed=1e9,
            power_consumption=0.001,
            applications=["数字逻辑", "微处理器", "存储器"]
        )
    ]
    
    return devices

@router.get("/{device_name}", response_model=DeviceProperties)
async def get_device(device_name: str):
    """获取特定器件的属性"""
    devices = await list_devices()
    
    for device in devices:
        if device_name.lower() in device.name.lower():
            return device
    
    return {"error": "Device not found"}

@router.post("/diode-characteristics")
async def calculate_diode_characteristics(request: Dict[str, Any]):
    """计算二极管特性曲线"""
    Is = request.get("Is", 1e-12)  # 反向饱和电流 (A)
    n = request.get("n", 1)  # 理想因子
    V_min = request.get("V_min", 0)  # 最小电压 (V)
    V_max = request.get("V_max", 0.8)  # 最大电压 (V)
    temperature = request.get("temperature", 300)  # 温度 (K)
    num_points = request.get("num_points", 100)
    
    k = 1.38e-23  # 玻尔兹曼常数 (J/K)
    q = 1.6e-19  # 电子电荷 (C)
    Vt = k * temperature / q  # 热电压
    
    V = np.linspace(V_min, V_max, num_points)
    I = Is * (np.exp(V / (n * Vt)) - 1)
    
    return {
        "voltage": V.tolist(),
        "current": I.tolist(),
        "temperature": temperature,
        "thermal_voltage": Vt
    }

@router.post("/transistor-characteristics")
async def calculate_transistor_characteristics(request: Dict[str, Any]):
    """计算晶体管特性曲线"""
    device_type = request.get("device_type", "MOSFET")  # BJT or MOSFET
    
    if device_type == "BJT":
        # 双极结型晶体管特性
        Ib_min = request.get("Ib_min", 0)  # 基极电流最小值 (μA)
        Ib_max = request.get("Ib_max", 50)  # 基极电流最大值 (μA)
        Vce_min = request.get("Vce_min", 0)  # 集电极-发射极电压最小值 (V)
        Vce_max = request.get("Vce_max", 5)  # 集电极-发射极电压最大值 (V)
        beta = request.get("beta", 100)  # 电流放大系数
        
        Ib_values = np.linspace(Ib_min, Ib_max, 5) * 1e-6  # 转换为A
        Vce = np.linspace(Vce_min, Vce_max, 100)
        
        curves = []
        for Ib in Ib_values:
            Ic = beta * Ib * (1 + Vce / 100)  # 简化的Early效应模型
            curves.append({
                "Ib": Ib * 1e6,  # 转换回μA
                "Vce": Vce.tolist(),
                "Ic": Ic.tolist()
            })
        
        return {
            "device_type": device_type,
            "beta": beta,
            "curves": curves
        }
    else:  # MOSFET
        # 金属氧化物半导体场效应管特性
        Vgs_min = request.get("Vgs_min", 0)  # 栅源电压最小值 (V)
        Vgs_max = request.get("Vgs_max", 5)  # 栅源电压最大值 (V)
        Vds_min = request.get("Vds_min", 0)  # 漏源电压最小值 (V)
        Vds_max = request.get("Vds_max", 5)  # 漏源电压最大值 (V)
        Vth = request.get("Vth", 0.7)  # 阈值电压 (V)
        k = request.get("k", 1e-3)  # 跨导参数 (A/V²)
        
        Vgs_values = np.linspace(Vgs_min, Vgs_max, 5)
        Vds = np.linspace(Vds_min, Vds_max, 100)
        
        curves = []
        for Vgs in Vgs_values:
            if Vgs > Vth:
                Id = k * ((Vgs - Vth) * Vds - Vds**2 / 2)
                # 饱和区
                Id_sat = k * (Vgs - Vth)**2 / 2
                Id = np.minimum(Id, Id_sat)
            else:
                Id = np.zeros_like(Vds)
            
            curves.append({
                "Vgs": Vgs,
                "Vds": Vds.tolist(),
                "Id": Id.tolist()
            })
        
        return {
            "device_type": device_type,
            "threshold_voltage": Vth,
            "transconductance_parameter": k,
            "curves": curves
        }