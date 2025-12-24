@echo off
echo 尝试推送到GitHub...
git config --global http.postBuffer 524288000
git push origin master
if %errorlevel% neq 0 (
    echo 推送失败，尝试其他方法...
    git push -f origin master
)
echo 推送完成！
pause