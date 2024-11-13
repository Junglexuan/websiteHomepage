import React, { useEffect, useRef } from 'react';

const ParticleEffect = (props) => {
  // const { style } = props;
  // const canvasRef = useRef(null);
  // const particles = useRef([]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   //设置画布尺寸
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  //   //粒子类
  //   class Particle {
  //     constructor() {
  //       this.x = Math.random() * canvas.width; //随机x坐标
  //       this.y = 0; //从画布顶部开始
  //       this.size = Math.random() * 3 + 1; //随机粒子大小
  //       this.speedX = 0; // 没有水平方向的速度
  //       this.speedY = Math.random() * 1 + 1; //向下的速度
  //       this.alpha = Math.random() * 0.5 + 0.3; //随机透明度
  //       this.color = `rgba(255, 255, 255, ${this.alpha})`; //白色粒子带透明度
  //     }
  //     update() {
  //       this.y += this.speedY; //粒子向下移动
  //       this.alpha -= 0.001; //透明度逐渐减少，模拟粒子消失
  //       if (this.alpha <= 0) {
  //         this.alpha = 0;
  //       }
  //     }
  //     draw() {
  //       ctx.fillStyle = this.color;
  //       ctx.beginPath();
  //       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  //       ctx.fill();
  //     }
  //   }
  //   //创建粒子
  //   const createParticles = () => {
  //     for (let i = 0; i < 5; i++) {  //每次生成5个粒子
  //       particles.current.push(new Particle());
  //     }
  //   };
  //   //动画循环
  //   const animateParticles = () => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height); //清空画布
  //     //更新和绘制粒子
  //     for (let i = 0; i < particles.current.length; i++) {
  //       const particle = particles.current[i];
  //       particle.update();
  //       particle.draw();
  //       //删除消失的粒子
  //       if (particle.alpha <= 0) {
  //         particles.current.splice(i, 1);
  //         i--; //确保删除元素后不跳过下一个粒子
  //       }
  //     }
  //     //使用requestAnimationFrame进行平滑动画
  //     requestAnimationFrame(animateParticles);
  //   };
  //   //定时生成粒子
  //   const particleInterval = setInterval(() => {
  //     createParticles();
  //   }, 100); //每100ms生成一个粒子(可以调整间隔)
  //   //启动动画
  //   animateParticles();
  //   //监听窗口大小变化，调整画布尺寸
  //   window.addEventListener('resize', () => {
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;
  //   });
  //   return () => {
  //     clearInterval(particleInterval); //清理粒子生成定时器
  //     window.removeEventListener('resize', () => { });
  //   };
  // }, []);
  // return <canvas ref={canvasRef} style={{ ...style }} />;

  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //画布大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const maxParticles = 200; //粒子数量
    //粒子类
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 5 + 2; //粒子半径
        this.alpha = Math.random() * 0.5 + 0.3; //初始透明度
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.005; //逐渐消失
        if (this.alpha <= 0) {
          this.alpha = Math.random() * 0.5 + 0.3; //重置透明度
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; //白色光点
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    //创建粒子
    const createParticles = () => {
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    };
    //动画更新
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); //清除画布
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    };
    createParticles();
    animateParticles();
    //监听窗口大小变化
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />;
};

export default ParticleEffect;