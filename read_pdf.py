#!/usr/bin/env python3
import fitz  # PyMuPDF
import os

def extract_pdf_text(pdf_path, page_num=None):
    """提取PDF文本内容"""
    try:
        doc = fitz.open(pdf_path)
        text = ''
        
        if page_num is None:
            # 提取所有页
            for page in doc:
                text += page.get_text()
        else:
            # 提取指定页
            if page_num < len(doc):
                text = doc[page_num].get_text()
        
        doc.close()
        return text
    except Exception as e:
        return f"Error extracting text from {pdf_path}: {str(e)}"

def main():
    # 半导体物理部分PDF讲义路径
    pdf_dir = r'D:\Semiconductor\半导体物理部分\pdf讲义'
    
    # 读取Lesson02.pdf（半导体材料基础）的内容
    pdf_path = os.path.join(pdf_dir, 'Lesson02.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} ===")
        text = extract_pdf_text(pdf_path, page_num=0)  # 只读取第一页
        print(text[:3000])  # 显示前3000字符
        print("\n" + "="*50 + "\n")
    
    # 读取Lesson03.pdf（晶体结构）的内容
    pdf_path = os.path.join(pdf_dir, 'Lesson03.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} ===")
        text = extract_pdf_text(pdf_path, page_num=0)
        print(text[:3000])
        print("\n" + "="*50 + "\n")
    
    # 读取Lesson04.pdf（能带理论）的内容
    pdf_path = os.path.join(pdf_dir, 'Lesson04.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} ===")
        text = extract_pdf_text(pdf_path, page_num=0)
        print(text[:3000])
        print("\n" + "="*50 + "\n")
    
    # 读取Lesson05.pdf（载流子统计）的内容
    pdf_path = os.path.join(pdf_dir, 'Lesson05.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} ===")
        text = extract_pdf_text(pdf_path, page_num=0)
        print(text[:3000])
        print("\n" + "="*50 + "\n")
    
    # 读取更多页内容以获取更全面的信息
    # 读取Lesson02.pdf的第二页（晶体结构）
    pdf_path = os.path.join(pdf_dir, 'Lesson02.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} 第二页 ===")
        text = extract_pdf_text(pdf_path, page_num=1)
        print(text[:3000])
        print("\n" + "="*50 + "\n")
    
    # 读取Lesson04.pdf的第二页（能带理论）
    pdf_path = os.path.join(pdf_dir, 'Lesson04.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} 第二页 ===")
        text = extract_pdf_text(pdf_path, page_num=1)
        print(text[:3000])
        print("\n" + "="*50 + "\n")
    
    # 读取Lesson06.pdf（能带理论）的内容
    pdf_path = os.path.join(pdf_dir, 'Lesson06.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} 第一页 ===")
        text = extract_pdf_text(pdf_path, page_num=0)
        print(text[:3000])
        print("\n" + "="*50 + "\n")
    
    # 读取Lesson07.pdf（载流子统计）的内容
    pdf_path = os.path.join(pdf_dir, 'Lesson07.pdf')
    if os.path.exists(pdf_path):
        print(f"=== 读取 {pdf_path} 第一页 ===")
        text = extract_pdf_text(pdf_path, page_num=0)
        print(text[:3000])
        print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    main()