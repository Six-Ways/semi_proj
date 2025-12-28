# 网站部署指南

本指南介绍如何让用户通过互联网访问你的semi_proj网站。

## 方法1：GitHub Pages (推荐，免费)

### 步骤1：启用GitHub Pages

1. 访问你的GitHub仓库：https://github.com/Six-Ways/semi_proj
2. 点击仓库中的"Settings"选项卡
3. 在左侧菜单中找到"Pages"选项
4. 在"Source"部分，选择"Deploy from a branch"
5. 在"Branch"下拉菜单中，选择"master"分支和"/(root)"文件夹
6. 点击"Save"保存设置

### 步骤2：配置网站目录

由于你的网站在website/out/目录下，你需要：

1. 将website/out/目录的内容移动到仓库根目录，或者
2. 在GitHub Pages设置中选择"master/(root)"并创建一个自定义的404页面

### 步骤3：访问网站

配置完成后，你的网站将在以下地址可用：
https://six-ways.github.io/semi_proj/

## 方法2：Vercel (推荐，免费，自动部署)

1. 访问 https://vercel.com
2. 使用GitHub账号登录
3. 点击"New Project"
4. 导入你的GitHub仓库：Six-Ways/semi_proj
5. 在"Framework Preset"中选择"Next.js"
6. 在"Root Directory"中输入"website"
7. 点击"Deploy"

部署完成后，Vercel会提供一个免费的域名，如：https://semi_proj-xxx.vercel.app

## 方法3：Netlify (免费)

1. 访问 https://netlify.com
2. 使用GitHub账号登录
3. 点击"New site from Git"
4. 选择GitHub并授权
5. 选择你的仓库：Six-Ways/semi_proj
6. 在"Build command"中输入：`cd website && npm run build`
7. 在"Publish directory"中输入：`website/out`
8. 点击"Deploy site"

## 方法4：自托管服务器

如果你有自己的服务器：

1. 在服务器上安装Node.js
2. 克隆你的仓库：
   ```bash
   git clone https://github.com/Six-Ways/semi_proj.git
   ```
3. 构建网站：
   ```bash
   cd semi_proj/website
   npm install
   npm run build
   ```
4. 使用任何静态文件服务器托管website/out目录，例如：
   ```bash
   npm install -g serve
   serve -s website/out -l 80
   ```

## 方法5：使用GitHub Actions自动部署

你可以设置GitHub Actions，在每次推送代码时自动部署到GitHub Pages：

1. 在仓库根目录创建`.github/workflows/deploy.yml`文件
2. 添加以下内容：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v2
      
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        cd website
        npm install
        
    - name: Build
      run: |
        cd website
        npm run build
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./website/out
```

## 推荐方案

对于你的项目，我推荐使用**Vercel**，因为：

1. 完全免费
2. 对Next.js项目有最好的支持
3. 自动部署，每次推送代码都会自动更新
4. 提供HTTPS证书
5. 全球CDN加速

## 注意事项

1. 确保你的网站是静态导出版本（已在next.config.js中配置output: 'export'）
2. 如果使用图片，确保已配置unoptimized: true
3. 检查所有链接都是相对路径，而不是绝对路径

## 测试本地网站

在部署前，你可以在本地测试网站：

```bash
cd website
npm install
npm run build
npm run start
```

然后访问 http://localhost:3000 查看网站效果。