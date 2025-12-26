// SEMI_PROJ 移动端交互优化

class MobileInteractionOptimizer {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50; // 滑动阈值
        this.init();
    }

    init() {
        this.setupTouchGestures();
        this.setupMobileMenu();
        this.setupScrollOptimizations();
        this.setupViewportOptimizations();
        this.setupImageLazyLoading();
        this.setupPerformanceOptimizations();
    }

    setupTouchGestures() {
        // 添加滑动导航支持
        const sections = document.querySelectorAll('.section');
        if (sections.length === 0) return;

        sections.forEach(section => {
            // 触摸开始
            section.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                this.touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            // 触摸结束
            section.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.touchEndY = e.changedTouches[0].screenY;
                this.handleSwipe();
            }, { passive: true });
        });
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // 确保水平滑动距离大于垂直滑动距离
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.swipeThreshold) {
            if (deltaX > 0) {
                // 向右滑动 - 上一章节
                this.navigateSection('prev');
            } else {
                // 向左滑动 - 下一章节
                this.navigateSection('next');
            }
        }
    }

    navigateSection(direction) {
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) return;
        
        const sections = Array.from(document.querySelectorAll('.section'));
        const currentIndex = sections.indexOf(activeSection);
        
        let targetIndex;
        if (direction === 'next') {
            targetIndex = (currentIndex + 1) % sections.length;
        } else {
            targetIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        }
        
        // 切换到目标部分
        activeSection.classList.remove('active');
        sections[targetIndex].classList.add('active');
        
        // 更新导航状态
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const targetId = sections[targetIndex].id;
        const targetNavLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        
        // 滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 显示导航提示
        this.showNavigationHint(sections[targetIndex].querySelector('h2').textContent);
    }

    showNavigationHint(sectionName) {
        // 创建或更新导航提示
        let hint = document.getElementById('nav-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'nav-hint';
            hint.style.cssText = `
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(26, 115, 232, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(hint);
        }
        
        hint.textContent = `已切换到: ${sectionName}`;
        hint.style.opacity = '1';
        
        // 3秒后淡出
        setTimeout(() => {
            hint.style.opacity = '0';
        }, 2000);
    }

    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (!menuToggle || !mainNav) return;
        
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            // 切换图标
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // 点击导航链接后关闭菜单
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
        
        // 点击页面其他区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header')) {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    setupScrollOptimizations() {
        // 添加滚动到顶部按钮
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        // 滚动事件处理
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            // 显示/隐藏滚动到顶部按钮
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
            
            // 滚动性能优化：使用节流
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(() => {
                // 滚动时隐藏AI助手
                const aiAssistant = document.getElementById('ai-assistant');
                if (aiAssistant) {
                    if (window.pageYOffset > 100) {
                        aiAssistant.style.transform = 'translateY(100px)';
                    } else {
                        aiAssistant.style.transform = 'translateY(0)';
                    }
                }
            });
        });
        
        // 点击滚动到顶部
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupViewportOptimizations() {
        // 设置视口高度修复移动浏览器问题
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);
        
        // 检测并适配屏幕方向
        const handleOrientationChange = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            document.body.classList.toggle('landscape', isLandscape);
            document.body.classList.toggle('portrait', !isLandscape);
        };
        
        handleOrientationChange();
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
    }

    setupImageLazyLoading() {
        // 如果浏览器支持原生懒加载，则使用原生
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
            return;
        }
        
        // 否则使用Intersection Observer实现懒加载
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    setupPerformanceOptimizations() {
        // 预加载关键资源
        const criticalResources = [
            'css/styles.css',
            'css/responsive.css',
            'js/main.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            }
            
            document.head.appendChild(link);
        });
        
        // 优化触摸响应
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // 减少重绘和回流
        const optimizeAnimations = () => {
            const animatedElements = document.querySelectorAll('.feature-card, .chapter-card');
            
            animatedElements.forEach(element => {
                // 添加will-change提示浏览器优化
                element.style.willChange = 'transform';
                
                // 使用transform代替top/left属性变化
                element.addEventListener('mouseenter', () => {
                    element.style.transform = 'translateY(-5px)';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'translateY(0)';
                });
            });
        };
        
        // 延迟执行非关键优化
        if ('requestIdleCallback' in window) {
            requestIdleCallback(optimizeAnimations);
        } else {
            setTimeout(optimizeAnimations, 100);
        }
    }

    // 添加移动端特定的交互反馈
    addTouchFeedback() {
        const buttons = document.querySelectorAll('.btn, button, .chapter-card');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            });
            
            button.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
        });
    }
}

// 初始化移动端交互优化
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (window.innerWidth <= 768 && 'ontouchstart' in window);
    
    if (isMobile) {
        window.mobileOptimizer = new MobileInteractionOptimizer();
        window.mobileOptimizer.addTouchFeedback();
    }
});