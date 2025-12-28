# GitHub Pages 部署说明

我已经为你创建了GitHub Actions工作流，可以自动部署网站到GitHub Pages。现在你只需要完成以下步骤：

## 启用GitHub Pages

1. 访问你的GitHub仓库：https://github.com/Six-Ways/semi_proj
2. 点击仓库中的"Settings"选项卡
3. 在左侧菜单中找到"Pages"选项
4. 在"Source"部分，选择"GitHub Actions"
5. 保存设置

## 工作原理

现在，每当你推送代码到master分支时，GitHub Actions会：
1. 自动检出代码
2. 安装Node.js和依赖
3. 构建Next.js网站
4. 将构建结果部署到GitHub Pages

## 访问网站

部署完成后，你的网站将在以下地址可用：
https://six-ways.github.io/semi_proj/

## 查看部署状态

你可以在这里查看部署状态：
1. 访问 https://github.com/Six-Ways/semi_proj/actions
2. 查看工作流运行情况

## 首次部署可能需要几分钟

首次部署可能需要几分钟时间完成。之后每次推送代码，网站会自动更新。

## 如果遇到问题

如果部署失败，请检查：
1. Actions页面中的错误信息
2. 确保website/package.json中的构建脚本正确
3. 确保next.config.js中的静态导出配置正确

## 本地测试

在推送代码前，你可以在本地测试：

```bash
cd website
npm install
npm run build
npm run start
```

然后访问 http://localhost:3000 查看网站效果。